//-------------------------------------------
// CONTROLLER DE USUARIOS (versión final)
//-------------------------------------------
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

// 🟢 Obtener todos los usuarios con datos del empleado
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id_usuario,
        u.nombre,
        u.correo,
        u.telefono,
        u.rol,
        u.fecha_creacion,
        e.id_empleado,
        e.fecha_nacimiento,
        e.fecha_inicio,
        e.activo
      FROM usuarios u
      LEFT JOIN empleados e ON e.id_usuario = u.id_usuario
      ORDER BY u.id_usuario ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Obtener usuario por ID (con datos del empleado)
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.correo,
        u.telefono,
        u.rol,
        u.fecha_creacion,
        e.id_empleado,
        e.fecha_nacimiento,
        e.fecha_inicio,
        e.activo
      FROM usuarios u
      LEFT JOIN empleados e ON e.id_usuario = u.id_usuario
      WHERE u.id_usuario = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en getUsuarioById:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Crear usuario + crear empleado automáticamente
export const createUsuario = async (req, res) => {
  const { id_usuario, nombre, telefono, correo, contrasena, rol, fecha_nacimiento } = req.body;

  if (!id_usuario || !nombre || !correo || !contrasena) {
    return res.status(400).json({
      error: "Faltan campos requeridos: id_usuario, nombre, correo, contrasena",
    });
  }

  try {
    // Verificar si el correo ya existe
    const check = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE correo = $1",
      [correo]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // === Transacción para crear usuario + empleado ===
    await pool.query("BEGIN");

    const newUser = await pool.query(
      `
      INSERT INTO usuarios (id_usuario, nombre, telefono, correo, contrasena, rol, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING *
      `,
      [
        id_usuario,
        nombre,
        telefono || null,
        correo,
        hashedPassword,
        rol || "cajero",
      ]
    );

    // Crear empleado automáticamente
    const newEmployee = await pool.query(
      `
      INSERT INTO empleados (id_usuario, fecha_nacimiento)
      VALUES ($1, $2)
      RETURNING *
      `,
      [id_usuario, fecha_nacimiento || null]
    );

    await pool.query("COMMIT");

    res.status(201).json({
      message: "Usuario y empleado creados correctamente ✅",
      usuario: newUser.rows[0],
      empleado: newEmployee.rows[0],
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error en createUsuario:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Actualizar usuario (y empleado si hay fecha_nacimiento)
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ error: "No hay campos para actualizar" });
  }

  try {
    await pool.query("BEGIN");

    // Separar campos de usuario y empleado
    const usuarioFields = {};
    const empleadoFields = {};

    for (const [key, value] of Object.entries(payload)) {
      if (key === "fecha_nacimiento") {
        empleadoFields[key] = value;
      } else {
        usuarioFields[key] = value;
      }
    }

    let updatedUser = null;

    // Actualizar usuario si hay campos
    if (Object.keys(usuarioFields).length > 0) {
      let fields = [];
      let values = [];
      let i = 1;

      for (const [key, value] of Object.entries(usuarioFields)) {
        if (key === "contrasena") {
          const hash = await bcrypt.hash(value, 10);
          fields.push(`contrasena = $${i++}`);
          values.push(hash);
        } else {
          fields.push(`${key} = $${i++}`);
          values.push(value);
        }
      }

      const result = await pool.query(
        `
        UPDATE usuarios
        SET ${fields.join(", ")}
        WHERE id_usuario = $${i}
        RETURNING *
        `,
        [...values, id]
      );

      if (result.rows.length === 0) {
        await pool.query("ROLLBACK");
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      updatedUser = result.rows[0];
    }

    // Actualizar empleado si hay campos
    if (Object.keys(empleadoFields).length > 0) {
      let fields = [];
      let values = [];
      let i = 1;

      for (const [key, value] of Object.entries(empleadoFields)) {
        fields.push(`${key} = $${i++}`);
        values.push(value);
      }

      await pool.query(
        `
        UPDATE empleados
        SET ${fields.join(", ")}
        WHERE id_usuario = $${i}
        `,
        [...values, id]
      );
    }

    await pool.query("COMMIT");

    res.json({
      message: "Usuario actualizado correctamente ✅",
      usuario: updatedUser || { id_usuario: id },
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error en updateUsuario:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Eliminar usuario (borra también el empleado por CASCADE)
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario y empleado eliminados correctamente ✅" });
  } catch (error) {
    console.error("Error en deleteUsuario:", error);
    res.status(500).json({ error: error.message });
  }
};
