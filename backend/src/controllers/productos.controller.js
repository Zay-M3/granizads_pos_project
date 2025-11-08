import { pool } from "../config/db.js";

// Obtener todos los productos (con categoría)
export const getProductos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.id_categoria, c.nombre AS categoria_nombre, c.descripcion AS categoria_descripcion
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.id_producto ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener producto por ID
export const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.*, c.id_categoria, c.nombre AS categoria_nombre, c.descripcion AS categoria_descripcion
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = $1
    `, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear producto
export const createProducto = async (req, res) => {
  const { id_categoria, nombre, tipo, descripcion, precio } = req.body;

  if (!nombre || !precio)
    return res.status(400).json({ error: "nombre y precio son requeridos" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1️⃣ Crear producto
    const insertProducto = await client.query(
      `INSERT INTO productos (id_categoria, nombre, tipo, descripcion, precio)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_categoria || null, nombre, tipo || null, descripcion || null, precio]
    );

    const producto = insertProducto.rows[0];

    // 2️⃣ Crear entrada en inventarios (automática)
    await client.query(
      `INSERT INTO inventarios (id_producto, unidades, stock_minimo, fecha_actualizacion)
       VALUES ($1, 0, 10, CURRENT_DATE)`,
      [producto.id_producto]
    );

    await client.query("COMMIT");
    res.status(201).json(producto);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Actualizar producto
export const updateProducto = async (req, res) => {
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
      `UPDATE productos SET ${fields} WHERE id_producto = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto actualizado", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Eliminar inventario asociado (opcional)
    await client.query("DELETE FROM inventarios WHERE id_producto = $1", [id]);

    // Eliminar producto
    const result = await client.query(
      "DELETE FROM productos WHERE id_producto = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await client.query("COMMIT");
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

