import api from './axios.config';
import type { Insumo } from '@utils/InventoryUtils';

export const getInsumos = async () => {
  const response = await api.get('/insumos');
  return response.data;
};

export const getInsumoById = async (id: number) => {
  const response = await api.get(`/insumos/${id}`);
  return response.data;
};

export const getInsumosBajoStock = async () => {
  const response = await api.get('/insumos/bajo-stock');
  return response.data;
};

export const createInsumo = async (insumo: Insumo) => {
  // Mapear campos del frontend al backend
  const insumoBackend = {
    nombre: insumo.nombre,
    unidad_medida: insumo.unidad_medida,
    stock: insumo.stock,
    fecha_compra: insumo.fecha_compra,
    costo_unitario: insumo.costo_unitario,
    alerta: insumo.alerta,
    minimo_stock: insumo.minimo_stock
  };
  const response = await api.post('/insumos', insumoBackend);
  return response.data;
};

export const updateInsumo = async (id: number, insumo: Partial<Insumo>) => {
  const response = await api.put(`/insumos/${id}`, insumo);
  return response.data;
};

export const deleteInsumo = async (id: number) => {
  const response = await api.delete(`/insumos/${id}`);
  return response.data;
};
