// ========== DETALLES DE COMPRAS ==========
export interface DetalleCompra {
  id_detalle?: number;
  id_venta?: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}
