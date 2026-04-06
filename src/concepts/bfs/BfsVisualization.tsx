import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { DataFlow } from '../../components/three/DataFlow';
import { FloatingParticles } from '../../components/three/FloatingParticles';
import { StepNode } from '../../components/three/StepNode';
import type { VisualizationProps } from '../../lib/types';

// ─── Graph topology ───────────────────────────────────────────────────────

const NODE_POSITIONS: Record<string, [number, number, number]> = {
  A: [0, 2.5, 0],
  B: [-2, 0, 0],
  C: [2, 0, 0],
  D: [-3, -2.5, 0],
  E: [-1, -2.5, 0],
  F: [2.5, -2.5, 0],
};

const EDGES: Array<[string, string]> = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'D'],
  ['B', 'E'],
  ['C', 'F'],
];

// ─── BFS state data ───────────────────────────────────────────────────────

const STEP_TO_NODE: Record<string, string | null> = {
  intro: null,
  a: 'A',
  b: 'B',
  c: 'C',
  d: 'D',
  e: 'E',
  f: 'F',
};

const BFS_STEP_ORDER = ['a', 'b', 'c', 'd', 'e', 'f'];

const PARENT_EDGE: Record<string, string | null> = {
  intro: null,
  a: null,
  b: 'A-B',
  c: 'A-C',
  d: 'B-D',
  e: 'B-E',
  f: 'C-F',
};

const NODE_LEVEL: Record<string, number> = { A: 0, B: 1, C: 1, D: 2, E: 2, F: 2 };

const QUEUE_STATE: Record<string, string[]> = {
  intro: [],
  a: ['A'],
  b: ['B', 'C'],
  c: ['C', 'D', 'E'],
  d: ['D', 'E', 'F'],
  e: ['E', 'F'],
  f: ['F'],
};

// ─── 3D Scene ─────────────────────────────────────────────────────────────

function BfsScene({ currentStep, completedSteps }: VisualizationProps) {
  const activeNodeId = STEP_TO_NODE[currentStep] ?? null;

  const visitedNodeIds = useMemo(
    () =>
      new Set(
        completedSteps
          .filter((s) => BFS_STEP_ORDER.includes(s))
          .map((s) => STEP_TO_NODE[s])
          .filter((n): n is string => n !== null),
      ),
    [completedSteps],
  );

  const allSteps = [...completedSteps, currentStep];
  const traversalEdges = new Set(allSteps.map((s) => PARENT_EDGE[s]).filter((e): e is string => e !== null));
  const completedEdges = new Set(completedSteps.map((s) => PARENT_EDGE[s]).filter((e): e is string => e !== null));

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#f59e0b" />

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={4}
        maxDistance={20}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.2}
        enableDamping
        target={[0, 0, 0]}
        autoRotate={false}
      />

      <FloatingParticles count={300} radius={10} />

      {/* Tree edges */}
      {EDGES.map(([from, to]) => {
        const edgeId = `${from}-${to}`;
        return (
          <DataFlow
            key={edgeId}
            from={NODE_POSITIONS[from]}
            to={NODE_POSITIONS[to]}
            isActive={traversalEdges.has(edgeId) && !completedEdges.has(edgeId)}
            isCompleted={completedEdges.has(edgeId)}
            color="#b45309"
          />
        );
      })}

      {/* Nodes */}
      {Object.entries(NODE_POSITIONS).map(([nodeId, pos]) => {
        const isActive = nodeId === activeNodeId;
        const isVisited = visitedNodeIds.has(nodeId);
        return (
          <StepNode
            key={nodeId}
            position={pos}
            label={nodeId}
            isActive={isActive}
            isCompleted={!isActive && isVisited}
            isProcessing={false}
            onClick={() => {}}
            color={isActive ? '#b45309' : '#9ca3af'}
          />
        );
      })}
    </>
  );
}

// ─── BFS Visualization (Canvas + HTML overlay) ───────────────────────────

export function BfsVisualization(props: VisualizationProps) {
  const { currentStep, completedSteps } = props;
  const activeNodeId = STEP_TO_NODE[currentStep] ?? null;
  const queue = QUEUE_STATE[currentStep] ?? [];

  const traversalSoFar = useMemo(() => {
    const visited = completedSteps
      .filter((s) => BFS_STEP_ORDER.includes(s))
      .map((s) => STEP_TO_NODE[s])
      .filter((n): n is string => n !== null);
    if (activeNodeId && !visited.includes(activeNodeId)) visited.push(activeNodeId);
    return visited;
  }, [completedSteps, activeNodeId]);

  const activeLevel = activeNodeId != null ? (NODE_LEVEL[activeNodeId] ?? null) : null;

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <BfsScene {...props} />
      </Canvas>

      {/* Queue panel */}
      <div className="absolute top-4 right-4 rounded-xl border border-gray-700/60 bg-gray-950/90 backdrop-blur-sm p-3 min-w-[110px] shadow-xl pointer-events-none">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Queue <span className="text-gray-600 normal-case font-normal">(front→)</span>
        </p>
        {queue.length === 0 ? (
          <p className="text-[10px] text-gray-600 text-center py-1 italic">empty</p>
        ) : (
          <div className="flex flex-col gap-1">
            {queue.map((node, i) => (
              <div
                key={`${node}-${i}`}
                className={[
                  'text-center rounded py-1 px-2 text-xs font-bold border',
                  i === 0
                    ? 'bg-accent-500/20 border-accent-500/40 text-accent-400'
                    : 'bg-gray-800/60 border-gray-700/40 text-gray-400',
                ].join(' ')}
              >
                {node}
                {i === 0 && <span className="block text-[8px] text-accent-600/70 font-normal">visiting</span>}
                {i === 1 && <span className="block text-[8px] text-gray-600 font-normal">next</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Level badge */}
      {activeLevel != null && (
        <div className="absolute top-4 left-4 rounded-lg border border-accent-500/30 bg-accent-500/10 backdrop-blur-sm px-2.5 py-1.5 shadow-lg pointer-events-none">
          <p className="text-[10px] font-semibold text-accent-400 uppercase tracking-wider">Level {activeLevel}</p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-950/80 backdrop-blur-sm px-2.5 py-1.5 text-[10px] pointer-events-none">
        <span className="flex items-center gap-1 text-gray-400">
          <span className="inline-block w-3 h-3 rounded-full bg-accent-500" /> Active
        </span>
        <span className="flex items-center gap-1 text-gray-400">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500" /> Visited
        </span>
        <span className="flex items-center gap-1 text-gray-400">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-600 border border-gray-500" /> Unvisited
        </span>
      </div>

      {/* Traversal order bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 flex-wrap rounded-xl border border-gray-700/50 bg-gray-950/90 backdrop-blur-sm px-4 py-2 shadow-xl pointer-events-none min-h-[36px]">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">BFS Order:</span>
        {traversalSoFar.length === 0 ? (
          <span className="text-[10px] text-gray-600 italic">Step through to start →</span>
        ) : (
          traversalSoFar.map((node, i) => (
            <div key={node} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-600 text-xs">→</span>}
              <span
                className={[
                  'text-xs font-bold px-1.5 py-0.5 rounded',
                  node === activeNodeId
                    ? 'text-accent-400 bg-accent-500/20 border border-accent-500/30'
                    : 'text-green-400 bg-green-500/10',
                ].join(' ')}
              >
                {node}
                <span className="ml-1 text-[9px] opacity-60">L{NODE_LEVEL[node] ?? 0}</span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
