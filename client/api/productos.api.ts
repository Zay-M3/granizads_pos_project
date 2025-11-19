import api from './axios.config';
import type { Producto } from '@utils/CreateProductsUtil';

export const getProductos = async () => {
  const response = await api.get('/productos');
  return response.data;
};

export const getProductoById = async (id: number) => {
  const response = await api.get(`/productos/${id}`);
  return response.data;
};

export const getProductosPorCategoria = async (idCategoria: number) => {
  const response = await api.get(`/productos/categoria/${idCategoria}`);
  return response.data;
};

export const buscarProductos = async (termino: string) => {
  const response = await api.get(`/productos/buscar?q=${termino}`);
  return response.data;
};

export const createProducto = async (producto: Producto) => {
  const response = await api.post('/productos', producto);
  return response.data;
};

export const updateProducto = async (id: number, producto: Partial<Producto>) => {
  const response = await api.put(`/productos/${id}`, producto);
  return response.data;
};

export const deleteProducto = async (id: number) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
};
