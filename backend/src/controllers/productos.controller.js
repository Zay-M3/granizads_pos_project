import { supabase } from '../config/supabase.js';

// Obtener todos los productos (con categoría)
export const getProductos = async (req, res) => {
  const { data, error } = await supabase.from('productos').select('*, categorias(*)');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Obtener producto por id
export const getProductoById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('productos')
    .select('*, categorias(*)')
    .eq('id_producto', id)
    .single();

  if (error) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(data);
};

// Crear producto
export const createProducto = async (req, res) => {
  const { id_categoria, nombre, tipo, descripcion, precio } = req.body;
  if (!nombre || !precio) return res.status(400).json({ error: 'nombre y precio son requeridos' });

  const { data, error } = await supabase
    .from('productos')
    .insert([{ id_categoria, nombre, tipo, descripcion, precio }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  // Opcional: crear entrada en inventarios al crear producto
  const producto = data[0];
  await supabase.from('inventarios').insert([{ id_producto: producto.id_producto, unidades: 0, costo_unitario: 0 }]);

  res.status(201).json(producto);
};

// Actualizar producto
export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const { data, error } = await supabase
    .from('productos')
    .update(payload)
    .eq('id_producto', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Producto actualizado', data: data[0] });
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
  const { id } = req.params;
  // Si quieres, antes podrías verificar dependencias
  const { error } = await supabase.from('productos').delete().eq('id_producto', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Producto eliminado' });
};
