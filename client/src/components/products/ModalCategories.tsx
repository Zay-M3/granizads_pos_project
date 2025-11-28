import { useState } from "react";

interface Category {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
}

interface ModalCategoriesProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
}

const ModalCategories = ({ isOpen, onClose, onSave }: ModalCategoriesProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim()) {
      const newCategory: Category = {
        id_categoria: Date.now(), // Temporal, la API asignará el ID real
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
      };
      onSave(newCategory);
      setNombre("");
      setDescripcion("");
    }
  };

  const handleClose = () => {
    setNombre("");
    setDescripcion("");
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Nueva Categoría</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Bebidas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe la categoría..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Crear Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCategories;
