//-----------------------------------------------------
// LOGIN (versión final con modelo actualizado)
//-----------------------------------------------------
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({
      error: "Faltan campos requeridos (correo, contrasena)"
    });
  }

  try {
    // Buscar usuario con JOIN hacia empleado
    const result = await pool.query(
      `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.correo,
        u.telefono,
        u.contrasena,
        u.rol,
        e.id_empleado,
        e.fecha_nacimiento,
        e.fecha_inicio,
        e.activo
      FROM usuarios u
      LEFT JOIN empleados e ON u.id_usuario = e.id_usuario
      WHERE u.correo = $1
      `,
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Verificar si tiene contraseña
    if (!user.contrasena) {
      return res.status(400).json({
        error: "El usuario no tiene una contraseña registrada"
      });
    }

    // Validar contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({
        error: "Usuario o contraseña incorrectas " 
      });
    }

    // Crear token
    const token = jwt.sign(
      {
        id: user.id_usuario,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Inicio de sesión exitoso ✅",
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        telefono: user.telefono,
        rol: user.rol,
        empleado: {
          id_empleado: user.id_empleado,
          fecha_nacimiento: user.fecha_nacimiento,
          fecha_inicio: user.fecha_inicio,
          activo: user.activo
        }
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: error.message });
  }
};
