import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalEditProduct from '@components/products/ModalEditProduct';
import ConfirmAction from '@components/ConfirmAction';
import type { Category } from '@utils/CategoryUtils';
import type { ProductFormData } from '@utils/CreateProductsUtil';

const ListProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<(ProductFormData & {
    id_producto?: number;
    category?: string;
    stock?: number;
    image?: string;
    status?: 'available' | 'low-stock' | 'out-of-stock';
  })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(ProductFormData & {
    id_producto?: number;
    category?: string;
    stock?: number;
    image?: string;
    status?: 'available' | 'low-stock' | 'out-of-stock';
  }) | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<(ProductFormData & {
    id_producto?: number;
    category?: string;
    stock?: number;
    image?: string;
    status?: 'available' | 'low-stock' | 'out-of-stock';
  }) | null>(null);

  // TODO: Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categorias');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategories();
  }, []);

  // TODO: Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/productos');
        const data = await response.json();
        // Mapear los datos con campos calculados
        const mappedProducts = data.map((product: ProductFormData & { id_producto?: number }) => ({
          ...product,
          category: categories.find(c => c.id_categoria === product.id_categoria)?.nombre,
          // TODO: Implementar cálculo de stock desde inventario
          stock: 0,
          // TODO: Implementar asignación de imagen según tipo
          image: '🍹',
          // TODO: Implementar cálculo de estado según stock
          status: 'available' as 'available' | 'low-stock' | 'out-of-stock'
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [categories]);

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtener badge de estado
  const getStatusBadge = (status?: 'available' | 'low-stock' | 'out-of-stock') => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Disponible</span>;
      case 'low-stock':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Stock Bajo</span>;
      case 'out-of-stock':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Agotado</span>;
    }
  };

  // Manejar edición de producto
  const handleEditProduct = (product: ProductFormData & {
    id_producto?: number;
    category?: string;
    stock?: number;
    image?: string;
    status?: 'available' | 'low-stock' | 'out-of-stock';
  }) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Guardar cambios del producto
  const handleSaveProduct = (updatedProduct: ProductFormData & {
    id_producto?: number;
    category?: string;
    stock?: number;
    image?: string;
    status?: 'available' | 'low-stock' | 'out-of-stock';
  }) => {
    setProducts(prevProducts =>
      prevProducts.map(p => p.id_producto === updatedProduct.id_producto ? updatedProduct : p)
    );
  };

  // Abrir modal de confirmación
  const handleDeleteClick = (product: ProductFormData & {
    id_producto?: number;
    category?: string;
    stock?: number;
    image?: string;
    status?: 'available' | 'low-stock' | 'out-of-stock';
  }) => {
    setProductToDelete(product);
    setIsConfirmOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = () => {
    if (productToDelete) {
      // TODO: Eliminar del backend
      // await fetch(`/api/productos/${productToDelete.id_producto}`, { method: 'DELETE' });
      setProducts(prevProducts => prevProducts.filter(p => p.id_producto !== productToDelete.id_producto));
      console.log('Producto eliminado:', productToDelete.id_producto);
    }
  };

  // Cerrar modal
  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setProductToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-dark">Productos</h1>
          <p className="text-gray-500 mt-1">Gestiona el catálogo de productos de DrinKeo</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/productos/crear')}
          className="bg-linear-to-r from-button to-button-hover text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Productos</p>
          <p className="text-2xl font-bold text-primary-dark mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Disponibles</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {products.filter(p => p.status === 'available').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Stock Bajo</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {products.filter(p => p.status === 'low-stock').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Agotados</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {products.filter(p => p.status === 'out-of-stock').length}
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
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filtro por categoría */}
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      {viewMode === 'grid' ? (
        /* Vista de Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id_producto}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              {/* Imagen del producto */}
              <div className="h-40 bg-linear-to-br from-primary/10 to-card/10 flex items-center justify-center">
                <span className="text-6xl">{product.image}</span>
              </div>

              {/* Información */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">
                      {product.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  {getStatusBadge(product.status!)}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary">
                  <div>
                    <p className="text-2xl font-bold text-primary">${product.precio.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="p-2 bg-button/10 text-button rounded-lg hover:bg-button hover:text-white transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(product)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Producto</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {filteredProducts.map(product => (
                <tr key={product.id_producto} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{product.image}</span>
                      <span className="font-medium text-gray-800">{product.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary">${product.precio.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-700">{product.stock}</span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(product.status!)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="p-2 bg-button/10 text-button rounded-lg hover:bg-button hover:text-white transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
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
        message={`¿Estás seguro de que deseas eliminar ${productToDelete?.nombre}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default ListProducts;
