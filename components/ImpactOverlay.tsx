
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveImpactMetrics } from '../types';
import { Theme } from '../App';
import { DollarSign, Users, AlertTriangle, TrendingDown, Timer } from 'lucide-react';

interface ImpactOverlayProps {
  metrics: LiveImpactMetrics;
  visible: boolean;
  theme: Theme;
}

export const ImpactOverlay: React.FC<ImpactOverlayProps> = ({ metrics, visible, theme }) => {
  if (!visible) return null;

  const isLight = theme === 'light';
  const bgClass = isLight ? 'bg-white/90 border-slate-200 text-slate-800' : 'bg-black/80 border-slate-800 text-slate-100';

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {visible && (
          <>
            {/* Left Edge: User Impact */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className={`absolute top-1/2 -translate-y-1/2 left-4 p-4 rounded-xl border backdrop-blur-md shadow-2xl flex flex-col items-center gap-2 ${bgClass}`}
            >
              <div className="p-2 rounded-full bg-rose-500/20 text-rose-500 animate-pulse">
                <Users size={24} />
              </div>
              <div className="text-center">
                 <div className="text-2xl font-mono font-bold">{metrics.usersImpacted.toLocaleString()}</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Active Users Affected</div>
              </div>
            </motion.div>

            {/* Right Edge: Revenue Impact */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`absolute top-1/2 -translate-y-1/2 right-4 p-4 rounded-xl border backdrop-blur-md shadow-2xl flex flex-col items-center gap-2 ${bgClass}`}
            >
              <div className="p-2 rounded-full bg-amber-500/20 text-amber-500 animate-pulse">
                 <DollarSign size={24} />
              </div>
              <div className="text-center">
                 <div className="text-2xl font-mono font-bold text-rose-500">-${metrics.revenueLoss.toLocaleString()}</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Revenue Loss</div>
              </div>
            </motion.div>

            {/* Top Right: SLA Countdown */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className={`absolute top-24 right-4 p-3 rounded-lg border backdrop-blur-md shadow-lg flex items-center gap-3 ${bgClass}`}
            >
               <div className={`p-1.5 rounded bg-slate-100 dark:bg-slate-800 ${metrics.slaBreachCountdown < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`}>
                 <Timer size={16} />
               </div>
               <div>
                  <div className={`text-sm font-mono font-bold ${metrics.slaBreachCountdown < 10 ? 'text-rose-500' : ''}`}>
                      00:{metrics.slaBreachCountdown.toString().padStart(2, '0')}
                  </div>
                  <div className="text-[9px] font-bold uppercase opacity-50">SLA Breach Timer</div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
