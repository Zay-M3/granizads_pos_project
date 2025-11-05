import { supabase } from '../config/supabase.js';

// Obtener empleados (con datos de usuario)
export const getEmpleados = async (req, res) => {
  const { data, error } = await supabase.from('empleados').select('*, usuarios(*)');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Obtener empleado por id
export const getEmpleadoById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('empleados')
    .select('*, usuarios(*)')
    .eq('id_empleado', id)
    .single();

  if (error) return res.status(404).json({ error: 'Empleado no encontrado' });
  res.json(data);
};

// Crear empleado
export const createEmpleado = async (req, res) => {
  const { id_usuario, contrato, fecha_nacimiento, fecha_contratacion, salario } = req.body;
  if (!id_usuario) return res.status(400).json({ error: 'id_usuario requerido' });

  const { data, error } = await supabase
    .from('empleados')
    .insert([{ id_usuario, contrato, fecha_nacimiento, fecha_contratacion, salario }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

// Actualizar empleado
export const updateEmpleado = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const { data, error } = await supabase
    .from('empleados')
    .update(payload)
    .eq('id_empleado', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Empleado actualizado', data: data[0] });
};

// Eliminar empleado
export const deleteEmpleado = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('empleados').delete().eq('id_empleado', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Empleado eliminado' });
};
