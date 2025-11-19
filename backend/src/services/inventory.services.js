// services/inventory.service.js
import { pool } from "../config/db.js";

/**
 * Agregar stock a un insumo y registrar movimiento.
 * @param {number} id_insumo
 * @param {number} cantidad (positiva)
 * @param {string} motivo
 * @param {object} [client] optional pg client para usar una transacción externa
 */
export const agregarStock = async (id_insumo, cantidad, motivo = "Ingreso manual", client = null) => {
  const externalClient = !!client;
  const conn = externalClient ? client : await pool.connect();

  try {
    if (!externalClient) await conn.query("BEGIN");

    // Actualizar stock (sumar)
    const upd = await conn.query(
      `UPDATE insumos
       SET stock = stock + $1
       WHERE id_insumo = $2
       RETURNING stock, minimo_stock`,
      [cantidad, id_insumo]
    );

    if (upd.rowCount === 0) throw new Error("Insumo no encontrado");

    const { stock, minimo_stock } = upd.rows[0];

    // Insertar movimiento
    await conn.query(
      `INSERT INTO movimientos_inventario (id_insumo, tipo, cantidad, motivo)
       VALUES ($1, 'entrada', $2, $3)`,
      [id_insumo, cantidad, motivo]
    );

    // Actualizar bandera alerta si corresponde
    const alerta = stock <= (minimo_stock ?? 0);
    await conn.query(
      `UPDATE insumos SET alerta = $1 WHERE id_insumo = $2`,
      [alerta, id_insumo]
    );

    if (!externalClient) await conn.query("COMMIT");

    return { id_insumo, stock, alerta };
  } catch (err) {
    if (!externalClient) await conn.query("ROLLBACK");
    throw err;
  } finally {
    if (!externalClient) conn.release();
  }
};

/**
 * Consumir stock de un insumo y registrar movimiento (no permite stock negativo).
 * @param {number} id_insumo
 * @param {number} cantidad (positiva)
 * @param {string} motivo
 * @param {object} [client] optional pg client para usar una transacción externa
 */
export const consumirStock = async (id_insumo, cantidad, motivo = "Consumo", client = null) => {
  const externalClient = !!client;
  const conn = externalClient ? client : await pool.connect();

  try {
    if (!externalClient) await conn.query("BEGIN");

    // Obtener stock actual (fila FOR UPDATE para evitar race conditions)
    const sel = await conn.query(
      `SELECT stock, minimo_stock FROM insumos WHERE id_insumo = $1 FOR UPDATE`,
      [id_insumo]
    );

    if (sel.rowCount === 0) throw new Error("Insumo no encontrado");
    const { stock: stockActual, minimo_stock } = sel.rows[0];

    if (Number(stockActual) < Number(cantidad))
      throw new Error(`Stock insuficiente para insumo ${id_insumo}. Disponible: ${stockActual}`);

    const newStock = Number(stockActual) - Number(cantidad);

    await conn.query(
      `UPDATE insumos SET stock = $1 WHERE id_insumo = $2`,
      [newStock, id_insumo]
    );

    await conn.query(
      `INSERT INTO movimientos_inventario (id_insumo, tipo, cantidad, motivo)
       VALUES ($1, 'salida', $2, $3)`,
      [id_insumo, cantidad, motivo]
    );

    const alerta = newStock <= (minimo_stock ?? 0);
    await conn.query(
      `UPDATE insumos SET alerta = $1 WHERE id_insumo = $2`,
      [alerta, id_insumo]
    );

    if (!externalClient) await conn.query("COMMIT");

    return { id_insumo, stock: newStock, alerta };
  } catch (err) {
    if (!externalClient) await conn.query("ROLLBACK");
    throw err;
  } finally {
    if (!externalClient) conn.release();
  }
};

/**
 * Consumir todos los insumos necesarios para un producto (según recetas) multiplicado por cantidadVendida.
 * Lanza error si algún insumo no tiene stock suficiente. Opcionalmente usa un client para hacer todo en una sola tx.
 * @param {number} id_producto
 * @param {number} cantidadVendida
 * @param {object} [client] optional pg client
 * @param {string} [motivoPrefix]
 */
export const consumirIngredientesProducto = async (id_producto, cantidadVendida, client = null, motivoPrefix = "Venta") => {
  const externalClient = !!client;
  const conn = externalClient ? client : await pool.connect();

  try {
    if (!externalClient) await conn.query("BEGIN");

    // Traer recetas del producto
    const rec = await conn.query(
      `SELECT id_insumo, cantidad_usada
       FROM recetas
       WHERE id_producto = $1`,
      [id_producto]
    );

    if (rec.rowCount === 0) {
      // Producto sin receta -> nada que consumir
      if (!externalClient) await conn.query("COMMIT");
      return { consumed: [] };
    }

    // Validación previa: chequear stock disponible para cada insumo
    for (const row of rec.rows) {
      const needed = Number(row.cantidad_usada) * Number(cantidadVendida);
      const sel = await conn.query(
        `SELECT stock FROM insumos WHERE id_insumo = $1 FOR SHARE`,
        [row.id_insumo]
      );
      if (sel.rowCount === 0) throw new Error(`Insumo ${row.id_insumo} no existe`);
      if (Number(sel.rows[0].stock) < needed)
        throw new Error(`Stock insuficiente para insumo ${row.id_insumo}. Necesita ${needed}`);
    }

    // Si todo bien, descontar uno por uno usando la función interna (consume directo)
    const consumed = [];
    for (const row of rec.rows) {
      const needed = Number(row.cantidad_usada) * Number(cantidadVendida);
      // reusar la lógica de consumirStock pero con el client de la tx
      const res = await consumirStock(row.id_insumo, needed, `${motivoPrefix} - producto ${id_producto}`, conn);
      consumed.push(res);
    }

    if (!externalClient) await conn.query("COMMIT");

    return { consumed };
  } catch (err) {
    if (!externalClient) await conn.query("ROLLBACK");
    throw err;
  } finally {
    if (!externalClient) conn.release();
  }
};
