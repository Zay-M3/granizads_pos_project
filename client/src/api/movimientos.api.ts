import api from './axios.config';
import type { Movimiento } from '@utils/MovimientosUtils';

export type { Movimiento };

export const getMovimientos = async () => {
  const response = await api.get('/movimientos');
  return response.data;
};

export const agregarStock = async (movimiento: Movimiento) => {
  const response = await api.post('/movimientos', {
    ...movimiento,
    tipo_movimiento: 'entrada'
  });
  return response.data;
};

export const consumirStock = async (movimiento: Movimiento) => {
  const response = await api.post('/movimientos', {
    ...movimiento,
    tipo_movimiento: 'salida'
  });
  return response.data;
};
