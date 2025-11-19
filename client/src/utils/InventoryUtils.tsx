// Las interfaces de Insumo e InsumoReceta ahora están en src/types/index.ts
// ========== INSUMOS ==========
export interface Insumo {
  id_insumo?: number;
  nombre: string;
  unidad_medida: string;
  stock: number; // Alias para stock_actual
  stock_actual?: number; // Del backend
  fecha_compra?: string;
  costo_unitario: number;
  alerta: boolean;
  minimo_stock: number; // Alias para stock_minimo
  stock_minimo?: number; // Del backend
}
