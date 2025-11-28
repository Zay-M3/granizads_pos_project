// ========== VENTAS ==========
export interface DetalleVenta {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
  producto_nombre?: string;
  producto_descripcion?: string;
  categoria_nombre?: string;
}

export interface Venta {
  id_venta?: number;
  id_empleado: number;
  id_cliente?: number;
  total?: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  estado?: 'completada' | 'anulada';
  fecha?: string;
  fecha_venta?: string;
  empleado_nombre?: string;
  cliente_nombre?: string;
  total_items?: number;
}

export interface VentaCompleta {
  venta: Venta;
  detalles: DetalleVenta[];
}

export interface EstadisticasVentas {
  total_ventas: number;
  ventas_hoy: number;
  ventas_mes: number;
  producto_mas_vendido?: string;
}
