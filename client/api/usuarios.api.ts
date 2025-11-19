import api from './axios.config';
import type { Usuario } from '@utils/admin/CreateCashierUtils';

export const getUsuarios = async () => {
  const response = await api.get('/usuarios');
  return response.data;
};

export const getUsuarioById = async (id: number) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

export const createUsuario = async (usuario: Usuario) => {
  const response = await api.post('/usuarios', usuario);
  return response.data;
};

export const updateUsuario = async (id: number, usuario: Partial<Usuario>) => {
  const response = await api.put(`/usuarios/${id}`, usuario);
  return response.data;
};

export const deleteUsuario = async (id: number) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
};
