import express from 'express';
import {
  getEmpleados,
  getEmpleadoById,
  updateEmpleado,
  deleteEmpleado
} from '../controllers/empleados.controller.js';

const router = express.Router();

router.get('/', getEmpleados);
router.get('/:id', getEmpleadoById);
router.put('/:id', updateEmpleado);
router.delete('/:id', deleteEmpleado);

export default router;
