import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';

const COUNT = 200;

function generatePositions() {
  const arr = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 40;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  return arr;
}

const INITIAL_POSITIONS = generatePositions();

export function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[INITIAL_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#5c7cfa" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}
