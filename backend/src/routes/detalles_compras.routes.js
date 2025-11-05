import express from 'express';
import {
  getDetallesCompra,
  getDetalleById,
  createDetalleCompra,
  updateDetalleCompra,
  deleteDetalleCompra
} from '../controllers/detalles_compras.controller.js';

const router = express.Router();

router.get('/', getDetallesCompra);
router.get('/:id', getDetalleById);
router.post('/', createDetalleCompra);
router.put('/:id', updateDetalleCompra);
router.delete('/:id', deleteDetalleCompra);

export default router;
