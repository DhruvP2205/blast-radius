
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Theme } from '../App';
import { Terminal, AlertTriangle, XCircle, CheckCircle, Info, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventLogOverlayProps {
  logs: LogEntry[];
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
}

export const EventLogOverlay: React.FC<EventLogOverlayProps> = ({ logs, theme, isOpen, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  // Auto-scroll logic
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return <XCircle size={14} className="text-rose-500" />;
      case 'warn': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'success': return <CheckCircle size={14} className="text-emerald-500" />;
      case 'system': return <Terminal size={14} className="text-indigo-500" />;
      default: return <Info size={14} className="text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed top-0 left-0 bottom-0 w-[350px] z-40 shadow-2xl flex flex-col border-r backdrop-blur-xl
                    ${isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900/95 border-slate-800'}
                `}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-4 border-b ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800 bg-black/20'}`}>
                    <div className="flex items-center gap-2">
                        <Terminal size={16} className={isLight ? 'text-slate-600' : 'text-slate-400'} />
                        <h3 className={`font-bold uppercase tracking-wider text-sm ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                            System Logs
                        </h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className={`p-1.5 rounded-md transition-colors ${isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                {/* Log List */}
                <div 
                    ref={scrollRef} 
                    className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
                >
                    {logs.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full opacity-40">
                            <Terminal size={32} className="mb-2" />
                            <p className="text-xs font-mono uppercase">No Events Recorded</p>
                        </div>
                    )}
                    
                    {/* Render standard order (oldest top, newest bottom) for a terminal feel */}
                    {logs.slice().reverse().map((log) => (
                        <div key={log.id} className="flex gap-3 group">
                            <div className="mt-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                {getIcon(log.type)}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className={`text-[10px] font-mono opacity-50 uppercase tracking-tight`}>
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                    {log.type === 'error' && (
                                        <span className="text-[9px] font-bold bg-rose-500 text-white px-1 rounded-sm">CRITICAL</span>
                                    )}
                                </div>
                                <p className={`text-[11px] font-mono leading-relaxed break-words ${
                                    log.type === 'error' ? 'text-rose-600 dark:text-rose-400 font-semibold' :
                                    log.type === 'warn' ? 'text-amber-600 dark:text-amber-400' :
                                    isLight ? 'text-slate-600' : 'text-slate-300'
                                }`}>
                                    {log.message}
                                </p>
                            </div>
                        </div>
                    ))}
                    {/* Spacer at bottom */}
                    <div className="h-4"></div>
                </div>

                {/* Footer Status */}
                <div className={`p-2 border-t text-[10px] font-mono text-center opacity-50 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                    BUFFER_SIZE: {logs.length} / 1000
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};
