import { pool } from "../config/db.js";

// Obtener todas las categorías
export const getCategorias = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categorias ORDER BY id_categoria ASC");
    const data = result.rows;
    res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtener una categoría por ID
export const getCategoriaById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM categorias WHERE id_categoria = $1",
      [id]
    );
    const data = result.rows[0];

    if (!data) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Crear una nueva categoría
export const createCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion]
    );
    const data = result.rows;

    res.status(201).json({
      message: "Categoría creada correctamente",
      data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Actualizar una categoría
export const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const result = await pool.query(
      "UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id_categoria = $3 RETURNING *",
      [nombre, descripcion, id]
    );
    const data = result.rows;

    if (data.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json({
      message: "Categoría actualizada correctamente",
      data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar una categoría
export const deleteCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM categorias WHERE id_categoria = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
