import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { ConceptStep, VisualizationProps } from '../../lib/types';
import { DataFlow } from './DataFlow';
import { FloatingParticles } from './FloatingParticles';
import { StepNode } from './StepNode';

function getNodePositions(count: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const startX = -((count - 1) * 1.2) / 2;
  for (let i = 0; i < count; i++) {
    const x = startX + i * 1.2;
    const y = Math.sin(i * 0.5) * 0.3;
    positions.push([x, y, 0]);
  }
  return positions;
}

interface PipelineSceneProps extends VisualizationProps {
  steps: ConceptStep[];
  color: string;
  onStepClick: (stepId: string) => void;
}

function Scene({ steps, currentStep, completedSteps, processingStep, color, onStepClick }: PipelineSceneProps) {
  const positions = getNodePositions(steps.length);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#5c7cfa" />

      <FloatingParticles />

      {/* Connections */}
      {steps.map((step, i) => {
        if (i === 0) return null;
        const prevStep = steps[i - 1];
        const isCompleted = completedSteps.includes(step.id) && completedSteps.includes(prevStep.id);
        const isActive = step.id === currentStep || step.id === processingStep;

        return (
          <DataFlow
            key={`flow-${prevStep.id}-${step.id}`}
            start={positions[i - 1]}
            end={positions[i]}
            isActive={isActive}
            isCompleted={isCompleted}
            color={color}
          />
        );
      })}

      {/* Nodes */}
      {steps.map((step, i) => (
        <StepNode
          key={step.id}
          position={positions[i]}
          label={step.label}
          isActive={step.id === currentStep}
          isCompleted={completedSteps.includes(step.id)}
          isProcessing={step.id === processingStep}
          color={color}
          onClick={() => onStepClick(step.id)}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={3}
        maxDistance={15}
        autoRotate={false}
        dampingFactor={0.1}
        enableDamping
      />
    </>
  );
}

export function PipelineScene(props: PipelineSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
