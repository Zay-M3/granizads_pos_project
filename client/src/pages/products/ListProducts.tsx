import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalEditProduct from "@components/products/ModalEditProduct";
import ConfirmAction from "@components/ConfirmAction";
import { getProductos, deleteProducto } from "@api/productos.api";
import { getCategorias } from "@api/categorias.api";
import type { Producto } from "@utils/CreateProductsUtil";
import type { Categoria } from "@utils/CategoryUtils";

// Componente de Toast simple
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const ListProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategorias();
        setCategories(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        showToast("Error al cargar las categorías", "error");
      }
    };
    fetchCategories();
  }, []);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductos();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        showToast("Error al cargar los productos", "error");
      }
    };
    fetchProducts();
  }, []);

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.categoria_nombre === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtener icono basado en la categoría del producto
  const getProductIcon = (categoriaNombre?: string) => {
    if (!categoriaNombre) return "🍹";

    const categoriaLower = categoriaNombre.toLowerCase();
    if (categoriaLower.includes("granizado")) return "🥤";
    if (categoriaLower.includes("coctel") || categoriaLower.includes("cóctel"))
      return "🍹";
    if (categoriaLower.includes("cerveza")) return "🍺";
    if (categoriaLower.includes("vino")) return "🍷";
    if (categoriaLower.includes("licor")) return "🥃";
    if (
      categoriaLower.includes("refresco") ||
      categoriaLower.includes("gaseosa")
    )
      return "🥤";
    if (categoriaLower.includes("agua")) return "💧";
    if (categoriaLower.includes("café") || categoriaLower.includes("cafe"))
      return "☕";
    return "🍹"; // default: coctel
  };

  // Obtener badge de estado
  const getStatusBadge = () => {
    return (
      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
        Disponible
      </span>
    );
  };

  // Manejar edición de producto
  const handleEditProduct = (product: Producto) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Guardar cambios del producto
  const handleSaveProduct = (updatedProduct: Producto) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id_producto === updatedProduct.id_producto ? updatedProduct : p
      )
    );
    showToast("Producto actualizado exitosamente", "success");
  };

  // Abrir modal de confirmación
  const handleDeleteClick = (product: Producto) => {
    setProductToDelete(product);
    setIsConfirmOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (productToDelete && productToDelete.id_producto) {
      try {
        await deleteProducto(productToDelete.id_producto);
        setProducts((prevProducts) =>
          prevProducts.filter(
            (p) => p.id_producto !== productToDelete.id_producto
          )
        );
        showToast("Producto eliminado exitosamente", "success");
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        const errorMessage =
          (error as { response?: { data?: { error?: string } } }).response?.data
            ?.error || "Error al eliminar el producto";
        showToast(errorMessage, "error");
      }
    }
    handleCloseConfirm();
  };

  // Cerrar modal
  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setProductToDelete(null);
  };

  // Refrescar lista de productos
  const refreshProducts = async () => {
    try {
      const data = await getProductos();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      showToast("Error al cargar los productos", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-dark">
            Productos
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona el catálogo de productos de DrinKeo
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshProducts}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 cursor-pointer"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Actualizar</span>
          </button>
          <button
            onClick={() => navigate("/dashboard/productos/crear")}
            className="bg-linear-to-r from-button to-button-hover text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Agregar Producto</span>
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Productos</p>
          <p className="text-2xl font-bold text-primary-dark mt-1">
            {products.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Categorías</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {categories.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Con Receta</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {
              products.filter(
                (p) => p.total_ingredientes && p.total_ingredientes > 0
              ).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Precio Promedio</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            $
            {products.length > 0
              ? (
                  products.reduce((sum, p) => sum + p.precio, 0) /
                  products.length
                ).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar producto o descripción..."
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

          <div className="flex items-center space-x-4">
            {/* Filtro por categoría */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id_categoria} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>

            {/* Toggle vista */}
            <div className="flex bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded cursor-pointer ${
                  viewMode === "grid" ? "bg-white shadow-sm" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded cursor-pointer ${
                  viewMode === "list" ? "bg-white shadow-sm" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      {viewMode === "grid" ? (
        /* Vista de Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id_producto}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              {/* Imagen del producto */}
              <div className="h-40 bg-linear-to-br from-primary/10 to-card/10 flex items-center justify-center">
                <span className="text-6xl">
                  {getProductIcon(product.categoria_nombre)}
                </span>
              </div>

              {/* Información */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">
                      {product.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {product.categoria_nombre || "Sin categoría"}
                    </p>
                  </div>
                  {getStatusBadge()}
                </div>

                {product.descripcion && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.descripcion}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ${product.precio.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.total_ingredientes || 0} ingredientes
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 bg-button/10 text-button rounded-lg hover:bg-button hover:text-white transition-all cursor-pointer"
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all cursor-pointer"
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
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Vista de Lista */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Descripción
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Receta
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id_producto}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">
                        {getProductIcon(product.categoria_nombre)}
                      </span>
                      <div>
                        <span className="font-medium text-gray-800 block">
                          {product.nombre}
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.categoria_nombre}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.categoria_nombre || "Sin categoría"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary">
                      ${product.precio.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 max-w-xs truncate block">
                      {product.descripcion || "Sin descripción"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-700">
                      {product.total_ingredientes || 0} ingredientes
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge()}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 bg-button/10 text-button rounded-lg hover:bg-button hover:text-white transition-all"
                        title="Editar producto"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                        title="Eliminar producto"
                      >
                        <svg
                          className="w-4 h-4"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sin resultados */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500">
            Intenta con otros filtros o términos de búsqueda
          </p>
        </div>
      )}

      {/* Modal de edición */}
      <ModalEditProduct
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />

      {/* Modal de confirmación */}
      <ConfirmAction
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default ListProducts;
