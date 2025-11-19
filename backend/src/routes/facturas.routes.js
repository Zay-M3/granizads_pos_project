// routes/facturas.routes.js
import express from 'express';
import {
  getFacturas,
  getFacturaById,
  getFacturaByVentaId,
  createFactura,
  updateFactura,
  marcarFacturaEnviada,
  deleteFactura,
  getEstadisticasFacturas
} from '../controllers/facturas.controller.js';

const router = express.Router();

router.get('/', getFacturas);
router.get('/estadisticas', getEstadisticasFacturas);
router.get('/:id', getFacturaById);
router.get('/venta/:id_venta', getFacturaByVentaId);
router.post('/', createFactura);
router.put('/:id', updateFactura);
router.patch('/:id/enviar', marcarFacturaEnviada);
router.delete('/:id', deleteFactura);

export default router;