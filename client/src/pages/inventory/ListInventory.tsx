import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInsumos, updateInsumo } from '@api/insumos.api';
import type { Insumo } from '@utils/InventoryUtils';
import ModalEditInputs from '@components/inventory/ModalEditInputs';

const ListInventory = () => {
  const navigate = useNavigate();
  const [insumos, setInsumos] = useState<Insumo[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);

  // Cargar insumos desde la API
  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const data = await getInsumos();
        setInsumos(data);
      } catch (error) {
        console.error('Error al cargar insumos:', error);
        alert('Error al cargar los insumos');
      }
    };
    fetchInsumos();
  }, []);

  // Calcular estado de un insumo
  const getInsumoStatus = (insumo: Insumo): 'available' | 'low-stock' | 'critical' => {
    if (insumo.alerta || insumo.stock <= insumo.minimo_stock * 0.5) return 'critical';
    if (insumo.stock <= insumo.minimo_stock) return 'low-stock';
    return 'available';
  };

  // Filtrar insumos
  const filteredInsumos = insumos.filter(insumo => {
    const matchesSearch = insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const insumoStatus = getInsumoStatus(insumo);
    const matchesStatus = selectedStatus === 'all' || insumoStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Obtener badge de estado basado en stock vs minimo_stock
  const getStatusBadge = (insumo: Insumo) => {
    if (insumo.alerta || insumo.stock <= insumo.minimo_stock * 0.5) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Crítico</span>;
    } else if (insumo.stock <= insumo.minimo_stock) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Stock Bajo</span>;
    } else {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Stock Normal</span>;
    }
  };

  // Calcular porcentaje de stock
  const getStockPercentage = (insumo: Insumo) => {
    const percentage = (insumo.stock / (insumo.minimo_stock * 2)) * 100;
    return Math.min(percentage, 100);
  };

  // Obtener color de barra de progreso basado en stock
  const getProgressColor = (insumo: Insumo) => {
    if (insumo.alerta || insumo.stock <= insumo.minimo_stock * 0.5) {
      return 'bg-red-500';
    } else if (insumo.stock <= insumo.minimo_stock) {
      return 'bg-orange-500';
    } else {
      return 'bg-green-500';
    }
  };

  // Abrir modal de edición
  const handleEditInsumo = (insumo: Insumo) => {
    setSelectedInsumo(insumo);
    setIsModalOpen(true);
  };

  // Guardar cambios del insumo
  const handleSaveInsumo = async (updatedInsumo: Insumo) => {
    try {
      if (updatedInsumo.id_insumo) {
        await updateInsumo(updatedInsumo.id_insumo, updatedInsumo);
        setInsumos(prevInsumos => 
          prevInsumos.map(insumo => 
            insumo.id_insumo === updatedInsumo.id_insumo ? updatedInsumo : insumo
          )
        );
        alert('Insumo actualizado exitosamente ✅');
      }
    } catch (error) {
      console.error('Error al actualizar insumo:', error);
      const errorMessage = (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error al actualizar el insumo';
      alert(errorMessage + ' ❌');
    }
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInsumo(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-dark">Inventario de Insumos</h1>
          <p className="text-gray-500 mt-1">Gestiona el stock de insumos para tus productos</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/inventario/agregar')}
          className="bg-linear-to-r from-button to-button-hover text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Agregar Insumos</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Insumos</p>
          <p className="text-2xl font-bold text-primary-dark mt-1">{insumos.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Stock Normal</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {insumos.filter(i => getInsumoStatus(i) === 'available').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Stock Bajo</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {insumos.filter(i => getInsumoStatus(i) === 'low-stock').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Críticos</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {insumos.filter(i => getInsumoStatus(i) === 'critical').length}
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
              placeholder="Buscar insumo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filtro por estado */}
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="available">Stock Normal</option>
              <option value="low-stock">Stock Bajo</option>
              <option value="critical">Crítico</option>
            </select>

            {/* Toggle vista */}
            <div className="flex bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de insumos */}
      {viewMode === 'grid' ? (
        /* Vista de Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInsumos.map(insumo => (
            <div
              key={insumo.id_insumo}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              {/* Imagen del insumo */}
              <div className="h-40 bg-linear-to-br from-primary/10 to-card/10 flex items-center justify-center relative">
                <span className="text-6xl">📦</span>
                <div className="absolute top-3 right-3">
                  {getStatusBadge(insumo)}
                </div>
              </div>

              {/* Información */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">
                    {insumo.nombre}
                  </h3>
                  <p className="text-sm text-gray-500">Última compra: {insumo.fecha_compra}</p>
                </div>

                {/* Barra de progreso de stock */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Stock</span>
                    <span>{insumo.stock} {insumo.unidad_medida}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${getProgressColor(insumo)} h-2 rounded-full transition-all`}
                      style={{ width: `${getStockPercentage(insumo)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mínimo: {insumo.minimo_stock} {insumo.unidad_medida}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-secondary">
                  <div>
                    <p className="text-lg font-bold text-primary">${insumo.costo_unitario.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">por {insumo.unidad_medida}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditInsumo(insumo)}
                      className="p-2 bg-button/10 text-button rounded-lg hover:bg-button hover:text-white transition-all cursor-pointer"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Insumo</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Fecha Compra</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Stock Disponible</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Stock Mínimo</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Costo Unit.</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {filteredInsumos.map(insumo => (
                <tr key={insumo.id_insumo} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">📦</span>
                      <span className="font-medium text-gray-800">{insumo.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{insumo.fecha_compra}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-700">
                      {insumo.stock} {insumo.unidad_medida}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {insumo.minimo_stock} {insumo.unidad_medida}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary">${insumo.costo_unitario.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(insumo)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditInsumo(insumo)}
                        className="p-2 bg-button/10 text-button rounded-lg hover:bg-button hover:text-white transition-all"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
      {filteredInsumos.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron insumos</h3>
          <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
        </div>
      )}

      {/* Modal de edición */}
      <ModalEditInputs
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        insumo={selectedInsumo}
        onSave={handleSaveInsumo}
      />
    </div>
  );
};

export default ListInventory;
