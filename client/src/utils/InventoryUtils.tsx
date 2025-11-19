// Interface para recetas (tabla recetas del backend)
export interface InsumoReceta {
  id_receta?: number;
  id_producto?: number;
  id_insumo: number;
  cantidad_usada: number;
}

// Interface para inventario de insumos (tabla insumos del backend)
export interface Insumo {
  id_insumo?: number;
  nombre: string;
  unidad_medida: string;
  stock: number;
  fecha_compra: string;
  costo_unitario: number;
  alerta: boolean;
  minimo_stock: number;
}