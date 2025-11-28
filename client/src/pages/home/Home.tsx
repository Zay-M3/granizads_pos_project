import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVentas } from "@api/ventas.api";
import { getProductos } from "@api/productos.api";
import { getInsumos } from "@api/insumos.api";
import type { Venta } from "@utils/VentasUtils";
import type { Producto } from "@utils/CreateProductsUtil";
import type { Insumo } from "@utils/InventoryUtils";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ventasHoy, setVentasHoy] = useState<Venta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);

  useEffect(() => {
    // Verificar el rol del usuario y redirigir según corresponda
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.rol === "cajero") {
          navigate("/dashboard/empleado", { replace: true });
        }
      } catch (error) {
        console.error("Error al verificar rol:", error);
      }
    }

    // Cargar datos del dashboard
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Obtener fecha de hoy
      const today = new Date().toISOString().split("T")[0];

      // Cargar ventas del día, productos e insumos en paralelo
      const [ventasData, productosData, insumosData] = await Promise.all([
        getVentas({ fecha_inicio: today, fecha_fin: today }),
        getProductos(),
        getInsumos(),
      ]);

      setVentasHoy(ventasData);
      setProductos(productosData);
      setInsumos(insumosData);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const totalVentasHoy = ventasHoy.reduce(
    (sum, venta) => sum + Number(venta.total),
    0
  );
  const totalProductosVendidos = ventasHoy.reduce(
    (sum, venta) => sum + Number(venta.total_items || 0),
    0
  );
  const totalTransacciones = ventasHoy.length;

  // Insumos con alerta o stock bajo
  const insumosStockBajo = insumos.filter(
    (i) => i.alerta || i.stock <= i.minimo_stock
  );

  // Calcular valor total del inventario de insumos
  const valorInventarioInsumos = insumos.reduce(
    (sum, i) => sum + i.stock * i.costo_unitario,
    0
  );
  const valorTotalInventario = valorInventarioInsumos;
  const totalItemsInventario = productos.length + insumos.length;

  // Productos disponibles
  const productosDisponibles = productos.slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ventas del día */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Ventas del Día
              </p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">
                ${totalVentasHoy.toLocaleString("es-CO")}
              </h3>
              <p className="text-xs text-green-500 mt-1">
                {totalTransacciones} transacciones
              </p>
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
              <h3 className="text-3xl font-bold text-primary-dark mt-2">
                {totalProductosVendidos}
              </h3>
              <p className="text-xs text-blue-500 mt-1">
                {totalTransacciones} transacciones
              </p>
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

        {/* Inventario bajo */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Productos Bajos
              </p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">
                {insumosStockBajo.length}
              </h3>
              <p className="text-xs text-orange-500 mt-1">
                {insumosStockBajo.length > 0
                  ? "⚠️ Requieren atención"
                  : "✓ Todo en orden"}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total inventario */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Valor Inventario
              </p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">
                ${(valorTotalInventario / 1000000).toFixed(1)}M
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {totalItemsInventario} items
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
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
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas y alertas */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Acciones rápidas */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-display font-bold text-primary-dark mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/dashboard/inventario")}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-linear-to-br from-button to-button-hover hover:shadow-lg transition-all group cursor-pointer"
            >
              <svg
                className="w-8 h-8 text-gray-600 mb-2"
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
              <span className="text-white font-medium text-sm">Inventario</span>
            </button>

            <button
              onClick={() => navigate("/dashboard/productos/crear")}
              className="flex flex-col items-center justify-center p-6 rounded-xl bg-linear-to-br from-card to-primary hover:shadow-lg transition-all group cursor-pointer"
            >
              <svg
                className="w-8 h-8 text-white mb-2"
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
              <span className="text-white font-medium text-sm">
                Agregar Producto
              </span>
            </button>
            <button
              onClick={() => navigate("/dashboard/cajeros")}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-secondary hover:border-button hover:bg-button/5 transition-all cursor-pointer"
            >
              <svg
                className="w-8 h-8 text-gray-600 mb-2"
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
              <span className="text-gray-700 font-medium text-sm">Cajeros</span>
            </button>
          </div>
        </div>

        {/* Alertas de inventario */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-display font-bold text-primary-dark mb-4">
            Alertas de Inventario
          </h2>
          <div className="space-y-3">
            {insumosStockBajo.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                </div>
                <p className="text-sm text-gray-600">
                  Todo el inventario está en buen estado
                </p>
              </div>
            ) : (
              <>
                {insumosStockBajo.slice(0, 5).map((insumo) => (
                  <div
                    key={`insumo-${insumo.id_insumo}`}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      insumo.stock <= insumo.minimo_stock * 0.5
                        ? "bg-red-50 border-red-200"
                        : "bg-orange-50 border-orange-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          insumo.stock <= insumo.minimo_stock * 0.5
                            ? "bg-red-500"
                            : "bg-orange-500"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {insumo.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stock: {insumo.stock} {insumo.unidad_medida}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs text-white px-2 py-1 rounded-full ${
                        insumo.stock <= insumo.minimo_stock * 0.5
                          ? "bg-red-500"
                          : "bg-orange-500"
                      }`}
                    >
                      {insumo.stock <= insumo.minimo_stock * 0.5
                        ? "Crítico"
                        : "Bajo"}
                    </span>
                  </div>
                ))}
              </>
            )}

            <button
              onClick={() => navigate("/dashboard/productos")}
              className="w-full mt-4 py-2 text-sm font-medium text-button hover:text-button-hover transition-colors cursor-pointer"
            >
              Ver todos los productos →
            </button>
          </div>
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-display font-bold text-primary-dark mb-4">
          Productos Disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {productosDisponibles.length > 0 ? (
            productosDisponibles.map((producto) => (
              <div
                key={producto.id_producto}
                className="p-4 border-2 border-secondary rounded-xl hover:border-button transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🥤</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    {producto.tipo}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">
                  {producto.nombre}
                </h3>
                <p className="text-sm text-gray-500">
                  {producto.categoria_nombre || "Sin categoría"}
                </p>
                <p className="text-lg font-bold text-primary mt-2">
                  ${producto.precio.toLocaleString("es-CO")}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-8 text-gray-500">
              No hay productos disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
