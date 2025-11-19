import { pool } from "../config/db.js";

// ========================================
// Obtener todos los clientes
// ========================================
export const getClientes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM clientes
      ORDER BY id_cliente ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Obtener cliente por ID
// ========================================
export const getClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM clientes WHERE id_cliente = $1`,
      [id]
    );

    const data = result.rows[0];
    if (!data) return res.status(404).json({ error: "Cliente no encontrado" });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Crear cliente
// ========================================
export const createCliente = async (req, res) => {
  const { cedula, nombre } = req.body;

  if (!cedula || !nombre)
    return res
      .status(400)
      .json({ error: "cedula y nombre son obligatorios" });

  try {
    const result = await pool.query(
      `INSERT INTO clientes (cedula, nombre)
       VALUES ($1, $2)
       RETURNING *`,
      [cedula, nombre]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505")
      return res.status(400).json({ error: "La cédula ya está registrada" });

    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Actualizar cliente
// ========================================
export const updateCliente = async (req, res) => {
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
      `UPDATE clientes SET ${setClause} 
       WHERE id_cliente = $${keys.length + 1}
       RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Cliente no encontrado" });

    res.json({
      message: "Cliente actualizado correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Eliminar cliente
// ========================================
export const deleteCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM clientes 
       WHERE id_cliente = $1 
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Cliente no encontrado" });

    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

