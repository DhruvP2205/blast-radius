
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MitigationStrategy } from '../types';
import { Theme } from '../App';
import { Zap, DollarSign, Shield, Clock } from 'lucide-react';

interface MitigationDecisionProps {
  visible: boolean;
  onSelect: (strategy: MitigationStrategy) => void;
  theme: Theme;
}

export const MitigationDecision: React.FC<MitigationDecisionProps> = ({ visible, onSelect, theme }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const isLight = theme === 'light';

  useEffect(() => {
    if (visible) {
      setTimeLeft(5);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Don't auto-select here, let parent handle timeout to "NONE"
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-sm">
       <motion.div
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         exit={{ scale: 0.9, opacity: 0 }}
         className={`w-full max-w-2xl p-6 rounded-2xl shadow-2xl border-2 overflow-hidden relative
            ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'}
         `}
       >
          {/* Timer Bar */}
          <div className="absolute top-0 left-0 h-1.5 bg-indigo-500 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 5) * 100}%` }} />

          <div className="text-center mb-6">
             <div className="flex items-center justify-center gap-2 mb-2 text-rose-500">
                <Clock className="animate-pulse" />
                <span className="font-mono font-bold">CRITICAL DECISION REQUIRED</span>
             </div>
             <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Select Mitigation Strategy</h2>
             <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Auto-remediation will proceed with default parameters in {timeLeft}s
             </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <button
               onClick={() => onSelect('SPEED')}
               className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02]
                  ${isLight 
                    ? 'border-blue-100 bg-blue-50 hover:border-blue-500' 
                    : 'border-blue-900/30 bg-blue-900/10 hover:border-blue-500'}
               `}
             >
                <div className="p-2 w-fit rounded-lg bg-blue-500 text-white mb-3">
                   <Zap size={20} />
                </div>
                <div className="font-bold text-sm mb-1">Prioritize Speed</div>
                <div className="text-[10px] opacity-70">
                   Recover faster. Higher cost burn. Risk of data inconsistency.
                </div>
             </button>

             <button
               onClick={() => onSelect('COST')}
               className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02]
                  ${isLight 
                    ? 'border-emerald-100 bg-emerald-50 hover:border-emerald-500' 
                    : 'border-emerald-900/30 bg-emerald-900/10 hover:border-emerald-500'}
               `}
             >
                <div className="p-2 w-fit rounded-lg bg-emerald-500 text-white mb-3">
                   <DollarSign size={20} />
                </div>
                <div className="font-bold text-sm mb-1">Protect Budget</div>
                <div className="text-[10px] opacity-70">
                   Reduce burn rate. Slower recovery. Users impacted longer.
                </div>
             </button>

             <button
               onClick={() => onSelect('STABILITY')}
               className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02]
                  ${isLight 
                    ? 'border-purple-100 bg-purple-50 hover:border-purple-500' 
                    : 'border-purple-900/30 bg-purple-900/10 hover:border-purple-500'}
               `}
             >
                <div className="p-2 w-fit rounded-lg bg-purple-500 text-white mb-3">
                   <Shield size={20} />
                </div>
                <div className="font-bold text-sm mb-1">Ensure Consistency</div>
                <div className="text-[10px] opacity-70">
                   Zero data loss. High latency. Moderate cost.
                </div>
             </button>
          </div>
       </motion.div>
    </div>
  );
};
