import React from 'react';
import { SimulationState, DecisionOption } from '../types';
import { Theme } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  DollarSign, 
  Clock,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Logo } from './Logo';

interface HUDProps {
  state: SimulationState;
  budgetHistory: { time: number; value: number }[];
  theme: Theme;
  onDecision: (option: DecisionOption) => void;
}

export const SimulationHUD: React.FC<HUDProps> = ({ state, theme, onDecision }) => {
  const { budget, activeDecision, logs, stability } = state;
  const [mobileExpanded, setMobileExpanded] = React.useState(false);

  const bgClass = theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-[#1e1e1e]/95 border-slate-800';
  const textClass = theme === 'light' ? 'text-slate-800' : 'text-slate-200';
  const subTextClass = theme === 'light' ? 'text-slate-500' : 'text-slate-500';
  const borderClass = theme === 'light' ? 'border-slate-200' : 'border-slate-800';

  // Desktop Sidebar Layout
  const DesktopLayout = () => (
    <div className={`hidden md:flex flex-col w-[320px] h-full border-l shadow-xl backdrop-blur-sm ${bgClass} ${borderClass}`}>
       {/* Branding */}
       <div className={`p-4 border-b ${borderClass}`}>
          <Logo theme={theme} size="md" />
       </div>

       {/* Status Header */}
       <div className={`p-4 border-b ${borderClass}`}>
          <div className="flex items-center justify-between mb-2">
             <h2 className={`text-xs font-bold uppercase tracking-widest ${subTextClass}`}>System Status</h2>
             <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
               ${stability > 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
               {stability > 80 ? 'Nominal' : 'Degraded'}
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
             <div>
                <div className={`text-[10px] font-mono uppercase ${subTextClass}`}>Budget</div>
                <div className={`text-lg font-mono font-medium flex items-center ${textClass}`}>
                   <DollarSign size={14} className="mr-0.5 opacity-50"/>
                   {Math.floor(budget).toLocaleString()}
                </div>
             </div>
             <div>
                <div className={`text-[10px] font-mono uppercase ${subTextClass}`}>Uptime</div>
                <div className={`text-lg font-mono font-medium flex items-center ${textClass}`}>
                   <Clock size={14} className="mr-1 opacity-50"/>
                   {new Date(Date.now()).getMinutes()}:{new Date(Date.now()).getSeconds().toString().padStart(2, '0')}
                </div>
             </div>
          </div>
       </div>

       {/* Decision / Action Area */}
       <div className={`flex-1 overflow-y-auto p-4 flex flex-col gap-4 border-b ${borderClass}`}>
           <h2 className={`text-xs font-bold uppercase tracking-widest mb-1 ${subTextClass}`}>Action Required</h2>
           <DecisionPanel />
       </div>

       {/* Logs */}
       <div className="h-1/3 flex flex-col min-h-[150px]">
          <div className={`p-2 px-4 border-b flex items-center gap-2 ${theme === 'light' ? 'bg-slate-50' : 'bg-black/20'} ${borderClass}`}>
             <Terminal size={12} className={subTextClass} />
             <span className={`text-[10px] font-bold uppercase tracking-widest ${subTextClass}`}>Event Log</span>
          </div>
          <LogPanel />
       </div>
    </div>
  );

  // Mobile Bottom Sheet Layout
  const MobileLayout = () => (
    <div className={`md:hidden absolute bottom-0 left-0 right-0 flex flex-col border-t shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 z-50 ${bgClass} ${borderClass}
      ${mobileExpanded ? 'h-[80vh]' : 'h-[160px]'}`}>
        
        {/* Mobile Handle / Status Bar */}
        <div 
          className={`flex items-center justify-between p-3 border-b cursor-pointer active:bg-black/5 ${borderClass}`}
          onClick={() => setMobileExpanded(!mobileExpanded)}
        >
           <div className="flex items-center gap-3">
              <Logo theme={theme} size="sm" collapsed />
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex gap-4">
                 <div className={`flex flex-col`}>
                    <span className="text-[9px] uppercase opacity-50 font-bold">Stability</span>
                    <span className={`text-xs font-mono font-bold ${stability > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                       {Math.floor(stability)}%
                    </span>
                 </div>
                 <div className={`flex flex-col`}>
                    <span className="text-[9px] uppercase opacity-50 font-bold">Budget</span>
                    <span className={`text-xs font-mono font-bold ${textClass}`}>${Math.floor(budget)}</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
              {activeDecision && !mobileExpanded && (
                 <div className="flex items-center gap-1 text-amber-500 animate-pulse">
                    <AlertTriangle size={14} />
                    <span className="text-[10px] font-bold uppercase">Action</span>
                 </div>
              )}
              {mobileExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
           </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {activeDecision && (
             <div className="mb-4">
               <h2 className={`text-xs font-bold uppercase tracking-widest mb-2 ${subTextClass}`}>Action Required</h2>
               <DecisionPanel />
             </div>
           )}
           
           <div>
              <h2 className={`text-xs font-bold uppercase tracking-widest mb-2 ${subTextClass}`}>Event Log</h2>
              <div className="max-h-[200px] overflow-y-auto border rounded p-2 text-[10px] font-mono">
                 <LogPanel />
              </div>
           </div>
        </div>
    </div>
  );

  const DecisionPanel = () => (
     <AnimatePresence mode="wait">
        {activeDecision ? (
           <motion.div 
             key="decision"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="flex flex-col gap-3"
           >
              <div className={`p-3 rounded border ${theme === 'light' ? 'bg-amber-50 border-amber-200' : 'bg-amber-950/20 border-amber-900/30'}`}>
                 <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="text-amber-500" />
                    <span className={`text-xs font-bold ${theme === 'light' ? 'text-amber-900' : 'text-amber-500'}`}>{activeDecision.title}</span>
                 </div>
                 <p className={`text-[11px] leading-relaxed ${theme === 'light' ? 'text-amber-800' : 'text-amber-400'}`}>
                    {activeDecision.description}
                 </p>
              </div>

              <div className="flex flex-col gap-2 mt-1">
                 {activeDecision.options.map(opt => (
                    <button 
                       key={opt.id}
                       onClick={() => onDecision(opt)}
                       className={`group text-left p-3 rounded border transition-colors relative overflow-hidden
                          ${theme === 'light' 
                             ? 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50' 
                             : 'bg-transparent border-slate-700 hover:border-slate-500 hover:bg-slate-800'}`}
                    >
                       <div className={`text-[11px] font-semibold mb-0.5 ${textClass}`}>{opt.label}</div>
                       <div className={`text-[10px] ${subTextClass}`}>{opt.description}</div>
                       <div className={`text-[9px] mt-1.5 font-mono uppercase tracking-tight opacity-70 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Trade-off: {opt.tradeOff}
                       </div>
                    </button>
                 ))}
              </div>
           </motion.div>
        ) : (
           <motion.div 
             key="empty"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className={`flex flex-col items-center justify-center h-24 border-2 border-dashed rounded opacity-50
                ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}
           >
              <CheckCircle2 size={20} className="mb-2 opacity-50" />
              <span className="text-[10px] uppercase font-bold tracking-widest">System Stable</span>
           </motion.div>
        )}
     </AnimatePresence>
  );

  const LogPanel = () => (
     <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[10px]">
        {logs.slice().reverse().map(log => (
           <div key={log.id} className="flex gap-2">
              <span className={`shrink-0 opacity-40 ${textClass}`}>
                 {new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}
              </span>
              <span className={`${
                 log.type === 'error' ? 'text-red-500' :
                 log.type === 'warn' ? 'text-amber-500' :
                 subTextClass
              }`}>
                 {log.message}
              </span>
           </div>
        ))}
     </div>
  );

  return (
    <>
      <DesktopLayout />
      <MobileLayout />
    </>
  );
};