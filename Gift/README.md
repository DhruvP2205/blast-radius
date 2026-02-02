# Blast Radius Presentation Deck Content

**Theme:** System Collapse Hackathon  
**Project:** Blast Radius - Chaos Engineering Simulator

---

## Slide 1: Title Slide

**Title:** Blast Radius: Architecture Simulation & Chaos Engineering  
**Subtitle:** Experience the Beauty of Failing Architectures  
**Presenter:** [Your Name/Team Name]  
**Hackathon Track:** System Collapse  

**Speaker Notes:**
- "Good morning/afternoon. We are here to present 'Blast Radius', a browser-based interactive simulation built specifically for the System Collapse Hackathon."
- "Instead of building a tool to *prevent* collapse, we built a tool to *visualize, understand, and master* it."

---

## Slide 2: The Problem Context

**Title:** Distributed Systems are Fragile

**Key Points:**
- **Complexity:** Modern cloud-native stacks (Kubernetes, Microservices, Event Buses) have massive surface areas for failure.
- **The "On-Call" Gap:** Junior engineers and students rarely get to experience catastrophic system failures until they are actually on-call at 3 AM.
- **Cost of Learning:** Learning by breaking real production systems is expensive, dangerous, and career-limiting.
- **Invisible Dependencies:** It is often unclear how a minor failure (e.g., a Redis cache eviction) cascades into a total system outage.

**Speaker Notes:**
- "Werner Vogels famously said, 'Everything fails, all the time.' Yet, we rarely practice failure in a safe environment. We usually learn the hard way—when money and reputation are burning."

---

## Slide 3: The Solution - Blast Radius

**Title:** A Safe Sandbox for System Collapse

**Key Points:**
- **What is it?** A high-fidelity, interactive simulation of a full DevOps lifecycle and cloud infrastructure.
- **The Core Loop:** Users act as a Platform Engineer. They can intentionally break components, observe the "blast radius" of that failure, and attempt to recover.
- **Visual Learning:** Uses dynamic SVG topology to show flow, dependencies, and breakage in real-time.

**Speaker Notes:**
- "Blast Radius is a flight simulator for SREs. It allows you to inject failure into a complex system and watch exactly how it propagates—without the pager going off in real life."

---

## Slide 4: Hackathon Relevance

**Title:** Why "System Collapse"?

**Key Points:**
- **Theme Alignment:** This project directly addresses the hackathon theme by making "Collapse" the core feature, not a bug.
- **Visualizing Ruin:** We implemented custom animations (shake, glitch, shockwave) to make the abstract concept of "latency" and "downtime" visceral and emotional.
- **Stabilized Ruin:** The goal isn't just uptime; it's understanding the state of "stabilized ruin"—where systems limp along in degraded modes (e.g., high latency but no data loss).

**Speaker Notes:**
- "We took the prompt 'System Collapse' literally. We didn't want to just build a resilient app; we wanted to build an app that teaches you *how* things collapse and how to survive it."

---

## Slide 5: Value for DevOps & SREs

**Title:** Building Mental Models of Failure

**Key Points:**
- **Pattern Recognition:** Teaches users to recognize symptoms. (e.g., High Latency + High CPU = Potential Death Spiral).
- **Empathy:** Simulates the stress of an incident (SLA timers, Revenue Loss counters) to build empathy for on-call responders.
- **Full Lifecycle Visibility:** Unlike other tools that focus only on production, Blast Radius models the *entire* chain:
  - Source Code (Git) -> CI/CD -> Infrastructure -> Data -> Observability.
- **Trade-offs:** Forces users to choose between Speed, Cost, and Stability during remediation.

**Speaker Notes:**
- "This tool helps engineers build the mental muscle memory required to diagnose outages quickly. It connects the dots between a 'Git Merge' and a 'Database Lock'."

---

## Slide 6: The Architecture (Inside the Sim)

**Title:** A Realistic Cloud-Native Topology

**Key Points:**
- **Zone 1: Control Plane:** Git Repos, Terraform State, Policy Engines.
- **Zone 2: CI/CD:** Build Runners, Artifact Registries, ArgoCD Controllers.
- **Zone 3: Runtime:** Kubernetes Clusters, Ingress Controllers, WAFs, Microservices.
- **Zone 4: Data:** Redis Caches, Postgres DBs, Kafka Event Buses.
- **Zone 5: Observability:** Prometheus, ELK Stack, PagerDuty.
- **The Logic:** Nodes have dependencies. If `Identity Service` dies, `API Gateway` throws 401s. If `Redis` dies, `Postgres` load spikes (Thundering Herd).

**Speaker Notes:**
- "We didn't just draw boxes. We programmed the logic of dependencies. If you break the CI Runner, you can't deploy fixes. If you break DNS, the WAF becomes irrelevant. It's a graph-based state machine."

---

## Slide 7: Technical Implementation

**Title:** How We Built It

**Key Points:**
- **Frontend:** React 18 with TypeScript for type-safe simulation logic.
- **Animation Engine:** Framer Motion for complex orchestration (entering simulation, node transitions, incident modals).
- **Visualization:** Custom SVG calculation engine for dynamic Bezier curves (`ConnectionLines.tsx`) that adapt to node states (healthy, degrading, broken).
- **State Management:** A central "tick" loop (`requestAnimationFrame`) simulating server load, latency, and user frustration in real-time.

**Speaker Notes:**
- "Under the hood, this is a real-time game engine. We calculate signal propagation, health decay, and recovery progress 60 times a second to ensure the simulation feels 'alive'."

---

## Slide 8: Live Demo Script

**Title:** Live Simulation

**Action:** *[Switch to Browser Tab]*

1.  **Mission Brief:** Show the "You Are Now On Call" screen. Highlight the emotional hook.
2.  **The Stack:** Scroll through the infrastructure diagram. Point out the connection between Git, CI, and K8s.
3.  **The Trigger:** Click on `Primary DB (Postgres)` -> Select "Trigger Failure Event".
4.  **The Cascade:**
    - Watch the `Backend API` degrade due to connection timeouts.
    - Watch `Revenue Loss` ticker spike.
    - Watch `User Frustration` climb.
5.  **The Logs:** Open the `System Logs` panel to see the "Connection Refused" errors streaming in.
6.  **Resolution:** Click the node again to see the "Auto-Recovery" phase (Failover/Restart).
7.  **Incident Report:** Show the generated "Post-Mortem" modal with Man-Hours lost and Churn stats.

**Speaker Notes:**
- "Let's see what happens when we lose our primary database in the middle of a traffic spike..."

---

## Slide 9: Future Roadmap

**Title:** Beyond the Hackathon

**Key Points:**
- **Multiplayer Mode:** "Red Team" (Attackers) vs. "Blue Team" (Defenders) in the same topology.
- **AI Integration:** An "AI Incident Commander" that offers hints or misleading advice based on the chaos.
- **Custom Scenarios:** Allow users to define their own architectures via YAML import.
- **Scoring System:** Global leaderboards for "Lowest Mean Time to Recovery (MTTR)".

**Speaker Notes:**
- "We see this evolving into a standard training tool for engineering bootcamps and corporate onboarding."

---

## Slide 10: Conclusion & Resources

**Title:** Ready to Break Things?

**Key Points:**
- **Summary:** Blast Radius makes the invisible risks of distributed systems visible.
- **Call to Action:** Don't wait for production to break. Break it here first.
- **Links:**
    - [GitHub Repository Link]
    - [Live Demo Link]
- **Q&A**

**Speaker Notes:**
- "Thank you for your time. We hope Blast Radius helps you appreciate the beauty of a well-architected collapse."
