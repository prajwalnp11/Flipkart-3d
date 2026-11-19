import React from 'react';
import * as THREE from 'three';

export function HandbagModel({ color = '#D97706' }) {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Designer Leather Handbag Body */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.7, 0.42]} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.15}
        />
      </mesh>

      {/* Folded Top Flap */}
      <mesh position={[0, 0.62, 0.08]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.92, 0.32, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.15} />
      </mesh>

      {/* Gold Metallic Turn-Lock Clasp */}
      <mesh position={[0, 0.42, 0.22]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.42, 0.25]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Rolled Leather / Gold Chain Top Handle */}
      <mesh position={[0, 0.88, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.28, 0.035, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Gold Bottom Protective Studs */}
      {[-0.32, 0.32].map((x, i) => (
        <React.Fragment key={i}>
          <mesh position={[x, 0.01, 0.12]}>
            <cylinderGeometry args={[0.025, 0.03, 0.02, 12]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[x, 0.01, -0.12]}>
            <cylinderGeometry args={[0.025, 0.03, 0.02, 12]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}
