
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IncidentReport, SystemNode } from '../types';
import { Theme } from '../App';
import { 
  CheckCircle2, 
  Clock, 
  Activity, 
  Layers,
  Wrench,
  X,
  History,
  DollarSign,
  Briefcase,
  UserMinus,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

interface IncidentModalProps {
  report: IncidentReport;
  nodes: SystemNode[]; // To look up labels
  theme: Theme;
  onClose: () => void;
}

const MetricTooltip = ({ text, visible }: { text: string; visible: boolean }) => (
    <AnimatePresence>
        {visible && (
            <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-slate-50 text-[10px] font-medium leading-relaxed rounded-lg shadow-xl w-48 text-center z-[999] pointer-events-none border border-slate-700/50"
            >
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-900"></div>
            </motion.div>
        )}
    </AnimatePresence>
);

const StatCard = ({ label, value, sub, icon: Icon, color, theme, onHover, onLeave, activeTooltip, tooltipKey, tooltipText }: any) => {
    const isLight = theme === 'light';
    // Match colors exactly to screenshot
    // Red for Revenue, Orange for Users, Blue for Hours/Devs
    const colorClasses: Record<string, string> = {
        rose: isLight ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-rose-950/30 text-rose-400 border-rose-900/50',
        orange: isLight ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-orange-950/30 text-orange-400 border-orange-900/50',
        indigo: isLight ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-blue-950/30 text-blue-400 border-blue-900/50', 
        slate: isLight ? 'bg-slate-50 text-slate-600 border-slate-100' : 'bg-slate-800/50 text-slate-400 border-slate-800'
    };
    
    const colors = colorClasses[color] || colorClasses.slate;

    return (
        <div 
            className={`relative p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] cursor-help ${colors}`}
            onMouseEnter={() => onHover(tooltipKey)}
            onMouseLeave={onLeave}
            style={{ zIndex: activeTooltip === tooltipKey ? 50 : 1 }}
        >
            <MetricTooltip text={tooltipText} visible={activeTooltip === tooltipKey} />
            <div className="mb-1.5 p-1.5 rounded-full bg-white/40">
                <Icon size={16} />
            </div>
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-0.5 flex items-center gap-1">
                {label} <HelpCircle size={8} className="opacity-50" />
            </div>
            <div className="text-lg md:text-xl font-mono font-bold leading-none mb-0.5">
                {value}
            </div>
            {sub && <div className="text-[9px] opacity-60">{sub}</div>}
        </div>
    );
};

export const IncidentModal: React.FC<IncidentModalProps> = ({ report, nodes, theme, onClose }) => {
  const isLight = theme === 'light';
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  const getNodeLabel = (id: string) => nodes.find(n => n.id === id)?.label || id;
  const rootLabel = getNodeLabel(report.rootCauseNodeId);
  
  const bgClass = isLight ? 'bg-white' : 'bg-[#18181b]';
  const textClass = isLight ? 'text-slate-900' : 'text-slate-100';
  const borderClass = isLight ? 'border-slate-200' : 'border-slate-800';

  // Enhanced scrollbar for better visibility
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${isLight ? '#cbd5e1' : '#334155'}; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: ${isLight ? '#94a3b8' : '#475569'}; }
  `;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <style>{scrollbarStyles}</style>
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content - Fixed Height for Viewport Fit */}
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className={`relative w-full max-w-5xl rounded-xl shadow-2xl h-[85vh] md:h-[80vh] flex flex-col overflow-hidden ${bgClass} ${textClass}`}
      >
        {/* Header Ribbon */}
        <div className="bg-emerald-500 text-white p-4 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-full shadow-inner ring-2 ring-white/10">
                <CheckCircle2 size={20} />
             </div>
             <div>
               <h2 className="text-lg font-bold uppercase tracking-wide leading-none">Incident Resolved</h2>
               <div className="text-[10px] font-mono opacity-80 flex gap-3 mt-1 font-medium">
                  <span className="flex items-center gap-1"><Activity size={10}/> CASE ID: {report.id.slice(0,8).toUpperCase()}</span>
                  <span className="w-px h-3 bg-white/30"></span>
                  <span className="flex items-center gap-1"><AlertTriangle size={10}/> ROOT CAUSE: {rootLabel}</span>
               </div>
             </div>
           </div>
           <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Main Body - Locked Layout (No Global Scroll) */}
        <div className={`flex-1 flex flex-col min-h-0 p-5 ${isLight ? 'bg-slate-100' : 'bg-black/40'}`}>
           
           {/* SECTION 1: DASHBOARD METRICS (Fixed Height) */}
           <div className="shrink-0 mb-3">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                   <Activity size={12} /> Cost & Impact Analysis
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-2 relative z-10">
                    <StatCard 
                        label="Revenue Lost" 
                        value={`$${Math.floor(report.totalRevenueLoss).toLocaleString()}`} 
                        icon={DollarSign} 
                        color="rose"
                        theme={theme}
                        activeTooltip={activeTooltip}
                        onHover={setActiveTooltip}
                        onLeave={() => setActiveTooltip(null)}
                        tooltipKey="revenue"
                        tooltipText="Estimated gross revenue loss during downtime."
                    />
                    <StatCard 
                        label="Users Churned" 
                        value={report.churnedUsers.toLocaleString()} 
                        icon={UserMinus} 
                        color="orange"
                        theme={theme}
                        activeTooltip={activeTooltip}
                        onHover={setActiveTooltip}
                        onLeave={() => setActiveTooltip(null)}
                        tooltipKey="churn"
                        tooltipText="Users who abandoned the platform permanently."
                    />
                    <StatCard 
                        label="Man Hours" 
                        value={`${report.manHoursLost}h`} 
                        icon={Clock} 
                        color="indigo"
                        theme={theme}
                        activeTooltip={activeTooltip}
                        onHover={setActiveTooltip}
                        onLeave={() => setActiveTooltip(null)}
                        tooltipKey="hours"
                        tooltipText="Total engineering time consumed for diagnosis."
                    />
                    <StatCard 
                        label="Devs Mobilized" 
                        value={report.developersMobilized} 
                        icon={Briefcase} 
                        color="indigo"
                        theme={theme}
                        activeTooltip={activeTooltip}
                        onHover={setActiveTooltip}
                        onLeave={() => setActiveTooltip(null)}
                        tooltipKey="devs"
                        tooltipText="Number of engineers paged."
                    />
               </div>
           </div>

           {/* SECTION 2: DETAILS GRID (Takes Remaining Space) */}
           <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3">
               
               {/* LEFT COL: Stats & Remediation - Independent Scroll if needed */}
               <div className="lg:col-span-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
                    {/* Duration Box */}
                    <div className={`p-3 rounded-lg border flex items-center justify-between shadow-sm shrink-0 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                        <div>
                            <div className="text-[9px] font-bold uppercase opacity-40 mb-0.5 tracking-widest">Total Downtime</div>
                            <div className="text-xl font-mono font-bold tracking-tight">{report.durationSeconds.toFixed(1)}s</div>
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
                             <Clock size={16} />
                        </div>
                    </div>

                    {/* Blast Radius Card */}
                    <div className={`p-3 rounded-lg border shadow-sm shrink-0 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                        <div className="flex items-center gap-1.5 mb-2 text-slate-400">
                            <Layers size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Blast Radius</span>
                        </div>
                        
                        <div className="space-y-3">
                             {/* Primary Failure Box */}
                             <div>
                                <div className="text-[9px] uppercase font-bold opacity-40 mb-1">Primary Failure</div>
                                <div className="inline-block px-2.5 py-1 rounded border-2 bg-rose-50 border-rose-200 text-rose-600 font-mono font-bold text-[10px]">
                                    {rootLabel}
                                </div>
                             </div>

                             <div className="border-t border-dashed border-slate-200 dark:border-slate-700"></div>

                             {/* Cascading */}
                             <div>
                                <div className="text-[9px] uppercase font-bold opacity-40 mb-1">Cascading Failures</div>
                                {report.affectedNodeIds.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {report.affectedNodeIds.map(id => (
                                            <span key={id} className={`px-1.5 py-0.5 rounded text-[9px] font-mono border opacity-80 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                                                {getNodeLabel(id)}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-[9px] italic opacity-40">No downstream effects detected.</span>
                                )}
                             </div>
                        </div>
                    </div>

                     {/* Remediation - Can grow */}
                     <div className={`p-3 rounded-lg border shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                               <Wrench size={12} /> Recovery Procedure
                           </h3>
                           <div className="space-y-2">
                               {report.remediationSteps.map((step, idx) => (
                                   <div key={idx} className="flex gap-2">
                                       <div className={`mt-0.5 w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] font-bold shrink-0 border
                                           ${isLight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                           {idx + 1}
                                       </div>
                                       <span className={`text-[10px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{step}</span>
                                   </div>
                               ))}
                           </div>
                      </div>
               </div>

               {/* RIGHT COL: Timeline - Takes remaining height, scroll internal */}
               <div className="lg:col-span-2 h-full min-h-0 flex flex-col">
                   <div className={`flex-1 flex flex-col p-4 rounded-lg border shadow-sm overflow-hidden ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                       <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2 shrink-0">
                           <History size={12} /> Full Incident Timeline
                       </h3>
                       
                       {/* Scrollable Timeline Area */}
                       <div className="relative flex-1 pl-2 overflow-y-auto custom-scrollbar pr-1">
                           {/* Continuous Vertical Line */}
                           <div className={`absolute left-[7px] top-2 bottom-6 w-px ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}></div>
                           
                           <div className="space-y-5">
                               {report.timeline.map((evt, idx) => (
                                   <div key={idx} className="relative pl-6 group">
                                       {/* Dot */}
                                       <div className={`absolute left-[3.5px] top-1.5 w-2 h-2 rounded-full border-[1.5px] z-10 transition-transform group-hover:scale-110
                                            ${isLight ? 'border-white' : 'border-[#0f172a]'} 
                                            ${evt.type === 'error' ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'}`} 
                                       />
                                       
                                       <div className="flex flex-col gap-0.5">
                                           <div className={`w-fit px-1.5 py-px rounded text-[8px] font-mono font-bold
                                                ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'}`}>
                                               T+{(evt.timestamp - report.startTime)/1000}s
                                           </div>
                                           <div className={`text-[11px] font-medium leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                                                {evt.message}
                                           </div>
                                       </div>
                                   </div>
                               ))}
                           </div>

                           {/* End Dot */}
                            <div className="relative pl-6 mt-5 pb-2">
                                <div className={`absolute left-[3.5px] top-1.5 w-2 h-2 rounded-full border-[1.5px] z-10 bg-slate-200 dark:bg-slate-700 ${isLight ? 'border-white' : 'border-[#0f172a]'}`} />
                                <div className="text-[9px] font-bold uppercase opacity-40 pt-0.5">INCIDENT CLOSED</div>
                            </div>
                       </div>
                   </div>
               </div>

           </div>
        </div>

        {/* Footer */}
        <div className={`p-3 border-t flex justify-end shrink-0 ${borderClass} ${isLight ? 'bg-white' : 'bg-[#18181b]'}`}>
           <button 
             onClick={onClose}
             className="px-5 py-2 bg-rose-900 text-white dark:bg-white dark:text-slate-900 rounded-lg font-bold text-xs hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-95 uppercase tracking-wide"
           >
             Acknowledge & Close
           </button>
        </div>
      </motion.div>
    </div>
  );
};
