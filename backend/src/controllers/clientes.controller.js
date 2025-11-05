import { supabase } from '../config/supabase.js';

// Obtener todos los clientes (con datos de usuario join)
export const getClientes = async (req, res) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*, usuarios(*)');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Obtener cliente por id
export const getClienteById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('clientes')
    .select('*, usuarios(*)')
    .eq('id_cliente', id)
    .single();

  if (error) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(data);
};

// Crear cliente (suponer que usuario ya existe o crear referencia)
export const createCliente = async (req, res) => {
  const { id_usuario, cedula } = req.body;
  if (!id_usuario) return res.status(400).json({ error: 'id_usuario requerido' });

  const { data, error } = await supabase
    .from('clientes')
    .insert([{ id_usuario, cedula }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const { data, error } = await supabase
    .from('clientes')
    .update(payload)
    .eq('id_cliente', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Cliente actualizado', data: data[0] });
};

// Eliminar cliente
export const deleteCliente = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('clientes').delete().eq('id_cliente', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Cliente eliminado' });
};
