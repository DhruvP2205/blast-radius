
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Theme } from '../App';
import { 
  Terminal, 
  Info, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogPanelProps {
  logs: LogEntry[];
  theme: Theme;
  collapsed: boolean;
  onToggle: () => void;
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs, theme, collapsed, onToggle }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const bgClass = isLight ? 'bg-white/80 border-r border-slate-200 backdrop-blur-md' : 'bg-[#0f172a]/90 border-r border-slate-800 backdrop-blur-md';
  const headerClass = isLight ? 'bg-slate-50/80 border-b border-slate-200' : 'bg-[#1e293b]/50 border-b border-slate-800';

  const getLogStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' };
      case 'warn': return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case 'success': return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'system': return { icon: Cpu, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
      default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' };
    }
  };

  // Custom Scrollbar Styles
  const scrollbarClass = `
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:rounded-full
    ${isLight 
      ? '[&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400' 
      : '[&::-webkit-scrollbar-thumb]:bg-slate-700 hover:[&::-webkit-scrollbar-thumb]:bg-slate-600'}
  `;

  return (
    <div className={`relative flex flex-col h-full transition-all duration-300 shadow-xl z-40 ${bgClass} ${collapsed ? 'w-12' : 'w-80'}`}>
      
      {/* --- Header --- */}
      <div className={`flex items-center justify-between p-3 h-14 shrink-0 ${headerClass}`}>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className={`p-1.5 rounded-md ${isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400'}`}>
                 <Terminal size={14} />
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                  System Log
                </span>
                <span className={`text-[9px] font-mono leading-none mt-1 flex items-center gap-1.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE STREAM
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={onToggle} 
          className={`p-1.5 rounded-md transition-colors ml-auto
            ${isLight 
              ? 'hover:bg-slate-200 text-slate-400 hover:text-slate-600' 
              : 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'}`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* --- Log Stream --- */}
      {!collapsed ? (
        <div 
          ref={scrollRef} 
          className={`flex-1 overflow-y-auto p-2 space-y-2 ${scrollbarClass}`}
        >
          {logs.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center opacity-30 gap-2">
                <Terminal size={24} />
                <span className="text-[10px] uppercase font-mono">Awaiting Events...</span>
             </div>
          )}

          {logs.map((log) => {
            const style = getLogStyle(log.type);
            const Icon = style.icon;
            
            return (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10, scale: 0.98 }} 
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className={`group flex gap-3 p-2.5 rounded-lg border transition-all hover:bg-black/5 dark:hover:bg-white/5
                  ${isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/50 border-slate-800/50'}
                  ${log.type === 'error' ? (isLight ? 'border-l-rose-500 border-l-2' : 'border-l-rose-500 border-l-2 bg-rose-950/10') : ''}
                `}
              >
                {/* Icon Column */}
                <div className={`mt-0.5 shrink-0 w-6 h-6 flex items-center justify-center rounded bg-opacity-50 ${style.bg} ${style.color}`}>
                   <Icon size={14} strokeWidth={2.5} />
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${style.color}`}>
                       {log.type}
                    </span>
                    <span className={`text-[9px] font-mono opacity-40 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}
                    </span>
                  </div>
                  <p className={`text-[11px] font-mono leading-relaxed break-words ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {log.message}
                  </p>
                </div>
              </motion.div>
            );
          })}
          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      ) : (
        /* --- Collapsed View --- */
        <div className="flex-1 flex flex-col items-center justify-center pb-8 overflow-hidden">
             <div 
               className={`text-[10px] font-bold uppercase tracking-[0.25em] whitespace-nowrap opacity-40 select-none ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
               style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
             >
                System Logs
             </div>
        </div>
      )}
      
      {/* --- Footer / Stats --- */}
      {!collapsed && (
        <div className={`p-2 text-[9px] font-mono text-center uppercase tracking-widest opacity-40 border-t ${headerClass}`}>
           {logs.length} Events Logged
        </div>
      )}
    </div>
  );
};
