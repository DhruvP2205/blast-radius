
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Terminal,
  Activity,
  Zap,
  ShieldCheck,
  Cpu,
  Server,
  Code2,
  Box,
  Layers,
  Unplug,
  RotateCcw,
  Github,
  Linkedin,
  Youtube
} from 'lucide-react';
import { 
  SiAmazon, 
  SiKubernetes, 
  SiTerraform, 
  SiGrafana, 
  SiJenkins, 
  SiGithub,
  SiDocker,
  SiPrometheus,
  SiPostgresql,
  SiRedis,
  SiNginx,
  SiReact,
  SiPython,
  SiDatadog,
  SiAnsible,
  SiLinux,
  SiGo,
  SiRust
} from 'react-icons/si';
import { Theme } from '../App';
import { Logo } from './Logo';

interface IntroScreenProps {
  onStart: () => void;
  theme: Theme;
}

const TOOLS = [
  { icon: SiKubernetes, name: "Kubernetes", color: "#326ce5" },
  { icon: SiAmazon, name: "AWS", color: "#ff9900" },
  { icon: SiTerraform, name: "Terraform", color: "#7b42bc" },
  { icon: SiDocker, name: "Docker", color: "#2496ed" },
  { icon: SiPrometheus, name: "Prometheus", color: "#e6522c" },
  { icon: SiGrafana, name: "Grafana", color: "#f46800" },
  { icon: SiJenkins, name: "Jenkins", color: "#d24939" },
  { icon: SiGithub, name: "GitHub", color: "#181717" },
  { icon: SiAnsible, name: "Ansible", color: "#ee0000" },
  { icon: SiRedis, name: "Redis", color: "#dc382d" },
  { icon: SiNginx, name: "Nginx", color: "#009639" },
  { icon: SiLinux, name: "Linux", color: "#fcc624" },
  { icon: SiGo, name: "Go", color: "#00add8" },
  { icon: SiRust, name: "Rust", color: "#000000" },
  { icon: SiDatadog, name: "Datadog", color: "#632ca6" },
  { icon: SiPostgresql, name: "PostgreSQL", color: "#4169e1" },
];

const ToolBadge = ({ icon: Icon, name, color, theme }: any) => {
    const isLight = theme === 'light';
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className={`
                group relative flex flex-col items-center justify-center px-6 py-4 rounded-xl border transition-colors cursor-default min-w-[120px] shrink-0
                ${isLight
                    ? 'bg-white/60 border-slate-200 shadow-sm hover:bg-white hover:shadow-md'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 hover:shadow-md'}
            `}
        >
             {/* Hover Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-transparent to-[${color}]`} />
            
            <Icon size={20} className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${isLight ? '' : 'text-slate-200'}`} style={{ color: isLight ? color : undefined }} />
            <span className={`relative z-10 mt-2 text-[10px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {name}
            </span>
        </motion.div>
    );
};

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart, theme }) => {
  const isLight = theme === 'light';
  
  // Background Pattern Styles
  const gridColor = isLight ? 'rgba(148, 163, 184, 0.2)' : 'rgba(255, 255, 255, 0.05)';
  const bgColor = isLight ? 'bg-[#f0f4f8]' : 'bg-[#09090b]';
  const textColor = isLight ? 'text-slate-900' : 'text-zinc-100';
  const subTextColor = isLight ? 'text-slate-600' : 'text-zinc-400';

  // Duplicate tools for seamless loop
  const MARQUEE_TOOLS = [...TOOLS, ...TOOLS];

  return (
    <div className={`relative h-full w-full overflow-y-auto overflow-x-hidden font-inter scroll-smooth ${bgColor} ${textColor}`}>
      
      {/* --- Technical Background --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, 
            backgroundSize: '40px 40px' 
          }} 
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${isLight ? 'from-transparent via-white/50 to-white' : 'from-transparent via-[#09090b]/50 to-[#09090b]'}`} />
      </div>

      {/* --- Header --- */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between shrink-0">
        <Logo theme={theme} size="sm" />
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono opacity-50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM_ONLINE
          </div>
          <div className={`px-2 py-1 rounded text-[10px] font-bold border ${isLight ? 'border-slate-300 bg-white' : 'border-zinc-700 bg-zinc-900'}`}>
            v3.2.0
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="relative z-10 w-full flex flex-col items-center pt-12 md:pt-20 pb-6">
        
        {/* Headline Group */}
        <div className="text-center max-w-3xl mb-16 space-y-6 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider
              ${isLight ? 'bg-white border-slate-300 text-slate-600' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}
          >
            <Activity size={14} />
            Production Simulation Environment
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] ${textColor}`}
          >
            Chaos Engineering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Simulator.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-sm md:text-lg font-mono leading-relaxed max-w-2xl mx-auto ${subTextColor} select-text`}
          >
            Experience the fragility of modern distributed systems. 
            Inject failures, observe latency cascades, and master the art of stabilized ruin across the full cloud-native stack.
          </motion.p>
        </div>

        {/* --- Infinite Marquee Carousel --- */}
        <div className="w-full max-w-full overflow-hidden mb-16 relative py-4">
           {/* Gradient Masks for Fade Effect */}
           <div className={`absolute left-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-r ${isLight ? 'from-[#f0f4f8]' : 'from-[#09090b]'} to-transparent`} />
           <div className={`absolute right-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-l ${isLight ? 'from-[#f0f4f8]' : 'from-[#09090b]'} to-transparent`} />

           <motion.div 
             className="flex gap-4 w-max px-4"
             animate={{ x: "-50%" }}
             transition={{ 
               duration: 40, 
               repeat: Infinity, 
               ease: "linear" 
             }}
           >
               {MARQUEE_TOOLS.map((tool, index) => (
                   <ToolBadge 
                      key={`${tool.name}-${index}`} 
                      icon={tool.icon} 
                      name={tool.name} 
                      color={tool.color} 
                      theme={theme} 
                   />
               ))}
           </motion.div>
        </div>

        {/* --- CTA --- */}
        <div className="relative z-20 mb-12 px-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-sm tracking-wide shadow-xl transition-all whitespace-nowrap
              ${isLight 
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-300' 
                : 'bg-white text-black hover:bg-zinc-200 shadow-blue-900/20'}
            `}
          >
            <Terminal size={16} />
            ENTER SIMULATION
            <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* --- "What You Will Experience" Section --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`w-full max-w-4xl px-6 mt-12 pt-12 border-t ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}
        >
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-8 text-center opacity-60 ${subTextColor}`}>What You Will Experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="flex items-center gap-4 group">
                    <div className={`p-3 rounded-lg shrink-0 transition-colors ${isLight ? 'bg-slate-200/50 text-slate-600 group-hover:bg-slate-200' : 'bg-zinc-900 text-zinc-400 group-hover:bg-zinc-800'}`}>
                        <Unplug size={18} />
                    </div>
                    <p className={`text-sm font-medium leading-tight ${textColor}`}>
                        Break infrastructure components and watch dependencies degrade.
                    </p>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className={`p-3 rounded-lg shrink-0 transition-colors ${isLight ? 'bg-slate-200/50 text-slate-600 group-hover:bg-slate-200' : 'bg-zinc-900 text-zinc-400 group-hover:bg-zinc-800'}`}>
                        <Activity size={18} />
                    </div>
                    <p className={`text-sm font-medium leading-tight ${textColor}`}>
                        See latency and error ripples propagate across the system.
                    </p>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className={`p-3 rounded-lg shrink-0 transition-colors ${isLight ? 'bg-slate-200/50 text-slate-600 group-hover:bg-slate-200' : 'bg-zinc-900 text-zinc-400 group-hover:bg-zinc-800'}`}>
                        <RotateCcw size={18} />
                    </div>
                    <p className={`text-sm font-medium leading-tight ${textColor}`}>
                        Observe automated recovery actions and self-healing in real-time.
                    </p>
                </div>
            </div>
        </motion.div>

        {/* --- Credible Footer Row --- */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-full max-w-7xl px-6 mt-24 mb-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 hover:opacity-100 transition-opacity"
        >
            <div className="flex items-center gap-2">
               <Logo theme={theme} size="sm" collapsed />
            </div>

            <div className="flex items-center gap-8">
                <a href="#" className={`flex items-center gap-2 text-xs font-medium transition-colors ${subTextColor} hover:${textColor}`}>
                    <Github size={14} />
                    <span>Repository</span>
                </a>
                <a href="#" className={`flex items-center gap-2 text-xs font-medium transition-colors ${subTextColor} hover:${textColor}`}>
                    <Linkedin size={14} />
                    <span>Creator</span>
                </a>
                <a href="#" className={`flex items-center gap-2 text-xs font-medium transition-colors ${subTextColor} hover:${textColor}`}>
                    <Youtube size={14} />
                    <span>Channel</span>
                </a>
            </div>
        </motion.footer>

      </main>
    </div>
  );
};
