import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { useCapacitor } from './src/hooks/useCapacitor';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import DataScreen from './screens/DataScreen';
import SettingsScreen from './screens/SettingsScreen';
import MobileNavigation from './components/MobileNavigation';
import SplashScreen from './components/SplashScreen';
import Logo from './components/Logo';

export interface CollectedData {
  id: string;
  asset_id: string;
  actor_id: string;
  event_type: string;
  event_date: string;
  location: string;
  metadata: string;
  created_at: string;
}

interface User {
  phone: string;
  name: string;
}

type AuthPage = 'signin' | 'signup';
type AppPage = 'home' | 'data' | 'settings';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>('signin');
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [user, setUser] = useState<User | null>(null);
  const [collectedData, setCollectedData] = useState<CollectedData[]>([]);
  
  const { deviceInfo, networkStatus, isNative, hapticFeedback, handleBackButton } = useCapacitor();

  // Gestion du bouton retour Android
  useEffect(() => {
    const cleanup = handleBackButton(() => {
      if (isAuthenticated) {
        if (currentPage !== 'home') {
          setCurrentPage('home');
          hapticFeedback();
        }
      } else {
        if (authPage === 'signup') {
          setAuthPage('signin');
          hapticFeedback();
        }
      }
    });

    return cleanup;
  }, [isAuthenticated, currentPage, authPage, handleBackButton, hapticFeedback]);

  const handleSignIn = (phone: string, password: string) => {
    // Générer un nom basé sur les derniers chiffres du téléphone
    const lastDigits = phone.replace(/\D/g, '').slice(-4);
    setUser({ phone, name: `Utilisateur ${lastDigits}` });
    setIsAuthenticated(true);
    setCurrentPage('home');
    hapticFeedback();
    toast.success('Connexion réussie', {
      description: 'Bienvenue dans Track-Collect'
    });
  };

  const handleSignUp = (name: string, phone: string, password: string) => {
    setUser({ phone, name });
    setIsAuthenticated(true);
    setCurrentPage('home');
    hapticFeedback();
    toast.success('Compte créé', {
      description: 'Bienvenue dans Track-Collect'
    });
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setAuthPage('signin');
    setUser(null);
    setCollectedData([]);
    toast.success('Déconnexion réussie', {
      description: 'À bientôt !'
    });
  };

  const handleDataSubmit = (data: Omit<CollectedData, 'id' | 'created_at'>) => {
    const newData: CollectedData = {
      ...data,
      id: `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };

    setCollectedData(prev => [newData, ...prev]);
    hapticFeedback();
    toast.success('Données enregistrées', {
      description: 'Les données ont été collectées avec succès'
    });
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
    hapticFeedback();
  };

  // Affichage du splash screen
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Pages d'authentification
  if (!isAuthenticated) {
    if (authPage === 'signin') {
      return (
        <>
          <SignInScreen 
            onSignIn={handleSignIn}
            onNavigateToSignUp={() => setAuthPage('signup')}
          />
          <Toaster />
        </>
      );
    }

    if (authPage === 'signup') {
      return (
        <>
          <SignUpScreen 
            onSignUp={handleSignUp}
            onNavigateToSignIn={() => setAuthPage('signin')}
          />
          <Toaster />
        </>
      );
    }
  }

  // Application principale avec navigation mobile
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeScreen onDataSubmit={handleDataSubmit} />;
      case 'data':
        return <DataScreen data={collectedData} />;
      case 'settings':
        return (
          <SettingsScreen 
            user={user}
            dataCount={collectedData.length}
            onSignOut={handleSignOut}
          />
        );
      default:
        return <HomeScreen onDataSubmit={handleDataSubmit} />;
    }
  };

  return (
    <div className={`min-h-screen bg-white text-black flex flex-col ${isNative ? 'w-full' : 'max-w-md mx-auto border-x border-black/10'}`}>
      {/* Status indicator pour le mode natif */}
      {isNative && (
        <div className="bg-black text-white text-xs text-center py-1">
          {deviceInfo.platform} • {networkStatus.connected ? 'En ligne' : 'Hors ligne'}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-black/10 p-4 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-center">
          <Logo size="sm" showText={true} />
        </div>
        {currentPage === 'data' && (
          <p className="text-sm text-black/60 text-center mt-1">
            {collectedData.length} enregistrement{collectedData.length > 1 ? 's' : ''}
          </p>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderCurrentPage()}
      </main>

      {/* Bottom Navigation */}
      <MobileNavigation 
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          hapticFeedback();
        }}
      />

      <Toaster />
    </div>
  );
}