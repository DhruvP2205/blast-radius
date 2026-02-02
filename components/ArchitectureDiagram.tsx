
import React, { useState, useRef, useEffect } from 'react';
import { SystemNode, SystemGroup } from '../types';
import { Theme } from '../App';
import { VisualNode } from './VisualNode';
import { ConnectionLines } from './ConnectionLines';
import { ZoomIn, ZoomOut, Maximize, GitBranch, Zap, Cloud, Database, Activity } from 'lucide-react';

interface ArchitectureDiagramProps {
  nodes: SystemNode[];
  groups: SystemGroup[];
  theme: Theme;
  onBreak: (id: string) => void;
  onInfo: (node: SystemNode) => void;
  onNodeMove: (id: string, x: number, y: number) => void;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ nodes, groups, theme, onBreak, onInfo, onNodeMove }) => {
  const WORLD_WIDTH = 1600; 
  const WORLD_HEIGHT = 1000; 

  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const viewRef = useRef(view);
  viewRef.current = view;
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const draggingNodeIdRef = useRef<string | null>(null);
  const dragDistanceRef = useRef(0);

  useEffect(() => {
    const padding = 50;
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;
    const scaleX = availableWidth / (WORLD_WIDTH + padding);
    const scaleY = availableHeight / (WORLD_HEIGHT + padding);
    const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.4), 1.0);
    const scaledW = WORLD_WIDTH * fitScale;
    const scaledH = WORLD_HEIGHT * fitScale;
    const centerX = (availableWidth - scaledW) / 2;
    const centerY = (availableHeight - scaledH) / 2;
    setView({ x: Math.max(0, centerX), y: Math.max(0, centerY), scale: fitScale });
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;
        const newScale = Math.min(Math.max(0.2, view.scale + delta), 2.0);
        setView(prev => ({ ...prev, scale: newScale }));
    }
  };

  const zoomIn = () => setView(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2.0) }));
  const zoomOut = () => setView(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.2) }));
  const resetView = () => setView({ x: 50, y: 50, scale: 0.8 });

  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
    isPanningRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    containerRef.current?.style.setProperty('cursor', 'grabbing');
  };

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    e.preventDefault();  
    draggingNodeIdRef.current = id;
    dragDistanceRef.current = 0;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    containerRef.current?.style.setProperty('cursor', 'grabbing');
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    if (draggingNodeIdRef.current) dragDistanceRef.current += Math.hypot(dx, dy);

    if (draggingNodeIdRef.current) {
        const currentScale = viewRef.current.scale;
        const node = nodesRef.current.find(n => n.id === draggingNodeIdRef.current);
        if (node) onNodeMove(node.id, node.x + dx / currentScale, node.y + dy / currentScale);
    } else if (isPanningRef.current) {
        setView(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }
  };

  const handleGlobalMouseUp = () => {
    if (draggingNodeIdRef.current && dragDistanceRef.current < 5) {
        const node = nodesRef.current.find(n => n.id === draggingNodeIdRef.current);
        if (node) onInfo(node);
    }
    isPanningRef.current = false;
    draggingNodeIdRef.current = null;
    dragDistanceRef.current = 0;
    containerRef.current?.style.setProperty('cursor', 'default');
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []); 

  const getGroupIcon = (id: string) => {
      switch(id) {
          case 'g1': return <GitBranch size={16} />;
          case 'g2': return <Zap size={16} />;
          case 'g3': return <Cloud size={16} />;
          case 'g4': return <Database size={16} />;
          case 'g5': return <Activity size={16} />;
          default: return <Cloud size={16} />;
      }
  };

  // SPOTLIGHT LOGIC: Calculate dimmed state
  const brokenNode = nodes.find(n => n.isDead);
  const getIsDimmed = (node: SystemNode) => {
      if (!brokenNode) return false;
      if (node.id === brokenNode.id) return false;
      if (brokenNode.connections.includes(node.id)) return false; // Downstream
      if (node.connections.includes(brokenNode.id)) return false; // Upstream
      return true; // Dim everything else
  };

  return (
    <div className={`w-full h-full overflow-hidden relative select-none
      ${theme === 'light' ? 'bg-white' : 'bg-[#0f172a]'}`}>
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          transformOrigin: '0 0',
          backgroundImage: `radial-gradient(${theme === 'light' ? '#e2e8f0' : '#334155'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          width: '10000px', height: '10000px', left: '-5000px', top: '-5000px'
        }}
      />
      <div 
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleBackgroundMouseDown}
        onWheel={handleWheel}
      >
        <div 
            style={{ 
                transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
                transformOrigin: '0 0',
                width: WORLD_WIDTH, 
                height: WORLD_HEIGHT,
                position: 'relative'
            }}
        >
            <svg 
                className="absolute inset-0 pointer-events-none z-0"
                viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
                style={{ width: '100%', height: '100%' }}
            >
                {groups.map(group => (
                    <g key={group.id} opacity={brokenNode ? 0.1 : 1} className="transition-opacity duration-500">
                         <rect x={group.x} y={group.y} width={group.width} height={group.height} rx="8" fill={group.color} fillOpacity="0.04"/>
                        <rect x={group.x} y={group.y} width={group.width} height={group.height} rx="8" fill="none" stroke={group.color} strokeWidth="1.5" strokeDasharray="8 6"/>
                        <path d={`M ${group.x} ${group.y+8} Q ${group.x} ${group.y} ${group.x+8} ${group.y} H ${group.x + 36} V ${group.y + 30} H ${group.x} V ${group.y+8} Z`} fill={group.color} fillOpacity="0.1"/>
                        <text x={group.x + 42} y={group.y + 20} fill={group.color} fontSize="11" fontWeight="bold" fontFamily="sans-serif" className="uppercase tracking-wider">
                            {group.label}
                        </text>
                        <foreignObject x={group.x + 8} y={group.y + 6} width={20} height={20}>
                             <div style={{ color: group.color }}>{getGroupIcon(group.id)}</div>
                        </foreignObject>
                    </g>
                ))}
            </svg>

            <ConnectionLines 
                nodes={nodes} 
                theme={theme} 
                width={WORLD_WIDTH} 
                height={WORLD_HEIGHT} 
            />

            {nodes.map(node => (
                <VisualNode 
                    key={node.id} 
                    node={node} 
                    isDimmed={getIsDimmed(node)}
                    onBreak={onBreak} 
                    onInfo={onInfo} 
                    onMouseDown={handleNodeMouseDown} 
                    theme={theme}
                />
            ))}
        </div>
      </div>
      
      {/* Zoom Controls Only */}
      <div className={`absolute bottom-6 right-6 flex flex-col gap-2 p-2 rounded-lg shadow-xl border z-50
         ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <button onClick={zoomIn} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"><ZoomIn size={18} /></button>
          <button onClick={zoomOut} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"><ZoomOut size={18} /></button>
          <button onClick={resetView} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"><Maximize size={18} /></button>
      </div>
    </div>
  );
};
