import { useNavigate } from "react-router-dom";

const HomeEmployee = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-linear-to-r from-primary to-card rounded-xl p-8 shadow-lg text-white">
        <h1 className="text-3xl font-display font-bold mb-2">
          ¡Bienvenido al Sistema de Ventas!
        </h1>
        <p className="text-white/80">
          Registra las ventas del día de manera rápida y eficiente
        </p>
      </div>

      {/* Estadísticas del cajero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ventas del día */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Mis Ventas Hoy
              </p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">
                $85,000
              </h3>
              <p className="text-xs text-blue-500 mt-1">12 transacciones</p>
            </div>
            <div className="w-12 h-12 bg-button/10 rounded-lg flex items-center justify-center">
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
            </div>
          </div>
        </div>

        {/* Productos vendidos */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Productos Vendidos
              </p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">47</h3>
              <p className="text-xs text-green-500 mt-1">↑ Muy bien</p>
            </div>
            <div className="w-12 h-12 bg-card/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-card"
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
            </div>
          </div>
        </div>

        {/* Última venta */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Última Venta</p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">
                $8,500
              </h3>
              <p className="text-xs text-gray-500 mt-1">Hace 5 minutos</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
          </div>
        </div>
      </div>

      {/* Acción principal - Registrar Venta */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-linear-to-br from-button to-button-hover rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-primary-dark mb-3">
            Registrar Nueva Venta
          </h2>
          <p className="text-gray-600 mb-6">
            Comienza a registrar una nueva transacción para tus clientes
          </p>
          <button
            onClick={() => navigate("/dashboard/ventas/crear")}
            className="bg-linear-to-r from-button to-button-hover text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center space-x-2 mx-auto"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Nueva Venta</span>
          </button>
        </div>
      </div>

      {/* Últimas transacciones */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-primary-dark">
            Mis Últimas Ventas
          </h2>
          <button className="text-sm font-medium text-button hover:text-button-hover transition-colors">
            Ver todas →
          </button>
        </div>
        <div className="space-y-3">
          {[
            {
              id: "#001234",
              time: "Hace 5 min",
              items: "3 productos",
              amount: "$8,500",
              payment: "Efectivo",
            },
            {
              id: "#001233",
              time: "Hace 15 min",
              items: "2 productos",
              amount: "$6,000",
              payment: "Tarjeta",
            },
            {
              id: "#001232",
              time: "Hace 32 min",
              items: "5 productos",
              amount: "$12,500",
              payment: "Transferencia",
            },
            {
              id: "#001231",
              time: "Hace 1 hora",
              items: "1 producto",
              amount: "$3,000",
              payment: "Efectivo",
            },
          ].map((sale, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-2 border-secondary rounded-lg hover:border-button transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{sale.id}</p>
                  <p className="text-sm text-gray-500">
                    {sale.items} • {sale.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary text-lg">{sale.amount}</p>
                <p className="text-xs text-gray-500">{sale.payment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productos más vendidos por el cajero */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-display font-bold text-primary-dark mb-4">
          Tus Productos Más Vendidos Hoy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Granizado Fresa", sales: 15, icon: "🍓" },
            { name: "Granizado Limón", sales: 12, icon: "🍋" },
            { name: "Limonada Natural", sales: 10, icon: "🍹" },
            { name: "Granizado Mora", sales: 10, icon: "🫐" },
          ].map((product, index) => (
            <div
              key={index}
              className="p-4 border-2 border-secondary rounded-xl hover:border-button transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{product.icon}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  #{index + 1}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.sales} vendidos</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips para el cajero */}
      <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center <shrink-0">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">
              💡 Consejo del día
            </h3>
            <p className="text-gray-700 text-sm">
              Recuerda verificar siempre el método de pago antes de completar la
              transacción. ¡Mantén tu caja organizada y cuadrada al final del
              turno!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeEmployee;
