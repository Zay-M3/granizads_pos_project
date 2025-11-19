import api from './axios.config';

export interface Movimiento {
  id_movimiento?: number;
  id_insumo: number;
  tipo_movimiento: 'entrada' | 'salida';
  cantidad: number;
  motivo?: string;
  id_usuario?: number;
  fecha_movimiento?: string;
}

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
