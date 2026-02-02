
import { SystemNode, SystemGroup, Decision } from './types';

export const SCAR_PENALTY = 10;
export const RECOVERY_TIME_MS = 10000; // 10s auto-recovery window

export const INITIAL_DECISION: Decision | null = null; 

// --- CLOUD ARCHITECTURE DIAGRAM LAYOUT ---
// Colors
const C_SOURCE = '#64748b'; // Slate
const C_CI = '#db2777';     // Pink
const C_RUNTIME = '#ea580c'; // Orange
const C_DATA = '#059669';    // Emerald
const C_OBS = '#7c3aed';     // Violet

// --- LAYOUT COORDINATES ---
const COL_1 = 150;  // Source
const COL_2 = 400;  // CI Start / LB
const COL_3 = 600;  // Sec / Frontend
const COL_4 = 800;  // Artifact / Backend
const COL_5 = 1000; // Controller
const COL_6 = 1250; // Metrics / Data
const COL_7 = 1450; // Logs / Auto-fix

const ROW_CI = 150;
const ROW_OBS_1 = 150;
const ROW_OBS_2 = 300;
const ROW_VPC_TOP = 520; 
const ROW_VPC_BOT = 700; 

export const INITIAL_GROUPS: SystemGroup[] = [
  { id: 'g1', label: 'Source & Control', x: 50, y: 440, width: 200, height: 450, color: C_SOURCE },
  { id: 'g2', label: 'CI/CD Pipeline', x: 300, y: 50, width: 800, height: 200, color: C_CI },
  { id: 'g3', label: 'Production VPC', x: 300, y: 440, width: 800, height: 450, color: C_RUNTIME },
  { id: 'g4', label: 'Data Persistence', x: 1180, y: 440, width: 350, height: 450, color: C_DATA },
  { id: 'g5', label: 'Observability & Recovery', x: 1180, y: 50, width: 350, height: 350, color: C_OBS },
];

export const INITIAL_NODES: SystemNode[] = [
  // --- GROUP 1: SOURCE ---
  { 
    id: 'git-repo', type: 'code', label: 'Git Repo', subLabel: 'Source', zone: 'Zone 1: Source & Control Plane', 
    x: COL_1, y: 520, health: 100, maxHealth: 100, load: 10, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 5,
    connections: ['ci-runner'],
    description: "The authoritative source of truth for application code and infrastructure definitions. Handles version control, branching strategies, and code review workflows.", 
    benefit: "Enables collaboration, auditability, and rollback capabilities for the entire engineering team.", 
    consequence: "Developers are blocked from merging code. No new features or hotfixes can be deployed.", 
    impactStats: { productivity: 100, trust: 10 }, remediation: "Switch Replica."
  },
  { 
    id: 'iac', type: 'iac', label: 'IaC State', subLabel: 'Terraform', zone: 'Zone 1: Source & Control Plane', 
    x: COL_1, y: 650, health: 100, maxHealth: 100, load: 10, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 5,
    connections: ['deploy-ctrl'], 
    description: "Stores the mapping between your code configurations and real-world cloud resources. Essential for determining what needs to be created, updated, or destroyed.", 
    benefit: "Guarantees infrastructure consistency and prevents manual configuration drift.", 
    consequence: "Infrastructure updates fail. High risk of 'split-brain' scenarios where state desyncs from reality.", 
    impactStats: { productivity: 50, trust: 20 }, remediation: "Re-apply State."
  },
  { 
    id: 'sec-policy', type: 'security', label: 'Policy Engine', subLabel: 'OPA', zone: 'Zone 1: Source & Control Plane', 
    x: COL_1, y: 780, health: 100, maxHealth: 100, load: 10, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 5,
    connections: ['deploy-ctrl'], 
    description: "Enforces organizational governance and security compliance as code. Validates every deployment against strict rules before it reaches production.", 
    benefit: "Prevents misconfigurations and security vulnerabilities from being deployed.", 
    consequence: "Deployments are blocked by default for safety, or run without compliance checks (high risk).", 
    impactStats: { productivity: 20, trust: 80 }, remediation: "Audit Log."
  },

  // --- GROUP 2: CI/CD ---
  { 
    id: 'ci-runner', type: 'ci', label: 'CI Runner', subLabel: 'Build', zone: 'Zone 2: CI/CD Pipeline', 
    x: COL_2, y: ROW_CI, health: 100, maxHealth: 100, load: 15, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 5,
    connections: ['sec-gate'],
    description: "Compute agents responsible for compiling code, running unit tests, and building container images.", 
    benefit: "Automates the validation and packaging process, ensuring only working code moves forward.", 
    consequence: "Deployment pipeline halts. Pull requests sit pending forever. Zero velocity.", 
    impactStats: { productivity: 90, trust: 10 }, remediation: "Restart Agent."
  },
  { 
    id: 'sec-gate', type: 'security', label: 'Scanner', subLabel: 'SAST', zone: 'Zone 2: CI/CD Pipeline', 
    x: COL_3, y: ROW_CI, health: 100, maxHealth: 100, load: 15, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 4,
    connections: ['artifact'],
    description: "Static Application Security Testing (SAST) tool that analyzes source code for known vulnerabilities and CVEs.", 
    benefit: "Catches security flaws early in the development lifecycle (Shift Left).", 
    consequence: "Vulnerable code may leak into production, or safe code is falsely blocked by timeouts.", 
    impactStats: { productivity: 10, trust: 90 }, remediation: "Override."
  },
  { 
    id: 'artifact', type: 'artifact', label: 'Registry', subLabel: 'Images', zone: 'Zone 2: CI/CD Pipeline', 
    x: COL_4, y: ROW_CI, health: 100, maxHealth: 100, load: 15, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 4,
    connections: ['deploy-ctrl'],
    description: "Secure storage for immutable container images (Docker). Acts as the single source of truth for deployable software versions.", 
    benefit: "Ensures consistency across environments. 'Build once, deploy anywhere'.", 
    consequence: "Production cannot scale up or heal because it cannot pull container images.", 
    impactStats: { productivity: 70, trust: 20 }, remediation: "Clean Reg."
  },
  { 
    id: 'deploy-ctrl', type: 'cd', label: 'Controller', subLabel: 'ArgoCD', zone: 'Zone 2: CI/CD Pipeline', 
    x: COL_5, y: ROW_CI, health: 100, maxHealth: 100, load: 15, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 4,
    connections: ['k8s-cluster'], 
    description: "GitOps continuous delivery tool. Monitors the live cluster and syncs it to match the desired state defined in Git.", 
    benefit: "Automates deployments and provides self-healing configuration drift detection.", 
    consequence: "Stale production environment. No new code can go live. Configuration drift goes unchecked.", 
    impactStats: { productivity: 40, trust: 40 }, remediation: "Force Sync."
  },

  // --- GROUP 3: PRODUCTION VPC ---
  // Control Layer
  { 
    id: 'k8s-cluster', type: 'orchestration', label: 'K8s Control', subLabel: 'EKS', zone: 'Zone 3: Production Runtime', 
    x: 700, y: ROW_VPC_TOP, health: 100, maxHealth: 100, load: 20, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 3,
    connections: ['frontend-svc', 'backend-svc'], 
    description: "The Kubernetes Control Plane (API Server, Etcd, Scheduler). It decides where to run containers and maintains cluster health.", 
    benefit: "Orchestrates complex distributed systems, handling scaling, failover, and networking.", 
    consequence: "Brain death of the cluster. No new pods can start. Existing workloads run blindly.", 
    impactStats: { productivity: 60, trust: 50 }, remediation: "Reboot Master."
  },
  { 
    id: 'auto-scaler', type: 'orchestration', label: 'Auto Scaler', subLabel: 'Karpenter', zone: 'Zone 3: Production Runtime', 
    x: 900, y: ROW_VPC_TOP, health: 100, maxHealth: 100, load: 15, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 3,
    connections: ['k8s-cluster'],
    description: "Dynamically provisions compute nodes based on pending pod demand.", 
    benefit: "Ensures performance during traffic spikes and saves cost during lulls.", 
    consequence: "Cluster cannot handle traffic surges (pod starvation) or wastes money on idle nodes.", 
    impactStats: { productivity: 5, trust: 40 }, remediation: "Adjust Limits."
  },

  // Traffic Layer
  { 
    id: 'load-balancer', type: 'network', label: 'Load Balancer', subLabel: 'ALB', zone: 'Zone 3: Production Runtime', 
    x: COL_2, y: ROW_VPC_BOT, health: 100, maxHealth: 100, load: 30, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 2,
    connections: ['frontend-svc'],
    description: "Entry point for all user traffic. Distributes incoming network requests across multiple targets to ensure availability.", 
    benefit: "Prevents any single server from becoming a bottleneck and handles SSL termination.", 
    consequence: "Total system blackout. Users receive 502/504 errors immediately.", 
    impactStats: { productivity: 0, trust: 100 }, remediation: "Reroute DNS."
  },
  { 
    id: 'frontend-svc', type: 'compute', label: 'Frontend', subLabel: 'Service', zone: 'Zone 3: Production Runtime', 
    x: COL_3, y: ROW_VPC_BOT, health: 100, maxHealth: 100, load: 30, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 2,
    connections: ['backend-svc'],
    description: "The user interface rendering service (React/Next.js). Handles client-side logic and presentation.", 
    benefit: "Provides the visual experience and interactivity for the end user.", 
    consequence: "The website fails to load or becomes unresponsive. Direct impact on user experience.", 
    impactStats: { productivity: 0, trust: 80 }, remediation: "Rollback."
  },
  { 
    id: 'backend-svc', type: 'compute', label: 'Backend API', subLabel: 'Service', zone: 'Zone 3: Production Runtime', 
    x: COL_4, y: ROW_VPC_BOT, health: 100, maxHealth: 100, load: 35, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 2,
    connections: ['cache', 'primary-db', 'msg-queue'],
    description: "Core business logic service (Spring Boot/Go). Processes transactions, validates data, and orchestrates workflows.", 
    benefit: "The brains of the application. Enforces business rules and data integrity.", 
    consequence: "App functionality breaks. Users can view the site but cannot perform any actions.", 
    impactStats: { productivity: 10, trust: 90 }, remediation: "Scale Up."
  },

  // --- GROUP 4: DATA ---
  { 
    id: 'cache', type: 'data', label: 'Redis', subLabel: 'Cache', zone: 'Zone 4: Data & State Plane', 
    x: COL_6, y: ROW_VPC_TOP, health: 100, maxHealth: 100, load: 25, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 1,
    connections: [],
    description: "In-memory data store used for sub-millisecond data retrieval. Caches frequent queries and user sessions.", 
    benefit: "Massively reduces load on the primary database and speeds up response times.", 
    consequence: "Extreme latency spikes. Database overload (thundering herd problem). Users logged out.", 
    impactStats: { productivity: 0, trust: 50 }, remediation: "Flush."
  },
  { 
    id: 'primary-db', type: 'data', label: 'Primary DB', subLabel: 'Postgres', zone: 'Zone 4: Data & State Plane', 
    x: COL_6, y: ROW_VPC_BOT, health: 100, maxHealth: 100, load: 25, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 1,
    connections: [],
    description: "Relational database holding critical user data (Orders, Users, Inventory). The ultimate system of record.", 
    benefit: "Guarantees ACID compliance and durable storage of business data.", 
    consequence: "Complete paralysis. No data can be read or written. Potential for catastrophic data loss.", 
    impactStats: { productivity: 20, trust: 95 }, remediation: "Failover."
  },
  { 
    id: 'msg-queue', type: 'data', label: 'Event Bus', subLabel: 'Kafka', zone: 'Zone 4: Data & State Plane', 
    x: COL_6, y: 880, health: 100, maxHealth: 100, load: 20, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 1,
    connections: [],
    description: "Asynchronous event streaming platform. Decouples services by buffering messages for later processing.", 
    benefit: "Allows system components to scale independently and handle traffic bursts gracefully.", 
    consequence: "Event data backlog. Downstream processes (emails, analytics, billing) stop working.", 
    impactStats: { productivity: 10, trust: 30 }, remediation: "Rebalance."
  },

  // --- GROUP 5: OBSERVABILITY ---
  { 
    id: 'metrics', type: 'observability', label: 'Metrics', subLabel: 'Prometheus', zone: 'Zone 5: Observability & Recovery', 
    x: COL_6, y: ROW_OBS_1, health: 100, maxHealth: 100, load: 40, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 0,
    connections: ['alerting'], 
    description: "Time-series database collecting quantitative data (CPU, Memory, Request Rates) from all services.", 
    benefit: "Provides real-time visibility into system health and performance trends.", 
    consequence: "Flying blind. Engineers cannot see if the system is healthy or degrading.", 
    impactStats: { productivity: 80, trust: 20 }, remediation: "Scrape."
  },
  { 
    id: 'logs', type: 'observability', label: 'Logs', subLabel: 'Elastic', zone: 'Zone 5: Observability & Recovery', 
    x: COL_7, y: ROW_OBS_1, health: 100, maxHealth: 100, load: 35, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 0,
    connections: ['alerting'],
    description: "Centralized logging stack. Aggregates text logs from all containers for searching and debugging.", 
    benefit: "Essential for root cause analysis and understanding 'why' an error occurred.", 
    consequence: "Impossible to debug specific errors. Root cause analysis becomes guesswork.", 
    impactStats: { productivity: 90, trust: 10 }, remediation: "Rotate Index."
  },
  { 
    id: 'alerting', type: 'observability', label: 'Alerting', subLabel: 'PagerDuty', zone: 'Zone 5: Observability & Recovery', 
    x: COL_6, y: ROW_OBS_2, health: 100, maxHealth: 100, load: 10, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 0,
    connections: ['incident-auto'],
    description: "Incident management platform. Ingests signals from Metrics/Logs and pages the on-call engineer.", 
    benefit: "Ensures human responders are notified immediately when critical thresholds are breached.", 
    consequence: "Silent failures. Incidents go unnoticed until users complain on social media.", 
    impactStats: { productivity: 30, trust: 90 }, remediation: "Ack."
  },
  { 
    id: 'incident-auto', type: 'observability', label: 'Auto-Fix', subLabel: 'Lambda', zone: 'Zone 5: Observability & Recovery', 
    x: COL_7, y: ROW_OBS_2, health: 100, maxHealth: 100, load: 10, isDead: false, isRecovering: false, recoveryProgress: 0, impactStatus: 'none',
    recoveryPhase: 'IDLE',
    targetRecoveryTime: RECOVERY_TIME_MS,
    tier: 0,
    connections: ['k8s-cluster'], 
    description: "Serverless functions that trigger automated remediation (e.g., restarting pods, clearing caches) based on alerts.", 
    benefit: "Reduces Mean Time To Recovery (MTTR) for common, known issues without human intervention.", 
    consequence: "Manual intervention required for every small glitch. increased operator fatigue.", 
    impactStats: { productivity: 50, trust: 60 }, remediation: "Trigger."
  },
];
