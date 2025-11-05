import { supabase } from '../config/supabase.js';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  const { data, error } = await supabase.from('usuarios').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Obtener usuario por id
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id_usuario', id)
    .single();

  if (error) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(data);
};

// Crear usuario
export const createUsuario = async (req, res) => {
  const { nombre, telefono, correo, contrasena, rol } = req.body;
  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nombre, telefono, correo, contrasena, rol }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

// Actualizar usuario
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const { data, error } = await supabase
    .from('usuarios')
    .update(payload)
    .eq('id_usuario', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Usuario actualizado', data: data[0] });
};

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('usuarios').delete().eq('id_usuario', id);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Usuario eliminado' });
};
