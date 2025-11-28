import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getVentas } from "@api/ventas.api";
import { getProductos } from "@api/productos.api";
import type { Venta } from "@utils/VentasUtils";
import type { Producto } from "@utils/CreateProductsUtil";

interface ProductoVendido {
  id_producto: number;
  nombre: string;
  cantidad: number;
}

const HomeEmployee = () => {
  const navigate = useNavigate();
  const [ventasHoy, setVentasHoy] = useState<Venta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener id del empleado del localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const id_empleado = user.id_empleado;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        // Obtener ventas del día actual del empleado
        const hoy = new Date().toISOString().split("T")[0];
        const ventasData = await getVentas({
          fecha_inicio: hoy,
          id_empleado: id_empleado,
        });

        // Filtrar solo ventas completadas
        const ventasCompletadas = ventasData.filter(
          (v: Venta) => v.estado !== "anulada"
        );

        setVentasHoy(ventasCompletadas);

        // Cargar productos para calcular los más vendidos
        const productosData = await getProductos();
        setProductos(productosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        // En caso de error, establecer arrays vacíos
        setVentasHoy([]);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id_empleado]);

  // Calcular estadísticas
  const totalVentasHoy = ventasHoy.reduce((acc, v) => acc + (v.total || 0), 0);
  const totalTransacciones = ventasHoy.length;
  const totalProductosVendidos = ventasHoy.reduce(
    (acc, v) => acc + (v.total_items || 0),
    0
  );

  // Última venta
  const ultimaVenta = ventasHoy[0];

  // Calcular productos más vendidos (placeholder por ahora)
  const productosVendidos: ProductoVendido[] = productos
    .slice(0, 4)
    .map((p) => ({
      id_producto: p.id_producto || 0,
      nombre: p.nombre,
      cantidad: Math.floor(Math.random() * 15) + 5,
    }));

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Formatear fecha relativa
  const formatRelativeTime = (fecha: string) => {
    const now = new Date();
    const ventaDate = new Date(fecha);
    const diffMs = now.getTime() - ventaDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    return ventaDate.toLocaleDateString("es-CO");
  };

  // Método de pago en español
  const formatMetodoPago = (metodo: string) => {
    const metodos: { [key: string]: string } = {
      efectivo: "Efectivo",
      tarjeta: "Tarjeta",
      transferencia: "Transferencia",
    };
    return metodos[metodo] || metodo;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button"></div>
      </div>
    );
  }

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
                {formatCurrency(totalVentasHoy)}
              </h3>
              <p className="text-xs text-blue-500 mt-1">
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
              <p className="text-xs text-green-500 mt-1">
                {totalProductosVendidos > 0 ? "↑ Muy bien" : "Sin ventas"}
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

        {/* Última venta */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Última Venta</p>
              <h3 className="text-3xl font-bold text-primary-dark mt-2">
                {ultimaVenta ? formatCurrency(ultimaVenta.total || 0) : "$0"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {ultimaVenta
                  ? formatRelativeTime(ultimaVenta.fecha || "")
                  : "Sin ventas"}
              </p>
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
            className="bg-linear-to-r from-button to-button-hover text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center space-x-2 mx-auto cursor-pointer"
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
        </div>
        {ventasHoy.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay ventas registradas hoy</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ventasHoy.slice(0, 4).map((venta, index) => (
              <div
                key={venta.id_venta || index}
                className="flex items-center justify-between p-4 border-2 border-secondary rounded-lg hover:border-button transition-colors cursor-pointer"
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
                    <p className="font-bold text-gray-800">
                      #{String(venta.id_venta).padStart(6, "0")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {venta.total_items || 0} producto
                      {(venta.total_items || 0) !== 1 ? "s" : ""} •{" "}
                      {formatRelativeTime(venta.fecha || "")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-lg">
                    {formatCurrency(venta.total || 0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatMetodoPago(venta.metodo_pago)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Productos más vendidos por el cajero */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-display font-bold text-primary-dark mb-4">
          Productos Disponibles
        </h2>
        {productosVendidos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {productosVendidos.map((product, index) => (
              <div
                key={product.id_producto}
                className="p-4 border-2 border-secondary rounded-xl hover:border-button transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🥤</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    #{index + 1}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">
                  {product.nombre}
                </h3>
                <p className="text-sm text-gray-500">Disponible</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips para el cajero */}
      <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
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
            <h3 className="font-bold text-gray-800 mb-2">💡 Consejo del día</h3>
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
