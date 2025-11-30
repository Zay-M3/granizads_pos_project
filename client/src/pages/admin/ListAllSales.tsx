/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { getVentas, getVentaById } from "@api/ventas.api";
import type { Venta, VentaCompleta } from "@utils/VentasUtils";
import DetailsSales from "@components/sales/DetailsSales";

const ListAllSales = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaCompleta | null>(null);
  const [loadingVenta, setLoadingVenta] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMetodo, setSelectedMetodo] = useState("all");
  const [selectedEstado, setSelectedEstado] = useState("all");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    cargarVentas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [ventas, searchTerm, selectedMetodo, selectedEstado, fechaInicio, fechaFin]);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      const ventasData = await getVentas({});
      // Ordenar por fecha más reciente
      const ventasOrdenadas = ventasData.sort((a: Venta, b: Venta) => {
        return new Date(b.fecha || "").getTime() - new Date(a.fecha || "").getTime();
      });
      setVentas(ventasOrdenadas);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...ventas];

    // Filtro por búsqueda (ID de venta)
    if (searchTerm) {
      resultado = resultado.filter((venta) =>
        String(venta.id_venta).includes(searchTerm)
      );
    }

    // Filtro por método de pago
    if (selectedMetodo !== "all") {
      resultado = resultado.filter((venta) => venta.metodo_pago === selectedMetodo);
    }

    // Filtro por estado
    if (selectedEstado !== "all") {
      resultado = resultado.filter((venta) => venta.estado === selectedEstado);
    }

    // Filtro por rango de fechas
    if (fechaInicio) {
      resultado = resultado.filter(
        (venta) => new Date(venta.fecha || "") >= new Date(fechaInicio)
      );
    }
    if (fechaFin) {
      resultado = resultado.filter(
        (venta) => new Date(venta.fecha || "") <= new Date(fechaFin + "T23:59:59")
      );
    }

    setVentasFiltradas(resultado);
  };

  const handleVerDetalleVenta = async (idVenta: number) => {
    try {
      setLoadingVenta(true);
      const ventaCompleta = await getVentaById(idVenta);
      setVentaSeleccionada(ventaCompleta);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al cargar detalles de la venta:", error);
      alert("Error al cargar los detalles de la venta");
    } finally {
      setLoadingVenta(false);
    }
  };

  // Calcular estadísticas
  const totalVentas = ventasFiltradas.reduce((acc, v) => acc + (v.total || 0), 0);
  const totalTransacciones = ventasFiltradas.length;
  const ventasCompletadas = ventasFiltradas.filter((v) => v.estado === "completada").length;
  const ventasAnuladas = ventasFiltradas.filter((v) => v.estado === "anulada").length;

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Formatear fecha
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  // Badge de estado
  const getEstadoBadge = (estado?: string) => {
    if (estado === "completada") {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          Completada
        </span>
      );
    }
    if (estado === "anulada") {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
          Anulada
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
        {estado || "Desconocido"}
      </span>
    );
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-dark">
            Historial de Ventas
          </h1>
          <p className="text-gray-500 mt-1">
            Consulta y analiza todas las transacciones realizadas
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Ventas</p>
          <p className="text-2xl font-bold text-primary-dark mt-1">
            {formatCurrency(totalVentas)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Transacciones</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{totalTransacciones}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Completadas</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{ventasCompletadas}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Anuladas</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{ventasAnuladas}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Búsqueda por ID */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button"
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

          {/* Filtro por método de pago */}
          <select
            value={selectedMetodo}
            onChange={(e) => setSelectedMetodo(e.target.value)}
            className="px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button cursor-pointer"
          >
            <option value="all">Todos los métodos</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>

          {/* Filtro por estado */}
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="completada">Completada</option>
            <option value="anulada">Anulada</option>
          </select>

          {/* Fecha inicio */}
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button"
          />

          {/* Fecha fin */}
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button"
          />
        </div>
      </div>

      {/* Lista de ventas */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  ID Venta
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Empleado
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Productos
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Método de Pago
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {ventasFiltradas.map((venta) => (
                <tr
                  key={venta.id_venta}
                  onClick={() => venta.id_venta && handleVerDetalleVenta(venta.id_venta)}
                  className="hover:bg-secondary/20 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-primary"
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
                      <span className="font-bold text-gray-800">
                        #{String(venta.id_venta).padStart(6, "0")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{formatFecha(venta.fecha || "")}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{venta.empleado_nombre || "N/A"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">
                      {venta.total_items || 0} producto{(venta.total_items || 0) !== 1 ? "s" : ""}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{formatMetodoPago(venta.metodo_pago)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-primary">{formatCurrency(venta.total || 0)}</p>
                  </td>
                  <td className="px-6 py-4">{getEstadoBadge(venta.estado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ventasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
            <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron ventas</h3>
            <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal de Detalles de Venta */}
      <DetailsSales
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ventaCompleta={ventaSeleccionada}
      />

      {/* Loading overlay para cuando se carga una venta */}
      {loadingVenta && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button mx-auto"></div>
            <p className="text-gray-700 mt-4 font-medium">Cargando detalles...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAllSales;
