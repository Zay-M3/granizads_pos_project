export interface CashierFormData {
  id_usuario?: number;
  nombre: string;
  telefono: string;
  correo: string;
  contrasena: string;
  rol: 'admin' | 'cajero';
  fecha_nacimiento: string;
}
