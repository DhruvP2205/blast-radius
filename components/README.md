
# System Architecture Topology

Below is the JSON dataset representing the components within the Blast Radius simulation and their directional dependencies (connections).

```json
{
  "topology": [
    {
      "id": "git-repo",
      "label": "Git Repo",
      "type": "code",
      "connections": ["ci-runner"]
    },
    {
      "id": "iac",
      "label": "IaC State",
      "type": "iac",
      "connections": ["deploy-ctrl"]
    },
    {
      "id": "sec-policy",
      "label": "Policy Engine",
      "type": "security",
      "connections": ["deploy-ctrl"]
    },
    {
      "id": "ci-runner",
      "label": "CI Runner",
      "type": "ci",
      "connections": ["sec-gate"]
    },
    {
      "id": "sec-gate",
      "label": "Scanner",
      "type": "security",
      "connections": ["artifact"]
    },
    {
      "id": "artifact",
      "label": "Registry",
      "type": "artifact",
      "connections": ["deploy-ctrl"]
    },
    {
      "id": "deploy-ctrl",
      "label": "Controller",
      "type": "cd",
      "connections": ["k8s-cluster"]
    },
    {
      "id": "k8s-cluster",
      "label": "K8s Control",
      "type": "orchestration",
      "connections": ["frontend-svc", "backend-svc"]
    },
    {
      "id": "auto-scaler",
      "label": "Auto Scaler",
      "type": "orchestration",
      "connections": ["k8s-cluster"]
    },
    {
      "id": "load-balancer",
      "label": "Load Balancer",
      "type": "network",
      "connections": ["frontend-svc"]
    },
    {
      "id": "frontend-svc",
      "label": "Frontend",
      "type": "compute",
      "connections": ["backend-svc"]
    },
    {
      "id": "backend-svc",
      "label": "Backend API",
      "type": "compute",
      "connections": ["cache", "primary-db", "msg-queue"]
    },
    {
      "id": "cache",
      "label": "Redis",
      "type": "data",
      "connections": []
    },
    {
      "id": "primary-db",
      "label": "Primary DB",
      "type": "data",
      "connections": []
    },
    {
      "id": "msg-queue",
      "label": "Event Bus",
      "type": "data",
      "connections": []
    },
    {
      "id": "metrics",
      "label": "Metrics",
      "type": "observability",
      "connections": ["alerting"]
    },
    {
      "id": "logs",
      "label": "Logs",
      "type": "observability",
      "connections": ["alerting"]
    },
    {
      "id": "alerting",
      "label": "Alerting",
      "type": "observability",
      "connections": ["incident-auto"]
    },
    {
      "id": "incident-auto",
      "label": "Auto-Fix",
      "type": "observability",
      "connections": ["k8s-cluster"]
    }
  ]
}
```
