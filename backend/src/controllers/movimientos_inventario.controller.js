import { pool } from "../config/db.js";

// Obtener todos los movimientos
export const getMovimientos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, i.id_producto
      FROM movimientos_inventarios m
      LEFT JOIN inventarios i ON m.id_inventario = i.id_inventario
      ORDER BY m.id_movimiento ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener movimiento por ID
export const getMovimientoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT m.*, i.id_producto
      FROM movimientos_inventarios m
      LEFT JOIN inventarios i ON m.id_inventario = i.id_inventario
      WHERE m.id_movimiento = $1
    `, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Movimiento no encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear movimiento manual (y afectar inventario)
export const createMovimiento = async (req, res) => {
  const { id_inventario, tipo_movimiento, cantidad, motivo } = req.body;

  if (!id_inventario || !tipo_movimiento || typeof cantidad !== "number") {
    return res.status(400).json({ error: "Campos faltantes o inválidos" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1️⃣ Insertar movimiento
    const insertMovimiento = await client.query(
      `INSERT INTO movimientos_inventarios (id_inventario, tipo_movimiento, cantidad, motivo, fecha)
       VALUES ($1, $2, $3, $4, CURRENT_DATE)
       RETURNING *`,
      [id_inventario, tipo_movimiento, cantidad, motivo]
    );
    const movimiento = insertMovimiento.rows[0];

    // 2️⃣ Obtener inventario actual
    const invResult = await client.query(
      "SELECT * FROM inventarios WHERE id_inventario = $1",
      [id_inventario]
    );
    const invData = invResult.rows[0];

    if (!invData)
      throw new Error("Inventario no encontrado");

    // 3️⃣ Calcular nuevas unidades
    const nuevasUnidades =
      tipo_movimiento === "entrada"
        ? invData.unidades + cantidad
        : invData.unidades - cantidad;

    // 4️⃣ Actualizar inventario
    await client.query(
      `UPDATE inventarios
       SET unidades = $1, fecha_actualizacion = CURRENT_DATE
       WHERE id_inventario = $2`,
      [nuevasUnidades, id_inventario]
    );

    await client.query("COMMIT");
    res.status(201).json(movimiento);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Eliminar movimiento (y revertir inventario)
export const deleteMovimiento = async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1️⃣ Buscar movimiento
    const movResult = await client.query(
      "SELECT * FROM movimientos_inventarios WHERE id_movimiento = $1",
      [id]
    );
    const movimiento = movResult.rows[0];

    if (!movimiento) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Movimiento no encontrado" });
    }

    // 2️⃣ Eliminar movimiento
    await client.query(
      "DELETE FROM movimientos_inventarios WHERE id_movimiento = $1",
      [id]
    );

    // 3️⃣ Revertir inventario
    const invResult = await client.query(
      "SELECT * FROM inventarios WHERE id_inventario = $1",
      [movimiento.id_inventario]
    );
    const invData = invResult.rows[0];

    if (invData) {
      const nuevasUnidades =
        movimiento.tipo_movimiento === "entrada"
          ? invData.unidades - movimiento.cantidad // revertir entrada
          : invData.unidades + movimiento.cantidad; // revertir salida

      await client.query(
        `UPDATE inventarios
         SET unidades = $1, fecha_actualizacion = CURRENT_DATE
         WHERE id_inventario = $2`,
        [nuevasUnidades, movimiento.id_inventario]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Movimiento eliminado correctamente" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};
