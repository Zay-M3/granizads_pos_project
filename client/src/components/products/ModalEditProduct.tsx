import { useState, useEffect } from 'react';
import type { ProductFormData } from '@utils/CreateProductsUtil';

type ProductWithUI = ProductFormData & {
  id_producto?: number;
  category?: string;
  stock?: number;
  image?: string;
  status?: 'available' | 'low-stock' | 'out-of-stock';
};

interface ModalEditProductProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductWithUI | null;
  onSave: (product: ProductWithUI) => void;
}

const ModalEditProduct = ({ isOpen, onClose, product, onSave }: ModalEditProductProps) => {
  const [formData, setFormData] = useState<ProductWithUI>({
    id_producto: 0,
    id_categoria: 0,
    id_empleado: 1,
    nombre: '',
    tipo: 'coctel',
    precio: 0,
    descripcion: '',
    receta: [],
    // Campos UI
    category: '',
    stock: 0,
    image: '📦',
    status: 'available'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
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

    if (!formData.category?.trim()) {
      newErrors.category = 'La categoría es requerida';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if ((formData.stock || 0) < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Determinar el estado basado en el stock
      let status: 'available' | 'low-stock' | 'out-of-stock' = 'available';
      if ((formData.stock || 0) === 0) {
        status = 'out-of-stock';
      } else if ((formData.stock || 0) <= 10) {
        status = 'low-stock';
      }

      onSave({ ...formData, status });
      onClose();
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

          {/* Grid para Categoría e Icono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.category 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-secondary focus:ring-button'
                }`}
              >
                <option value="">Seleccionar categoría</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Cervezas">Cervezas</option>
                <option value="Vinos">Vinos</option>
                <option value="Licores">Licores</option>
                <option value="Snacks">Snacks</option>
                <option value="Otros">Otros</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Icono */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Icono del Producto
              </label>
              <div className="grid grid-cols-7 gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                    className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                      formData.image === emoji 
                        ? 'border-button bg-button/10' 
                        : 'border-secondary hover:border-button/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid para Precio y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-bold text-gray-700 mb-2">
                Stock Disponible *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.stock 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-secondary focus:ring-button'
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* Preview del producto */}
          <div className="bg-secondary/30 rounded-xl p-4 border-2 border-dashed border-secondary">
            <p className="text-sm font-bold text-gray-700 mb-3">Vista Previa</p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl shadow-sm">
                {formData.image}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">
                  {formData.nombre || 'Nombre del producto'}
                </h3>
                <p className="text-sm text-gray-500">
                  {formData.category || 'Categoría'}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-primary font-bold">
                    ${formData.precio.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">
                    Stock: {formData.stock || 0}
                  </span>
                </div>
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
