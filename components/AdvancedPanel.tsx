
import React from 'react';
import { Theme } from '../App';
import { LogPanel } from './LogPanel';
import { DecisionTray } from './DecisionTray';
import { SimulationState, DecisionOption, LogEntry } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedPanelProps {
  isOpen: boolean;
  state: SimulationState;
  theme: Theme;
  onDecision: (option: DecisionOption) => void;
  onToggleLogs: () => void;
  logsCollapsed: boolean;
}

export const AdvancedPanel: React.FC<AdvancedPanelProps> = ({ 
    isOpen, state, theme, onDecision, onToggleLogs, logsCollapsed 
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end">
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="pointer-events-auto flex flex-col h-[40vh] bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl"
                >
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left: Logs */}
                        <div className="w-1/2 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                             <div className="p-3 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest opacity-60">
                                 System Logs & Diagnostics
                             </div>
                             <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
                                 {state.logs.slice().reverse().map(log => (
                                     <div key={log.id} className="mb-2 flex gap-2">
                                         <span className="opacity-40">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                         <span className={log.type === 'error' ? 'text-rose-500' : ''}>{log.message}</span>
                                     </div>
                                 ))}
                             </div>
                        </div>

                        {/* Right: Decisions */}
                        <div className="w-1/2 flex flex-col">
                             <div className="p-3 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest opacity-60">
                                 Configuration & Decisions
                             </div>
                             <div className="flex-1 p-4">
                                 {state.activeDecision ? (
                                     <DecisionTray decision={state.activeDecision} theme={theme} onOptionSelect={onDecision} />
                                 ) : (
                                     <div className="flex items-center justify-center h-full text-sm opacity-40 italic">
                                         No pending configuration changes.
                                     </div>
                                 )}
                             </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};
