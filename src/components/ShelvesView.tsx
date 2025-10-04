import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Warehouse, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { shelvesApi, Shelf } from '../lib/api';
import ShelfModal from './ShelfModal';

export default function ShelvesView() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);

  useEffect(() => {
    loadShelves();
  }, [currentPage]);

  const loadShelves = async () => {
    try {
      setLoading(true);
      const response = await shelvesApi.getAll(currentPage, 10);
      setShelves(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to load shelves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shelf?')) return;

    try {
      await shelvesApi.delete(id);
      loadShelves();
    } catch (error) {
      console.error('Failed to delete shelf:', error);
    }
  };

  const handleEdit = (shelf: Shelf) => {
    setSelectedShelf(shelf);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedShelf(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedShelf(null);
    loadShelves();
  };

  if (loading && shelves.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Shelves</h1>
          <p className="text-slate-600 mt-2">Manage warehouse shelf locations</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-amber-600 shadow-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Shelf
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Shelf ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Warehouse</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Coordinates</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Products</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {shelves.map((shelf) => (
                <tr key={shelf.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Warehouse className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{shelf.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900">
                    {shelf.warehouseId.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-slate-900">
                      ({shelf.xCoord}, {shelf.yCoord})
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-900">{shelf.level}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">{shelf.productIds?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        shelf.available
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {shelf.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(shelf)}
                        className="p-2 text-amber-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(shelf.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Page {currentPage + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ShelfModal
          shelf={selectedShelf}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
