// ========== MOVIMIENTOS DE INVENTARIO ==========
export interface Movimiento {
  id_movimiento?: number;
  id_insumo: number;
  tipo_movimiento: 'entrada' | 'salida';
  cantidad: number;
  motivo?: string;
  id_usuario?: number;
  fecha_movimiento?: string;
}
