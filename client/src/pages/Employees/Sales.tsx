import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductos } from "@api/productos.api";
import { createCliente } from "@api/clientes.api";
import { createVenta } from "@api/ventas.api";
import type { Producto } from "@utils/CreateProductsUtil";
import type { DetalleVenta } from "@utils/VentasUtils";

interface ClienteFormData {
  cedula: string;
  nombre: string;
}

interface VentaFormData {
  metodo_pago: "efectivo" | "tarjeta" | "transferencia";
  id_cliente?: number | null;
}

interface DetalleCarrito {
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface ClienteResponse {
  id_cliente: number;
  cedula: string;
  nombre: string;
}

const Sales = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<DetalleCarrito[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0);
  const [cantidadProducto, setCantidadProducto] = useState<number>(1);
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [clienteRegistrado, setClienteRegistrado] = useState<ClienteResponse | null>(null);

  const {
    register: registerCliente,
    handleSubmit: handleSubmitCliente,
    reset: resetCliente,
    formState: { errors: errorsCliente },
  } = useForm<ClienteFormData>();

  const {
    register: registerVenta,
    handleSubmit: handleSubmitVenta,
    formState: { errors: errorsVenta, isSubmitting },
  } = useForm<VentaFormData>();

  // Cargar productos disponibles
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        alert("Error al cargar los productos");
      }
    };
    fetchProductos();
  }, []);

  // Calcular total del carrito
  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + item.subtotal, 0);
  };

  // Agregar producto al carrito
  const agregarAlCarrito = () => {
    if (productoSeleccionado === 0 || cantidadProducto <= 0) {
      alert("Selecciona un producto y cantidad válida");
      return;
    }

    const producto = productos.find((p) => p.id_producto === productoSeleccionado);
    if (!producto) return;

    const productoEnCarrito = carrito.find(
      (item) => item.id_producto === productoSeleccionado
    );

    if (productoEnCarrito) {
      // Actualizar cantidad si ya existe
      setCarrito(
        carrito.map((item) =>
          item.id_producto === productoSeleccionado
            ? {
                ...item,
                cantidad: item.cantidad + cantidadProducto,
                subtotal:
                  (item.cantidad + cantidadProducto) * item.precio_unitario,
              }
            : item
        )
      );
    } else {
      // Agregar nuevo producto
      setCarrito([
        ...carrito,
        {
          id_producto: producto.id_producto!,
          cantidad: cantidadProducto,
          precio_unitario: producto.precio,
          subtotal: producto.precio * cantidadProducto,
          nombre_producto: producto.nombre,
        },
      ]);
    }

    // Reset selección
    setProductoSeleccionado(0);
    setCantidadProducto(1);
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (id_producto: number) => {
    setCarrito(carrito.filter((item) => item.id_producto !== id_producto));
  };

  // Modificar cantidad en el carrito
  const modificarCantidad = (id_producto: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id_producto);
      return;
    }

    setCarrito(
      carrito.map((item) =>
        item.id_producto === id_producto
          ? {
              ...item,
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * item.precio_unitario,
            }
          : item
      )
    );
  };

  // Procesar venta
  const onSubmitVenta = async (data: VentaFormData) => {
    if (carrito.length === 0) {
      alert("Agrega productos al carrito antes de continuar");
      return;
    }

    try {
      // Obtener id_empleado del usuario logueado (desde localStorage o context)
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        alert("No hay sesión activa");
        navigate("/");
        return;
      }

      const user = JSON.parse(userStr);
      const id_empleado = user.empleado?.id_empleado;

      if (!id_empleado) {
        alert("El usuario no tiene un empleado asociado");
        return;
      }

      // Preparar detalles de venta según el formato que espera el backend
      const detalles: DetalleVenta[] = carrito.map((item) => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      }));

      // Preparar datos para la venta según el backend analizado
      const ventaData = {
        id_cliente: clienteRegistrado?.id_cliente || null, // El backend acepta null
        id_empleado: id_empleado,
        metodo_pago: data.metodo_pago,
        detalles: detalles
      };

      console.log("Enviando datos de venta:", ventaData);

      // Crear venta (sin factura electrónica)
      const ventaResponse = await createVenta(ventaData);
      
      alert("¡Venta registrada exitosamente!");
      
      // Limpiar formulario
      setCarrito([]);
      resetCliente();
      setShowClienteForm(false);
      setClienteRegistrado(null);
      
      // Redirigir o mostrar resumen
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error al procesar venta:", error);
      const errorMessage = error.response?.data?.error || error.message || "Error al procesar la venta";
      alert(errorMessage);
    }
  };

  // Registrar cliente opcional
  const onSubmitCliente = async (data: ClienteFormData) => {
    try {
      const clienteResponse: ClienteResponse = await createCliente({
        cedula: data.cedula,
        nombre: data.nombre,
      });
      setClienteRegistrado(clienteResponse);
      alert(`Cliente registrado: ${clienteResponse.nombre}`);
      setShowClienteForm(false);
      resetCliente();
    } catch (error: any) {
      console.error("Error al registrar cliente:", error);
      const errorMessage = error.response?.data?.error || error.message || "Error al registrar cliente";
      alert(errorMessage);
    }
  };

  // Remover cliente registrado
  const removerCliente = () => {
    setClienteRegistrado(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary-dark">
              Registrar Nueva Venta
            </h1>
            <p className="text-gray-600 mt-1">
              Agrega productos y completa la transacción
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors cursor-pointer"
          >
            ← Volver
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Selección de productos */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-display font-bold text-primary-dark mb-4">
            Agregar Productos
          </h2>

          {/* Selector de productos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto
              </label>
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-secondary rounded-lg focus:border-button focus:outline-none cursor-pointer"
              >
                <option value={0}>Seleccionar producto...</option>
                {productos.map((producto) => (
                  <option
                    key={producto.id_producto}
                    value={producto.id_producto}
                  >
                    {producto.nombre} - ${producto.precio.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={cantidadProducto}
                onChange={(e) => setCantidadProducto(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-secondary rounded-lg focus:border-button focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={agregarAlCarrito}
            className="w-full bg-button hover:bg-button-hover text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Agregar al Carrito</span>
          </button>

          {/* Carrito de compras */}
          <div className="mt-6">
            <h3 className="font-bold text-gray-800 mb-3">
              Productos en el Carrito
            </h3>
            {carrito.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-2 text-gray-300"
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
                <p>No hay productos en el carrito</p>
              </div>
            ) : (
              <div className="space-y-2">
                {carrito.map((item) => (
                  <div
                    key={item.id_producto}
                    className="flex items-center justify-between p-4 border-2 border-secondary rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        {item.nombre_producto}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.precio_unitario.toLocaleString()} c/u
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            modificarCantidad(
                              item.id_producto,
                              item.cantidad - 1
                            )
                          }
                          className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-bold">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            modificarCantidad(
                              item.id_producto,
                              item.cantidad + 1
                            )
                          }
                          className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="font-bold text-primary">
                          ${item.subtotal.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => eliminarDelCarrito(item.id_producto)}
                        className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumen y pago */}
        <div className="space-y-6">
          {/* Cliente opcional */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">Cliente (Opcional)</h3>
            
            {clienteRegistrado ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-green-800">{clienteRegistrado.nombre}</p>
                    <p className="text-sm text-green-600">Cédula: {clienteRegistrado.cedula}</p>
                  </div>
                  <button
                    onClick={removerCliente}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : !showClienteForm ? (
              <button
                onClick={() => setShowClienteForm(true)}
                className="w-full py-2 border-2 border-button text-button hover:bg-button hover:text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                + Registrar Cliente
              </button>
            ) : (
              <form onSubmit={handleSubmitCliente(onSubmitCliente)} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula *
                  </label>
                  <input
                    {...registerCliente("cedula", {
                      required: "La cédula es obligatoria",
                    })}
                    type="text"
                    className="w-full px-4 py-2 border-2 border-secondary rounded-lg focus:border-button focus:outline-none"
                  />
                  {errorsCliente.cedula && (
                    <p className="text-red-500 text-xs mt-1">
                      {errorsCliente.cedula.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    {...registerCliente("nombre", {
                      required: "El nombre es obligatorio",
                    })}
                    type="text"
                    className="w-full px-4 py-2 border-2 border-secondary rounded-lg focus:border-button focus:outline-none"
                  />
                  {errorsCliente.nombre && (
                    <p className="text-red-500 text-xs mt-1">
                      {errorsCliente.nombre.message}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowClienteForm(false);
                      resetCliente();
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Resumen de venta */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Resumen de Venta</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Productos:</span>
                <span className="font-bold">{carrito.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Unidades:</span>
                <span className="font-bold">
                  {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
                </span>
              </div>
              <div className="border-t-2 border-secondary pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-lg text-gray-800">TOTAL:</span>
                  <span className="font-bold text-2xl text-primary">
                    ${calcularTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <form onSubmit={handleSubmitVenta(onSubmitVenta)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago *
                </label>
                <select
                  {...registerVenta("metodo_pago", {
                    required: "Selecciona un método de pago",
                  })}
                  className="w-full px-4 py-3 border-2 border-secondary rounded-lg focus:border-button focus:outline-none cursor-pointer"
                >
                  <option value="">Seleccionar...</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
                {errorsVenta.metodo_pago && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorsVenta.metodo_pago.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || carrito.length === 0}
                className="w-full bg-gradient-to-r from-button to-button-hover text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Completar Venta</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Advertencia */}
          {carrito.length === 0 && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-orange-500 shrink-0 mt-0.5"
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
                <p className="text-sm text-orange-800">
                  Agrega al menos un producto para continuar con la venta.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;