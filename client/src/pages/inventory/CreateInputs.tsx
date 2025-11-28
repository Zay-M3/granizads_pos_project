import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInsumo } from "@api/insumos.api";
import type { Insumo } from "@utils/InventoryUtils";
import ModalError from "@components/ModalError";
import ModalAlert from "@components/ModalAlert";
import ConfirmAction from "@components/ConfirmAction";

const CreateInputs = () => {
  const navigate = useNavigate();
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
  });
  const [confirmModal, setConfirmModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<Insumo>({
    defaultValues: {
      nombre: "",
      unidad_medida: "litros",
      stock: 0,
      fecha_compra: new Date().toISOString().split("T")[0],
      costo_unitario: 0,
      alerta: false,
      minimo_stock: 0,
    },
  });

  const stock = watch("stock");
  const minimo_stock = watch("minimo_stock");

  // Calcular estado del insumo
  const getStockStatus = () => {
    if (stock <= minimo_stock * 0.5)
      return { color: "text-red-600", label: "Crítico" };
    if (stock <= minimo_stock)
      return { color: "text-orange-600", label: "Stock Bajo" };
    return { color: "text-green-600", label: "Stock Normal" };
  };

  const onSubmit = async (data: Insumo) => {
    try {
      // Determinar alerta automáticamente
      const insumoData = {
        ...data,
        alerta: data.stock <= data.minimo_stock * 0.5,
      };

      await createInsumo(insumoData);

      setSuccessModal({
        isOpen: true,
        message: "Insumo registrado exitosamente",
      });
      reset();
      setTimeout(() => navigate("/dashboard/inventario"), 2000);
    } catch (error) {
      console.error("Error al crear insumo:", error);
      const errorMessage =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Error al registrar el insumo";
      setErrorModal({ isOpen: true, message: errorMessage });
    }
  };

  const handleCancel = () => {
    setConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    navigate("/dashboard/inventario");
  };

  const status = getStockStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-dark">
            Registrar Compra de Insumo
          </h1>
          <p className="text-gray-500 mt-1">
            Agrega nuevos insumos al inventario
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/inventario")}
          className="text-gray-600 hover:text-primary-dark transition-colors flex items-center space-x-2 cursor-pointer"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Volver</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Formulario Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-primary-dark mb-4 flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-button"
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
              <span>Información del Insumo</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Insumo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: Ron Blanco, Coca Cola, Limones"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Unidad de Medida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad de Medida <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("unidad_medida", {
                    required: "La unidad es obligatoria",
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button cursor-pointer ${
                    errors.unidad_medida ? "border-red-500" : "border-gray-300"
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.unidad_medida.message}
                  </p>
                )}
              </div>

              {/* Fecha de Compra */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Compra <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("fecha_compra", {
                    required: "La fecha es obligatoria",
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                    errors.fecha_compra ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.fecha_compra && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fecha_compra.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cantidad y Costos */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-primary-dark mb-4 flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-button"
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
              <span>Cantidad y Precio</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stock Inicial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad Comprada <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("stock", {
                    required: "La cantidad es obligatoria",
                    min: { value: 0.01, message: "Debe ser mayor a 0" },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              {/* Stock Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Mínimo <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("minimo_stock", {
                    required: "El stock mínimo es obligatorio",
                    min: { value: 0, message: "Debe ser mayor o igual a 0" },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                    errors.minimo_stock ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.minimo_stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.minimo_stock.message}
                  </p>
                )}
              </div>

              {/* Costo Unitario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo Unitario <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("costo_unitario", {
                    required: "El costo es obligatorio",
                    min: { value: 0.01, message: "Debe ser mayor a 0" },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                    errors.costo_unitario ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.costo_unitario && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.costo_unitario.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Lateral - Resumen */}
        <div className="lg:col-span-1 space-y-6">
          {/* Vista Previa */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-primary-dark mb-4">
              Vista Previa
            </h2>

            {/* Icono del insumo */}
            <div className="w-full h-32 bg-linear-to-br from-primary/10 to-card/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-6xl">📦</span>
            </div>

            {/* Información */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-bold text-gray-800">
                  {watch("nombre") || "Sin nombre"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Cantidad</p>
                  <p className="font-bold text-gray-800">
                    {watch("stock") || 0} {watch("unidad_medida")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mínimo</p>
                  <p className="font-bold text-gray-800">
                    {watch("minimo_stock") || 0} {watch("unidad_medida")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Costo Unitario</p>
                  <p className="font-bold text-primary text-xl">
                    ${(watch("costo_unitario") || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Costo Total</p>
                  <p className="font-bold text-gray-800 text-lg">
                    $
                    {(
                      (watch("stock") || 0) * (watch("costo_unitario") || 0)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className={`font-bold ${status.color}`}>{status.label}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Compra</p>
                  <p className="font-medium text-gray-800">
                    {watch("fecha_compra") || "No especificada"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
            <button
              type="submit"
              className="w-full bg-linear-to-r from-button to-button-hover text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
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
              <span>Registrar Insumo</span>
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>

      {/* Modales */}
      <ModalError
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
        message={errorModal.message}
      />

      <ModalAlert
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, message: "" })}
        message={successModal.message}
        type="success"
      />

      <ConfirmAction
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={handleConfirmCancel}
        title="¿Cancelar registro?"
        message="Se perderán los datos ingresados. ¿Estás seguro de continuar?"
        confirmText="Sí, cancelar"
        cancelText="No, continuar"
        type="warning"
      />
    </div>
  );
};

export default CreateInputs;
