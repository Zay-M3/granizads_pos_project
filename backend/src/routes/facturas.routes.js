import express from 'express';
import {
  getFacturas,
  getFacturaById,
  createFactura,
  deleteFactura
} from '../controllers/facturas.controller.js';

const router = express.Router();

router.get('/', getFacturas);
router.get('/:id', getFacturaById);
router.post('/', createFactura);
router.delete('/:id', deleteFactura);

export default router;
