import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Insumo } from '@utils/InventoryUtils';

interface ModalEditInputsProps {
  isOpen: boolean;
  onClose: () => void;
  insumo: Insumo | null;
  onSave: (insumo: Insumo) => void;
}

const ModalEditInputs = ({ isOpen, onClose, insumo, onSave }: ModalEditInputsProps) => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<Insumo>({
    defaultValues: {
      nombre: "",
      unidad_medida: "litros",
      stock: 0,
      fecha_compra: new Date().toISOString().split('T')[0],
      costo_unitario: 0,
      alerta: false,
      minimo_stock: 0,
    },
  });

  const stock = watch("stock");
  const minimo_stock = watch("minimo_stock");

  // Actualizar formulario cuando cambie el insumo
  useEffect(() => {
    if (insumo) {
      reset(insumo);
    }
  }, [insumo, reset]);

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

  // Calcular estado del insumo
  const getStockStatus = () => {
    if (stock <= minimo_stock * 0.5) return { color: 'text-red-600', label: 'Crítico', bgColor: 'bg-red-100' };
    if (stock <= minimo_stock) return { color: 'text-orange-600', label: 'Stock Bajo', bgColor: 'bg-orange-100' };
    return { color: 'text-green-600', label: 'Stock Normal', bgColor: 'bg-green-100' };
  };

  const onSubmit = async (data: Insumo) => {
    try {
      // Determinar si debe estar en alerta
      const alerta = data.stock <= data.minimo_stock;
      
      onSave({ ...data, alerta });
      onClose();
    } catch (error) {
      console.error('Error al actualizar insumo:', error);
      alert('Error al actualizar el insumo');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const status = getStockStatus();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-primary-dark">
              Editar Insumo
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary-dark flex items-center space-x-2">
              <svg className="w-5 h-5 text-button" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Información del Insumo</span>
            </h3>

            {/* Nombre del insumo */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 mb-2">
                Nombre del Insumo *
              </label>
              <input
                type="text"
                id="nombre"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.nombre 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-secondary focus:ring-button'
                }`}
                placeholder="Ej: Ron Blanco, Coca Cola, Limones"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Grid para Unidad de Medida y Fecha de Compra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Unidad de Medida */}
              <div>
                <label htmlFor="unidad_medida" className="block text-sm font-bold text-gray-700 mb-2">
                  Unidad de Medida *
                </label>
                <select
                  id="unidad_medida"
                  {...register("unidad_medida", { required: "La unidad es obligatoria" })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.unidad_medida 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-secondary focus:ring-button'
                  }`}
                >
                  <option value="litros">Litros</option>
                  <option value="mililitros">Mililitros</option>
                  <option value="kg">Kilogramos</option>
                  <option value="gramos">Gramos</option>
                  <option value="unidades">Unidades</option>
                  <option value="cajas">Cajas</option>
                  <option value="botellas">Botellas</option>
                  <option value="latas">Latas</option>
                </select>
                {errors.unidad_medida && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.unidad_medida.message}
                  </p>
                )}
              </div>

              {/* Fecha de Compra */}
              <div>
                <label htmlFor="fecha_compra" className="block text-sm font-bold text-gray-700 mb-2">
                  Fecha de Compra *
                </label>
                <input
                  type="date"
                  id="fecha_compra"
                  {...register("fecha_compra", { required: "La fecha es obligatoria" })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.fecha_compra 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-secondary focus:ring-button'
                  }`}
                />
                {errors.fecha_compra && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.fecha_compra.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cantidad y Costos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary-dark flex items-center space-x-2">
              <svg className="w-5 h-5 text-button" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cantidad y Precio</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stock Actual */}
              <div>
                <label htmlFor="stock" className="block text-sm font-bold text-gray-700 mb-2">
                  Stock Actual *
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="stock"
                  {...register("stock", {
                    required: "El stock es obligatorio",
                    min: { value: 0, message: "Debe ser mayor o igual a 0" },
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.stock 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-secondary focus:ring-button'
                  }`}
                  placeholder="0.00"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.stock.message}
                  </p>
                )}
              </div>

              {/* Stock Mínimo */}
              <div>
                <label htmlFor="minimo_stock" className="block text-sm font-bold text-gray-700 mb-2">
                  Stock Mínimo *
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="minimo_stock"
                  {...register("minimo_stock", {
                    required: "El stock mínimo es obligatorio",
                    min: { value: 0, message: "Debe ser mayor o igual a 0" },
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.minimo_stock 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-secondary focus:ring-button'
                  }`}
                  placeholder="0.00"
                />
                {errors.minimo_stock && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.minimo_stock.message}
                  </p>
                )}
              </div>

              {/* Costo Unitario */}
              <div>
                <label htmlFor="costo_unitario" className="block text-sm font-bold text-gray-700 mb-2">
                  Costo Unitario *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    id="costo_unitario"
                    {...register("costo_unitario", {
                      required: "El costo es obligatorio",
                      min: { value: 0.01, message: "Debe ser mayor a 0" },
                    })}
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.costo_unitario 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-secondary focus:ring-button'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.costo_unitario && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.costo_unitario.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preview del insumo */}
          <div className={`${status.bgColor} rounded-xl p-5 border-2 border-dashed ${status.color.replace('text-', 'border-')}`}>
            <p className="text-sm font-bold text-gray-700 mb-3">Vista Previa del Insumo</p>
            <div className="bg-white rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800">
                    {watch("nombre") || 'Nombre del insumo'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Unidad: {watch("unidad_medida")}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${status.bgColor} ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Stock Actual</p>
                  <p className="font-bold text-gray-800">
                    {watch("stock") || 0} {watch("unidad_medida")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Stock Mínimo</p>
                  <p className="font-bold text-gray-800">
                    {watch("minimo_stock") || 0} {watch("unidad_medida")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Costo Unitario</p>
                  <p className="font-bold text-primary text-lg">
                    ${(watch("costo_unitario") || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Valor Total</p>
                  <p className="font-bold text-gray-800 text-lg">
                    ${((watch("stock") || 0) * (watch("costo_unitario") || 0)).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Barra de progreso del stock */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Nivel de Stock</span>
                  <span>{((watch("stock") / (watch("minimo_stock") || 1)) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      watch("stock") <= (watch("minimo_stock") * 0.5) ? 'bg-red-500' :
                      watch("stock") <= watch("minimo_stock") ? 'bg-orange-500' : 
                      'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min(((watch("stock") / (watch("minimo_stock") || 1)) * 100), 100)}%` 
                    }}
                  />
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

export default ModalEditInputs;
