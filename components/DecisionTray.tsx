import React from 'react';
import { Decision } from '../types';
import { Theme } from '../App';
import { AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DecisionTrayProps {
  decision: Decision | null;
  theme: Theme;
  onOptionSelect: (option: any) => void;
}

export const DecisionTray: React.FC<DecisionTrayProps> = ({ decision, theme, onOptionSelect }) => {
  const [expanded, setExpanded] = React.useState(true);

  if (!decision) return null;

  const bgClass = theme === 'light' ? 'bg-white border-t border-slate-200' : 'bg-[#18181b] border-t border-slate-800';
  const textClass = theme === 'light' ? 'text-slate-800' : 'text-slate-200';

  return (
    <div className={`absolute bottom-0 left-0 right-0 z-50 flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ${bgClass}`}>
      
      {/* Handle */}
      <div 
        className="h-8 flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Action Required</span>
            {expanded ? <ChevronDown size={14} className="text-slate-400"/> : <ChevronUp size={14} className="text-slate-400" />}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {expanded && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
            >
                <div className="p-4 md:p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                        <h3 className={`text-lg font-bold mb-2 ${textClass}`}>{decision.title}</h3>
                        <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                            {decision.description}
                        </p>
                    </div>
                    <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        {decision.options.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => onOptionSelect(opt)}
                                className={`flex flex-col text-left p-3 rounded-lg border transition-all hover:-translate-y-1 hover:shadow-md
                                    ${theme === 'light' 
                                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300' 
                                        : 'bg-black/20 border-slate-700 hover:border-slate-500'}`}
                            >
                                <span className={`text-xs font-bold mb-1 ${textClass}`}>{opt.label}</span>
                                <span className={`text-[10px] mb-2 ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>{opt.description}</span>
                                <span className="mt-auto text-[9px] font-mono uppercase tracking-tight text-amber-500">
                                    Impact: {opt.tradeOff}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};