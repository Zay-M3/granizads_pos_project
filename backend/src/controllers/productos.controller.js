// controllers/productos.controller.js
import { pool } from "../config/db.js";

// Obtener todos los productos con información de categoría
export const getProductos = async (req, res) => {
  try {
    const { categoria, disponibilidad } = req.query;
    
    let query = `
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre, 
        c.descripcion AS categoria_descripcion,
        COUNT(r.id_receta) as total_ingredientes
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN recetas r ON p.id_producto = r.id_producto
    `;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (categoria) {
      paramCount++;
      conditions.push(`c.nombre ILIKE $${paramCount}`);
      params.push(`%${categoria}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY p.id_producto, c.id_categoria ORDER BY p.nombre ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener producto por ID con información completa
export const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener información básica del producto
    const productoResult = await pool.query(`
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre, 
        c.descripcion AS categoria_descripcion
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = $1
    `, [id]);

    if (productoResult.rows.length === 0)
      return res.status(404).json({ error: "Producto no encontrado" });

    // Obtener receta del producto (ingredientes)
    const recetaResult = await pool.query(`
      SELECT 
        r.*,
        i.nombre AS insumo_nombre,
        i.unidad_medida,
        i.stock AS insumo_stock
      FROM recetas r
      JOIN insumos i ON r.id_insumo = i.id_insumo
      WHERE r.id_producto = $1
    `, [id]);

    const producto = productoResult.rows[0];
    producto.receta = recetaResult.rows;

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear producto
export const createProducto = async (req, res) => {
  const { id_categoria, nombre, precio, descripcion, receta } = req.body;

  if (!nombre || !precio || !id_categoria) {
    return res.status(400).json({ 
      error: "nombre, precio e id_categoria son requeridos" 
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verificar que la categoría existe
    const categoriaCheck = await client.query(
      "SELECT id_categoria FROM categorias WHERE id_categoria = $1",
      [id_categoria]
    );

    if (categoriaCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Crear producto (CORREGIDO: solo 4 parámetros en lugar de 6)
    const productoResult = await client.query(
      `INSERT INTO productos (id_categoria, nombre, precio, descripcion)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_categoria, nombre, precio, descripcion || null]
    );

    const producto = productoResult.rows[0];

    // Si se proporciona una receta, crear los registros correspondientes
    if (receta && Array.isArray(receta)) {
      for (const ingrediente of receta) {
        if (!ingrediente.id_insumo || !ingrediente.cantidad_usada) {
          await client.query("ROLLBACK");
          return res.status(400).json({ 
            error: "Cada ingrediente debe tener id_insumo y cantidad_usada" 
          });
        }

        // Verificar que el insumo existe
        const insumoCheck = await client.query(
          "SELECT id_insumo FROM insumos WHERE id_insumo = $1",
          [ingrediente.id_insumo]
        );

        if (insumoCheck.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({ 
            error: `Insumo con ID ${ingrediente.id_insumo} no encontrado` 
          });
        }

        // Crear registro en recetas
        await client.query(
          `INSERT INTO recetas (id_producto, id_insumo, cantidad_usada)
           VALUES ($1, $2, $3)`,
          [producto.id_producto, ingrediente.id_insumo, ingrediente.cantidad_usada]
        );
      }
    }

    await client.query("COMMIT");

    // Obtener el producto completo con receta
    const productoCompleto = await getProductoCompleto(producto.id_producto, client);

    res.status(201).json({
      message: "Producto creado exitosamente",
      producto: productoCompleto
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Actualizar producto
export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { id_categoria, nombre, precio, descripcion } = req.body;

  if (!id_categoria && !nombre && !precio && !descripcion) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verificar que el producto existe
    const productoCheck = await client.query(
      "SELECT id_producto FROM productos WHERE id_producto = $1",
      [id]
    );

    if (productoCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar categoría si se está actualizando
    if (id_categoria) {
      const categoriaCheck = await client.query(
        "SELECT id_categoria FROM categorias WHERE id_categoria = $1",
        [id_categoria]
      );

      if (categoriaCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Categoría no encontrada" });
      }
    }

    // Construir query dinámica
    const fields = [];
    const values = [];

    if (id_categoria) {
      fields.push(`id_categoria = $${fields.length + 1}`);
      values.push(id_categoria);
    }
    
    if (nombre) {
      fields.push(`nombre = $${fields.length + 1}`);
      values.push(nombre);
    }
    if (precio) {
      fields.push(`precio = $${fields.length + 1}`);
      values.push(precio);
    }
    if (descripcion !== undefined) {
      fields.push(`descripcion = $${fields.length + 1}`);
      values.push(descripcion);
    }

    values.push(id);

    const result = await client.query(
      `UPDATE productos SET ${fields.join(", ")} 
       WHERE id_producto = $${values.length} 
       RETURNING *`,
      values
    );

    await client.query("COMMIT");

    res.json({ 
      message: "Producto actualizado", 
      producto: result.rows[0] 
    });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Verificar que el producto existe
    const productoCheck = await client.query(
      "SELECT id_producto FROM productos WHERE id_producto = $1",
      [id]
    );

    if (productoCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar si el producto tiene ventas asociadas
    const ventasCheck = await client.query(
      "SELECT id_detalle FROM detalles_ventas WHERE id_producto = $1 LIMIT 1",
      [id]
    );

    if (ventasCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ 
        error: "No se puede eliminar el producto porque tiene ventas asociadas" 
      });
    }

    // Eliminar recetas asociadas primero
    await client.query(
      "DELETE FROM recetas WHERE id_producto = $1",
      [id]
    );

    // Eliminar producto
    const result = await client.query(
      "DELETE FROM productos WHERE id_producto = $1 RETURNING *",
      [id]
    );

    await client.query("COMMIT");

    res.json({ 
      message: "Producto eliminado exitosamente",
      producto_eliminado: result.rows[0] 
    });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Obtener productos por categoría
export const getProductosPorCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria_nombre
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_categoria = $1
      ORDER BY p.nombre ASC
    `, [id_categoria]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar productos por nombre
export const buscarProductos = async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: "Parámetro de búsqueda requerido" });
  }

  try {
    const result = await pool.query(`
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.nombre ILIKE $1 OR p.descripcion ILIKE $1
      ORDER BY p.nombre ASC
    `, [`%${q}%`]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función auxiliar para obtener producto completo
async function getProductoCompleto(id_producto, client = pool) {
  const productoResult = await client.query(`
    SELECT 
      p.*, 
      c.nombre AS categoria_nombre, 
      c.descripcion AS categoria_descripcion
    FROM productos p
    LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
    WHERE p.id_producto = $1
  `, [id_producto]);

  if (productoResult.rows.length === 0) return null;

  const recetaResult = await client.query(`
    SELECT 
      r.*,
      i.nombre AS insumo_nombre,
      i.unidad_medida,
      i.stock AS insumo_stock
    FROM recetas r
    JOIN insumos i ON r.id_insumo = i.id_insumo
    WHERE r.id_producto = $1
  `, [id_producto]);

  const producto = productoResult.rows[0];
  producto.receta = recetaResult.rows;

  return producto;
}