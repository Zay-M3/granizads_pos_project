import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 via-secondary to-card/10 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Ilustración 404 */}
        <div className="mb-8 relative">
          <h1 className="text-[200px] font-black text-primary/20 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-32 h-32 text-primary animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Mensaje */}
        <div className="mb-8">
          <h2 className="text-4xl font-display font-bold text-primary-dark mb-4">
            ¡Oops! Página no encontrada
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Parece que la página que buscas se tomó un descanso... 🍹
          </p>
          <p className="text-gray-500">
            La ruta que intentas acceder no existe o fue movida.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-linear-to-r from-button to-button-hover text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Ir al Dashboard</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-white text-primary-dark border-2 border-primary px-8 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver Atrás</span>
          </button>
        </div>

        {/* Links rápidos */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-500 mb-4">Enlaces rápidos:</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <button
              onClick={() => navigate('/dashboard/productos')}
              className="text-primary hover:text-primary-dark font-medium hover:underline"
            >
              Productos
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => navigate('/dashboard/inventario')}
              className="text-primary hover:text-primary-dark font-medium hover:underline"
            >
              Inventario
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => navigate('/dashboard/usuarios')}
              className="text-primary hover:text-primary-dark font-medium hover:underline"
            >
              Usuarios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
