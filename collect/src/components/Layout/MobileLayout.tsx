import { Home, Settings, User, Database } from 'lucide-react';
import { Button } from '../ui/button';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
}

export function MobileLayout({ children, currentPage, onNavigate, isAuthenticated }: MobileLayoutProps) {
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-black">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="border-b border-black/10 p-4">
        <h1 className="text-xl font-medium text-center">Track-Collect</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="border-t border-black/10 bg-white">
        <div className="grid grid-cols-3 h-16">
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center space-y-1 rounded-none h-full ${
              currentPage === 'home' ? 'bg-black text-white' : 'text-black hover:bg-black/5'
            }`}
            onClick={() => onNavigate('home')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Accueil</span>
          </Button>

          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center space-y-1 rounded-none h-full ${
              currentPage === 'data' ? 'bg-black text-white' : 'text-black hover:bg-black/5'
            }`}
            onClick={() => onNavigate('data')}
          >
            <Database className="h-5 w-5" />
            <span className="text-xs">Données</span>
          </Button>

          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center space-y-1 rounded-none h-full ${
              currentPage === 'settings' ? 'bg-black text-white' : 'text-black hover:bg-black/5'
            }`}
            onClick={() => onNavigate('settings')}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Paramètres</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}