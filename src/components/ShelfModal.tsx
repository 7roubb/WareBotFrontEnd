import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { shelvesApi, Shelf } from '../lib/api';

interface ShelfModalProps {
  shelf: Shelf | null;
  onClose: () => void;
}

export default function ShelfModal({ shelf, onClose }: ShelfModalProps) {
  const [formData, setFormData] = useState({
    warehouseId: '',
    xCoord: 0,
    yCoord: 0,
    level: 0,
    status: 'available',
    available: true,
    productIds: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shelf) {
      setFormData({
        warehouseId: shelf.warehouseId,
        xCoord: shelf.xCoord,
        yCoord: shelf.yCoord,
        level: shelf.level,
        status: shelf.status,
        available: shelf.available,
        productIds: shelf.productIds?.join(', ') || '',
      });
    }
  }, [shelf]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...(shelf && { id: shelf.id }),
        warehouseId: formData.warehouseId,
        xCoord: formData.xCoord,
        yCoord: formData.yCoord,
        level: formData.level,
        status: formData.status,
        available: formData.available,
        productIds: formData.productIds
          .split(',')
          .map(id => id.trim())
          .filter(Boolean),
      };

      if (shelf) {
        await shelvesApi.update(payload);
      } else {
        await shelvesApi.create(payload);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save shelf:', error);
      alert('Failed to save shelf. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-yellow-400 to-amber-500 border-b border-amber-300 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {shelf ? 'Edit Shelf' : 'Add Shelf'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-900" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Warehouse ID
            </label>
            <input
              type="text"
              required
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                X Coordinate
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.xCoord}
                onChange={(e) => setFormData({ ...formData, xCoord: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Y Coordinate
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.yCoord}
                onChange={(e) => setFormData({ ...formData, yCoord: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Level
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="available">Available</option>
                <option value="in-use">In Use</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Available
              </label>
              <select
                value={formData.available ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product IDs (comma-separated)
            </label>
            <input
              type="text"
              value={formData.productIds}
              onChange={(e) => setFormData({ ...formData, productIds: e.target.value })}
              placeholder="prod1, prod2, prod3"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : shelf ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
