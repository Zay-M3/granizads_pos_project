// controllers/facturas.controller.js
import { pool } from "../config/db.js";

// Obtener todas las facturas electrónicas con información relacionada
export const getFacturas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        fe.*,
        v.total,
        v.fecha as fecha_venta,
        v.metodo_pago,
        c.nombre as cliente_nombre,
        c.cedula as cliente_cedula,
        u.nombre as empleado_nombre
      FROM facturas_electronicas fe
      JOIN ventas v ON fe.id_venta = v.id_venta
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      JOIN empleados e ON v.id_empleado = e.id_empleado
      JOIN usuarios u ON e.id_usuario = u.id_usuario
      ORDER BY fe.id_factura DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una factura por ID con información completa
export const getFacturaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        fe.*,
        v.total,
        v.fecha as fecha_venta,
        v.metodo_pago,
        v.estado as estado_venta,
        c.nombre as cliente_nombre,
        c.cedula as cliente_cedula,
        c.id_cliente,
        u.nombre as empleado_nombre,
        u.id_usuario
      FROM facturas_electronicas fe
      JOIN ventas v ON fe.id_venta = v.id_venta
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      JOIN empleados e ON v.id_empleado = e.id_empleado
      JOIN usuarios u ON e.id_usuario = u.id_usuario
      WHERE fe.id_factura = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Factura no encontrada" });

    // Obtener detalles de la venta
    const detallesResult = await pool.query(
      `SELECT 
        dv.*,
        p.nombre as producto_nombre,
        p.descripcion as producto_descripcion
      FROM detalles_ventas dv
      JOIN productos p ON dv.id_producto = p.id_producto
      JOIN ventas v ON dv.id_venta = v.id_venta
      JOIN facturas_electronicas fe ON v.id_venta = fe.id_venta
      WHERE fe.id_factura = $1`,
      [id]
    );

    res.json({
      ...result.rows[0],
      detalles: detallesResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener factura por ID de venta
export const getFacturaByVentaId = async (req, res) => {
  const { id_venta } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        fe.*,
        v.total,
        v.fecha as fecha_venta,
        v.metodo_pago,
        c.nombre as cliente_nombre,
        c.cedula as cliente_cedula
      FROM facturas_electronicas fe
      JOIN ventas v ON fe.id_venta = v.id_venta
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      WHERE fe.id_venta = $1`,
      [id_venta]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Factura no encontrada para esta venta" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva factura electrónica
export const createFactura = async (req, res) => {
  const { id_venta, codigo_cufin, estado_envio = 'pendiente' } = req.body;

  if (!id_venta || !codigo_cufin) {
    return res.status(400).json({ 
      error: "id_venta y codigo_cufin son requeridos" 
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Verificar que la venta existe
    const ventaCheck = await client.query(
      "SELECT id_venta FROM ventas WHERE id_venta = $1",
      [id_venta]
    );

    if (ventaCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    // Verificar que no exista ya una factura para esta venta
    const facturaExistente = await client.query(
      "SELECT id_factura FROM facturas_electronicas WHERE id_venta = $1",
      [id_venta]
    );

    if (facturaExistente.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Ya existe una factura para esta venta" });
    }

    // Crear la factura
    const result = await client.query(
      `INSERT INTO facturas_electronicas (id_venta, codigo_cufin, estado_envio)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id_venta, codigo_cufin, estado_envio]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Factura electrónica creada exitosamente",
      factura: result.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Actualizar estado de una factura
export const updateFactura = async (req, res) => {
  const { id } = req.params;
  const { codigo_cufin, estado_envio } = req.body;

  if (!codigo_cufin && !estado_envio) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }

  try {
    const fields = [];
    const values = [];

    if (codigo_cufin) {
      fields.push(`codigo_cufin = $${fields.length + 1}`);
      values.push(codigo_cufin);
    }

    if (estado_envio) {
      fields.push(`estado_envio = $${fields.length + 1}`);
      values.push(estado_envio);
    }

    // Si se actualiza el estado_envio, actualizar también la fecha_envio
    if (estado_envio === 'enviado') {
      fields.push(`fecha_envio = CURRENT_TIMESTAMP`);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE facturas_electronicas 
       SET ${fields.join(", ")} 
       WHERE id_factura = $${values.length} 
       RETURNING *`,
      values
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Factura no encontrada" });

    res.json({ 
      message: "Factura actualizada", 
      factura: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Marcar factura como enviada
export const marcarFacturaEnviada = async (req, res) => {
  const { id } = req.params;
  const { codigo_cufin } = req.body;

  try {
    const result = await pool.query(
      `UPDATE facturas_electronicas 
       SET estado_envio = 'enviado', 
           fecha_envio = CURRENT_TIMESTAMP,
           codigo_cufin = COALESCE($1, codigo_cufin)
       WHERE id_factura = $2 
       RETURNING *`,
      [codigo_cufin, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Factura no encontrada" });

    res.json({ 
      message: "Factura marcada como enviada", 
      factura: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una factura
export const deleteFactura = async (req, res) => {
  const { id } = req.params;
  
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");

    const result = await client.query(
      "DELETE FROM facturas_electronicas WHERE id_factura = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    await client.query("COMMIT");

    res.json({ 
      message: "Factura eliminada exitosamente",
      factura_eliminada: result.rows[0] 
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Obtener estadísticas de facturas
export const getEstadisticasFacturas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    let query = `
      SELECT 
        COUNT(*) as total_facturas,
        estado_envio,
        COUNT(*) as cantidad_por_estado,
        AVG(EXTRACT(EPOCH FROM (fecha_envio - fe.fecha_envio))) as tiempo_promedio_envio_segundos
      FROM facturas_electronicas fe
      JOIN ventas v ON fe.id_venta = v.id_venta
    `;

    const params = [];
    
    if (fecha_inicio && fecha_fin) {
      query += ` WHERE v.fecha BETWEEN $1 AND $2`;
      params.push(fecha_inicio, fecha_fin + ' 23:59:59');
    }

    query += ` GROUP BY estado_envio ORDER BY cantidad_por_estado DESC`;

    const result = await pool.query(query, params);
    
    res.json({
      estadisticas: result.rows,
      periodo: {
        fecha_inicio: fecha_inicio || 'No especificado',
        fecha_fin: fecha_fin || 'No especificado'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};