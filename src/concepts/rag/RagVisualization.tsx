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

export function RagVisualization({ currentStep, completedSteps, processingStep }: VisualizationProps) {
  return (
    <div className="w-full h-full">
      <p className="text-gray-500 text-center pt-20">RAG Visualization (WIP)</p>
    </div>
  );
}
