// controllers/ventas.controller.js
import { pool } from "../config/db.js";
import { consumirIngredientesProducto } from "../services/inventory.services.js";

/**
 * Crear una venta con detalles y descuento automático de inventario
 */
export const createVenta = async (req, res) => {
  const { id_cliente = null, id_empleado, metodo_pago, detalles } = req.body;

  if (!id_empleado || !metodo_pago || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // Validar que todos los detalles tengan los campos requeridos
  for (const detalle of detalles) {
    if (!detalle.id_producto || !detalle.cantidad || !detalle.precio_unitario) {
      return res.status(400).json({ 
        error: "Cada detalle debe tener id_producto, cantidad y precio_unitario" 
      });
    }
    if (detalle.cantidad <= 0) {
      return res.status(400).json({ 
        error: "La cantidad debe ser mayor a 0" 
      });
    }
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Calcular total de la venta
    const total = detalles.reduce(
      (acc, d) => acc + Number(d.precio_unitario) * Number(d.cantidad),
      0
    );

    // Insertar venta
    const ventaRes = await client.query(
      `INSERT INTO ventas (id_cliente, id_empleado, total, metodo_pago)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_cliente, id_empleado, total, metodo_pago]
    );

    const id_venta = ventaRes.rows[0].id_venta;

    // Insertar detalles y descontar inventario
    for (const det of detalles) {
      // Insertar detalle
      await client.query(
        `INSERT INTO detalles_ventas
         (id_venta, id_producto, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          id_venta,
          det.id_producto,
          det.cantidad,
          det.precio_unitario,
          Number(det.precio_unitario) * Number(det.cantidad)
        ]
      );

      // Consumir insumos dependiendo de recetas
      await consumirIngredientesProducto(
        det.id_producto,
        det.cantidad,
        client,
        `Venta ${id_venta}`
      );
    }

    await client.query("COMMIT");

    // Obtener la venta completa con detalles para la respuesta
    const ventaCompleta = await getVentaCompleta(id_venta, client);

    res.status(201).json({
      message: "Venta creada exitosamente",
      venta: ventaCompleta
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear venta:", error);
    res.status(400).json({ 
      error: "Error al crear la venta: " + error.message 
    });
  } finally {
    client.release();
  }
};

/**
 * Obtener todas las ventas con filtros opcionales
 */
export const getVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, id_empleado, metodo_pago } = req.query;
    
    let query = `
      SELECT 
        v.*, 
        u.nombre AS empleado_nombre, 
        c.nombre AS cliente_nombre,
        COUNT(dv.id_detalle) as total_items
      FROM ventas v
      JOIN empleados e ON v.id_empleado = e.id_empleado
      JOIN usuarios u ON e.id_usuario = u.id_usuario
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      LEFT JOIN detalles_ventas dv ON v.id_venta = dv.id_venta
    `;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (fecha_inicio) {
      paramCount++;
      conditions.push(`v.fecha >= $${paramCount}`);
      params.push(fecha_inicio);
    }

    if (fecha_fin) {
      paramCount++;
      conditions.push(`v.fecha <= $${paramCount}`);
      params.push(fecha_fin + ' 23:59:59');
    }

    if (id_empleado) {
      paramCount++;
      conditions.push(`v.id_empleado = $${paramCount}`);
      params.push(id_empleado);
    }

    if (metodo_pago) {
      paramCount++;
      conditions.push(`v.metodo_pago = $${paramCount}`);
      params.push(metodo_pago);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY v.id_venta, u.nombre, c.nombre ORDER BY v.fecha DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener venta por id con sus detalles completos
 */
export const getVentaById = async (req, res) => {
  const { id } = req.params;

  try {
    const ventaCompleta = await getVentaCompleta(id);
    
    if (!ventaCompleta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    res.json(ventaCompleta);

  } catch (error) {
    console.error("Error al obtener venta:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Eliminar una venta (solo si es necesario, considerar anulación en lugar de eliminación)
 */
export const deleteVenta = async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Primero verificar si la venta existe
    const ventaCheck = await client.query(
      `SELECT id_venta FROM ventas WHERE id_venta = $1`,
      [id]
    );

    if (ventaCheck.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    // Eliminar detalles de venta primero (por la FK)
    await client.query(
      `DELETE FROM detalles_ventas WHERE id_venta = $1`,
      [id]
    );

    // Finalmente eliminar la venta
    const result = await client.query(
      `DELETE FROM ventas WHERE id_venta = $1`,
      [id]
    );

    await client.query("COMMIT");

    res.json({ 
      message: "Venta eliminada exitosamente",
      venta_eliminada: id 
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al eliminar venta:", error);
    res.status(500).json({ 
      error: "Error al eliminar la venta: " + error.message 
    });
  } finally {
    client.release();
  }
};

/**
 * Anular una venta (marcar como anulada en lugar de eliminar)
 */
export const anularVenta = async (req, res) => {
  const { id } = req.params;
  const { motivo_anulacion } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Verificar si la venta existe y no está ya anulada
    const ventaCheck = await client.query(
      `SELECT id_venta, estado FROM ventas WHERE id_venta = $1`,
      [id]
    );

    if (ventaCheck.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    if (ventaCheck.rows[0].estado === 'anulado') {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "La venta ya está anulada" });
    }

    // Marcar venta como anulada
    const result = await client.query(
      `UPDATE ventas 
       SET estado = 'anulado' 
       WHERE id_venta = $1
       RETURNING *`,
      [id]
    );

    // Registrar movimiento de inventario para revertir los insumos consumidos
    const detalles = await client.query(
      `SELECT * FROM detalles_ventas WHERE id_venta = $1`,
      [id]
    );

    for (const detalle of detalles.rows) {
      // Aquí deberías implementar la función para revertir insumos
      // await revertirIngredientesProducto(detalle.id_producto, detalle.cantidad, client, `Anulación venta ${id}`);
    }

    await client.query("COMMIT");

    res.json({ 
      message: "Venta anulada exitosamente",
      venta: result.rows[0],
      motivo: motivo_anulacion || "Sin motivo especificado"
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al anular venta:", error);
    res.status(500).json({ 
      error: "Error al anular la venta: " + error.message 
    });
  } finally {
    client.release();
  }
};

/**
 * Obtener estadísticas de ventas
 */
export const getEstadisticasVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    let query = `
      SELECT 
        COUNT(*) as total_ventas,
        SUM(total) as ingresos_totales,
        AVG(total) as promedio_venta,
        metodo_pago,
        COUNT(*) as ventas_por_metodo,
        SUM(total) as ingresos_por_metodo
      FROM ventas 
      WHERE estado != 'anulado'
    `;

    const params = [];
    
    if (fecha_inicio && fecha_fin) {
      query += ` AND fecha BETWEEN $1 AND $2`;
      params.push(fecha_inicio, fecha_fin + ' 23:59:59');
    } else if (fecha_inicio) {
      query += ` AND fecha >= $1`;
      params.push(fecha_inicio);
    } else if (fecha_fin) {
      query += ` AND fecha <= $1`;
      params.push(fecha_fin + ' 23:59:59');
    }

    query += ` GROUP BY metodo_pago ORDER BY ingresos_por_metodo DESC`;

    const result = await pool.query(query, params);
    
    res.json({
      estadisticas: result.rows,
      periodo: {
        fecha_inicio: fecha_inicio || 'No especificado',
        fecha_fin: fecha_fin || 'No especificado'
      }
    });

  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: error.message });
  }
};

// Función auxiliar para obtener venta completa
async function getVentaCompleta(id_venta, client = pool) {
  const ventaResult = await client.query(
    `SELECT 
        v.*, 
        u.nombre AS empleado_nombre,
        c.nombre AS cliente_nombre,
        c.cedula AS cliente_cedula
     FROM ventas v
     JOIN empleados e ON v.id_empleado = e.id_empleado
     JOIN usuarios u ON e.id_usuario = u.id_usuario
     LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
     WHERE v.id_venta = $1`,
    [id_venta]
  );

  if (ventaResult.rowCount === 0) {
    return null;
  }

  const detallesResult = await client.query(
    `SELECT 
        dv.*, 
        p.nombre AS producto_nombre,
        p.descripcion AS producto_descripcion,
        c.nombre AS categoria_nombre
     FROM detalles_ventas dv
     JOIN productos p ON dv.id_producto = p.id_producto
     JOIN categorias c ON p.id_categoria = c.id_categoria
     WHERE dv.id_venta = $1`,
    [id_venta]
  );

  return {
    venta: ventaResult.rows[0],
    detalles: detallesResult.rows
  };
}