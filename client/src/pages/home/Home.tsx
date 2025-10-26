
const Home = () => {
  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ventas del día */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Ventas del Día</p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">$245,000</h3>
              <p className="text-xs text-green-500 mt-1">↑ 12% vs ayer</p>
            </div>
            <div className="w-12 h-12 bg-button/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-button" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Productos vendidos */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Productos Vendidos</p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">127</h3>
              <p className="text-xs text-blue-500 mt-1">23 transacciones</p>
            </div>
            <div className="w-12 h-12 bg-card/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-card" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Inventario bajo */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Productos Bajos</p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">5</h3>
              <p className="text-xs text-orange-500 mt-1">⚠️ Requieren atención</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total inventario */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Valor Inventario</p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">$1.2M</h3>
              <p className="text-xs text-gray-500 mt-1">342 productos</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas y alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Acciones rápidas */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-display font-bold text-primary-dark mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-button to-button-hover hover:shadow-lg transition-all group">
              <svg className="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-white font-medium text-sm">Nueva Venta</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-card to-primary hover:shadow-lg transition-all group">
              <svg className="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-white font-medium text-sm">Agregar Producto</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-secondary hover:border-button hover:bg-button/5 transition-all">
              <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-gray-700 font-medium text-sm">Ver Reportes</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-secondary hover:border-button hover:bg-button/5 transition-all">
              <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-gray-700 font-medium text-sm">Inventario</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-secondary hover:border-button hover:bg-button/5 transition-all">
              <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-gray-700 font-medium text-sm">Cerrar Caja</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-secondary hover:border-button hover:bg-button/5 transition-all">
              <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-gray-700 font-medium text-sm">Clientes</span>
            </button>
          </div>
        </div>

        {/* Alertas de inventario */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-display font-bold text-primary-dark mb-4">Alertas de Inventario</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Granizado Fresa</p>
                  <p className="text-xs text-gray-500">Stock: 3 unidades</p>
                </div>
              </div>
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">Crítico</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Vasos Medianos</p>
                  <p className="text-xs text-gray-500">Stock: 15 unidades</p>
                </div>
              </div>
              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Bajo</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Jarabe Limón</p>
                  <p className="text-xs text-gray-500">Stock: 8 unidades</p>
                </div>
              </div>
              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Bajo</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Tapas Vasos</p>
                  <p className="text-xs text-gray-500">Stock: 12 unidades</p>
                </div>
              </div>
              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Bajo</span>
            </div>

            <button className="w-full mt-4 py-2 text-sm font-medium text-button hover:text-button-hover transition-colors">
              Ver todos los productos →
            </button>
          </div>
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-display font-bold text-primary-dark mb-4">Top Productos del Día</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Granizado Fresa', sales: 45, revenue: '$45,000', icon: '🍓' },
            { name: 'Granizado Limón', sales: 38, revenue: '$38,000', icon: '🍋' },
            { name: 'Granizado Mora', sales: 32, revenue: '$32,000', icon: '🫐' },
            { name: 'Limonada Natural', sales: 28, revenue: '$28,000', icon: '🍹' },
          ].map((product, index) => (
            <div key={index} className="p-4 border-2 border-secondary rounded-xl hover:border-button transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{product.icon}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  #{index + 1}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.sales} vendidos</p>
              <p className="text-lg font-bold text-primary mt-2">{product.revenue}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
