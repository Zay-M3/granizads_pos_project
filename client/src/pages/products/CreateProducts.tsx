import { useForm } from "react-hook-form";
import { useState } from "react";

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  salePrice: number;
  size: string;
  hasAlcohol: boolean;
  alcoholType?: string;
  alcoholPercentage?: number;
  hasCandy: boolean;
  candyType?: string;
  stockQuantity: number;
  minStockAlert: number;
  isActive: boolean;
  preparationTime: number;
  tags: string[];
}

const CreateProducts = () => {
  const [showAlcoholFields, setShowAlcoholFields] = useState(false);
  const [showCandyFields, setShowCandyFields] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      category: "granizado",
      basePrice: 0,
      salePrice: 0,
      size: "mediano",
      hasAlcohol: false,
      hasCandy: false,
      stockQuantity: 0,
      minStockAlert: 5,
      isActive: true,
      preparationTime: 5,
      tags: [],
    },
  });

  const hasAlcohol = watch("hasAlcohol");
  const hasCandy = watch("hasCandy");

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Agregar los tags al formulario
      const formDataWithTags = {
        ...data,
        tags: tags,
      };

      console.log("Producto a crear:", formDataWithTags);

      // Aquí irá la lógica para enviar al backend
      // await axios.post('/api/products', formDataWithTags);

      // Mostrar mensaje de éxito
      alert("Producto creado exitosamente");

      // Resetear formulario
      reset();
      setTags([]);
      setShowAlcoholFields(false);
      setShowCandyFields(false);
    } catch (error) {
      console.error("Error al crear producto:", error);
      alert("Error al crear el producto");
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black text-primary-dark mb-2">
          Crear Nuevo Producto
        </h1>
        <p className="text-gray-600">
          Completa la información para agregar un nuevo producto al inventario
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary-dark mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Información Básica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del producto */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre del Producto *
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: "El nombre del producto es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
                  },
                  maxLength: {
                    value: 100,
                    message: "El nombre no puede exceder 100 caracteres",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all ${
                  errors.name ? "border-red-500" : "border-secondary"
                }`}
                placeholder="Ej: Granizado de Fresa con Vodka"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descripción *
              </label>
              <textarea
                id="description"
                rows={3}
                {...register("description", {
                  required: "La descripción es obligatoria",
                  minLength: {
                    value: 10,
                    message: "La descripción debe tener al menos 10 caracteres",
                  },
                  maxLength: {
                    value: 500,
                    message: "La descripción no puede exceder 500 caracteres",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all ${
                  errors.description ? "border-red-500" : "border-secondary"
                }`}
                placeholder="Describe el producto, sus ingredientes principales y características..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Categoría *
              </label>
              <select
                id="category"
                {...register("category", {
                  required: "La categoría es obligatoria",
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all ${
                  errors.category ? "border-red-500" : "border-secondary"
                }`}
              >
                <option value="granizado">Granizado</option>
                <option value="granizado-premium">Granizado Premium</option>
                <option value="bebida">Bebida</option>
                <option value="coctel">Coctel</option>
                <option value="postre-helado">Postre Helado</option>
                <option value="especial">Especial</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Tamaño */}
            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tamaño *
              </label>
              <select
                id="size"
                {...register("size", {
                  required: "El tamaño es obligatorio",
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all ${
                  errors.size ? "border-red-500" : "border-secondary"
                }`}
              >
                <option value="pequeño">Pequeño (8 oz)</option>
                <option value="mediano">Mediano (12 oz)</option>
                <option value="grande">Grande (16 oz)</option>
                <option value="extra-grande">Extra Grande (20 oz)</option>
              </select>
              {errors.size && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.size.message}
                </p>
              )}
            </div>

            {/* Tiempo de preparación */}
            <div>
              <label
                htmlFor="preparationTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tiempo de Preparación (minutos) *
              </label>
              <input
                id="preparationTime"
                type="number"
                {...register("preparationTime", {
                  required: "El tiempo de preparación es obligatorio",
                  min: {
                    value: 1,
                    message: "El tiempo debe ser al menos 1 minuto",
                  },
                  max: {
                    value: 60,
                    message: "El tiempo no puede exceder 60 minutos",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all ${
                  errors.preparationTime ? "border-red-500" : "border-secondary"
                }`}
                placeholder="5"
              />
              {errors.preparationTime && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.preparationTime.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Precios */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary-dark mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Precios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Precio base */}
            <div>
              <label
                htmlFor="basePrice"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Precio Base (Costo) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                <input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  {...register("basePrice", {
                    required: "El precio base es obligatorio",
                    min: {
                      value: 0,
                      message: "El precio debe ser mayor a 0",
                    },
                    validate: (value) => {
                      const salePrice = watch("salePrice");
                      if (value >= salePrice && salePrice > 0) {
                        return "El precio base debe ser menor al precio de venta";
                      }
                      return true;
                    },
                  })}
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all ${
                    errors.basePrice ? "border-red-500" : "border-secondary"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.basePrice && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.basePrice.message}
                </p>
              )}
            </div>

            {/* Precio de venta */}
            <div>
              <label
                htmlFor="salePrice"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Precio de Venta *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                <input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  {...register("salePrice", {
                    required: "El precio de venta es obligatorio",
                    min: {
                      value: 0.01,
                      message: "El precio debe ser mayor a 0",
                    },
                    validate: (value) => {
                      const basePrice = watch("basePrice");
                      if (value <= basePrice) {
                        return "El precio de venta debe ser mayor al precio base";
                      }
                      return true;
                    },
                  })}
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all ${
                    errors.salePrice ? "border-red-500" : "border-secondary"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.salePrice && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.salePrice.message}
                </p>
              )}
            </div>
          </div>

          {/* Margen de ganancia calculado */}
          {watch("basePrice") > 0 && watch("salePrice") > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Margen de ganancia:</strong> $
                {(watch("salePrice") - watch("basePrice")).toFixed(2)} (
                {(
                  ((watch("salePrice") - watch("basePrice")) /
                    watch("basePrice")) *
                  100
                ).toFixed(1)}
                %)
              </p>
            </div>
          )}
        </div>

        {/* Ingredientes Especiales */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary-dark mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Ingredientes Especiales
          </h2>

          <div className="space-y-6">
            {/* Licor */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("hasAlcohol")}
                  onChange={(e) => {
                    setShowAlcoholFields(e.target.checked);
                    if (!e.target.checked) {
                      setValue("alcoholType", "");
                      setValue("alcoholPercentage", 0);
                    }
                  }}
                  className="w-5 h-5 text-button rounded focus:ring-button cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">
                  🍸 Este producto contiene licor/alcohol
                </span>
              </label>

              {(hasAlcohol || showAlcoholFields) && (
                <div className="mt-4 ml-8 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div>
                    <label
                      htmlFor="alcoholType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tipo de Licor/Alcohol *
                    </label>
                    <input
                      id="alcoholType"
                      type="text"
                      {...register("alcoholType", {
                        required: hasAlcohol
                          ? "Especifica el tipo de licor"
                          : false,
                      })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                        errors.alcoholType
                          ? "border-red-500"
                          : "border-amber-300"
                      }`}
                      placeholder="Ej: Vodka, Ron, Tequila..."
                    />
                    {errors.alcoholType && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.alcoholType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="alcoholPercentage"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Porcentaje de Alcohol (%) *
                    </label>
                    <input
                      id="alcoholPercentage"
                      type="number"
                      step="0.1"
                      {...register("alcoholPercentage", {
                        required: hasAlcohol
                          ? "Especifica el porcentaje"
                          : false,
                        min: {
                          value: 0.1,
                          message: "Debe ser mayor a 0",
                        },
                        max: {
                          value: 100,
                          message: "No puede exceder 100%",
                        },
                      })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                        errors.alcoholPercentage
                          ? "border-red-500"
                          : "border-amber-300"
                      }`}
                      placeholder="5.0"
                    />
                    {errors.alcoholPercentage && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.alcoholPercentage.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 bg-amber-100 p-3 rounded-lg">
                    <p className="text-sm text-amber-800 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Producto restringido a mayores de edad. Se requerirá
                      verificación de edad en la venta.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Dulces */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("hasCandy")}
                  onChange={(e) => {
                    setShowCandyFields(e.target.checked);
                    if (!e.target.checked) {
                      setValue("candyType", "");
                    }
                  }}
                  className="w-5 h-5 text-button rounded focus:ring-button cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">
                  🍬 Este producto incluye dulces/toppings
                </span>
              </label>

              {(hasCandy || showCandyFields) && (
                <div className="mt-4 ml-8 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                  <label
                    htmlFor="candyType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tipo de Dulces/Toppings *
                  </label>
                  <input
                    id="candyType"
                    type="text"
                    {...register("candyType", {
                      required: hasCandy
                        ? "Especifica el tipo de dulces"
                        : false,
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                      errors.candyType ? "border-red-500" : "border-pink-300"
                    }`}
                    placeholder="Ej: Gomitas, Chocolate, Chispas, M&Ms..."
                  />
                  {errors.candyType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.candyType.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inventario */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary-dark mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Control de Inventario
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cantidad en stock */}
            <div>
              <label
                htmlFor="stockQuantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cantidad en Stock *
              </label>
              <input
                id="stockQuantity"
                type="number"
                {...register("stockQuantity", {
                  required: "La cantidad en stock es obligatoria",
                  min: {
                    value: 0,
                    message: "No puede ser negativo",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all ${
                  errors.stockQuantity ? "border-red-500" : "border-secondary"
                }`}
                placeholder="0"
              />
              {errors.stockQuantity && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>

            {/* Alerta de stock mínimo */}
            <div>
              <label
                htmlFor="minStockAlert"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Alerta de Stock Mínimo *
              </label>
              <input
                id="minStockAlert"
                type="number"
                {...register("minStockAlert", {
                  required: "La alerta de stock mínimo es obligatoria",
                  min: {
                    value: 1,
                    message: "Debe ser al menos 1",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button transition-all ${
                  errors.minStockAlert ? "border-red-500" : "border-secondary"
                }`}
                placeholder="5"
              />
              {errors.minStockAlert && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.minStockAlert.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Recibirás una alerta cuando el stock llegue a este nivel
              </p>
            </div>
          </div>

          {/* Indicador de estado de stock */}
          {watch("stockQuantity") !== undefined &&
            watch("minStockAlert") !== undefined && (
              <div className="mt-4">
                {watch("stockQuantity") <= watch("minStockAlert") ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-red-800 font-medium">
                      Stock bajo: Este producto necesitará reabastecimiento
                      pronto
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-green-800 font-medium">
                      Stock adecuado
                    </span>
                  </div>
                )}
              </div>
            )}
        </div>

        {/* Etiquetas/Tags */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary-dark mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Etiquetas
          </h2>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button"
                placeholder="Agregar etiqueta (Ej: Verano, Refrescante, Popular...)"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-6 py-2 bg-card text-white rounded-lg hover:bg-primary transition-colors"
              >
                Agregar
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-button/10 text-button rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-button hover:text-button-hover"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estado del producto */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary-dark mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Estado del Producto
          </h2>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-5 h-5 text-button rounded focus:ring-button cursor-pointer"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Producto activo y disponible para la venta
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Si está desactivado, no aparecerá en el sistema de ventas
              </p>
            </div>
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => {
              reset();
              setTags([]);
              setShowAlcoholFields(false);
              setShowCandyFields(false);
            }}
            className="px-6 py-3 border-2 border-secondary text-gray-700 rounded-lg hover:border-button hover:text-button transition-all font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-linear-to-r from-button to-button-hover text-white rounded-lg font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Creando...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Crear Producto</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProducts;
