import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import ModalCategories from "@components/products/ModalCategories";
import { useNavigate } from "react-router-dom";
import { getCategorias } from "@api/categorias.api";
import { createProducto } from "@api/productos.api";
import { getInsumos } from "@api/insumos.api";
import type { Categoria } from "@utils/CategoryUtils";
import type { InsumoReceta, ProductoFormData } from "@utils/CreateProductsUtil";
import type { Insumo } from "@utils/InventoryUtils";

// Componente de Toast simple
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          ×
        </button>
      </div>
    </div>
  );
};

const CreateProducts = () => {
  const navigate = useNavigate();
  const [isModalCategoriesOpen, setIsModalCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [insumosDisponibles, setInsumosDisponibles] = useState<Insumo[]>([]);
  const [insumos, setInsumos] = useState<InsumoReceta[]>([]);
  const [newInsumo, setNewInsumo] = useState({ id_insumo: 0, cantidad_usada: 0 });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategorias();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        showToast('Error al cargar las categorías', 'error');
      }
    };
    fetchCategories();
  }, []);

  // Cargar insumos disponibles
  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const data = await getInsumos();
        setInsumosDisponibles(data);
      } catch (error) {
        console.error('Error al cargar insumos:', error);
      }
    };
    fetchInsumos();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductoFormData>({
    defaultValues: {
      id_categoria: 0,
      nombre: "",
      precio: 0,
      descripcion: "",
      receta: [],
    },
  });

  const onSubmit = async (data: ProductoFormData) => {
    try {
      const productData = {
        ...data,
        receta: insumos,
      };
      
      await createProducto(productData);
      
      showToast("Producto creado exitosamente ✅", 'success');
      reset();
      setInsumos([]);
      
      // Navegar después de un breve delay para que se vea el toast
      setTimeout(() => {
        navigate('/dashboard/productos');
      }, 1500);
      
    } catch (error) {
      console.error("Error al crear producto:", error);
      const errorMessage = (error as { response?: { data?: { error?: string } } }).response?.data?.error || "Error al crear el producto";
      showToast(errorMessage + " ❌", 'error');
    }
  };

  const addInsumo = () => {
    if (newInsumo.id_insumo > 0 && newInsumo.cantidad_usada > 0) {
      // Verificar si el insumo existe
      const insumoExiste = insumosDisponibles.find(i => i.id_insumo === newInsumo.id_insumo);
      if (!insumoExiste) {
        showToast("El insumo seleccionado no existe", 'error');
        return;
      }
      setInsumos([...insumos, newInsumo]);
      setNewInsumo({ id_insumo: 0, cantidad_usada: 0 });
    } else {
      showToast("Por favor completa todos los campos del insumo", 'error');
    }
  };

  const removeInsumo = (index: number) => {
    setInsumos(insumos.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Crear Nuevo Producto
          </h1>
          <p className="text-gray-600">
            Completa la información para agregar un nuevo producto al inventario
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Información Básica
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre del Producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  })}
                  type="text"
                  placeholder="Ej: Cuba Libre"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <div className="flex gap-2">
                  <select
                    {...register("id_categoria", {
                      required: "Selecciona una categoría",
                      validate: (value) => value > 0 || "Selecciona una categoría válida",
                    })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsModalCategoriesOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                {errors.id_categoria && (
                  <p className="text-red-500 text-sm mt-1">{errors.id_categoria.message}</p>
                )}
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    {...register("precio", {
                      required: "El precio es obligatorio",
                      min: { value: 0, message: "El precio debe ser mayor a 0" },
                    })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.precio && (
                  <p className="text-red-500 text-sm mt-1">{errors.precio.message}</p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                {...register("descripcion")}
                rows={3}
                placeholder="Describe el producto..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          {/* Receta / Insumos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Receta / Insumos
            </h2>

            {/* Agregar Insumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insumo
                </label>
                <select
                  value={newInsumo.id_insumo}
                  onChange={(e) =>
                    setNewInsumo({ ...newInsumo, id_insumo: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Seleccionar insumo</option>
                  {insumosDisponibles.map((insumo) => (
                    <option key={insumo.id_insumo} value={insumo.id_insumo}>
                      {insumo.nombre} ({insumo.unidad_medida})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newInsumo.cantidad_usada}
                  onChange={(e) =>
                    setNewInsumo({ ...newInsumo, cantidad_usada: Number(e.target.value) })
                  }
                  placeholder="Ej: 0.06"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addInsumo}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Agregar Insumo
                </button>
              </div>
            </div>

            {/* Lista de Insumos */}
            {insumos.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Insumos Agregados
                </h3>
                <div className="space-y-2">
                  {insumos.map((insumo, index) => {
                    const insumoData = insumosDisponibles.find(i => i.id_insumo === insumo.id_insumo);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">
                            {insumoData ? insumoData.nombre : `ID: ${insumo.id_insumo}`}
                          </span>
                          <span className="text-gray-600 ml-4">
                            Cantidad: {insumo.cantidad_usada} {insumoData?.unidad_medida || ''}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeInsumo(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/productos')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? "Guardando..." : "Crear Producto"}
              </button>
            </div>
          </div>
        </form>

        {/* Modal de Categorías */}
        <ModalCategories
          isOpen={isModalCategoriesOpen}
          onClose={() => setIsModalCategoriesOpen(false)}
          onSave={(newCategory) => {
            setCategories([...categories, newCategory]);
            setIsModalCategoriesOpen(false);
            showToast("Categoría creada exitosamente", 'success');
          }}
        />
      </div>
    </div>
  );
};

export default CreateProducts;
