import express from 'express';
import * as comprasCtrl from '../controllers/compras.controller.js';

const router = express.Router();

router.get('/', comprasCtrl.getCompras);
router.get('/:id', comprasCtrl.getCompraById);
router.post('/', comprasCtrl.createCompra);
router.put('/:id', comprasCtrl.updateCompra);
router.delete('/:id', comprasCtrl.deleteCompra);

export default router;