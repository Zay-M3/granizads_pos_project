import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UsuarioFormData } from '@utils/admin/CreateCashierUtils';
import ConfirmAction from '@components/ConfirmAction';

const ListCashier = () => {
  const navigate = useNavigate();
  const [cajeros, setCajeros] = useState<UsuarioFormData[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRol, setSelectedRol] = useState('all');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [cajeroToDelete, setCajeroToDelete] = useState<UsuarioFormData | null>(null);

  // TODO: Cargar cajeros desde la API
  useEffect(() => {
    const fetchCajeros = async () => {
      try {
        // const response = await fetch('/api/usuarios');
        // const data = await response.json();
        // setCajeros(data);
      } catch (error) {
        console.error('Error al cargar cajeros:', error);
      }
    };
    fetchCajeros();
  }, []);

  // Filtrar cajeros
  const filteredCajeros = cajeros.filter(cajero => {
    const matchesSearch = cajero.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cajero.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = selectedRol === 'all' || cajero.rol === selectedRol;
    return matchesSearch && matchesRol;
  });

  // Obtener badge de rol
  const getRolBadge = (rol: string) => {
    if (rol === 'admin') {
      return <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">Admin</span>;
    }
    return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Cajero</span>;
  };

  // Calcular edad
  const calcularEdad = (fechaNacimiento?: string) => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Abrir modal de confirmación
  const handleDeleteClick = (cajero: UsuarioFormData) => {
    setCajeroToDelete(cajero);
    setIsConfirmOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = () => {
    if (cajeroToDelete) {
      // TODO: Eliminar del backend
      // await fetch(`/api/usuarios/${cajeroToDelete.id_usuario}`, { method: 'DELETE' });
      setCajeros(prevCajeros => 
        prevCajeros.filter(c => c.id_usuario !== cajeroToDelete.id_usuario)
      );
      console.log('Cajero eliminado:', cajeroToDelete.id_usuario);
    }
  };

  // Cerrar modal
  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setCajeroToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-dark">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">Administra los usuarios del sistema</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/cajeros/crear')}
          className="bg-linear-to-r from-button to-button-hover text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Agregar Usuario</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Usuarios</p>
          <p className="text-2xl font-bold text-primary-dark mt-1">{cajeros.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Administradores</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {cajeros.filter(c => c.rol === 'admin').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Cajeros</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {cajeros.filter(c => c.rol === 'cajero').length}
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
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-button"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filtro por rol */}
            <select 
              value={selectedRol}
              onChange={(e) => setSelectedRol(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="cajero">Cajeros</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de cajeros */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Usuario</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Contacto</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Edad</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rol</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {filteredCajeros.map(cajero => (
              <tr key={cajero.id_usuario} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-linear-to-br from-primary/20 to-button/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-button" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{cajero.nombre}</p>
                      <p className="text-sm text-gray-500">ID: {cajero.id_usuario}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-800 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {cajero.correo}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {cajero.telefono}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-800">{cajero.fecha_nacimiento ? calcularEdad(cajero.fecha_nacimiento) : 0} años</p>
                    <p className="text-xs text-gray-500">{cajero.fecha_nacimiento || '---'}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getRolBadge(cajero.rol)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 bg-button/10 text-button rounded-lg hover:bg-button hover:text-white transition-all"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                      title="Eliminar"
                      onClick={() => handleDeleteClick(cajero)}
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

      {/* Sin resultados */}
      {filteredCajeros.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron usuarios</h3>
          <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmAction
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar a ${cajeroToDelete?.nombre}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default ListCashier;
