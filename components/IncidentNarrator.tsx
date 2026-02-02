
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../App';
import { Bot, Terminal } from 'lucide-react';

interface IncidentNarratorProps {
  text: string;
  subtext?: string;
  visible: boolean;
  theme: Theme;
}

export const IncidentNarrator: React.FC<IncidentNarratorProps> = ({ text, subtext, visible, theme }) => {
  const isLight = theme === 'light';

  return (
    <div className="fixed bottom-6 left-6 z-30 pointer-events-none max-w-md w-full">
      <AnimatePresence>
        {visible && text && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className={`
               p-1 rounded-2xl border shadow-2xl backdrop-blur-xl
               ${isLight ? 'bg-white/90 border-slate-200 shadow-slate-200/50' : 'bg-slate-900/90 border-slate-700 shadow-black/50'}
            `}
          >
             <div className="flex items-start">
                 {/* Icon Section */}
                 <div className={`w-12 h-12 flex items-center justify-center rounded-xl shrink-0 mt-1 ml-1 ${isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400'}`}>
                    <Bot size={24} />
                 </div>
                 
                 {/* Content Section */}
                 <div className="flex-1 p-3 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>System Narrative</span>
                       <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    </div>
                    
                    {/* Headline */}
                    <p className={`text-base font-bold leading-snug mb-2 ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                       {text}
                    </p>
                    
                    {/* Technical Subtext */}
                    {subtext && (
                        <div className={`inline-flex items-center gap-2 text-[10px] font-mono py-1 px-2 rounded
                           ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-black/30 text-slate-400'}
                        `}>
                            <Terminal size={10} className="opacity-50" />
                            <span className="opacity-90 leading-tight">{subtext}</span>
                        </div>
                    )}
                 </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
