import { supabase } from '../config/supabase.js';

// Obtener todas las categorías
export const getCategorias = async (req, res) => {
  const { data, error } = await supabase.from('categorias').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

// Obtener una categoría por ID
export const getCategoriaById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('id_categoria', id)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  res.json(data);
};

// Crear una nueva categoría
export const createCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;

  const { data, error } = await supabase.from('categorias').insert([
    { nombre, descripcion }
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    message: 'Categoría creada correctamente',
    data
  });
};

// Actualizar una categoría
export const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  const { data, error } = await supabase
    .from('categorias')
    .update({ nombre, descripcion })
    .eq('id_categoria', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    message: 'Categoría actualizada correctamente',
    data
  });
};

// Eliminar una categoría
export const deleteCategoria = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id_categoria', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'Categoría eliminada correctamente' });
};
