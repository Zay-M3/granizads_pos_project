import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex h-screen bg-secondary font-sans overflow-hidden">
      {/* Sidebar / Navegación */}
      <aside className="w-20 bg-primary-dark flex flex-col items-center py-6 space-y-8">
        {/* Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center hover:bg-card transition-colors cursor-pointer"
        >
          <span className="text-white font-black text-xl">D</span>
        </div>

        {/* Menú de navegación */}
        <nav className="flex flex-col space-y-6">
          <button className="w-12 h-12 rounded-lg bg-primary hover:bg-card transition-colors flex items-center justify-center cursor-pointer">
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>

          <button className="w-12 h-12 rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center cursor-pointer">
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </button>

          <button className="w-12 h-12 rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center cursor-pointer">
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>

          <button className="w-12 h-12 rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center cursor-pointer">
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </nav>

        {/* Usuario / Logout */}
        <div className="mt-auto">
          <button className="w-12 h-12 rounded-full bg-card hover:bg-button transition-colors flex items-center justify-center cursor-pointer">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header / Barra superior */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <div
            className="flex items-center space-x-4"
            onClick={() => navigate("/dashboard")}
          >
            <h1 className="text-2xl font-display font-bold text-primary-dark cursor-pointer">
              DrinKeo POS
            </h1>
            <span className="px-3 py-1 bg-button/10 text-button text-sm font-medium rounded-full">
              Caja Abierta
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Búsqueda */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar producto..."
                className="pl-10 pr-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button w-64"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Usuario y hora */}
            <div className="flex items-center space-x-3 pl-4 border-l border-secondary">
              <div className="text-right">
                <p className="text-sm font-medium text-primary-dark">
                  Juan Cajero
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime(currentTime)}
                </p>
              </div>
              <div className="w-10 h-10 bg-linear-to-br from-primary to-card rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Área de contenido (donde se renderizarán las rutas) */}
        <div className="flex-1 overflow-auto bg-secondary p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
