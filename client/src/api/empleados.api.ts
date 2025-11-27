import api from './axios.config';
import type { Empleado } from '@utils/EmpleadosUtils';

export type { Empleado };

export const getEmpleados = async () => {
  const response = await api.get('/empleados');
  return response.data;
};

export const getEmpleadoById = async (id: number) => {
  const response = await api.get(`/empleados/${id}`);
  return response.data;
};

export const updateEmpleado = async (id: number, empleado: Partial<Empleado>) => {
  const response = await api.put(`/empleados/${id}`, empleado);
  return response.data;
};

export const deleteEmpleado = async (id: number) => {
  const response = await api.delete(`/empleados/${id}`);
  return response.data;
};
