
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { MissionBriefing } from './components/MissionBriefing';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { Logo } from './components/Logo';
import { ImpactBar } from './components/ImpactBar';
import { IncidentNarrator } from './components/IncidentNarrator';
import { IncidentModal } from './components/IncidentModal';
import { SimulationState, DecisionOption, SystemNode, LogEntry, IncidentReport, ActiveIncidentState, MitigationStrategy, RecoveryPhase, IncidentTimelineEvent, NodeType } from './types';
import { INITIAL_NODES, INITIAL_GROUPS } from './constants';
import { Sun, Moon, Smartphone, RotateCcw, X, AlertTriangle, Activity, Zap, Shield, ArrowRight, GitCommit } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type ViewState = 'INTRO' | 'BRIEFING' | 'SIMULATION';
export type Theme = 'light' | 'dark';

const MobileLandscapePrompt = () => (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="relative mb-6">
        <Smartphone className="w-12 h-12 animate-pulse" />
        <RotateCcw className="w-6 h-6 absolute -right-2 -bottom-2 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />
      </div>
      <h2 className="text-xl font-bold mb-3 tracking-tight">Please Rotate Device</h2>
      <p className="text-sm opacity-60 max-w-xs leading-relaxed">
        The Blast Radius simulation requires a landscape viewport for optimal visualization of the architecture.
      </p>
    </div>
);

// --- DYNAMIC CONTENT GENERATORS ---

const getIncidentMessages = (node: SystemNode): { text: string, sub: string } => {
    if (node.id === 'load-balancer') return { text: "Users cannot reach the application.", sub: "ALB health checks failed. 100% Packet Loss." };
    if (node.id === 'frontend-svc') return { text: "Web interface is down.", sub: "Container crash loop backoff. 503 Service Unavailable." };
    if (node.id === 'backend-svc') return { text: "App cannot process requests.", sub: "API Gateway timeout. Thread pool exhaustion." };
    if (node.id === 'primary-db') return { text: "Data cannot be saved or read.", sub: "Postgres connection refused. WAL lock detected." };
    if (node.id === 'cache') return { text: "Application is running slowly.", sub: "Redis eviction spike. Cache miss ratio > 90%." };
    if (node.id === 'k8s-cluster') return { text: "Orchestration failure. No new pods can be scheduled.", sub: "Control plane API unreachable. Etcd quorum lost." };
    if (node.id === 'git-repo') return { text: "Developers cannot push code.", sub: "Git upstream timeout. SSH handshake failure." };
    if (node.id === 'ci-runner') return { text: "Build pipelines are frozen.", sub: "Runner agent disconnected. Job queue overflow." };
    return { text: `${node.label} has stopped working.`, sub: `Critical fault detected in ${node.id}. Signal loss.` };
};

// Helper to pick random items from array
const pickRandom = (arr: string[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const generateRemediationSteps = (type: NodeType): string[] => {
    const pools: Record<string, string[]> = {
        data: [
            "Initiating Point-in-Time Recovery (PITR) from snapshot.",
            "Replaying Write-Ahead Logs (WAL) to restore consistency.",
            "Verifying data integrity checksums.",
            "Warming up cache replicas.",
            "Promoting standby to primary.",
            "Vacuuming dead tuples from master.",
            "Rebalancing shard distribution.",
            "Flushing dirty pages to disk."
        ],
        compute: [
            "Isolating crashing container instance.",
            "Analyzing stack trace for segmentation faults.",
            "Rolling back to previous stable image tag.",
            "Adjusting resource limits (CPU/RAM).",
            "Waiting for liveness probes to pass.",
            "Cycling worker thread pool.",
            "Clearing local heap memory.",
            "Restarting sidecar proxies."
        ],
        network: [
            "Flushing DNS cache propagation.",
            "Rerouting traffic via secondary availability zone.",
            "Mitigating DDOS via WAF rules.",
            "Cycling load balancer targets.",
            "Verifying SSL handshake latency.",
            "Renewing expired TLS certificates.",
            "Adjusting TCP keepalive settings.",
            "Switching ingress controller backend."
        ],
        orchestration: [
            "Restarting Kubelet service on master nodes.",
            "Restoring Etcd quorum from backup.",
            "Pruning evicted pods.",
            "Rescheduling critical daemonsets.",
            "Verifying API server health endpoints.",
            "Patching node operating system.",
            "Uncordoning recovered nodes.",
            "Refreshing service account tokens."
        ],
        code: [
            "Switching to read-only git mirror.",
            "Running `git fsck` to verify object database.",
            "Clearing stale lock files.",
            "Restarting SSH daemon.",
            "Syncing refs with secondary remote.",
            "Pruning loose objects.",
            "Verifying commit signatures.",
            "Restoring reflog from backup."
        ]
    };

    const pool = pools[type] || [
        "Identifying anomaly signature.",
        "Recycling service process.",
        "Clearing temporary buffers.",
        "Verifying configuration integrity.",
        "Restoring normal operation mode."
    ];

    return pickRandom(pool, 4);
};

const generateResolutionSummary = (type: NodeType): string => {
    const scenarios = [
        "Automated failover sequence completed successfully.",
        "Manual override required for final synchronization.",
        "Self-healing heuristics applied corrections.",
        "Fallback redundancy engaged after primary failure.",
        "Configuration drift detected and auto-corrected.",
        "Load shedding protocols stabilized the system.",
        "Emergency patch applied via hotfix pipeline."
    ];
    return scenarios[Math.floor(Math.random() * scenarios.length)];
};

export default function App() {
  const [view, setView] = useState<ViewState>('INTRO');
  const [theme, setTheme] = useState<Theme>('light'); 
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  
  // Incident Reporting State
  const [incidentReport, setIncidentReport] = useState<IncidentReport | null>(null);
  const [activeIncident, setActiveIncident] = useState<ActiveIncidentState | null>(null);
  const [selectedNode, setSelectedNode] = useState<SystemNode | null>(null);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobileSize = window.innerWidth < 900; 
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsPortraitMobile(isMobileSize && isPortrait);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const [state, setState] = useState<SimulationState>({
    nodes: INITIAL_NODES.map(n => ({...n, recoveryPhase: 'IDLE', targetRecoveryTime: 10000})), 
    groups: INITIAL_GROUPS,
    stability: 100,
    budget: 100000,
    logs: [],
    status: 'IDLE',
    signals: {
        load: 20, latency: 24, errorRate: 0.00, integrity: 100, costBurn: 40, userFrustration: 0
    },
    elapsedTime: 0,
    activeDecision: null
  });

  const lastTick = useRef<number>(Date.now());
  const loopRef = useRef<number>(0);
  const logIdCounter = useRef(0);

  const addLog = useCallback((message: string, type: LogEntry['type']) => {
    setState(prev => ({
      ...prev,
      logs: [
        ...prev.logs,
        { id: `log-${logIdCounter.current++}`, timestamp: Date.now(), type, message }
      ].slice(-1000)
    }));
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const handleStartIntro = () => setView('BRIEFING');
  const handleEnterSimulation = () => {
    setView('SIMULATION');
    setState(prev => ({ ...prev, status: 'RUNNING' }));
    addLog("SYSTEM ONLINE: Simulation initialized. Monitoring active.", "system");
  };

  const handleBreak = (id: string) => {
    if (state.status !== 'RUNNING') return;
    setSelectedNode(null);

    setState(prev => {
      const target = prev.nodes.find(n => n.id === id);
      if (!target || target.isDead) return prev;

      addLog(`CRITICAL EVENT: ${target.label} manual disconnect initiated.`, "error");

      const baseTime = 8000;
      let complexityMult = 1.0;
      if (['data', 'orchestration'].includes(target.type)) complexityMult = 2.5; 
      else if (['compute', 'network'].includes(target.type)) complexityMult = 1.5; 
      else complexityMult = 1.0; 
      
      const randomFactor = 0.8 + Math.random() * 0.4;
      const targetRecoveryTime = baseTime * complexityMult * randomFactor;

      const updatedNodes = prev.nodes.map(n => 
        n.id === id ? { 
            ...n, 
            health: 0, 
            isDead: true, 
            load: 0, 
            recoveryProgress: 0, 
            isRecovering: true,
            recoveryPhase: 'DIAGNOSE',
            targetRecoveryTime: targetRecoveryTime
        } : n
      );
      
      return { ...prev, nodes: updatedNodes, stability: Math.max(0, prev.stability - 5) };
    });
  };

  const handleNodeMove = (id: string, x: number, y: number) => {
    setState(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => n.id === id ? { ...n, x, y } : n)
    }));
  };

  // --- MAIN SIMULATION LOOP ---
  const tick = useCallback(() => {
    const now = Date.now();
    const dt = (now - lastTick.current); 
    lastTick.current = now;

    setState(prev => {
      if (prev.status !== 'RUNNING' && prev.status !== 'STABILIZED_RUIN') return prev;

      let currentNodes = [...prev.nodes];
      const brokenNodes = currentNodes.filter(n => n.isDead);
      const activeNodesCount = currentNodes.length - brokenNodes.length;
      
      // Observability Check
      const metricsDead = brokenNodes.some(n => n.id === 'metrics');
      const isAutoFixDisabled = metricsDead || brokenNodes.some(n => n.id === 'incident-auto');

      // Incident State Management
      let currentActiveIncident = activeIncident;
      
      // Standard Incident Logic (if nodes actually break)
      if (brokenNodes.length > 0) {
          if (!currentActiveIncident) {
            const msgs = getIncidentMessages(brokenNodes[0]);
            currentActiveIncident = {
              startTime: now,
              rootCauseId: brokenNodes[0].id,
              involvedNodes: new Set(brokenNodes.map(n => n.id)),
              maxFrustration: prev.signals.userFrustration,
              narratorText: msgs.text,
              narratorSubtext: msgs.sub,
              mitigationStrategy: 'NONE',
              metrics: { revenueLoss: 0, usersImpacted: 0, slaBreachCountdown: 45 }
            };
            setActiveIncident(currentActiveIncident);
          } else {
             brokenNodes.forEach(n => currentActiveIncident?.involvedNodes.add(n.id));
             
             const userFacingNodes = brokenNodes.filter(n => n.tier <= 3);
             
             if (userFacingNodes.length > 0) {
                 currentActiveIncident.metrics.revenueLoss += (800 * userFacingNodes.length * (dt/1000));
                 currentActiveIncident.metrics.usersImpacted += (userFacingNodes.length * 15 * (dt/1000));
                 prev.signals.userFrustration = Math.min(100, prev.signals.userFrustration + (dt / 800));
             } else {
                 currentActiveIncident.metrics.revenueLoss += (50 * brokenNodes.length * (dt/1000)); 
                 prev.signals.userFrustration = Math.min(20, prev.signals.userFrustration + (dt / 5000));
             }
          }
      }

      const nextNodes = currentNodes.map(node => {
        const newNode = { ...node };
        
        // --- Dependency Logic ---
        const upstreamSources = currentNodes.filter(n => n.connections.includes(node.id));
        const brokenUpstream = upstreamSources.filter(n => n.isDead);
        const downstreamTargets = currentNodes.filter(n => node.connections.includes(n.id));
        const brokenDownstream = downstreamTargets.filter(n => n.isDead);

        let isImpacted = false;
        
        // Specific Logic
        if (node.type === 'compute' || node.type === 'network') {
            const k8sBroken = currentNodes.find(n => n.id === 'k8s-cluster')?.isDead;
            if (brokenDownstream.length > 0 || k8sBroken) isImpacted = true;
        } else if (['ci','cd','artifact','security'].includes(node.type)) {
            if (brokenUpstream.length > 0) isImpacted = true;
        } else if (node.type === 'orchestration') {
             if (brokenUpstream.length > 0) isImpacted = true;
        }

        newNode.impactStatus = isImpacted ? 'impacted' : 'none';
        
        // --- Safety Net Animation Phase Logic ---
        if (newNode.isDead && newNode.isRecovering) {
            let canRecover = true;
            if (node.tier > 0 && isAutoFixDisabled) canRecover = false;
            if (brokenDownstream.length > 0) canRecover = false;
            if (currentNodes.some(n => n.isDead && n.tier < node.tier)) canRecover = false;

            if (canRecover) {
                newNode.recoveryProgress += dt;
                
                const progressPct = newNode.recoveryProgress / newNode.targetRecoveryTime;
                const oldPhase = newNode.recoveryPhase;
                if (progressPct < 0.2) newNode.recoveryPhase = 'DIAGNOSE';
                else if (progressPct < 0.4) newNode.recoveryPhase = 'DRAIN';
                else if (progressPct < 0.7) newNode.recoveryPhase = 'STANDBY_ACTIVATION';
                else if (progressPct < 0.95) newNode.recoveryPhase = 'DEPLOY';
                else newNode.recoveryPhase = 'STABILIZE';

                if (newNode.recoveryPhase !== oldPhase) {
                    const phaseMsgs: Record<string, string> = {
                        'DRAIN': `Traffic draining from ${newNode.label} initiated.`,
                        'STANDBY_ACTIVATION': `Provisioning standby replica for ${newNode.label}.`,
                        'DEPLOY': `Deploying patched version of ${newNode.label}.`,
                        'STABILIZE': `Verifying health checks for ${newNode.label}.`
                    };
                    if (phaseMsgs[newNode.recoveryPhase]) {
                        addLog(phaseMsgs[newNode.recoveryPhase], 'system');
                    }
                }

                if (newNode.recoveryProgress >= newNode.targetRecoveryTime) {
                    newNode.isDead = false;
                    newNode.isRecovering = false;
                    newNode.health = 100;
                    newNode.recoveryProgress = 0;
                    newNode.recoveryPhase = 'IDLE';
                    addLog(`SYSTEM RESTORED: ${node.label} backup active.`, "success");
                }
            }
        } else {
             // Logic for normal nodes
             newNode.recoveryPhase = 'IDLE';
             
             // Base Load + Random
             const baseLoad = isImpacted ? 0 : Math.max(10, Math.min(100, newNode.load + (Math.random() - 0.5)));
             newNode.load = Math.min(100, baseLoad);
        }

        return newNode;
      });

      // Clear Incident if Resolved
      const anyBrokenNow = nextNodes.some(n => n.isDead);
      
      if (currentActiveIncident && !anyBrokenNow && currentActiveIncident.rootCauseId !== 'load-balancer') {
          const endTime = now;
          const durationSeconds = (endTime - currentActiveIncident.startTime) / 1000;
          
          const involvedCount = currentActiveIncident.involvedNodes.size;
          const developersMobilized = Math.max(2, involvedCount * 4);
          const manHoursLost = Number((durationSeconds * 0.5 * developersMobilized).toFixed(1));
          
          const churnRate = 0.15; 
          const hasUserFacingBreach = Array.from(currentActiveIncident.involvedNodes).some(id => {
              const n = prev.nodes.find(node => node.id === id);
              return n && n.tier <= 3;
          });
          
          let churnedUsers = 0;
          if (hasUserFacingBreach) {
             churnedUsers = Math.floor(currentActiveIncident.metrics.usersImpacted * churnRate);
             if (currentActiveIncident.metrics.usersImpacted > 100) {
                 churnedUsers = Math.max(churnedUsers, 50); 
             }
          }

          const relevantLogs = prev.logs.filter(l => l.timestamp >= currentActiveIncident.startTime && l.timestamp <= endTime);
          const timeline: IncidentTimelineEvent[] = relevantLogs
             .filter(l => l.type === 'error' || l.type === 'success' || l.message.includes('RECOVERY') || l.type === 'system')
             .map(l => ({ 
                 timestamp: l.timestamp, 
                 message: l.message, 
                 type: l.type === 'error' ? 'error' : 'recovery' 
             }));

          const rootNode = currentNodes.find(n => n.id === currentActiveIncident.rootCauseId);
          const remediationSteps = rootNode ? generateRemediationSteps(rootNode.type) : ["Standard recovery protocol applied."];
          const resolutionType = rootNode ? generateResolutionSummary(rootNode.type) : "Automated Recovery";

          setIncidentReport({
              id: crypto.randomUUID(),
              startTime: currentActiveIncident.startTime,
              endTime: endTime,
              durationSeconds: durationSeconds,
              rootCauseNodeId: currentActiveIncident.rootCauseId,
              involvedNodeIds: Array.from(currentActiveIncident.involvedNodes),
              affectedNodeIds: nextNodes.filter(n => n.impactStatus === 'impacted').map(n => n.id),
              maxFrustration: currentActiveIncident.maxFrustration,
              totalRevenueLoss: currentActiveIncident.metrics.revenueLoss,
              mitigationUsed: currentActiveIncident.mitigationStrategy,
              resolutionType: resolutionType,
              timeline: timeline,
              manHoursLost,
              developersMobilized,
              churnedUsers,
              remediationSteps
          });
          setActiveIncident(null);
      }
      
      // Update Selection
      if (selectedNode) {
          const updatedSelected = nextNodes.find(n => n.id === selectedNode.id);
          if (updatedSelected) setSelectedNode(updatedSelected);
      }

      return {
        ...prev,
        nodes: nextNodes,
        elapsedTime: prev.elapsedTime + dt,
        signals: {
            ...prev.signals,
            load: nextNodes.length > 0 ? 0 : 0,
            costBurn: 20 + (activeNodesCount * 2),
            latency: 24,
            errorRate: 0
        }
      };
    });
  }, [addLog, activeIncident, selectedNode]); 

  useEffect(() => {
    if (state.status === 'RUNNING') {
      loopRef.current = requestAnimationFrame(function frame() {
        tick();
        loopRef.current = requestAnimationFrame(frame);
      });
    }
    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [state.status, tick]);

  if (isPortraitMobile) return <MobileLandscapePrompt />;

  const scrollbarClass = `
    [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:border-2
    ${theme === 'light' 
      ? '[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:border-white hover:[&::-webkit-scrollbar-thumb]:bg-slate-400' 
      : '[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:border-[#18181b] hover:[&::-webkit-scrollbar-thumb]:bg-slate-500'}
  `;

  return (
    <div className={`w-full h-[100dvh] overflow-hidden font-inter select-none transition-colors duration-700
      ${theme === 'light' ? 'bg-[#f0f4f8] text-slate-800' : 'bg-[#09090b] text-slate-200'}`}>
      
      {view === 'INTRO' && <IntroScreen onStart={handleStartIntro} theme={theme} />}
      {view === 'BRIEFING' && <MissionBriefing onEnter={handleEnterSimulation} theme={theme} />}

      {view === 'SIMULATION' && (
        <div className="flex h-full w-full relative">
            
            <ImpactBar 
                state={state} 
                activeIncident={activeIncident} 
                theme={theme}
                advancedOpen={false} 
                onToggleAdvanced={() => {}}
            />

            <div className="flex-1 flex flex-col relative min-w-0 z-0 bg-transparent pt-16">
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                     <Logo theme={theme} size="sm" />
                </div>
                <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                     </button>
                </div>

                <ArchitectureDiagram 
                    nodes={state.nodes} 
                    groups={state.groups}
                    theme={theme} 
                    onBreak={handleBreak} 
                    onInfo={setSelectedNode}
                    onNodeMove={handleNodeMove}
                />
            </div>

            {/* Narrator Display */}
            {activeIncident && (
                 <IncidentNarrator 
                    text={activeIncident.narratorText} 
                    subtext={activeIncident.narratorSubtext}
                    visible={true} 
                    theme={theme} 
                 />
            )}

            <AnimatePresence>
                {selectedNode && (
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`absolute left-0 top-16 bottom-0 w-full md:w-[400px] z-30 shadow-2xl border-r backdrop-blur-xl flex flex-col
                            ${theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-[#18181b]/95 border-slate-800'}`}
                    >
                        {/* Header */}
                        <div className={`p-4 border-b flex justify-between items-start ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}>
                             <div>
                                <h2 className={`text-lg font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{selectedNode.label}</h2>
                                <span className={`text-xs font-mono uppercase tracking-wide opacity-50 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {selectedNode.type} // TIER {selectedNode.tier}
                                </span>
                             </div>
                             <button onClick={() => setSelectedNode(null)} className="p-1 hover:opacity-50 transition-opacity">
                                <X size={20} />
                             </button>
                        </div>
                        
                        {/* Body */}
                        <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${scrollbarClass}`}>
                            <div className="flex items-center gap-4">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border
                                    ${selectedNode.isDead ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}
                                `}>
                                    {selectedNode.isDead ? <AlertTriangle size={14}/> : <Activity size={14}/>}
                                    {selectedNode.isDead ? 'System Offline' : 'Operational'}
                                </div>
                                {selectedNode.impactStatus !== 'none' && !selectedNode.isDead && (
                                   <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">
                                       Degraded
                                   </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className={`p-3 rounded-lg border ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900 border-slate-800'}`}>
                                    <div className="text-[10px] font-bold uppercase opacity-50 mb-1">Load</div>
                                    <div className="text-lg font-mono font-bold">{Math.floor(selectedNode.load)}%</div>
                                </div>
                                <div className={`p-3 rounded-lg border ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900 border-slate-800'}`}>
                                    <div className="text-[10px] font-bold uppercase opacity-50 mb-1">Health</div>
                                    <div className="text-lg font-mono font-bold">{Math.floor(selectedNode.health)}%</div>
                                </div>
                            </div>
                            
                            <div className={`p-4 rounded-lg border border-l-4 border-l-rose-500 ${theme === 'light' ? 'bg-rose-50/50 border-rose-100' : 'bg-rose-900/10 border-rose-900/30'}`}>
                                <div className="flex items-center gap-2 mb-2 text-rose-500">
                                    <AlertTriangle size={12} />
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest">Failure Consequence</h3>
                                </div>
                                <p className={`text-xs leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                    {selectedNode.consequence}
                                </p>
                            </div>

                            <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                                {selectedNode.description}
                            </p>
                            
                            <div className="space-y-4 pt-2">
                                <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/50 border-slate-800'}`}>
                                    <div className="flex items-center gap-2 mb-2 opacity-50">
                                        <Shield size={12} />
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest">Business Value</h3>
                                    </div>
                                    <p className={`text-xs leading-relaxed ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                        {selectedNode.benefit}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-3 opacity-50 px-1">
                                        <GitCommit size={12} />
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest">Topology Dependencies</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {selectedNode.connections.map(targetId => {
                                            const target = state.nodes.find(n => n.id === targetId);
                                            return target ? (
                                                <div key={targetId} className={`flex items-center gap-2 p-2 rounded border text-xs ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-black/20 border-slate-800'}`}>
                                                    <ArrowRight size={12} className="opacity-40" />
                                                    <span className="font-mono">{target.label}</span>
                                                    <span className="ml-auto text-[9px] opacity-40 uppercase tracking-widest">{target.type}</span>
                                                </div>
                                            ) : null;
                                        })}
                                        {selectedNode.connections.length === 0 && (
                                            <div className="text-[10px] italic opacity-40 px-2">No downstream dependencies.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`p-5 border-t ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-[#18181b] border-slate-800'}`}>
                             {!selectedNode.isDead ? (
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleBreak(selectedNode.id)}
                                    className="w-full group relative flex items-center justify-center gap-3 py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xl shadow-rose-500/30 transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-shimmer" style={{ animationDuration: '1.5s' }} />
                                    <Zap size={18} className="relative z-10 animate-pulse" />
                                    <span className="relative z-10 tracking-wide">TRIGGER FAILURE EVENT</span>
                                </motion.button>
                             ) : (
                                <div className="w-full py-3 px-4 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center gap-3">
                                    <div className="animate-spin text-blue-500"><RotateCcw size={18} /></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">Auto-Recovery Active</span>
                                        <span className="text-[10px] font-mono opacity-60">Phase: {selectedNode.recoveryPhase}</span>
                                    </div>
                                </div>
                             )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {incidentReport && (
                    <IncidentModal 
                        report={incidentReport}
                        nodes={state.nodes}
                        theme={theme}
                        onClose={() => setIncidentReport(null)}
                    />
                )}
            </AnimatePresence>

            {state.nodes.map(n => (
                <div key={n.id} style={{ display: 'none' }} />
            ))}
        </div>
      )}
    </div>
  );
}
