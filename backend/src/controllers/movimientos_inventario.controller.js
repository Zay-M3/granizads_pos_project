// controllers/movimientos.controller.js
import { pool } from "../config/db.js";
import { agregarStock, consumirStock } from "../services/inventory.services.js";

// Obtener movimientos (últimos N o por insumo)
export const getMovimientos = async (req, res) => {
  const { id_insumo, limit = 100 } = req.query;
  try {
    let sql = `SELECT m.*, i.nombre as insumo_nombre
               FROM movimientos_inventario m
               JOIN insumos i ON m.id_insumo = i.id_insumo`;
    const params = [];

    if (id_insumo) {
      sql += ` WHERE m.id_insumo = $1`;
      params.push(id_insumo);
    }

    sql += ` ORDER BY m.fecha DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint para agregar stock manualmente (usa agregarStock)
export const postAgregarStock = async (req, res) => {
  const { id_insumo, cantidad, motivo } = req.body;
  if (!id_insumo || cantidad == null) return res.status(400).json({ error: "id_insumo y cantidad son obligatorios" });

  try {
    const result = await agregarStock(id_insumo, Number(cantidad), motivo || "Ingreso manual");
    res.json({ message: "Stock agregado", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Endpoint para consumir stock manualmente (usa consumirStock)
export const postConsumirStock = async (req, res) => {
  const { id_insumo, cantidad, motivo } = req.body;
  if (!id_insumo || cantidad == null) return res.status(400).json({ error: "id_insumo y cantidad son obligatorios" });

  try {
    const result = await consumirStock(id_insumo, Number(cantidad), motivo || "Consumo manual");
    res.json({ message: "Stock consumido", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
