import api from './axios.config';
import type { Cliente } from '@utils/ClientesUtils';

export type { Cliente };

export const getClientes = async () => {
  const response = await api.get('/clientes');
  return response.data;
};

export const getClienteById = async (id: number) => {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
};

export const createCliente = async (cliente: Cliente) => {
  const response = await api.post('/clientes', cliente);
  return response.data;
};

export const updateCliente = async (id: number, cliente: Partial<Cliente>) => {
  const response = await api.put(`/clientes/${id}`, cliente);
  return response.data;
};

export const deleteCliente = async (id: number) => {
  const response = await api.delete(`/clientes/${id}`);
  return response.data;
};
