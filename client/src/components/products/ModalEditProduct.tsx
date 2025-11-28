import { useState, useEffect } from 'react';
import type { Producto } from '@utils/CreateProductsUtil';
import type { Categoria } from '@utils/CategoryUtils';
import { updateProducto } from '@api/productos.api';
import { getCategorias } from '@api/categorias.api';

interface ModalEditProductProps {
  isOpen: boolean;
  onClose: () => void;
  product: Producto | null;
  onSave: (product: Producto) => void;
}

const ModalEditProduct = ({ isOpen, onClose, product, onSave }: ModalEditProductProps) => {
  const [formData, setFormData] = useState<Producto>({
    id_producto: 0,
    id_categoria: 0,
    id_empleado: 0,
    nombre: '',
    tipo: '',
    precio: 0,
    descripcion: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Cargar categorías
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    if (isOpen) {
      loadCategorias();
    }
  }, [isOpen]);

  // Actualizar formData cuando cambie el producto
  useEffect(() => {
    if (product) {
      setFormData(product);
      setErrors({});
    }
  }, [product]);

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
      [name]: name === 'precio' || name === 'id_categoria' ? Number(value) : value
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

    if (!formData.tipo?.trim()) {
      newErrors.tipo = 'El tipo es requerido';
    }

    if (!formData.id_categoria || formData.id_categoria === 0) {
      newErrors.id_categoria = 'La categoría es requerida';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate() && formData.id_producto) {
      try {
        await updateProducto(formData.id_producto, formData);
        onSave(formData);
        alert('Producto actualizado exitosamente ✅');
        onClose();
      } catch (error) {
        console.error('Error al actualizar producto:', error);
        const errorMessage = (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error al actualizar el producto';
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

  const emojis = ['📦', '🍺', '🍻', '🍷', '🥃', '🍹', '🍸', '🥤', '☕', '🧃', '🧋', '🍾', '🥂'];

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
              Editar Producto
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre del producto */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 mb-2">
              Nombre del Producto *
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
              placeholder="Ej: Cuba Libre"
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

          {/* Grid para Categoría y Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoría */}
            <div>
              <label htmlFor="id_categoria" className="block text-sm font-bold text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="id_categoria"
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.id_categoria 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-secondary focus:ring-button'
                }`}
              >
                <option value="0">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              {errors.id_categoria && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.id_categoria}
                </p>
              )}
            </div>

            {/* Tipo (Emoji selector) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tipo (Icono) *
              </label>
              <div className="grid grid-cols-7 gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tipo: emoji }))}
                    className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                      formData.tipo === emoji 
                        ? 'border-button bg-button/10' 
                        : 'border-secondary hover:border-button/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {errors.tipo && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.tipo}
                </p>
              )}
            </div>
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="precio" className="block text-sm font-bold text-gray-700 mb-2">
              Precio (COP) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.precio 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-secondary focus:ring-button'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.precio && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.precio}
              </p>
            )}
          </div>

          {/* Preview del producto */}
          <div className="bg-secondary/30 rounded-xl p-4 border-2 border-dashed border-secondary">
            <p className="text-sm font-bold text-gray-700 mb-3">Vista Previa</p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl shadow-sm">
                {formData.tipo || '📦'}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">
                  {formData.nombre || 'Nombre del producto'}
                </h3>
                <p className="text-sm text-gray-500">
                  {categorias.find(c => c.id_categoria === formData.id_categoria)?.nombre || 'Categoría'}
                </p>
                <span className="text-primary font-bold">
                  ${formData.precio.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-secondary">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-secondary text-gray-700 rounded-lg font-medium hover:bg-secondary transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-linear-to-r from-button to-button-hover text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center space-x-2"
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

export default ModalEditProduct;
