import { useEffect, useState } from 'react';
import { Package, Warehouse, Bot, TrendingUp } from 'lucide-react';
import { productsApi, shelvesApi, robotsApi } from '../lib/api';

interface Stats {
  totalProducts: number;
  totalShelves: number;
  totalRobots: number;
  availableRobots: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalShelves: 0,
    totalRobots: 0,
    availableRobots: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [products, shelves, robots] = await Promise.all([
        productsApi.getAll(0, 1),
        shelvesApi.getAll(0, 1),
        robotsApi.getAll(0, 100),
      ]);

      const availableRobots = robots.data.content.filter(r => r.available).length;

      setStats({
        totalProducts: products.data.totalElements,
        totalShelves: shelves.data.totalElements,
        totalRobots: robots.data.totalElements,
        availableRobots,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-gradient-to-br from-yellow-400 to-amber-500',
      lightColor: 'bg-yellow-50',
      textColor: 'text-amber-700',
    },
    {
      title: 'Total Shelves',
      value: stats.totalShelves,
      icon: Warehouse,
      color: 'bg-gradient-to-br from-amber-400 to-orange-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-orange-700',
    },
    {
      title: 'Total Robots',
      value: stats.totalRobots,
      icon: Bot,
      color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      lightColor: 'bg-yellow-50',
      textColor: 'text-amber-700',
    },
    {
      title: 'Available Robots',
      value: stats.availableRobots,
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-amber-500 to-yellow-600',
      lightColor: 'bg-amber-50',
      textColor: 'text-yellow-700',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Overview of your warehouse operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.lightColor} ${card.textColor} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Backend Connection</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">API Endpoint</span>
            <span className="text-sm font-mono text-slate-900">http://localhost:8080</span>
          </div>
        </div>
      </div>
    </div>
  );
}
