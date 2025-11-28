interface ModalSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  autoCloseDelay?: number; // Cierre automático en milisegundos (opcional)
}

const ModalSuccess = ({
  isOpen,
  onClose,
  title = "¡Éxito!",
  message,
  confirmText = "Aceptar",
  autoCloseDelay,
}: ModalSuccessProps) => {
  // Auto-cierre opcional
  if (isOpen && autoCloseDelay) {
    setTimeout(() => {
      onClose();
    }, autoCloseDelay);
  }

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header con gradiente verde */}
        <div className="bg-linear-to-r from-green-500 to-green-600 px-6 py-5">
          <div className="flex items-center space-x-4">
            {/* Icono de éxito animado */}
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">
                {title}
              </h3>
            </div>
            {/* Botón de cierre */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
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
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer con botón */}
        <div className="px-6 pb-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer flex items-center space-x-2"
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
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSuccess;
