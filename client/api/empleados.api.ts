import api from './axios.config';

export interface Empleado {
  id_empleado?: number;
  nombre: string;
  email: string;
  telefono?: string;
  cargo?: string;
  fecha_contratacion?: string;
  activo?: boolean;
}

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
