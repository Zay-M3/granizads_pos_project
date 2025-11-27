// ========== FACTURAS ==========
export interface Factura {
  id_factura?: number;
  id_venta: number;
  codigo_cufin: string;
  estado_envio?: string;
  fecha_emision?: string;
}

export interface EstadisticasFacturas {
  total_facturas: number;
  facturas_mes: number;
  facturas_enviadas: number;
  total_facturado: number;
}
