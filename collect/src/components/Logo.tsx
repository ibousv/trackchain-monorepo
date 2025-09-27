import React from 'react';
import logoImage from 'figma:asset/bb076b572499108757110e00318a332a4c7e03ae.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg', 
    xl: 'text-xl'
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {/* Logo TRACKCHAIN propre - pas besoin de filtre */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <img 
          src={logoImage} 
          alt="Track-Collect Logo"
          className="w-full h-full object-contain"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-medium text-black tracking-wide ${textSizeClasses[size]}`}>
            TRACK-COLLECT
          </span>
          {size === 'xl' && (
            <span className="text-xs text-black/60 tracking-widest">
              SYSTÈME DE COLLECTE
            </span>
          )}
        </div>
      )}
    </div>
  );
}