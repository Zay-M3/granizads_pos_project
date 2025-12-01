import api from './axios.config';
import type { CreateCategoria, Categoria } from '@utils/CategoryUtils';

export const getCategorias = async () => {
  const response = await api.get('/categorias');
  return response.data;
};

export const getCategoriaById = async (id: number) => {
  const response = await api.get(`/categorias/${id}`);
  return response.data;
};

export const createCategoria = async (categoria: CreateCategoria) => {
  const response = await api.post('/categorias', categoria);
  return response.data;
};

export const updateCategoria = async (id: number, categoria: Partial<Categoria>) => {
  const response = await api.put(`/categorias/${id}`, categoria);
  return response.data;
};

export const deleteCategoria = async (id: number) => {
  const response = await api.delete(`/categorias/${id}`);
  return response.data;
};
