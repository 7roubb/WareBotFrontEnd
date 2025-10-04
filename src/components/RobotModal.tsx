import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { robotsApi, Robot } from '../lib/api';

interface RobotModalProps {
  robot: Robot | null;
  onClose: () => void;
}

export default function RobotModal({ robot, onClose }: RobotModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'IDLE',
    available: true,
    currentShelfId: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (robot) {
      setFormData({
        name: robot.name,
        status: robot.status,
        available: robot.available,
        currentShelfId: robot.currentShelfId || '',
      });
    }
  }, [robot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...(robot && { id: robot.id }),
        name: formData.name,
        status: formData.status,
        available: formData.available,
        currentShelfId: formData.currentShelfId || undefined,
      };

      if (robot) {
        await robotsApi.update(payload);
      } else {
        await robotsApi.create(payload);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save robot:', error);
      alert('Failed to save robot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {robot ? 'Edit Robot' : 'Add Robot'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Robot Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="IDLE">Idle</option>
                <option value="BUSY">Busy</option>
                <option value="CHARGING">Charging</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Available
              </label>
              <select
                value={formData.available ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Shelf ID (Optional)
            </label>
            <input
              type="text"
              value={formData.currentShelfId}
              onChange={(e) => setFormData({ ...formData, currentShelfId: e.target.value })}
              placeholder="Enter shelf ID if assigned"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : robot ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
