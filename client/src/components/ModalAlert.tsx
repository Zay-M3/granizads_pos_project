interface ModalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "success" | "warning";
}

const ModalAlert = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Información",
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  type = "info",
}: ModalAlertProps) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  // Configuración de colores según el tipo
  const colorConfig = {
    info: {
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-white/20",
      buttonBg: "bg-blue-500 hover:bg-blue-600",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    success: {
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-white/20",
      buttonBg: "bg-green-500 hover:bg-green-600",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    warning: {
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-white/20",
      buttonBg: "bg-orange-500 hover:bg-orange-600",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      ),
    },
  };

  const config = colorConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className={`bg-linear-to-r ${config.gradient} px-6 py-4`}>
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center`}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {config.icon}
              </svg>
            </div>
            <h3 className="text-xl font-display font-bold text-white">
              {title}
            </h3>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          {onConfirm && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-6 py-2.5 ${config.buttonBg} text-white rounded-lg font-bold transition-colors cursor-pointer shadow-sm hover:shadow-md`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlert;
