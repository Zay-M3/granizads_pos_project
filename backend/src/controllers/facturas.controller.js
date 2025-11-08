import { pool } from "../config/db.js";

// Obtener todas las facturas electrónicas
export const getFacturas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM facturas_electronicas ORDER BY id_factura ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una factura por ID
export const getFacturaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM facturas_electronicas WHERE id_factura = $1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Factura no encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva factura
export const createFactura = async (req, res) => {
  const { id_compra, codigo_dian, estado_envio, fecha_envio } = req.body;

  if (!id_compra)
    return res.status(400).json({ error: "id_compra es requerido" });

  try {
    const result = await pool.query(
      `INSERT INTO facturas_electronicas (id_compra, codigo_dian, estado_envio, fecha_envio)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_compra, codigo_dian, estado_envio, fecha_envio]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una factura
export const updateFactura = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  if (Object.keys(payload).length === 0)
    return res.status(400).json({ error: "No hay campos para actualizar" });

  try {
    const fields = Object.keys(payload)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");
    const values = Object.values(payload);

    const result = await pool.query(
      `UPDATE facturas_electronicas SET ${fields} WHERE id_factura = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Factura no encontrada" });

    res.json({ message: "Factura actualizada", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una factura
export const deleteFactura = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM facturas_electronicas WHERE id_factura = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Factura no encontrada" });

    res.json({ message: "Factura eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
