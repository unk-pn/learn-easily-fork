import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface DataFlowProps {
  start: [number, number, number];
  end: [number, number, number];
  isActive: boolean;
  isCompleted: boolean;
  color: string;
}

const PARTICLE_COUNT = 8;

export function DataFlow({ start, end, isActive, isCompleted, color }: DataFlowProps) {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const curve = useMemo(() => {
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2 + 0.5;
    const midZ = (start[2] + end[2]) / 2;
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(midX, midY, midZ),
      new THREE.Vector3(...end),
    );
  }, [start, end]);

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.02, 8, false), [curve]);

  useFrame(({ clock }) => {
    if (!particlesRef.current || (!isActive && !isCompleted)) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const progress = (t * 0.4 + i / PARTICLE_COUNT) % 1;
      const point = curve.getPointAt(progress);
      dummy.position.copy(point);
      dummy.scale.setScalar(isActive ? 0.04 : 0.02);
      dummy.updateMatrix();
      particlesRef.current.setMatrixAt(i, dummy.matrix);
    }
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  const tubeColor = isCompleted ? '#22c55e' : isActive ? color : '#1f2937';

  return (
    <group>
      {/* Connection tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial color={tubeColor} transparent opacity={isActive || isCompleted ? 0.6 : 0.15} />
      </mesh>

      {/* Flow particles */}
      {(isActive || isCompleted) && (
        <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLE_COUNT]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={isActive ? color : '#22c55e'} transparent opacity={0.8} />
        </instancedMesh>
      )}
    </group>
  );
}
