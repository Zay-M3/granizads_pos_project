import { supabase } from '../config/supabase.js';

// Obtener todos los detalles de compras
export const getDetallesCompra = async (req, res) => {
  const { data, error } = await supabase.from('detalles_compras').select('*');
  if (error) return res.status(500).json({ error: error?.message || JSON.stringify(error) });
  res.json(data);
};

// Obtener un detalle por id
export const getDetalleById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('detalles_compras')
    .select('*')
    .eq('id_detalle_compra', id)
    .single();

  if (error) return res.status(404).json({ error: 'Detalle no encontrado' });
  res.json(data);
};

// Crear un detalle de compra
export const createDetalleCompra = async (req, res) => {
  const { id_compra, id_producto, cantidad, precio_unitario } = req.body;

  if (!id_compra || !id_producto) return res.status(400).json({ error: 'id_compra e id_producto son requeridos' });
  if (typeof cantidad !== 'number' || cantidad <= 0) return res.status(400).json({ error: 'cantidad inválida' });
  if (typeof precio_unitario !== 'number' || precio_unitario < 0) return res.status(400).json({ error: 'precio_unitario inválido' });

  const { data, error } = await supabase
    .from('detalles_compras')
    .insert([{ id_compra, id_producto, cantidad, precio_unitario }])
    .select();

  if (error) return res.status(500).json({ error: error?.message || JSON.stringify(error) });
  res.status(201).json(data[0]);
};

// Actualizar un detalle de compra (mínimo)
export const updateDetalleCompra = async (req, res) => {
  const { id } = req.params;
  const { id_compra, id_producto, cantidad, precio_unitario } = req.body;

  const updates = {};
  if (id_compra !== undefined) updates.id_compra = id_compra;
  if (id_producto !== undefined) updates.id_producto = id_producto;
  if (cantidad !== undefined) {
    if (typeof cantidad !== 'number' || cantidad <= 0) return res.status(400).json({ error: 'cantidad inválida' });
    updates.cantidad = cantidad;
  }
  if (precio_unitario !== undefined) {
    if (typeof precio_unitario !== 'number' || precio_unitario < 0) return res.status(400).json({ error: 'precio_unitario inválido' });
    updates.precio_unitario = precio_unitario;
  }

  if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });

  const { data, error } = await supabase
    .from('detalles_compras')
    .update(updates)
    .eq('id_detalle_compra', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error?.message || JSON.stringify(error) });
  res.json(data);
};

// Eliminar un detalle de compra
export const deleteDetalleCompra = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('detalles_compras').delete().eq('id_detalle_compra', id);
  if (error) return res.status(500).json({ error: error?.message || JSON.stringify(error) });
  res.json({ message: 'Detalle eliminado' });
};