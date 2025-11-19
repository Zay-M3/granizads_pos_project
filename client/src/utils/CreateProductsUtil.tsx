import type { InsumoReceta } from "./InventoryUtils";

export interface ProductFormData {
  id_categoria: number;
  id_empleado: number;
  nombre: string;
  tipo: string;
  precio: number;
  descripcion: string;
  receta: InsumoReceta[];
}

