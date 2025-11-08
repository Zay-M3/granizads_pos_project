import { pool } from "../config/db.js";

// Obtener todos los inventarios
export const getInventarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, p.nombre, p.categoria, p.precio
      FROM inventarios i
      LEFT JOIN productos p ON i.id_producto = p.id_producto
      ORDER BY i.id_inventario ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener inventario por ID
export const getInventarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT i.*, p.nombre, p.categoria, p.precio
      FROM inventarios i
      LEFT JOIN productos p ON i.id_producto = p.id_producto
      WHERE i.id_inventario = $1
    `, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Inventario no encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo inventario
export const createInventario = async (req, res) => {
  const { id_producto, unidades, stock_minimo } = req.body;

  if (!id_producto || typeof unidades !== "number") {
    return res.status(400).json({
      error: "Campos obligatorios: id_producto, unidades"
    });
  }

  try {
    const result = await pool.query(`
      INSERT INTO inventarios (id_producto, unidades, stock_minimo, fecha_actualizacion)
      VALUES ($1, $2, $3, CURRENT_DATE)
      RETURNING *
    `, [id_producto, unidades, stock_minimo || 10]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar inventario
export const updateInventario = async (req, res) => {
  const { id } = req.params;
  const { id_producto, unidades, stock_minimo } = req.body;

  try {
    const result = await pool.query(`
      UPDATE inventarios
      SET id_producto = COALESCE($1, id_producto),
          unidades = COALESCE($2, unidades),
          stock_minimo = COALESCE($3, stock_minimo),
          fecha_actualizacion = CURRENT_DATE
      WHERE id_inventario = $4
      RETURNING *
    `, [id_producto, unidades, stock_minimo, id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Inventario no encontrado" });

    res.json({
      message: "Inventario actualizado correctamente",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar inventario
export const deleteInventario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM inventarios WHERE id_inventario = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Inventario no encontrado" });

    res.json({ message: "Inventario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
