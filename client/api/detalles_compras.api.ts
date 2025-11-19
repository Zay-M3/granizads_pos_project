import api from './axios.config';

export interface DetalleCompra {
  id_detalle?: number;
  id_venta?: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}

export const getDetallesCompra = async () => {
  const response = await api.get('/detalles');
  return response.data;
};

export const getDetalleById = async (id: number) => {
  const response = await api.get(`/detalles/${id}`);
  return response.data;
};

export const createDetalleCompra = async (detalle: DetalleCompra) => {
  const response = await api.post('/detalles', detalle);
  return response.data;
};

export const updateDetalleCompra = async (id: number, detalle: Partial<DetalleCompra>) => {
  const response = await api.put(`/detalles/${id}`, detalle);
  return response.data;
};

export const deleteDetalleCompra = async (id: number) => {
  const response = await api.delete(`/detalles/${id}`);
  return response.data;
};
