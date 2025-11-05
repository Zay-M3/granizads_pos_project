import { supabase } from "../config/supabase.js";

// Obtener todos los inventarios
export const getInventarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("inventarios")
      .select("*, productos(nombre, categoria, precio)");

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener inventario por ID
export const getInventarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("inventarios")
      .select("*, productos(nombre, categoria, precio)")
      .eq("id_inventario", id)
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Inventario no encontrado" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo inventario
export const createInventario = async (req, res) => {
  const { id_producto, unidades, stock_minimo } = req.body;

  if (!id_producto || typeof unidades !== "number") {
    return res
      .status(400)
      .json({ error: "Campos obligatorios: id_producto, unidades" });
  }

  try {
    const { data, error } = await supabase
      .from("inventarios")
      .insert([
        {
          id_producto,
          unidades,
          stock_minimo: stock_minimo || 10,
          fecha_actualizacion: new Date().toISOString().slice(0, 10),
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar inventario
export const updateInventario = async (req, res) => {
  const { id } = req.params;
  const { id_producto, unidades, stock_minimo } = req.body;

  try {
    const { data, error } = await supabase
      .from("inventarios")
      .update({
        id_producto,
        unidades,
        stock_minimo,
        fecha_actualizacion: new Date().toISOString().slice(0, 10),
      })
      .eq("id_inventario", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0)
      return res.status(404).json({ error: "Inventario no encontrado" });

    res.json({ message: "Inventario actualizado correctamente", data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar inventario
export const deleteInventario = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from("inventarios")
      .delete()
      .eq("id_inventario", id);

    if (error) throw error;

    res.json({ message: "Inventario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
