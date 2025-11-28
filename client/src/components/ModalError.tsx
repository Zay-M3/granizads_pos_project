interface ModalErrorProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const ModalError = ({
  isOpen,
  onClose,
  title = "Error",
  message,
}: ModalErrorProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header con color de error */}
        <div className="bg-linear-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors cursor-pointer shadow-sm hover:shadow-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalError;
