import { pool } from "../config/db.js";

// ========================================
// Obtener todas las categorías
// ========================================
export const getCategorias = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM categorias
      ORDER BY id_categoria ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Obtener categoría por ID
// ========================================
export const getCategoriaById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM categorias WHERE id_categoria = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Categoría no encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Crear categoría
// ========================================
export const createCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre)
    return res.status(400).json({ error: "El nombre es obligatorio" });

  try {
    const result = await pool.query(
      `INSERT INTO categorias (nombre, descripcion)
       VALUES ($1, $2)
       RETURNING *`,
      [nombre, descripcion || null]
    );

    res.status(201).json({
      message: "Categoría creada correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Actualizar categoría
// ========================================
export const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const keys = Object.keys(data);
    const values = Object.values(data);

    if (keys.length === 0)
      return res.status(400).json({ error: "No se enviaron campos a actualizar" });

    const setClause = keys
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");

    const result = await pool.query(
      `UPDATE categorias SET ${setClause}
        WHERE id_categoria = $${keys.length + 1}
       RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Categoría no encontrada" });

    res.json({
      message: "Categoría actualizada correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Eliminar categoría
// ========================================
export const deleteCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM categorias
       WHERE id_categoria = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Categoría no encontrada" });

    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
