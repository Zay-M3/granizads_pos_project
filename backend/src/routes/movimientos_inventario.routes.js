import express from 'express';
import {
  getMovimientos,
  postAgregarStock,
  postConsumirStock,

} from '../controllers/movimientos_inventario.controller.js';

const router = express.Router();

router.get('/', getMovimientos);
router.post('/', postAgregarStock);
router.post('/', postConsumirStock);


export default router;
