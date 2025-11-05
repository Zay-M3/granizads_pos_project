import { supabase } from "../config/supabase.js";

// Obtener todos los movimientos
export const getMovimientos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("movimientos_inventarios")
      .select("*, inventarios(id_producto)");

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener movimiento por ID
export const getMovimientoById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("movimientos_inventarios")
      .select("*, inventarios(id_producto)")
      .eq("id_movimiento", id)
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Movimiento no encontrado" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear movimiento manual (y afectar inventario)
export const createMovimiento = async (req, res) => {
  const { id_inventario, tipo_movimiento, cantidad, motivo } = req.body;

  if (!id_inventario || !tipo_movimiento || typeof cantidad !== "number") {
    return res.status(400).json({ error: "Campos faltantes o inválidos" });
  }

  try {
    // 1️⃣ Insertar movimiento
    const { data: movimiento, error: movErr } = await supabase
      .from("movimientos_inventarios")
      .insert([{ id_inventario, tipo_movimiento, cantidad, motivo }])
      .select();

    if (movErr) throw movErr;

    // 2️⃣ Obtener inventario actual
    const { data: invData, error: invErr } = await supabase
      .from("inventarios")
      .select("*")
      .eq("id_inventario", id_inventario)
      .single();

    if (invErr || !invData)
      return res.status(404).json({ error: "Inventario no encontrado" });

    // 3️⃣ Calcular nuevas unidades
    const nuevasUnidades =
      tipo_movimiento === "entrada"
        ? invData.unidades + cantidad
        : invData.unidades - cantidad;

    // 4️⃣ Actualizar inventario
    const { error: updErr } = await supabase
      .from("inventarios")
      .update({
        unidades: nuevasUnidades,
        fecha_actualizacion: new Date().toISOString().slice(0, 10),
      })
      .eq("id_inventario", id_inventario);

    if (updErr) throw updErr;

    // 5️⃣ Devolver el movimiento creado
    res.status(201).json(movimiento[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar movimiento
export const deleteMovimiento = async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ Buscar el movimiento a eliminar
    const { data: movimiento, error: movErr } = await supabase
      .from("movimientos_inventarios")
      .select("*")
      .eq("id_movimiento", id)
      .single();

    if (movErr || !movimiento) {
      return res.status(404).json({ error: "Movimiento no encontrado" });
    }

    // 2️⃣ Eliminar el movimiento
    const { error: delErr } = await supabase
      .from("movimientos_inventarios")
      .delete()
      .eq("id_movimiento", id);

    if (delErr) throw delErr;

    // 3️⃣ (Opcional) Revertir el cambio en inventario
    const { data: invData, error: invErr } = await supabase
      .from("inventarios")
      .select("*")
      .eq("id_inventario", movimiento.id_inventario)
      .single();

    if (!invErr && invData) {
      const nuevasUnidades =
        movimiento.tipo_movimiento === "entrada"
          ? invData.unidades - movimiento.cantidad // se revierte
          : invData.unidades + movimiento.cantidad;

      await supabase
        .from("inventarios")
        .update({
          unidades: nuevasUnidades,
          fecha_actualizacion: new Date().toISOString().slice(0, 10),
        })
        .eq("id_inventario", movimiento.id_inventario);
    }

    // 4️⃣ Responder éxito
    res.json({ message: "Movimiento eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
