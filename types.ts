

export type SystemStatus = 'IDLE' | 'RUNNING' | 'STABILIZED_RUIN';

export type NodeType = 
  | 'planning' 
  | 'code' 
  | 'ci' 
  | 'artifact' 
  | 'cd' 
  | 'iac' 
  | 'network' 
  | 'orchestration' 
  | 'compute' 
  | 'data' 
  | 'security' 
  | 'observability' 
  | 'user';

export type ZoneType = 
  | 'Zone 1: Source & Control Plane'
  | 'Zone 2: CI/CD Pipeline'
  | 'Zone 3: Production Runtime'
  | 'Zone 4: Data & State Plane'
  | 'Zone 5: Observability & Recovery';

export interface SystemGroup {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export type RecoveryPhase = 'IDLE' | 'DIAGNOSE' | 'DRAIN' | 'STANDBY_ACTIVATION' | 'DEPLOY' | 'STABILIZE';

export interface SystemNode {
  id: string;
  type: NodeType;
  label: string;
  subLabel?: string; 
  zone: ZoneType;
  x: number; // SVG Coordinate
  y: number; // SVG Coordinate
  
  // Simulation Props
  health: number; // 0-100
  maxHealth: number; 
  load: number; // 0-100
  tier: number; // 1 (Data) -> 5 (Source). Lower = Higher Priority for Recovery.
  
  // State flags
  isDead: boolean;
  isRecovering: boolean;
  recoveryPhase: RecoveryPhase; // Drives the "Safety Net" animation
  recoveryProgress: number; // 0-100%
  targetRecoveryTime: number; // Variable time for this specific incident
  impactStatus: 'none' | 'impacted' | 'cascading' | 'compensating'; 
  
  // Static Data for Context Panel
  description: string;
  benefit: string;
  consequence: string;
  
  // New Stats
  impactStats: {
    productivity: number; // 0-100% loss
    trust: number;        // 0-100% loss
  };
  remediation: string; // Recovery steps

  connections: string[]; // IDs of connected nodes
}

export interface SimulationSignals {
  load: number;      
  latency: number;   
  errorRate: number; 
  integrity: number;
  costBurn: number; 
  userFrustration: number;
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  tradeOff: string; 
  impact: {
    latency?: number;
    loadReduction?: number;
    stability?: number;
  };
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  resolved: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'info' | 'warn' | 'error' | 'success' | 'system';
  message: string;
}

// --- INCIDENT TYPES ---

export type MitigationStrategy = 'NONE' | 'COST' | 'SPEED' | 'STABILITY';

export interface LiveImpactMetrics {
  revenueLoss: number;
  usersImpacted: number;
  slaBreachCountdown: number; // Seconds
}

export interface IncidentTimelineEvent {
    timestamp: number;
    message: string;
    type: 'error' | 'recovery' | 'info';
    nodeId?: string;
}

export interface IncidentReport {
  id: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  rootCauseNodeId: string;
  involvedNodeIds: string[]; // All nodes that broke
  affectedNodeIds: string[]; // Nodes that didn't break but were starved
  maxFrustration: number;
  totalRevenueLoss: number;
  mitigationUsed: MitigationStrategy;
  resolutionType: string;
  timeline: IncidentTimelineEvent[];
  
  // New Detailed Metrics for Report
  developersMobilized: number;
  churnedUsers: number;
  remediationSteps: string[];
  manHoursLost: number;
}

export interface ActiveIncidentState {
  startTime: number;
  rootCauseId: string;
  involvedNodes: Set<string>;
  maxFrustration: number;
  narratorText: string;
  narratorSubtext: string; // NEW: Technical explanation
  mitigationStrategy: MitigationStrategy;
  metrics: LiveImpactMetrics;
}

export interface SimulationState {
  nodes: SystemNode[];
  groups: SystemGroup[];
  stability: number; 
  budget: number;
  signals: SimulationSignals;
  status: SystemStatus;
  elapsedTime: number;
  activeDecision: Decision | null;
  logs: LogEntry[];
}