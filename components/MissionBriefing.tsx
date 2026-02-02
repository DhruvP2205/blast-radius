
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Terminal, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Server,
  Eye,
  Cpu
} from 'lucide-react';
import { Theme } from '../App';
import { Logo } from './Logo';

interface MissionBriefingProps {
  onEnter: () => void;
  theme: Theme;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({ onEnter, theme }) => {
  const isLight = theme === 'light';
  const [isReady, setIsReady] = useState(false);

  // Simulated "boot sequence" delay for the button
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const bgClass = isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#09090b] text-white';
  const accentColor = isLight ? 'text-indigo-600' : 'text-indigo-400';
  const subtleText = isLight ? 'text-slate-500' : 'text-zinc-500';

  return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-inter selection:bg-indigo-500/30 ${bgClass}`}>
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-multiply opacity-50 dark:opacity-20`} />
          <div 
            className="absolute inset-0 opacity-[0.03]" 
            style={{ 
              backgroundImage: `linear-gradient(${isLight ? '#000' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#000' : '#fff'} 1px, transparent 1px)`, 
              backgroundSize: '60px 60px' 
            }} 
          />
      </div>

      {/* --- Top Status Strip --- */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-8 left-0 right-0 flex justify-center items-center gap-6 md:gap-12 pointer-events-none"
      >
          <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${subtleText}`}>System Stable</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${subtleText}`}>Production Env</span>
          </div>
          <div className="flex items-center gap-2">
              <Activity size={12} className="text-blue-500 animate-pulse" />
              <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${subtleText}`}>Live Traffic</span>
          </div>
      </motion.div>

      {/* --- Main Content Canvas --- */}
      <div className="relative z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center">
        
        {/* Role Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`mb-8 inline-flex items-center gap-3 px-3 py-1.5 rounded-full border backdrop-blur-md
            ${isLight ? 'bg-white/60 border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'}
          `}
        >
            <span className={`text-[10px] uppercase font-bold tracking-widest ${subtleText}`}>Role Assigned</span>
            <div className={`h-3 w-px ${isLight ? 'bg-slate-300' : 'bg-white/20'}`} />
            <span className={`text-xs font-bold tracking-wide ${isLight ? 'text-slate-800' : 'text-white'}`}>Platform Engineer</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6"
        >
          You Are Now <br />
          <span className={`relative inline-block ${accentColor}`}>
             On Call.
             <div className="absolute -inset-1 bg-indigo-500/20 blur-xl -z-10 animate-pulse" />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-12 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}
        >
          Every decision you make will ripple across real users, real latency, and real cost.
        </motion.p>

        {/* Capability Tags */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.6 }}
           className="flex gap-4 mb-16"
        >
            {[
              { icon: Zap, label: 'Break' },
              { icon: Eye, label: 'Observe' },
              { icon: ShieldAlert, label: 'Recover' }
            ].map((cap, i) => (
               <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isLight ? 'border-slate-200 bg-white/50' : 'border-white/10 bg-white/5'}`}>
                  <cap.icon size={14} className={isLight ? 'text-slate-500' : 'text-zinc-400'} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>{cap.label}</span>
               </div>
            ))}
        </motion.div>

        {/* Visual Pulse Strip (Abstract Infrastructure) */}
        <motion.div 
           initial={{ scaleX: 0, opacity: 0 }}
           animate={{ scaleX: 1, opacity: 1 }}
           transition={{ delay: 0.7, duration: 1 }}
           className="w-full max-w-lg h-1 mb-16 relative overflow-hidden rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"
        >
           <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 blur-sm animate-[shimmer_2s_infinite]" />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isReady ? 1 : 0.5, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
           <button
             onClick={isReady ? onEnter : undefined}
             disabled={!isReady}
             className={`
               group relative flex items-center gap-3 px-10 py-5 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300
               ${isReady 
                 ? isLight 
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:-translate-y-1' 
                    : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:-translate-y-1'
                 : 'bg-zinc-500/20 text-zinc-500 cursor-wait'
               }
             `}
           >
             <span className="relative z-10 flex items-center gap-3">
                {isReady ? <Terminal size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />}
                {isReady ? 'Enter Live Simulation' : 'Establishing Connection...'}
                {isReady && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
             </span>
           </button>

           {isReady && (
              <button className={`text-[10px] font-bold uppercase tracking-widest hover:underline opacity-40 hover:opacity-100 transition-opacity ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                 View System Snapshot
              </button>
           )}
        </motion.div>

      </div>

      {/* --- Footer Branding --- */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-30 pointer-events-none">
          <Logo theme={theme} size="sm" collapsed />
      </div>

    </div>
  );
};
