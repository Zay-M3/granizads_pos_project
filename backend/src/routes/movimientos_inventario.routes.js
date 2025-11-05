import express from 'express';
import {
  getMovimientos,
  getMovimientoById,
  createMovimiento,
  deleteMovimiento
} from '../controllers/movimientos_inventario.controller.js';

const router = express.Router();

router.get('/', getMovimientos);
router.get('/:id', getMovimientoById);
router.post('/', createMovimiento);
router.delete('/:id', deleteMovimiento);

export default router;
