import api from './axios.config';

export interface Factura {
  id_factura?: number;
  id_venta: number;
  numero_factura: string;
  subtotal: number;
  impuesto: number;
  total: number;
  fecha_emision?: string;
  enviada?: boolean;
}

export interface EstadisticasFacturas {
  total_facturas: number;
  facturas_mes: number;
  facturas_enviadas: number;
  total_facturado: number;
}

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
