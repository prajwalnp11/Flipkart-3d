import React from 'react';
import * as THREE from 'three';

export function TelevisionModel({ color = '#9CA3AF' }) {
  return (
    <group position={[0, 0, 0]}>
      {/* 75" Razor-Thin Metallic Outer Frame */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[3.2, 1.85, 0.06]} />
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Screen Bezel (0.8mm Infinity Air) */}
      <mesh position={[0, 0.4, 0.032]}>
        <planeGeometry args={[3.14, 1.79]} />
        <meshBasicMaterial color="#020617" />
      </mesh>

      {/* 8K Quantum Dot Display Surface (Vivid Visual) */}
      <mesh position={[0, 0.4, 0.034]}>
        <planeGeometry args={[3.1, 1.75]} />
        <meshBasicMaterial color="#0b1736" />
      </mesh>

      {/* HDR Glowing Scene Elements on Screen */}
      <mesh position={[-0.4, 0.4, 0.035]}>
        <planeGeometry args={[1.8, 1.2]} />
        <meshBasicMaterial
          color="#2874F0"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0.7, 0.5, 0.035]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial
          color="#FB641B"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Center TV Stand Neck */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.3, 0.35, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Flat Heavy Pedestal Base Plate */}
      <mesh position={[0, -0.78, 0.1]} receiveShadow>
        <boxGeometry args={[1.2, 0.03, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}
