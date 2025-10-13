import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Bot, ChevronLeft, ChevronRight } from 'lucide-react';
import { robotsApi, Robot } from '../lib/api';
import RobotModal from './RobotModal';

export default function RobotsView() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);

  useEffect(() => {
    loadRobots();
  }, [currentPage]);

  const loadRobots = async () => {
    try {
      setLoading(true);
      const response = await robotsApi.getAll(currentPage, 10);
      setRobots(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to load robots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this robot?')) return;

    try {
      await robotsApi.delete(id);
      loadRobots();
    } catch (error) {
      console.error('Failed to delete robot:', error);
    }
  };

  const handleEdit = (robot: Robot) => {
    setSelectedRobot(robot);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedRobot(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedRobot(null);
    loadRobots();
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'IDLE':
        return 'bg-green-100 text-green-700';
      case 'BUSY':
        return 'bg-amber-100 text-amber-700';
      case 'CHARCHING':
      case 'CHARGING':
        return 'bg-blue-100 text-blue-700';
      case 'MAINTENANCE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status.toUpperCase() === 'CHARCHING') return 'Charging';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (loading && robots.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Robots</h1>
          <p className="text-slate-600 mt-2">Manage warehouse robots and their assignments</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-amber-600 shadow-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Robot
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Robot</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Availability</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Current Shelf</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {robots.map((robot) => (
                <tr key={robot.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{robot.name}</p>
                        <p className="text-sm text-slate-500">{robot.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(robot.status)}`}>
                      {getStatusLabel(robot.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        robot.available
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {robot.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-900">
                    {robot.currentShelfId ? (
                      <span className="font-mono">{robot.currentShelfId.substring(0, 8)}</span>
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(robot)}
                        className="p-2 text-amber-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(robot.id)}
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
        <RobotModal
          robot={selectedRobot}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
