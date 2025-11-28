import { useState, useEffect } from 'react';
import type { UsuarioFormData } from '@utils/admin/CreateCashierUtils';
import { updateUsuario } from '@api/usuarios.api';

interface ModalEditUsersProps {
  isOpen: boolean;
  onClose: () => void;
  user: UsuarioFormData | null;
  onSave: (user: UsuarioFormData) => void;
}

const ModalEditUsers = ({ isOpen, onClose, user, onSave }: ModalEditUsersProps) => {
  const [formData, setFormData] = useState<UsuarioFormData>({
    id_usuario: 0,
    nombre: '',
    correo: '',
    contrasena: '',
    rol: 'cajero',
    telefono: '',
    fecha_nacimiento: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Actualizar formData cuando cambie el usuario
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        contrasena: '', // No mostrar la contraseña actual
      });
      setErrors({});
    }
  }, [user]);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }

    if (!formData.telefono?.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }

    // Validar contraseña solo si se está modificando
    if (formData.contrasena && formData.contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate() && formData.id_usuario) {
      try {
        // Si no se modificó la contraseña, no enviarla
        const dataToUpdate: Partial<UsuarioFormData> = { ...formData };
        if (!dataToUpdate.contrasena) {
          delete dataToUpdate.contrasena;
        }

        await updateUsuario(formData.id_usuario, dataToUpdate);
        onSave(formData);
        alert('Usuario actualizado exitosamente ✅');
        onClose();
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        const errorMessage = (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error al actualizar el usuario';
        alert(errorMessage + ' ❌');
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Calcular edad
  const calcularEdad = (fechaNacimiento?: string) => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-primary-dark">
              Editar Usuario
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre completo */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.nombre 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-secondary focus:ring-button'
              }`}
              placeholder="Ej: Juan Pérez"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Grid para Correo y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Correo */}
            <div>
              <label htmlFor="correo" className="block text-sm font-bold text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.correo 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-secondary focus:ring-button'
                  }`}
                  placeholder="correo@ejemplo.com"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {errors.correo && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.correo}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-bold text-gray-700 mb-2">
                Teléfono *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.telefono 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-secondary focus:ring-button'
                  }`}
                  placeholder="3001234567"
                  maxLength={10}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              {errors.telefono && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.telefono}
                </p>
              )}
            </div>
          </div>

          {/* Grid para Rol y Fecha de Nacimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rol */}
            <div>
              <label htmlFor="rol" className="block text-sm font-bold text-gray-700 mb-2">
                Rol *
              </label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all cursor-pointer"
              >
                <option value="cajero">Cajero</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="fecha_nacimiento" className="block text-sm font-bold text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all"
              />
              {formData.fecha_nacimiento && (
                <p className="text-sm text-gray-500 mt-1">
                  Edad: {calcularEdad(formData.fecha_nacimiento)} años
                </p>
              )}
            </div>
          </div>

          {/* Contraseña (opcional al editar) */}
          <div>
            <label htmlFor="contrasena" className="block text-sm font-bold text-gray-700 mb-2">
              Nueva Contraseña (dejar vacío para mantener la actual)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.contrasena 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-secondary focus:ring-button'
                }`}
                placeholder="••••••••"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.contrasena && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.contrasena}
              </p>
            )}
          </div>

          {/* Preview del usuario */}
          <div className="bg-secondary/30 rounded-xl p-4 border-2 border-dashed border-secondary">
            <p className="text-sm font-bold text-gray-700 mb-3">Vista Previa</p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-linear-to-br from-primary/20 to-button/20 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-8 h-8 text-button" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">
                  {formData.nombre || 'Nombre del usuario'}
                </h3>
                <p className="text-sm text-gray-600">{formData.correo || 'correo@ejemplo.com'}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    formData.rol === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {formData.rol === 'admin' ? 'Administrador' : 'Cajero'}
                  </span>
                  {formData.telefono && (
                    <span className="text-xs text-gray-500">📱 {formData.telefono}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-secondary">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-secondary text-gray-700 rounded-lg font-medium hover:bg-secondary transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-linear-to-r from-button to-button-hover text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditUsers;
