// Las interfaces de Usuario ahora están en src/types/index.ts
// ========== USUARIOS ==========
export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono?: string;
  contrasena?: string;
  rol: 'admin' | 'cajero';
  fecha_creacion?: string;
  fecha_nacimiento?: string;
}

export interface UsuarioFormData {
  id_usuario: number;
  nombre: string;
  telefono?: string;
  correo: string;
  contrasena: string;
  rol: 'admin' | 'cajero';
  fecha_nacimiento?: string;
}

// ========== EMPLEADOS ==========
export interface Empleado {
  id_empleado?: number;
  id_usuario: number;
  fecha_nacimiento?: string;
  fecha_inicio?: string;
  activo: boolean;
}
