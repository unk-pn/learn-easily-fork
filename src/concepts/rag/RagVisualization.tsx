import { Background, type Edge, Handle, type Node, type NodeProps, Position, ReactFlow } from '@xyflow/react';
import { useCallback, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import {
  Binary,
  Check,
  Database,
  FileText,
  Filter,
  Loader2,
  MessageSquare,
  Scissors,
  Search,
  Sparkles,
} from 'lucide-react';
import type { VisualizationProps } from '../../lib/types';
import { ragSteps } from './steps';

// ---------------------------------------------------------------------------
// Icon map
// ---------------------------------------------------------------------------
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Scissors,
  Binary,
  Database,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
};

// ---------------------------------------------------------------------------
// Custom node
// ---------------------------------------------------------------------------
interface PipelineNodeData {
  label: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
  isProcessing: boolean;
  stepIndex: number;
  [key: string]: unknown;
}

type PipelineNode = Node<PipelineNodeData, 'pipeline'>;

function PipelineStepNode({ data }: NodeProps<PipelineNode>) {
  const Icon = iconMap[data.icon] ?? Sparkles;

  let border = 'border-gray-700/60';
  let bg = 'bg-gray-800/50';
  let iconBg = 'bg-gray-700/50';
  let iconColor = 'text-gray-400';
  let shadow = '';
  let labelColor = 'text-gray-400';

  if (data.isCompleted) {
    border = 'border-green-500/50';
    bg = 'bg-green-500/10';
    iconBg = 'bg-green-500/20';
    iconColor = 'text-green-400';
    labelColor = 'text-gray-200';
  } else if (data.isActive || data.isProcessing) {
    border = 'border-primary-500/60';
    bg = 'bg-primary-500/10';
    iconBg = 'bg-primary-500/20';
    iconColor = 'text-primary-400';
    shadow = 'shadow-lg shadow-primary-500/10';
    labelColor = 'text-gray-50';
  }

  return (
    <div
      className={`rounded-xl border-2 ${border} ${bg} ${shadow} px-5 py-4 min-w-[140px] transition-all duration-500 ${data.isProcessing ? 'animate-pulse' : ''}`}
    >
      <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="top" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <div className="flex flex-col items-center gap-2">
        <div
          className={`relative h-10 w-10 rounded-lg flex items-center justify-center ${iconBg} transition-colors duration-500`}
        >
          {data.isProcessing ? (
            <Loader2 className={`h-5 w-5 ${iconColor} animate-spin`} />
          ) : data.isCompleted ? (
            <Check className={`h-5 w-5 ${iconColor}`} />
          ) : (
            <Icon className={`h-5 w-5 ${iconColor}`} />
          )}
        </div>
        <span className={`text-xs font-medium text-center leading-tight ${labelColor} transition-colors duration-500`}>
          {data.label}
        </span>
      </div>
      <Handle id="right" type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  );
}

const nodeTypes = { pipeline: PipelineStepNode };

// ---------------------------------------------------------------------------
// Main visualization
// ---------------------------------------------------------------------------

const COLS = 4;
const GAP_X = 210;
const GAP_Y = 160;

export function RagVisualization({ currentStep, completedSteps, processingStep }: VisualizationProps) {
  const nodes = useMemo<PipelineNode[]>(
    () =>
      ragSteps.map((step, i) => {
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        // Reverse every other row for a snake/zigzag layout
        const x = (row % 2 === 1 ? COLS - 1 - col : col) * GAP_X;
        const y = row * GAP_Y;
        return {
          id: step.id,
          type: 'pipeline' as const,
          position: { x, y },
          data: {
            label: step.label,
            icon: step.icon,
            isActive: currentStep === step.id,
            isCompleted: completedSteps.includes(step.id),
            isProcessing: processingStep === step.id,
            stepIndex: i,
          },
          draggable: false,
          selectable: false,
          connectable: false,
        };
      }),
    [currentStep, completedSteps, processingStep],
  );

  const edges = useMemo<Edge[]>(
    () =>
      ragSteps.slice(0, -1).map((step, i) => {
        const next = ragSteps[i + 1];
        const sourceCompleted = completedSteps.includes(step.id);
        const targetActive = currentStep === next.id || processingStep === next.id;
        const isLive = sourceCompleted || targetActive;

        const srcRow = Math.floor(i / COLS);
        const tgtRow = Math.floor((i + 1) / COLS);
        const isRowTransition = srcRow !== tgtRow;
        const isReversedRow = srcRow % 2 === 1;

        let sourceHandle = 'right';
        let targetHandle = 'left';
        if (isRowTransition) {
          sourceHandle = 'bottom';
          targetHandle = 'top';
        } else if (isReversedRow) {
          sourceHandle = 'left';
          targetHandle = 'right';
        }

        return {
          id: `${step.id}-${next.id}`,
          source: step.id,
          target: next.id,
          sourceHandle,
          targetHandle,
          type: 'smoothstep',
          animated: isLive,
          style: {
            stroke: sourceCompleted
              ? 'rgb(var(--green-400))'
              : isLive
                ? 'rgb(var(--primary-400))'
                : 'rgb(var(--gray-600))',
            strokeWidth: isLive ? 2.5 : 1.5,
            opacity: isLive ? 1 : 0.4,
          },
        };
      }),
    [currentStep, completedSteps, processingStep],
  );

  const onInit = useCallback((instance: { fitView: (opts?: Record<string, unknown>) => void }) => {
    instance.fitView({ padding: 0.35 });
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.35 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        <Background color="rgb(var(--gray-700) / 0.3)" gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
