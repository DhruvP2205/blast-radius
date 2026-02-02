
import React, { useState } from 'react';
import { SimulationState, ActiveIncidentState } from '../types';
import { Theme } from '../App';
import { 
  Users, 
  Activity, 
  DollarSign, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Terminal,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImpactBarProps {
  state: SimulationState;
  activeIncident: ActiveIncidentState | null;
  theme: Theme;
  onToggleAdvanced: () => void;
  advancedOpen: boolean;
}

export const ImpactBar: React.FC<ImpactBarProps> = ({ state, activeIncident, theme, onToggleAdvanced, advancedOpen }) => {
  const isLight = theme === 'light';
  const bgClass = isLight ? 'bg-white/90 border-slate-200 text-slate-800' : 'bg-[#18181b]/90 border-slate-800 text-slate-100';

  const usersAffected = activeIncident ? activeIncident.metrics.usersImpacted : 0;
  const revenueLoss = activeIncident ? activeIncident.metrics.revenueLoss : 0;
  
  return (
    <div className={`absolute top-0 left-0 right-0 z-40 border-b backdrop-blur-md shadow-sm transition-colors duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        
        {/* Left: System Health */}
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${state.stability > 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                 <ShieldCheck size={20} />
              </div>
              <div>
                 <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">System Health</div>
                 <div className="font-mono font-bold text-sm">{Math.floor(state.stability)}%</div>
              </div>
           </div>

           <div className="h-8 w-px bg-current opacity-10 hidden md:block"></div>

           <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${usersAffected > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-500'}`}>
                 <Users size={20} />
              </div>
              <div>
                 <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Users Impacted</div>
                 <div className="font-mono font-bold text-sm">
                    {activeIncident ? Math.floor(usersAffected).toLocaleString() : 'Nominal'}
                 </div>
              </div>
           </div>
        </div>

        {/* Center: Incident Status (If active) */}
        <AnimatePresence>
          {activeIncident && (
             <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20"
             >
                <Activity size={16} className="animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wide">Incident In Progress</span>
                <span className="text-xs font-mono ml-2">
                   {Math.floor((Date.now() - activeIncident.startTime)/1000)}s
                </span>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Revenue Impact Only */}
        <div className="flex items-center gap-3 text-right">
           <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Revenue Impact</div>
              <div className={`font-mono font-bold text-sm ${revenueLoss > 0 ? 'text-rose-500' : ''}`}>
                 {revenueLoss > 0 ? `-$${Math.floor(revenueLoss).toLocaleString()}` : 'Stable'}
              </div>
           </div>
           <div className={`p-2 rounded-lg ${revenueLoss > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <DollarSign size={20} />
           </div>
        </div>
      </div>
    </div>
  );
};
