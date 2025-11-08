import { pool } from "../config/db.js";

// Obtener todos los detalles de compras
export const getDetallesCompra = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM detalles_compras ORDER BY id_detalle_compra ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un detalle por id
export const getDetalleById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM detalles_compras WHERE id_detalle_compra = $1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Detalle no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un detalle de compra
export const createDetalleCompra = async (req, res) => {
  const { id_compra, id_producto, cantidad, precio_unitario } = req.body;

  if (!id_compra || !id_producto)
    return res.status(400).json({ error: "id_compra e id_producto son requeridos" });
  if (typeof cantidad !== "number" || cantidad <= 0)
    return res.status(400).json({ error: "cantidad inválida" });
  if (typeof precio_unitario !== "number" || precio_unitario < 0)
    return res.status(400).json({ error: "precio_unitario inválido" });

  try {
    const result = await pool.query(
      `INSERT INTO detalles_compras (id_compra, id_producto, cantidad, precio_unitario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_compra, id_producto, cantidad, precio_unitario]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un detalle de compra
export const updateDetalleCompra = async (req, res) => {
  const { id } = req.params;
  const { id_compra, id_producto, cantidad, precio_unitario } = req.body;

  const updates = {};
  if (id_compra !== undefined) updates.id_compra = id_compra;
  if (id_producto !== undefined) updates.id_producto = id_producto;
  if (cantidad !== undefined) {
    if (typeof cantidad !== "number" || cantidad <= 0)
      return res.status(400).json({ error: "cantidad inválida" });
    updates.cantidad = cantidad;
  }
  if (precio_unitario !== undefined) {
    if (typeof precio_unitario !== "number" || precio_unitario < 0)
      return res.status(400).json({ error: "precio_unitario inválido" });
    updates.precio_unitario = precio_unitario;
  }

  if (Object.keys(updates).length === 0)
    return res.status(400).json({ error: "No hay campos para actualizar" });

  try {
    const fields = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");
    const values = Object.values(updates);

    const result = await pool.query(
      `UPDATE detalles_compras SET ${fields} WHERE id_detalle_compra = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Detalle no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un detalle de compra
export const deleteDetalleCompra = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM detalles_compras WHERE id_detalle_compra = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Detalle no encontrado" });

    res.json({ message: "Detalle eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
