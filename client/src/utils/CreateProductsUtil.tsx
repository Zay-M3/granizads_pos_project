// Las interfaces de Producto ahora están en src/types/index.ts
// ========== RECETAS ==========
export interface InsumoReceta {
  id_receta?: number;
  id_producto?: number;
  id_insumo: number;
  cantidad_usada: number;
  insumo_nombre?: string;
  unidad_medida?: string;
  insumo_stock?: number;
}

// ========== PRODUCTOS ==========
export interface Producto {
  id_producto?: number;
  id_categoria: number;
  id_empleado?: number;
  nombre: string;
  tipo: string;
  precio: number;
  descripcion?: string;
  fecha_creacion?: string;
  // Campos calculados del frontend
  categoria_nombre?: string;
  categoria_descripcion?: string;
  empleado_nombre?: string;
  total_ingredientes?: number;
  receta?: InsumoReceta[];
}

export interface ProductoFormData {
  id_categoria: number;
  id_empleado?: number;
  nombre: string;
  tipo: string;
  precio: number;
  descripcion: string;
  receta: InsumoReceta[];
}
