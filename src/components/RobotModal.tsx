import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { robotsApi, Robot } from '../lib/api';

interface RobotModalProps {
  robot: Robot | null;
  onClose: () => void;
}

const MP400_IMAGE_URL = 'https://www.neobotix-robots.com/fileadmin/_processed_/c/8/csm_MP-400_front-neu_ac5ce9b8de.png';

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
      alert('Failed to save robot. Please check all required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 border-b border-orange-300 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {robot ? 'Edit Robot' : 'Add Robot'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 flex items-center justify-center">
            <img
              src={MP400_IMAGE_URL}
              alt="Neobotix MP-400"
              className="h-48 object-contain"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%23475569" text-anchor="middle" dominant-baseline="middle"%3ENeobotix MP-400%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">Neobotix MP-400</p>
            <p className="text-xs text-slate-500">Mobile Platform Robot</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Robot Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., MP400-Unit-01"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="IDLE">Idle</option>
                <option value="BUSY">Busy</option>
                <option value="CHARCHING">Charging</option>
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              placeholder="Enter shelf ID if currently assigned"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Leave empty if robot is not currently assigned to a shelf
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-1">Robot Specifications</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Payload capacity: 400 kg</li>
              <li>• Max speed: 1.5 m/s</li>
              <li>• Navigation: Autonomous with SLAM</li>
              <li>• Safety: 360° laser scanners</li>
            </ul>
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : robot ? 'Update Robot' : 'Create Robot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
