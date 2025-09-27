import React, { useEffect, useState } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

export default function SplashScreen({ onFinish, duration = 2500 }: SplashScreenProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      // Délai supplémentaire pour l'animation de sortie
      setTimeout(onFinish, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <div className={`
      fixed inset-0 bg-white z-50 flex flex-col items-center justify-center
      transition-all duration-300 ease-in-out
      ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
    `}>
      {/* Logo animé */}
      <div className={`
        transform transition-all duration-1000 ease-out
        ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        <Logo size="xl" showText={true} />
      </div>

      {/* Animation de chargement */}
      <div className="mt-8 w-24">
        <div className="h-1 bg-black/10 rounded-full overflow-hidden">
          <div 
            className={`
              h-full bg-black rounded-full transition-all duration-2000 ease-out
              ${isAnimating ? 'w-full' : 'w-0'}
            `}
          />
        </div>
      </div>

      {/* Version */}
      <div className={`
        mt-6 text-xs text-black/40 transition-all duration-1000 delay-500
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
      `}>
        Version 1.0.0
      </div>
    </div>
  );
}