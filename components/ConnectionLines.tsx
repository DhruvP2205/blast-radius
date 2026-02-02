
import React from 'react';
import { SystemNode } from '../types';
import { Theme } from '../App';

interface ConnectionLinesProps {
  nodes: SystemNode[];
  theme: Theme;
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ nodes, theme, width, height }) => {
  const getNode = (id: string) => nodes.find(n => n.id === id);
  const isLight = theme === 'light';

  // Colors
  const lineColor = isLight ? '#cbd5e1' : '#334155'; // Slate-300 / Slate-700
  const brokenColor = isLight ? '#fca5a5' : '#7f1d1d'; // Red-300 / Red-900

  const PORT_OFFSET_X = 35; // Wider for new node size
  const PORT_OFFSET_Y_TOP = 35;
  const PORT_OFFSET_Y_BOTTOM = 70; 

  const getPort = (node: SystemNode, dir: 't' | 'b' | 'l' | 'r'): Point => {
      switch (dir) {
          case 't': return { x: node.x, y: node.y - PORT_OFFSET_Y_TOP };
          case 'b': return { x: node.x, y: node.y + PORT_OFFSET_Y_BOTTOM };
          case 'l': return { x: node.x - PORT_OFFSET_X, y: node.y };
          case 'r': return { x: node.x + PORT_OFFSET_X, y: node.y };
      }
  };

  const createRoundedPath = (points: Point[], radius: number = 10): string => {
    if (points.length < 2) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      const distPrev = Math.hypot(curr.x - prev.x, curr.y - prev.y);
      const distNext = Math.hypot(next.x - curr.x, next.y - curr.y);
      const r = Math.min(radius, distPrev / 2, distNext / 2);
      if (r < 1) { path += ` L ${curr.x} ${curr.y}`; continue; }
      const dxPrev = Math.sign(curr.x - prev.x);
      const dyPrev = Math.sign(curr.y - prev.y);
      const pStart = { x: curr.x - dxPrev * r, y: curr.y - dyPrev * r };
      const dxNext = Math.sign(next.x - curr.x);
      const dyNext = Math.sign(next.y - curr.y);
      const pEnd = { x: curr.x + dxNext * r, y: curr.y + dyNext * r };
      path += ` L ${pStart.x} ${pStart.y}`;
      path += ` Q ${curr.x} ${curr.y} ${pEnd.x} ${pEnd.y}`;
    }
    path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    return path;
  };

  const getRoutePoints = (source: SystemNode, target: SystemNode): Point[] => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    
    // Custom Routes
    if (source.id === 'logs' && target.id === 'alerting') {
        const start = getPort(source, 'l');
        const end = getPort(target, 't');
        return [start, { x: end.x, y: start.y }, end];
    }
    if (source.id === 'incident-auto' && target.id === 'k8s-cluster') {
        const start = getPort(source, 'b');
        const end = getPort(target, 't');
        const midY = 380; 
        return [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end];
    }
    if (source.x < 250 && target.id === 'deploy-ctrl') {
        const start = getPort(source, 'r');
        const end = getPort(target, 'b'); 
        const channelX = 280;
        const channelY = 230; 
        return [start, { x: channelX, y: start.y }, { x: channelX, y: channelY }, { x: end.x, y: channelY }, end];
    }
    if (source.x < 250 && target.id === 'ci-runner') {
        const start = getPort(source, 'r');
        const end = getPort(target, 'l');
        const channelX = 280;
        return [start, { x: channelX, y: start.y }, { x: channelX, y: end.y }, end];
    }
    if (source.id === 'backend-svc' && target.id === 'cache') {
        const start = getPort(source, 'r');
        const end = getPort(target, 'l');
        const midX = 1000; 
        return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
    }

    // Standard Heuristics
    if (Math.abs(dx) < 20) {
        if (dy > 0) return [getPort(source, 'b'), getPort(target, 't')];
        else return [getPort(source, 't'), getPort(target, 'b')];
    }
    if (Math.abs(dy) < 20) {
        if (dx > 0) return [getPort(source, 'r'), getPort(target, 'l')];
        else return [getPort(source, 'l'), getPort(target, 'r')];
    }
    const start = getPort(source, 'r');
    const end = getPort(target, 'l');
    const midX = (start.x + end.x) / 2;
    return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
  };

  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-0 overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <marker 
          id="arrow-slow" 
          markerWidth="4" 
          markerHeight="4" 
          refX="2" 
          refY="2" 
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L4,2 L0,4 z" fill={lineColor} />
        </marker>
      </defs>

      {nodes.map(node => (
        node.connections.map(targetId => {
          const target = getNode(targetId);
          if (!target) return null;

          let isBroken = false;
          if (['code', 'ci', 'cd', 'iac', 'artifact'].includes(node.type)) {
              if (node.isDead) isBroken = true;
          } else {
              if (target.isDead) isBroken = true;
          }

          const strokeColor = isBroken ? brokenColor : lineColor;
          const points = getRoutePoints(node, target);
          const pathD = createRoundedPath(points, 12);
          
          return (
            <g key={`${node.id}-${target.id}`}>
              <path
                d={pathD}
                stroke={strokeColor}
                strokeWidth={isBroken ? 1 : 1.5}
                fill="none"
                strokeDasharray={isBroken ? "4,6" : "none"} // Dashed if broken
                className="transition-colors duration-500"
              />
              
              {/* Legit Flow Particle */}
              {!isBroken && (
                 <circle r={2} fill={isLight ? '#64748b' : '#94a3b8'}>
                    <animateMotion 
                    dur="3s" 
                    repeatCount="indefinite"
                    path={pathD}
                    calcMode="linear"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    />
                 </circle>
              )}
            </g>
          );
        })
      ))}
    </svg>
  );
};
