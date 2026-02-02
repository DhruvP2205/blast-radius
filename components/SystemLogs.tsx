import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Theme } from '../App';
import { Terminal, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemLogsProps {
  logs: LogEntry[];
  theme: Theme;
}

export const SystemLogs: React.FC<SystemLogsProps> = ({ logs, theme }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return <AlertCircle size={10} className="text-rose-500" />;
      case 'warn': return <AlertTriangle size={10} className="text-amber-500" />;
      case 'system': return <Terminal size={10} className="text-purple-500" />;
      default: return <Info size={10} className="text-blue-500" />;
    }
  };

  const getTextColor = (type: LogEntry['type']) => {
    if (theme === 'light') {
        switch (type) {
            case 'error': return 'text-rose-700';
            case 'warn': return 'text-amber-700';
            case 'system': return 'text-purple-700';
            default: return 'text-zinc-600';
        }
    } else {
        switch (type) {
            case 'error': return 'text-rose-400';
            case 'warn': return 'text-amber-400';
            case 'system': return 'text-purple-400';
            default: return 'text-zinc-400';
        }
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-xl border backdrop-blur-md overflow-hidden transition-colors
      ${theme === 'light' ? 'bg-white/80 border-zinc-200 shadow-lg' : 'bg-zinc-950/60 border-zinc-800 shadow-xl'}`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${theme === 'light' ? 'border-zinc-100 bg-zinc-50/50' : 'border-zinc-800 bg-zinc-900/50'}`}>
        <div className="flex items-center gap-2">
           <Terminal size={12} className={theme === 'light' ? 'text-zinc-400' : 'text-zinc-500'} />
           <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-500'}`}>
             System Logs
           </span>
        </div>
        <div className="flex gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
        </div>
      </div>

      {/* Log Body */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-[10px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {logs.length === 0 && (
            <div className={`text-center py-4 italic opacity-50 ${theme === 'light' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Initializing stream...
            </div>
        )}
        {logs.map((log) => (
          <motion.div 
            key={log.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-2 leading-tight ${getTextColor(log.type)}`}
          >
            <span className="opacity-50 shrink-0">
               {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
            </span>
            <span className="mt-0.5">{getIcon(log.type)}</span>
            <span className="break-all">{log.message}</span>
          </motion.div>
        ))}
        {/* Anchor for scrolling */}
        <div className="h-2"></div>
      </div>
    </div>
  );
};