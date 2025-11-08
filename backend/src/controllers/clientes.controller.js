import { pool } from "../config/db.js";

// Obtener todos los clientes (con datos de usuario join)
export const getClientes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.*
      FROM clientes c
      LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
      ORDER BY c.id_cliente ASC
    `);
    const data = result.rows;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener cliente por id
export const getClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT c.*, u.*
      FROM clientes c
      LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
      WHERE c.id_cliente = $1
    `, [id]);

    const data = result.rows[0];
    if (!data) return res.status(404).json({ error: 'Cliente no encontrado' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear cliente (suponer que usuario ya existe o crear referencia)
export const createCliente = async (req, res) => {
  const { id_usuario, cedula } = req.body;

  if (!id_usuario) return res.status(400).json({ error: 'id_usuario requerido' });

  try {
    const result = await pool.query(
      `INSERT INTO clientes (id_usuario, cedula)
       VALUES ($1, $2)
       RETURNING *`,
      [id_usuario, cedula]
    );

    const data = result.rows[0];
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  try {
    // construir consulta dinámica según campos enviados
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

    const result = await pool.query(
      `UPDATE clientes SET ${setClause} WHERE id_cliente = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Cliente no encontrado" });

    const data = result.rows[0];
    res.json({ message: "Cliente actualizado", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cliente
export const deleteCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM clientes WHERE id_cliente = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Cliente no encontrado" });

    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
