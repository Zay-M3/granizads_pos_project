import { supabase } from '../config/supabase.js';

export const getFacturas = async (req, res) => {
  const { data, error } = await supabase.from('facturas_electronicas').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const getFacturaById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('facturas_electronicas')
    .select('*')
    .eq('id_factura', id)
    .single();

  if (error) return res.status(404).json({ error: 'Factura no encontrada' });
  res.json(data);
};

export const createFactura = async (req, res) => {
  const { id_compra, codigo_dian, estado_envio, fecha_envio } = req.body;
  if (!id_compra) return res.status(400).json({ error: 'id_compra es requerido' });

  const { data, error } = await supabase
    .from('facturas_electronicas')
    .insert([{ id_compra, codigo_dian, estado_envio, fecha_envio }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
};

export const updateFactura = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const { data, error } = await supabase
    .from('facturas_electronicas')
    .update(payload)
    .eq('id_factura', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Factura actualizada', data: data[0] });
};

export const deleteFactura = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('facturas_electronicas').delete().eq('id_factura', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Factura eliminada' });
};
