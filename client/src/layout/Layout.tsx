import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
          <button
            onClick={() => navigate("/dashboard")}
            className={`w-12 h-12 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
              location.pathname === "/dashboard"
                ? "bg-primary"
                : "hover:bg-primary/20"
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                location.pathname === "/dashboard"
                  ? "text-white"
                  : "text-secondary"
              }`}
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

          <button
            onClick={() => navigate("/dashboard/productos")}
            className={`w-12 h-12 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
              location.pathname.includes("/productos")
                ? "bg-primary"
                : "hover:bg-primary/20"
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                location.pathname.includes("/productos")
                  ? "text-white"
                  : "text-secondary"
              }`}
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

          <button
            onClick={() => navigate("/dashboard/inventario")}
            className={`w-12 h-12 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
              location.pathname.includes("/inventario")
                ? "bg-primary"
                : "hover:bg-primary/20"
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                location.pathname.includes("/inventario")
                  ? "text-white"
                  : "text-secondary"
              }`}
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
          </button>

          <button
            onClick={() => navigate("/dashboard/cajeros")}
            className={`w-12 h-12 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
              location.pathname.includes("/usuarios")
                ? "bg-primary"
                : "hover:bg-primary/20"
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                location.pathname.includes("/cajeros")
                  ? "text-white"
                  : "text-secondary"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <button
            onClick={() => {
              navigate("/");
            }}
            className="w-12 h-12 rounded-lg bg-red-500/10 hover:bg-red-500 transition-colors flex items-center justify-center cursor-pointer group"
            title="Cerrar sesión"
          >
            <svg
              className="w-6 h-6 text-red-500 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
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
              DrinKéo POS
            </h1>
            <span className="px-3 py-1 bg-button/10 text-button text-sm font-medium rounded-full">
              Caja Abierta
            </span>
          </div>

          <div className="flex items-center space-x-4">
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
