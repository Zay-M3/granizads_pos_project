import { pool } from "../config/db.js";

// ✅ Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios ORDER BY id_usuario ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Obtener usuario por ID
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en getUsuarioById:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Crear nuevo usuario
export const createUsuario = async (req, res) => {
  const { id_usuario, nombre, telefono, correo } = req.body;

  if (!id_usuario || !nombre || !correo) {
    return res.status(400).json({ error: "Faltan campos requeridos: id_usuario, nombre, correo" });
  }

  try {
    // Verificar si el correo ya existe
    const check = await pool.query("SELECT id_usuario FROM usuarios WHERE correo = $1", [correo]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const result = await pool.query(
      `INSERT INTO usuarios (id_usuario, nombre, telefono, correo, fecha_creacion)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [id_usuario, nombre, telefono || null, correo]
    );

    res.status(201).json({
      message: "Usuario creado correctamente ✅",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error("Error en createUsuario:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Actualizar usuario
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }

  try {
    const fields = Object.keys(payload)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");
    const values = Object.values(payload);

    const result = await pool.query(
      `UPDATE usuarios SET ${fields} WHERE id_usuario = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      message: "Usuario actualizado correctamente ✅",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error("Error en updateUsuario:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Eliminar usuario
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente ✅" });
  } catch (error) {
    console.error("Error en deleteUsuario:", error);
    res.status(500).json({ error: error.message });
  }
};
