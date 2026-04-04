import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';

interface StepNodeProps {
  position: [number, number, number];
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  isProcessing: boolean;
  color: string;
  onClick: () => void;
}

export function StepNode({ position, label, isActive, isCompleted, isProcessing, color, onClick }: StepNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      // Gentle float
      meshRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.08;

      if (isProcessing) {
        meshRef.current.rotation.y += 0.02;
      } else if (isActive) {
        const scale = 1 + Math.sin(t * 2.5) * 0.06;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
    if (glowRef.current) {
      glowRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.08;
      const opacity = isActive ? 0.15 + Math.sin(t * 3) * 0.08 : 0;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  const nodeColor = isCompleted ? '#22c55e' : isActive || isProcessing ? color : '#374151';

  return (
    <group>
      {/* Glow */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>

      {/* Main node */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: R3F mesh with onClick is standard pattern */}
      <mesh
        ref={meshRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={isActive || isProcessing ? color : '#000000'}
          emissiveIntensity={isActive || isProcessing ? 0.3 : 0}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[position[0], position[1] - 0.6, position[2]]}
        fontSize={0.15}
        color={isActive ? '#ffffff' : '#9ca3af'}
        anchorX="center"
        anchorY="top"
        maxWidth={2}
      >
        {label}
      </Text>
    </group>
  );
}
