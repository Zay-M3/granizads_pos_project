import { pool } from "../config/db.js";

// ========================================
// Obtener todos los insumos
// ========================================
export const getInsumos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM insumos
      ORDER BY id_insumo ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Obtener insumo por ID
// ========================================
export const getInsumoById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM insumos WHERE id_insumo = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Insumo no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Crear insumo (CORREGIDO - ahora incluye minimo_stock)
// ========================================
export const createInsumo = async (req, res) => {
  const { 
    nombre, 
    unidad_medida, 
    stock, 
    fecha_compra, 
    costo_unitario, 
    alerta, 
    minimo_stock  // ✅ Campo agregado
  } = req.body;

  if (!nombre)
    return res.status(400).json({ error: "El nombre del insumo es obligatorio" });

  try {
    const result = await pool.query(
      `INSERT INTO insumos (nombre, unidad_medida, stock, fecha_compra, costo_unitario, alerta, minimo_stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        nombre,
        unidad_medida || null,
        stock ?? 0,
        fecha_compra || null,
        costo_unitario ?? null,
        alerta ?? false,
        minimo_stock ?? 0  // ✅ Valor por defecto 0
      ]
    );

    res.status(201).json({
      message: "Insumo creado correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Actualizar insumo
// ========================================
export const updateInsumo = async (req, res) => {
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
      `UPDATE insumos SET ${setClause}
       WHERE id_insumo = $${keys.length + 1}
       RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Insumo no encontrado" });

    res.json({
      message: "Insumo actualizado correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Eliminar insumo
// ========================================
export const deleteInsumo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM insumos
       WHERE id_insumo = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Insumo no encontrado" });

    res.json({ message: "Insumo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Obtener insumos con stock bajo
// ========================================
export const getInsumosBajoStock = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_insumo, nombre, stock, minimo_stock, alerta
      FROM insumos
      WHERE stock <= minimo_stock OR alerta = true
      ORDER BY stock ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// Actualizar stock de insumo (NUEVA FUNCIÓN)
// ========================================
export const updateStockInsumo = async (req, res) => {
  const { id } = req.params;
  const { stock, tipo_movimiento, motivo } = req.body;

  if (stock === undefined) {
    return res.status(400).json({ error: "El stock es requerido" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Actualizar stock del insumo
    const result = await client.query(
      `UPDATE insumos 
       SET stock = $1 
       WHERE id_insumo = $2 
       RETURNING *`,
      [stock, id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Insumo no encontrado" });
    }

    // Registrar movimiento en el inventario si se proporciona tipo_movimiento
    if (tipo_movimiento) {
      await client.query(
        `INSERT INTO movimientos_inventario (id_insumo, tipo, cantidad, motivo)
         VALUES ($1, $2, $3, $4)`,
        [id, tipo_movimiento, stock, motivo || 'Ajuste manual']
      );
    }

    await client.query("COMMIT");

    res.json({
      message: "Stock actualizado correctamente",
      data: result.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};
