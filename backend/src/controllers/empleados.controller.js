import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

/**
 * ✅ CONTROLADOR: EMPLEADOS
 * Maneja CRUD y oculta contraseñas de forma segura.
 */

// 🟢 Obtener todos los empleados (sin mostrar contraseñas)
export const getEmpleados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id_empleado,
        id_usuario,
        fecha_nacimiento,
        activo,
        rol
      FROM empleados
      ORDER BY id_empleado ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error en getEmpleados:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Obtener un empleado por ID
export const getEmpleadoById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        id_empleado,
        id_usuario,
        fecha_nacimiento,
        activo,
        rol
      FROM empleados
      WHERE id_empleado = $1
      `,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Empleado no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en getEmpleadoById:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Crear nuevo empleado
export const createEmpleado = async (req, res) => {
  const { id_usuario, fecha_nacimiento, contrasena, rol, activo } = req.body;

  if (!id_usuario || !contrasena)
    return res.status(400).json({ error: "id_usuario y contrasena son requeridos" });

  try {
    // Encriptar contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const result = await pool.query(
      `
      INSERT INTO empleados (id_usuario, fecha_nacimiento, contrasena, rol, activo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_empleado, id_usuario, fecha_nacimiento, rol, activo
      `,
      [id_usuario, fecha_nacimiento, hashedPassword, rol || "cajero", activo ?? true]
    );

    res.status(201).json({
      message: "Empleado creado correctamente ✅",
      empleado: result.rows[0],
    });
  } catch (error) {
    console.error("Error en createEmpleado:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Actualizar empleado
export const updateEmpleado = async (req, res) => {
  const { id } = req.params;
  const { contrasena, ...otrosCampos } = req.body;

  try {
    let updateQuery = [];
    let values = [];
    let i = 1;

    for (const [key, value] of Object.entries(otrosCampos)) {
      updateQuery.push(`${key} = $${i++}`);
      values.push(value);
    }

    if (contrasena) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      updateQuery.push(`contrasena = $${i++}`);
      values.push(hashedPassword);
    }

    if (updateQuery.length === 0)
      return res.status(400).json({ error: "No hay campos para actualizar" });

    const query = `
      UPDATE empleados
      SET ${updateQuery.join(", ")}
      WHERE id_empleado = $${i}
      RETURNING id_empleado, id_usuario, fecha_nacimiento, rol, activo
    `;

    const result = await pool.query(query, [...values, id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Empleado no encontrado" });

    res.json({
      message: "Empleado actualizado correctamente ✅",
      empleado: result.rows[0],
    });
  } catch (error) {
    console.error("Error en updateEmpleado:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Eliminar empleado
export const deleteEmpleado = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM empleados WHERE id_empleado = $1 RETURNING id_empleado",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Empleado no encontrado" });

    res.json({ message: "Empleado eliminado correctamente ✅" });
  } catch (error) {
    console.error("Error en deleteEmpleado:", error);
    res.status(500).json({ error: error.message });
  }
};
