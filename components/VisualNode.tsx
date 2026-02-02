
import React from 'react';
import { SystemNode } from '../types';
import { 
  AlertTriangle, 
  Trash2,
  CheckCircle2,
  Unplug,
  Server,
  Box,
  Radio,
  Lock,
  Shield,
  Activity,
  Layers
} from 'lucide-react';
import { 
  SiGithub, SiJenkins, SiTerraform, 
  SiNginx, SiKubernetes, SiRedis, SiPostgresql,
  SiDatadog, SiPrometheus, SiPagerduty, SiReact, SiSpringboot,
  SiAmazon
} from 'react-icons/si';
import { Theme } from '../App';
import { AnimatePresence, motion } from 'framer-motion';

interface VisualNodeProps {
  node: SystemNode;
  isDimmed: boolean; // Kept for prop interface compatibility but ignored for visuals
  onBreak: (id: string) => void;
  onInfo: (node: SystemNode) => void;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  theme: Theme;
}

const ServiceIcon = ({ label, className }: { label: string, className?: string }) => {
  if (label.includes('Git')) return <SiGithub className={className} />;
  if (label.includes('IaC')) return <SiTerraform className={className} />;
  if (label.includes('Policy')) return <Lock className={className} />;
  if (label.includes('Runner')) return <SiJenkins className={className} />;
  if (label.includes('Scanner')) return <Shield className={className} />;
  if (label.includes('Registry')) return <Box className={className} />;
  if (label.includes('Controller')) return <Radio className={className} />;
  if (label.includes('Load Balancer')) return <SiNginx className={className} />;
  if (label.includes('K8s')) return <SiKubernetes className={className} />;
  if (label.includes('Frontend')) return <SiReact className={className} />;
  if (label.includes('Backend')) return <SiSpringboot className={className} />;
  if (label.includes('Auto')) return <Activity className={className} />;
  if (label.includes('Cache')) return <SiRedis className={className} />;
  if (label.includes('Primary')) return <SiPostgresql className={className} />;
  if (label.includes('Event')) return <Layers className={className} />;
  if (label.includes('Metrics')) return <SiPrometheus className={className} />;
  if (label.includes('Logs')) return <SiDatadog className={className} />;
  if (label.includes('Alerting')) return <SiPagerduty className={className} />;
  if (label.includes('Auto-Fix')) return <SiAmazon className={className} />;
  return <Server className={className} />;
}

export const VisualNode: React.FC<VisualNodeProps> = ({ node, isDimmed, onMouseDown, theme }) => {
  const left = node.x;
  const top = node.y;
  const isLight = theme === 'light';
  
  // Phase Helpers
  const phase = node.recoveryPhase;
  const isImpacted = node.impactStatus !== 'none' && !node.isDead;
  
  // Removed Opacity/Grayscale logic to keep layout clear during incidents
  const containerOpacity = 1;
  const grayscale = '';
  const hoverOpacity = '';

  // Get readable status message
  const getStatusMessage = () => {
    if (phase === 'DIAGNOSE') return "Detecting Failure";
    if (phase === 'DRAIN') return "Draining Instance";
    if (phase === 'STANDBY_ACTIVATION') return "Activating Backup";
    if (phase === 'DEPLOY') return "Deploying New Pod";
    if (phase === 'STABILIZE') return "Stabilizing";
    if (isImpacted) return "Degraded Performance";
    return "Healthy";
  };

  const statusColor = node.isDead ? 'text-rose-500' : isImpacted ? 'text-amber-500' : 'text-slate-500';
  const borderColor = node.isDead ? 'border-rose-500' : isImpacted ? 'border-amber-500' : isLight ? 'border-slate-300' : 'border-slate-600';

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-grab active:cursor-grabbing transition-all duration-300 ${grayscale} ${hoverOpacity}`}
      style={{ left: `${left}px`, top: `${top}px`, opacity: containerOpacity }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
    >
      {/* 1. Status Pill (The "Headline") */}
      <AnimatePresence>
        {(node.isDead || isImpacted) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute -top-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg whitespace-nowrap z-30 border ${isLight ? 'bg-white' : 'bg-slate-900'} ${borderColor} ${statusColor}`}
          >
            {getStatusMessage()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Icon Container */}
      <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all duration-300
         ${isLight ? 'bg-white' : 'bg-[#1e293b]'}
         ${borderColor}
         ${!node.isDead && !isImpacted ? 'hover:scale-105 hover:shadow-xl' : ''}
      `}>
         
         <AnimatePresence mode="wait">
            {/* Case: Normal Operation */}
            {phase === 'IDLE' && !node.isDead && (
               <motion.div
                 key="idle"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
               >
                 <ServiceIcon label={node.label} className={`w-8 h-8 ${isImpacted ? 'text-amber-500 animate-pulse' : isLight ? 'text-slate-700' : 'text-slate-300'}`} />
               </motion.div>
            )}

            {/* Case: Failure Detected */}
            {phase === 'DIAGNOSE' && (
               <motion.div
                 key="diagnose"
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="text-rose-500"
               >
                 <AlertTriangle size={32} className="animate-pulse" />
               </motion.div>
            )}

            {/* Case: Safety Net - Drain/Destroy */}
            {phase === 'DRAIN' && (
               <motion.div
                 key="drain"
                 initial={{ x: 0, opacity: 1 }}
                 animate={{ x: -20, opacity: 0 }}
                 transition={{ duration: 1 }}
                 className="flex flex-col items-center opacity-50"
               >
                  <ServiceIcon label={node.label} className="w-8 h-8 text-slate-400 grayscale" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Trash2 size={24} className="text-slate-500" />
                  </div>
               </motion.div>
            )}

            {/* Case: Safety Net - Warm Standby */}
            {phase === 'STANDBY_ACTIVATION' && (
               <motion.div
                 key="standby"
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 0.8, scale: 1 }}
                 className="flex flex-col items-center"
               >
                 <div className="border-2 border-dashed border-emerald-500/50 rounded-lg p-2">
                    <ServiceIcon label={node.label} className="w-6 h-6 text-emerald-500/50" />
                 </div>
                 <div className="mt-1 text-[8px] font-bold uppercase text-emerald-500">Standby</div>
               </motion.div>
            )}

            {/* Case: Safety Net - Deploy */}
            {phase === 'DEPLOY' && (
               <motion.div
                 key="deploy"
                 initial={{ x: 40, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                 className="relative"
               >
                 <ServiceIcon label={node.label} className="w-8 h-8 text-emerald-600" />
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ delay: 0.2 }}
                   className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5"
                 >
                    <CheckCircle2 size={12} />
                 </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Impact / Degraded Overlay */}
         {isImpacted && (
             <div className="absolute top-1 right-1">
                 <Unplug size={12} className="text-amber-500" />
             </div>
         )}
      </div>

      {/* Label Group */}
      <div className="mt-3 text-center pointer-events-none flex flex-col items-center z-30">
          <div className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {node.label}
          </div>
          <div className={`text-[9px] opacity-60 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
             {node.subLabel}
          </div>
      </div>
    </div>
  );
};
