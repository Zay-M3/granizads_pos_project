// ...existing code...
import { supabase } from '../config/supabase.js';

/**
 * createCompra:
 * Body esperado:
 * {
 *   id_cliente,
 *   id_empleado,
 *   metodo_pago,
 *   estado,
 *   total,
 *   detalles: [
 *     { id_producto, cantidad, precio_unitario }
 *   ]
 * }
 *
 * NOTA: Este flujo realiza varias consultas secuenciales:
 *  - Inserta la compra
 *  - Inserta los detalles
 *  - Resta stock en inventarios y crea movimientos
 *
 * Si necesitas transacción atómica, considera una función RPC en la DB.
 */

export const getCompras = async (req, res) => {
  const { data, error } = await supabase.from('compras').select('*');
  if (error) return res.status(500).json({ error: error?.message || JSON.stringify(error) });
  res.json(data);
};

export const getCompraById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('compras')
    .select('*, detalles_compras(*), clientes(*), empleados(*)')
    .eq('id_compra', id)
    .single();

  if (error) return res.status(404).json({ error: 'Compra no encontrada' });
  res.json(data);
};

export const createCompra = async (req, res) => {
  const {
    id_cliente,
    id_empleado,
    metodo_pago = 'efectivo',
    estado = 'pagado',
    total,
    detalles
  } = req.body;

  // Validaciones básicas
  if (!id_cliente) return res.status(400).json({ error: 'id_cliente es requerido' });
  if (typeof total !== 'number' || total <= 0) return res.status(400).json({ error: 'total inválido' });
  if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ error: 'detalles es requerido y debe ser array' });
  }

  for (const d of detalles) {
    if (!d.id_producto || typeof d.cantidad !== 'number' || d.cantidad <= 0 || typeof d.precio_unitario !== 'number') {
      return res.status(400).json({ error: 'Cada detalle debe tener id_producto, cantidad>0 y precio_unitario' });
    }
  }

  // Insertar compra
  const { data: compraData, error: compraErr } = await supabase
    .from('compras')
    .insert([{ id_cliente, id_empleado, total, metodo_pago, estado }])
    .select();

  if (compraErr) return res.status(500).json({ error: compraErr?.message || JSON.stringify(compraErr) });
  const compra = compraData[0];

  // Insertar detalles
  const detallesPayload = detalles.map(d => ({
    id_compra: compra.id_compra,
    id_producto: d.id_producto,
    cantidad: d.cantidad,
    precio_unitario: d.precio_unitario
  }));

  const { data: detallesData, error: detallesErr } = await supabase
    .from('detalles_compras')
    .insert(detallesPayload)
    .select();

  if (detallesErr) {
    // Si falla insertar detalles, eliminar compra para mantener consistencia
    await supabase.from('compras').delete().eq('id_compra', compra.id_compra);
    return res.status(500).json({ error: detallesErr?.message || JSON.stringify(detallesErr) });
  }

  // 3) Actualizar inventario por cada detalle y registrar movimientos
  // Si ocurre un error después de haber aplicado algunos cambios, se intentará hacer rollback compensatorio
  const updatedInventarios = []; // { id_inventario, cantidad }
  try {
    for (const d of detalles) {
      // Buscar inventario del producto
      const { data: invData, error: invErr } = await supabase
        .from('inventarios')
        .select('*')
        .eq('id_producto', d.id_producto)
        .single();

      if (invErr || !invData) {
        throw new Error(`Inventario no encontrado para producto ${d.id_producto}`);
      }

      if (invData.unidades < d.cantidad) {
        throw new Error(`Stock insuficiente para producto ${d.id_producto} (disponible: ${invData.unidades}, requerido: ${d.cantidad})`);
      }

      const nuevasUnidades = invData.unidades - d.cantidad;
      const { error: updErr } = await supabase
        .from('inventarios')
        .update({ unidades: nuevasUnidades, fecha_actualizacion: new Date().toISOString().split('T')[0] })
        .eq('id_inventario', invData.id_inventario);

      if (updErr) {
        throw new Error(`Error actualizando inventario para producto ${d.id_producto}: ${updErr?.message || JSON.stringify(updErr)}`);
      }

      // Registrar movimiento
      const motivo = `Venta (compra ${compra.id_compra})`;
      const { error: movErr } = await supabase.from('movimientos_inventarios').insert([{
        id_inventario: invData.id_inventario,
        tipo_movimiento: 'salida',
        cantidad: d.cantidad,
        motivo
      }]);

      if (movErr) {
        // intentar revertir la actualización del inventario localmente antes de lanzar
        await supabase
          .from('inventarios')
          .update({ unidades: invData.unidades, fecha_actualizacion: new Date().toISOString().split('T')[0] })
          .eq('id_inventario', invData.id_inventario);

        throw new Error(`Error registrando movimiento para producto ${d.id_producto}: ${movErr?.message || JSON.stringify(movErr)}`);
      }

      updatedInventarios.push({ id_inventario: invData.id_inventario, cantidad: d.cantidad });
    }

    // Todo OK
    res.status(201).json({ compra, detalles: detallesData });
  } catch (err) {
    const message = err?.message || JSON.stringify(err);

    // rollback compensatorio:
    // 1) revertir inventarios ya actualizados
    for (const ui of updatedInventarios) {
      try {
        // sumar de vuelta usando RPC si existe, si no hacer update manual
        await supabase.rpc('incrementar_inventario_por_id', { p_id_inventario: ui.id_inventario, p_cantidad: ui.cantidad })
          .catch(async () => {
            const { data: inv, error: e } = await supabase.from('inventarios').select('unidades').eq('id_inventario', ui.id_inventario).single();
            if (!e && inv) {
              await supabase.from('inventarios').update({ unidades: inv.unidades + ui.cantidad }).eq('id_inventario', ui.id_inventario);
            }
          });

        // eliminar movimientos asociados a esta compra y inventario (intento amplio)
        await supabase
          .from('movimientos_inventarios')
          .delete()
          .match({ id_inventario: ui.id_inventario, tipo_movimiento: 'salida' });
      } catch (e) {
        // ignorar errores en rollback, pero registrar
        console.warn('Rollback parcial fallo:', e);
      }
    }

    // 2) eliminar detalles insertados para la compra
    try {
      await supabase.from('detalles_compras').delete().eq('id_compra', compra.id_compra);
    } catch (e) {
      console.warn('No se pudo eliminar detalles durante rollback:', e);
    }

    // 3) eliminar la compra
    try {
      await supabase.from('compras').delete().eq('id_compra', compra.id_compra);
    } catch (e) {
      console.warn('No se pudo eliminar compra durante rollback:', e);
    }

    return res.status(500).json({ error: message });
  }
};

// Minimal updateCompra para evitar error de import en rutas.
// No maneja actualización de detalles ni ajuste de inventario.
export const updateCompra = async (req, res) => {
  const { id } = req.params;
  const { id_cliente, id_empleado, metodo_pago, estado, total } = req.body;

  // Construir objeto de actualización con solo campos permitidos
  const updates = {};
  if (id_cliente !== undefined) updates.id_cliente = id_cliente;
  if (id_empleado !== undefined) updates.id_empleado = id_empleado;
  if (metodo_pago !== undefined) updates.metodo_pago = metodo_pago;
  if (estado !== undefined) updates.estado = estado;
  if (total !== undefined) {
    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ error: 'total inválido' });
    }
    updates.total = total;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  const { data, error } = await supabase
    .from('compras')
    .update(updates)
    .eq('id_compra', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error?.message || JSON.stringify(error) });
  }

  res.json(data);
};

export const deleteCompra = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('compras').delete().eq('id_compra', id);
  if (error) return res.status(500).json({ error: error?.message || JSON.stringify(error) });
  res.json({ message: 'Compra eliminada' });
};
// ...existing code...