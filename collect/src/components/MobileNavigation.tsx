import React from 'react';
import { Home, Database, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface MobileNavigationProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'data' | 'settings') => void;
}

export default function MobileNavigation({ currentPage, onNavigate }: MobileNavigationProps) {
  return (
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
  );
}