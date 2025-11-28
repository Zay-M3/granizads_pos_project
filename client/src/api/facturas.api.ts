import api from './axios.config';
import type { Factura, EstadisticasFacturas } from '@utils/FacturasUtils';

export type { Factura, EstadisticasFacturas };

export const getFacturas = async () => {
  const response = await api.get('/facturas');
  return response.data;
};

export const getFacturaById = async (id: number) => {
  const response = await api.get(`/facturas/${id}`);
  return response.data;
};

export const getFacturaByVentaId = async (idVenta: number) => {
  const response = await api.get(`/facturas/venta/${idVenta}`);
  return response.data;
};

export const createFactura = async (factura: Factura) => {
  const response = await api.post('/facturas', factura);
  return response.data;
};

export const updateFactura = async (id: number, factura: Partial<Factura>) => {
  const response = await api.put(`/facturas/${id}`, factura);
  return response.data;
};

export const marcarFacturaEnviada = async (id: number) => {
  const response = await api.patch(`/facturas/${id}/enviar`);
  return response.data;
};

export const deleteFactura = async (id: number) => {
  const response = await api.delete(`/facturas/${id}`);
  return response.data;
};

export const getEstadisticasFacturas = async () => {
  const response = await api.get('/facturas/estadisticas');
  return response.data;
};
