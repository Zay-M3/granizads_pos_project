import { useEffect } from "react";
import type { VentaCompleta } from "@utils/VentasUtils";

interface DetailsSalesProps {
  isOpen: boolean;
  onClose: () => void;
  ventaCompleta: VentaCompleta | null;
}

const DetailsSales = ({
  isOpen,
  onClose,
  ventaCompleta,
}: DetailsSalesProps) => {
  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !ventaCompleta) return null;

  const { venta, detalles } = ventaCompleta;

  // Calcular totales
  const subtotalGeneral = detalles.reduce(
    (acc, detalle) => acc + (detalle.subtotal || 0),
    0
  );
  const cantidadTotal = detalles.reduce(
    (acc, detalle) => acc + detalle.cantidad,
    0
  );

  // Formatear fecha
  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Badge de método de pago
  const getMetodoPagoBadge = () => {
    const metodos = {
      efectivo: { color: "bg-green-100 text-green-700", icon: "💵" },
      tarjeta: { color: "bg-blue-100 text-blue-700", icon: "💳" },
      transferencia: { color: "bg-purple-100 text-purple-700", icon: "🏦" },
    };
    const metodo = metodos[venta.metodo_pago] || metodos.efectivo;
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-bold ${metodo.color}`}
      >
        {metodo.icon}{" "}
        {venta.metodo_pago.charAt(0).toUpperCase() + venta.metodo_pago.slice(1)}
      </span>
    );
  };

  // Badge de estado
  const getEstadoBadge = () => {
    if (venta.estado === "anulada") {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700">
          ❌ Anulada
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
        ✅ Completada
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-button/10 rounded-lg">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-primary-dark">
                  Detalle de Venta
                </h2>
                <p className="text-sm text-gray-500">
                  #{venta.id_venta || "N/A"} -{" "}
                  {formatearFecha(venta.fecha || venta.fecha_venta)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-gray-500"
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

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="bg-secondary/30 rounded-xl p-4 border-2 border-dashed border-secondary">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-button/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-button"
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
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold">Cliente</p>
                  <p className="text-sm font-bold text-gray-800">
                    {venta.cliente_nombre || "Cliente General"}
                  </p>
                </div>
              </div>
            </div>

            {/* Empleado */}
            <div className="bg-secondary/30 rounded-xl p-4 border-2 border-dashed border-secondary">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-button/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-button"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold">Vendedor</p>
                  <p className="text-sm font-bold text-gray-800">
                    {venta.empleado_nombre || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Método de Pago */}
            <div className="bg-secondary/30 rounded-xl p-4 border-2 border-dashed border-secondary">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-button/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-button"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold">
                    Método de Pago
                  </p>
                  <div className="mt-1">{getMetodoPagoBadge()}</div>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="bg-secondary/30 rounded-xl p-4 border-2 border-dashed border-secondary">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-button/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-button"
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
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold">Estado</p>
                  <div className="mt-1">{getEstadoBadge()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-primary-dark flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-button"
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
              <span>Productos</span>
              <span className="text-sm text-gray-500 font-normal">
                ({detalles.length}{" "}
                {detalles.length === 1 ? "producto" : "productos"})
              </span>
            </h3>

            {/* Tabla de productos */}
            <div className="bg-white rounded-xl border border-secondary overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary">
                    {detalles.map((detalle, index) => (
                      <tr
                        key={index}
                        className="hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              {detalle.producto_nombre || "Producto"}
                            </p>
                            {detalle.producto_descripcion && (
                              <p className="text-xs text-gray-500 mt-1">
                                {detalle.producto_descripcion}
                              </p>
                            )}
                            {detalle.categoria_nombre && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-button/10 text-button text-xs rounded-full font-medium">
                                {detalle.categoria_nombre}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-button/10 text-button rounded-full font-bold text-sm">
                            {detalle.cantidad}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="text-sm font-bold text-gray-700">
                            ${detalle.precio_unitario.toLocaleString("es-CO")}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="text-sm font-bold text-primary">
                            $
                            {(
                              detalle.subtotal ||
                              detalle.cantidad * detalle.precio_unitario
                            ).toLocaleString("es-CO")}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Resumen Total */}
          <div className="bg-linear-to-br from-button/5 to-primary/5 rounded-xl p-6 border-2 border-button/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-button/20">
                <span className="text-sm font-bold text-gray-600">
                  Cantidad Total de Productos
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {cantidadTotal} {cantidadTotal === 1 ? "unidad" : "unidades"}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-button/20">
                <span className="text-sm font-bold text-gray-600">
                  Subtotal
                </span>
                <span className="text-sm font-bold text-gray-800">
                  ${subtotalGeneral.toLocaleString("es-CO")}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-primary-dark">
                  TOTAL
                </span>
                <div className="text-right">
                  <p className="text-3xl font-bold text-button">
                    ${(venta.total || subtotalGeneral).toLocaleString("es-CO")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    COP - Peso Colombiano
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-secondary px-6 py-4 rounded-b-2xl">
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-linear-to-r from-button to-button-hover text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSales;
