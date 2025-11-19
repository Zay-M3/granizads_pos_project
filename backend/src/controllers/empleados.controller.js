
import { pool } from "../config/db.js";


// 🟢 Obtener todos los empleados con info del usuario
export const getEmpleados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id_empleado,
        u.id_usuario,
        u.nombre,
        u.correo,
        u.telefono,
        u.rol,
        e.fecha_nacimiento,
        e.fecha_inicio,
        e.activo
      FROM empleados e
      INNER JOIN usuarios u ON u.id_usuario = e.id_usuario
      ORDER BY e.id_empleado ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error en getEmpleados:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getEmpleadoById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        e.id_empleado,
        u.id_usuario,
        u.nombre,
        u.correo,
        u.telefono,
        u.rol,
        e.fecha_nacimiento,
        e.fecha_inicio,
        e.activo
      FROM empleados e
      INNER JOIN usuarios u ON u.id_usuario = e.id_usuario
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


// 🟢 Actualizar empleado
export const updateEmpleado = async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  if (Object.keys(fields).length === 0)
    return res.status(400).json({ error: "No hay campos para actualizar" });

  try {
    let setParts = [];
    let values = [];
    let i = 1;

    for (const [key, value] of Object.entries(fields)) {
      setParts.push(`${key} = $${i++}`);
      values.push(value);
    }

    const query = `
      UPDATE empleados 
      SET ${setParts.join(", ")} 
      WHERE id_empleado = $${i}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Empleado no encontrado" });

    res.json({
      message: "Empleado actualizado correctamente",
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

    res.json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteEmpleado:", error);
    res.status(500).json({ error: error.message });
  }
};
