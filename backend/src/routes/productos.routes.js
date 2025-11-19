// routes/productos.routes.js
import express from 'express';
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosPorCategoria,
  buscarProductos
} from '../controllers/productos.controller.js';

const router = express.Router();

router.get('/', getProductos);
router.get('/buscar', buscarProductos);
router.get('/categoria/:id_categoria', getProductosPorCategoria);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;