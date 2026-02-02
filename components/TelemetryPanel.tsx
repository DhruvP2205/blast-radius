import React from 'react';
import { SimulationState } from '../types';
import { Theme } from '../App';
import { Activity, Zap, DollarSign, Database, Server, ChevronLeft, ChevronRight } from 'lucide-react';

interface TelemetryPanelProps {
  state: SimulationState;
  theme: Theme;
  collapsed: boolean;
  onToggle: () => void;
}

const StatItem = ({ label, value, icon: Icon, color, collapsed, theme }: any) => {
    if (collapsed) {
        return (
            <div className={`group relative p-2 rounded-lg mb-2 flex justify-center ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}>
                <Icon size={16} className={color} />
                <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
                    {label}: {value}
                </div>
            </div>
        );
    }
    return (
        <div className={`p-3 rounded-lg border mb-3 ${theme === 'light' ? 'bg-white border-slate-100' : 'bg-transparent border-slate-800'}`}>
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">{label}</span>
                <Icon size={12} className={color} />
            </div>
            <div className={`text-lg font-mono font-bold ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                {value}
            </div>
        </div>
    );
};

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ state, theme, collapsed, onToggle }) => {
  const bgClass = theme === 'light' ? 'bg-slate-50 border-l border-slate-200' : 'bg-[#18181b] border-l border-slate-800';

  return (
    <div className={`relative flex flex-col transition-all duration-300 ${bgClass} ${collapsed ? 'w-12' : 'w-64'}`}>
        
       {/* Header / Toggle */}
      <div className={`flex items-center justify-between p-3 border-b ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}>
         <button onClick={onToggle} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors mx-auto md:mx-0">
          {collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
        {!collapsed && <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Telemetry</span>}
      </div>

      <div className="p-2 flex-1 overflow-y-auto">
        <StatItem 
            label="System Health" 
            value={`${Math.floor(state.stability)}%`} 
            icon={Activity} 
            color="text-emerald-500" 
            collapsed={collapsed} theme={theme}
        />
        <StatItem 
            label="Traffic Load" 
            value={`${Math.floor(state.signals.load)}%`} 
            icon={Zap} 
            color="text-amber-500" 
            collapsed={collapsed} theme={theme}
        />
        <StatItem 
            label="Latency" 
            value={`${Math.floor(state.signals.latency)}ms`} 
            icon={Server} 
            color="text-blue-500" 
            collapsed={collapsed} theme={theme}
        />
        <StatItem 
            label="Burn Rate" 
            value={`$${Math.floor(state.signals.costBurn)}/s`} 
            icon={DollarSign} 
            color="text-rose-500" 
            collapsed={collapsed} theme={theme}
        />
        <StatItem 
            label="Budget" 
            value={`$${Math.floor(state.budget)}`} 
            icon={Database} 
            color="text-slate-500" 
            collapsed={collapsed} theme={theme}
        />
      </div>
    </div>
  );
};