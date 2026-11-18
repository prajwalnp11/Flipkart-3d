import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

export function AutomaticDoors({ position = [0, 1.4, 0] }) {
  const doorOpen = useStore((state) => state.doorOpen);
  const leftDoorRef = useRef();
  const rightDoorRef = useRef();

  useFrame((_, delta) => {
    const targetLeft = doorOpen ? -1.65 : -0.7;
    const targetRight = doorOpen ? 1.65 : 0.7;

    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.damp(
        leftDoorRef.current.position.x,
        targetLeft,
        6,
        delta
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = THREE.MathUtils.damp(
        rightDoorRef.current.position.x,
        targetRight,
        6,
        delta
      );
    }
  });

  return (
    <group position={position}>
      {/* Outer Door Frame / Top Sensor Unit (Brushed Aluminum & Flipkart Blue) */}
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[3.2, 0.25, 0.2]} />
        <meshStandardMaterial color="#0053C2" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Motion Sensor Beacon */}
      <mesh position={[0, 1.35, 0.12]}>
        <boxGeometry args={[0.2, 0.06, 0.06]} />
        <meshStandardMaterial
          color={doorOpen ? '#10B981' : '#2874F0'}
          emissive={doorOpen ? '#10B981' : '#2874F0'}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Left Sliding Glass Door */}
      <group ref={leftDoorRef} position={[-0.7, 0, 0]}>
        {/* Crystal Glass Panel */}
        <mesh castShadow>
          <boxGeometry args={[1.35, 2.6, 0.05]} />
          <meshPhysicalMaterial
            color="#E0F2FE"
            transparent
            opacity={0.35}
            roughness={0.05}
            metalness={0.1}
            clearcoat={1.0}
            transmission={0.85}
          />
        </mesh>
        {/* Chrome Frame Border */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.38, 2.65, 0.04]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} wireframe />
        </mesh>
        {/* Flipkart Yellow Safety Decal Bar */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.2, 0.08]} />
          <meshBasicMaterial color="#FFE500" />
        </mesh>
      </group>

      {/* Right Sliding Glass Door */}
      <group ref={rightDoorRef} position={[0.7, 0, 0]}>
        {/* Crystal Glass Panel */}
        <mesh castShadow>
          <boxGeometry args={[1.35, 2.6, 0.05]} />
          <meshPhysicalMaterial
            color="#E0F2FE"
            transparent
            opacity={0.35}
            roughness={0.05}
            metalness={0.1}
            clearcoat={1.0}
            transmission={0.85}
          />
        </mesh>
        {/* Chrome Frame Border */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.38, 2.65, 0.04]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} wireframe />
        </mesh>
        {/* Flipkart Yellow Safety Decal Bar */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.2, 0.08]} />
          <meshBasicMaterial color="#FFE500" />
        </mesh>
      </group>

      {/* Welcome Entrance Doormat in Light Elegant Grey & Blue */}
      <mesh position={[0, -1.35, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.8, 1.4]} />
        <meshStandardMaterial color="#EEF2F7" roughness={0.7} />
      </mesh>
      {/* Flipkart Welcome Logo on mat */}
      <mesh position={[0, -1.34, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 0.35]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>
    </group>
  );
}
