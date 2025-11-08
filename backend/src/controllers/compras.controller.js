import { pool } from "../config/db.js";

// Obtener todas las compras
export const getCompras = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM compras ORDER BY id_compra ASC");
    const data = result.rows;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener compra por id (con joins)
export const getCompraById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.*, cl.*, e.*, d.*
      FROM compras c
      LEFT JOIN clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
      LEFT JOIN detalles_compras d ON c.id_compra = d.id_compra
      WHERE c.id_compra = $1
    `, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Compra no encontrada" });

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear compra
export const createCompra = async (req, res) => {
  const {
    id_cliente,
    id_empleado,
    metodo_pago = "efectivo",
    estado = "pagado",
    total,
    detalles
  } = req.body;

  // Validaciones básicas
  if (!id_cliente) return res.status(400).json({ error: "id_cliente es requerido" });
  if (typeof total !== "number" || total <= 0)
    return res.status(400).json({ error: "total inválido" });
  if (!detalles || !Array.isArray(detalles) || detalles.length === 0)
    return res.status(400).json({ error: "detalles es requerido y debe ser array" });

  for (const d of detalles) {
    if (!d.id_producto || typeof d.cantidad !== "number" || d.cantidad <= 0 || typeof d.precio_unitario !== "number") {
      return res.status(400).json({ error: "Cada detalle debe tener id_producto, cantidad>0 y precio_unitario" });
    }
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1️⃣ Insertar compra
    const compraResult = await client.query(
      `INSERT INTO compras (id_cliente, id_empleado, metodo_pago, estado, total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_cliente, id_empleado, metodo_pago, estado, total]
    );
    const compra = compraResult.rows[0];

    // 2️⃣ Insertar detalles
    const detallesInsert = [];
    for (const d of detalles) {
      const detalle = await client.query(
        `INSERT INTO detalles_compras (id_compra, id_producto, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [compra.id_compra, d.id_producto, d.cantidad, d.precio_unitario]
      );
      detallesInsert.push(detalle.rows[0]);

      // 3️⃣ Actualizar inventario
      const inv = await client.query(
        `SELECT * FROM inventarios WHERE id_producto = $1`,
        [d.id_producto]
      );

      if (inv.rows.length === 0)
        throw new Error(`Inventario no encontrado para producto ${d.id_producto}`);

      const inventario = inv.rows[0];
      if (inventario.unidades < d.cantidad)
        throw new Error(`Stock insuficiente para producto ${d.id_producto}`);

      const nuevasUnidades = inventario.unidades - d.cantidad;
      await client.query(
        `UPDATE inventarios
         SET unidades = $1, fecha_actualizacion = CURRENT_DATE
         WHERE id_inventario = $2`,
        [nuevasUnidades, inventario.id_inventario]
      );

      // 4️⃣ Registrar movimiento
      await client.query(
        `INSERT INTO movimientos_inventarios (id_inventario, tipo_movimiento, cantidad, motivo)
         VALUES ($1, 'salida', $2, $3)`,
        [inventario.id_inventario, d.cantidad, `Venta (compra ${compra.id_compra})`]
      );
    }

    // Confirmar transacción
    await client.query("COMMIT");

    res.status(201).json({ compra, detalles: detallesInsert });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Actualizar compra
export const updateCompra = async (req, res) => {
  const { id } = req.params;
  const { id_cliente, id_empleado, metodo_pago, estado, total } = req.body;

  const updates = {};
  if (id_cliente !== undefined) updates.id_cliente = id_cliente;
  if (id_empleado !== undefined) updates.id_empleado = id_empleado;
  if (metodo_pago !== undefined) updates.metodo_pago = metodo_pago;
  if (estado !== undefined) updates.estado = estado;
  if (total !== undefined) {
    if (typeof total !== "number" || total <= 0)
      return res.status(400).json({ error: "total inválido" });
    updates.total = total;
  }

  if (Object.keys(updates).length === 0)
    return res.status(400).json({ error: "No hay campos para actualizar" });

  try {
    const fields = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");
    const values = Object.values(updates);

    const result = await pool.query(
      `UPDATE compras SET ${fields} WHERE id_compra = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Compra no encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar compra
export const deleteCompra = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM compras WHERE id_compra = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Compra no encontrada" });

    res.json({ message: "Compra eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
