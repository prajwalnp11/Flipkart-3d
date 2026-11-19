import React from 'react';
import * as THREE from 'three';

export function MannequinModel({ color = '#EC4899' }) {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Heavy Brushed Chrome Base Stand */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.04, 32]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Chrome Vertical Support Pole */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 16]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Haute Couture Fashion Torso (Sculptural Mannequin) */}
      {/* Hips & Waist */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.28, 0.35, 24]} />
        <meshStandardMaterial color="#1E293B" roughness={0.5} />
      </mesh>
      {/* Upper Chest / Tailored Blazer / Dress */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.26, 0.45, 24]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} />
      </mesh>
      {/* Lapels / Collar */}
      <mesh position={[0, 1.35, 0.14]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.38, 0.28, 0.06]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      {/* Neck & Head Form */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.2, 16]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.4} />
      </mesh>
    </group>
  );
}
