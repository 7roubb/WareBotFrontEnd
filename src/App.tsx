import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ProductsView from './components/ProductsView';
import ShelvesView from './components/ShelvesView';
import RobotsView from './components/RobotsView';
import Sidebar from './components/Sidebar';

type View = 'dashboard' | 'products' | 'shelves' | 'robots';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsView />;
      case 'shelves':
        return <ShelvesView />;
      case 'robots':
        return <RobotsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
