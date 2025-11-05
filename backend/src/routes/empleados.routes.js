import express from 'express';
import {
  getEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado
} from '../controllers/empleados.controller.js';

const router = express.Router();

router.get('/', getEmpleados);
router.get('/:id', getEmpleadoById);
router.post('/', createEmpleado);
router.put('/:id', updateEmpleado);
router.delete('/:id', deleteEmpleado);

export default router;
