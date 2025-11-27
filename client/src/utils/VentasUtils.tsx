// ========== VENTAS ==========
export interface DetalleVenta {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export interface Venta {
  id_venta?: number;
  id_empleado: number;
  id_cliente?: number;
  total?: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  estado?: 'completada' | 'anulada';
  fecha_venta?: string;
  detalles?: DetalleVenta[];
}

export interface EstadisticasVentas {
  total_ventas: number;
  ventas_hoy: number;
  ventas_mes: number;
  producto_mas_vendido?: string;
}
