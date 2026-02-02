import React from 'react';
import { Theme } from '../App';

interface LogoProps {
  theme: Theme;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ theme, className = "", size = 'md', collapsed = false }) => {
  const isLight = theme === 'light';
  
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} shrink-0`}>
        {/* Abstract Isometric Box / Blast Shield Logo */}
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
           <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
                 <stop offset="100%" stopColor="#ec4899" /> {/* Pink */}
              </linearGradient>
           </defs>
           
           {/* Outer Hex */}
           <path 
             d="M50 5 L95 27.5 L95 72.5 L50 95 L5 72.5 L5 27.5 Z" 
             fill="none" 
             stroke="url(#logoGradient)" 
             strokeWidth="8"
             strokeLinecap="round"
             className="opacity-100"
           />
           
           {/* Inner Pulse */}
           <circle cx="50" cy="50" r="15" fill={isLight ? "#333" : "#fff"}>
             <animate attributeName="r" values="15;20;15" dur="3s" repeatCount="indefinite" />
             <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
           </circle>

           {/* Tech Lines */}
           <path d="M50 5 L50 25" stroke={isLight ? "#333" : "#fff"} strokeWidth="4" />
           <path d="M50 95 L50 75" stroke={isLight ? "#333" : "#fff"} strokeWidth="4" />
           <path d="M95 27.5 L75 37.5" stroke={isLight ? "#333" : "#fff"} strokeWidth="4" />
           <path d="M5 72.5 L25 62.5" stroke={isLight ? "#333" : "#fff"} strokeWidth="4" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col justify-center">
          <h1 className={`font-bold tracking-tight leading-none ${textSizes[size]} ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            BLAST RADIUS
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
             <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></div>
             <span className={`text-[0.6rem] font-mono uppercase tracking-widest ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
               Architecture Sim
             </span>
          </div>
        </div>
      )}
    </div>
  );
};