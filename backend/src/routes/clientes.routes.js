import express from 'express';
import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
} from '../controllers/clientes.controller.js';

const router = express.Router();

router.get('/', getClientes);
router.get('/:id', getClienteById);
router.post('/', createCliente);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);

export default router;
