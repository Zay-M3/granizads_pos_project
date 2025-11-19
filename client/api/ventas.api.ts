import api from './axios.config';

export interface DetalleVenta {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export interface Venta {
  id_venta?: number;
  id_empleado: number;
  id_cliente?: number;
  total: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  estado?: 'completada' | 'anulada';
  fecha_venta?: string;
  detalles?: DetalleVenta[];
}

export interface EstadisticasVentas {
  total_ventas: number;
  ventas_hoy: number;
  ventas_mes: number;
  producto_mas_vendido?: string;
}

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
