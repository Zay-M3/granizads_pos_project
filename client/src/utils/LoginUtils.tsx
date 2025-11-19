// Las interfaces de Login ahora están en src/types/index.ts
// ========== AUTENTICACIÓN ==========
export interface LoginData {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id_usuario: number;
    nombre: string;
    correo: string;
    telefono?: string;
    rol: 'admin' | 'cajero';
    empleado?: {
      id_empleado: number;
      fecha_nacimiento?: string;
      fecha_inicio?: string;
      activo: boolean;
    };
  };
}
