import api from './axios.config';
import type { DetalleVenta, Venta, EstadisticasVentas } from '@utils/VentasUtils';

export type { DetalleVenta, Venta, EstadisticasVentas };

export const createVenta = async (venta: Venta) => {
  const response = await api.post('/ventas', venta);
  return response.data;
};

export const getVentas = async () => {
  const response = await api.get('/ventas');
  return response.data;
};

export const getVentaById = async (id: number) => {
  const response = await api.get(`/ventas/${id}`);
  return response.data;
};

export const deleteVenta = async (id: number) => {
  const response = await api.delete(`/ventas/${id}`);
  return response.data;
};

export const anularVenta = async (id: number) => {
  const response = await api.patch(`/ventas/${id}/anular`);
  return response.data;
};

export const getEstadisticasVentas = async () => {
  const response = await api.get('/ventas/estadisticas');
  return response.data;
};
