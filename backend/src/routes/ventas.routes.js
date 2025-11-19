// routes/ventas.routes.js
import express from 'express';
import {
  createVenta,
  getVentas,
  getVentaById,
  deleteVenta,
  anularVenta,
  getEstadisticasVentas
} from '../controllers/ventas.controller.js';

const router = express.Router();

router.post('/', createVenta);
router.get('/', getVentas);
router.get('/estadisticas', getEstadisticasVentas);
router.get('/:id', getVentaById);
router.delete('/:id', deleteVenta);
router.patch('/:id/anular', anularVenta);

export default router;