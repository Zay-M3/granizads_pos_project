import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUsuario } from "@api/usuarios.api";
import type { UsuarioFormData } from "@utils/admin/CreateCashierUtils";
import ModalError from "@components/ModalError";
import ModalAlert from "@components/ModalAlert";

const CreateCashier = () => {
  const navigate = useNavigate();
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<UsuarioFormData>({
    defaultValues: {
      id_usuario: 0,
      nombre: "",
      telefono: "",
      correo: "",
      contrasena: "",
      rol: "cajero",
      fecha_nacimiento: "",
    },
  });

  const onSubmit = async (data: UsuarioFormData) => {
    try {
      // Generar id_usuario único (timestamp simplificado)
      const id_usuario = Number(Date.now().toString().slice(-9));

      const usuarioData = {
        ...data,
        id_usuario,
      };

      await createUsuario(usuarioData);

      setSuccessModal({
        isOpen: true,
        message: "Cajero registrado exitosamente",
      });
      reset();
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error("Error al crear cajero:", error);
      const errorMessage =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Error al registrar el cajero";
      setErrorModal({ isOpen: true, message: errorMessage });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-dark">
            Registrar Cajero
          </h1>
          <p className="text-gray-500 mt-1">
            Agrega un nuevo cajero al sistema
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
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
          {/* Información Personal */}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Información Personal</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre Completo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
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
                  placeholder="Ej: Juan Pérez García"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("telefono", {
                    required: "El teléfono es obligatorio",
                    pattern: {
                      value: /^[0-9]{7,15}$/,
                      message: "Teléfono inválido (7-15 dígitos)",
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                    errors.telefono ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="3001234567"
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.telefono.message}
                  </p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("fecha_nacimiento", {
                    required: "La fecha de nacimiento es obligatoria",
                    validate: (value) => {
                      if (!value)
                        return "La fecha de nacimiento es obligatoria";
                      const birthDate = new Date(value);
                      const today = new Date();
                      const age = today.getFullYear() - birthDate.getFullYear();
                      return age >= 18 || "Debe ser mayor de 18 años";
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                    errors.fecha_nacimiento
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.fecha_nacimiento && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fecha_nacimiento.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Credenciales de Acceso */}
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Credenciales de Acceso</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Correo Electrónico */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("correo", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico inválido",
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                    errors.correo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ejemplo@correo.com"
                />
                {errors.correo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.correo.message}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  {...register("contrasena", {
                    required: "La contraseña es obligatoria",
                    minLength: { value: 4, message: "Mínimo 4 caracteres" },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button ${
                    errors.contrasena ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                {errors.contrasena && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contrasena.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  La contraseña debe tener al menos 4 caracteres
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Lateral - Vista Previa */}
        <div className="lg:col-span-1 space-y-6">
          {/* Vista Previa */}
          <div className="bg-white rounded-xl p-6 shadow-sm top-6">
            <h2 className="text-xl font-bold text-primary-dark mb-4">
              Vista Previa
            </h2>

            {/* Avatar del usuario */}
            <div className="w-full h-32 bg-linear-to-br from-primary/10 to-card/10 rounded-lg flex items-center justify-center mb-4">
              <div className="w-24 h-24 bg-button/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-button"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
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
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-800 text-sm">
                    {watch("telefono") || "---"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha Nac.</p>
                  <p className="font-medium text-gray-800 text-sm">
                    {watch("fecha_nacimiento") || "---"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Correo Electrónico</p>
                <p className="font-medium text-gray-800 text-sm break-all">
                  {watch("correo") || "sin-correo@ejemplo.com"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                  <svg
                    className="w-4 h-4 mr-1"
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
                  Cajero
                </span>
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
              <span>Registrar Cajero</span>
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
    </div>
  );
};

export default CreateCashier;
