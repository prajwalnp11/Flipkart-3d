import React from 'react';
import * as THREE from 'three';

export function SmartwatchModel({ color = '#B5AEA4' }) {
  return (
    <group position={[0, 0, 0]}>
      {/* 49mm Titanium Squircle Case */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 1.05, 0.28]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Raised Protective Bezel Frame */}
      <mesh position={[0, 0, 0.14]}>
        <boxGeometry args={[0.82, 0.98, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.9} />
      </mesh>

      {/* Flat Sapphire Crystal Glass & OLED Display */}
      <mesh position={[0, 0, 0.16]}>
        <planeGeometry args={[0.74, 0.9]} />
        <meshPhysicalMaterial color="#020617" roughness={0.05} metalness={0.2} clearcoat={1.0} />
      </mesh>

      {/* Watch Face UI (Vibrant 3000 nits display) */}
      <mesh position={[0, 0, 0.162]}>
        <planeGeometry args={[0.7, 0.86]} />
        <meshBasicMaterial color="#061224" />
      </mesh>
      {/* Watch Face Accent Graphic */}
      <mesh position={[0, 0.1, 0.164]}>
        <ringGeometry args={[0.2, 0.23, 32]} />
        <meshBasicMaterial color="#FB641B" />
      </mesh>
      <mesh position={[0, -0.15, 0.164]}>
        <planeGeometry args={[0.35, 0.12]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>

      {/* Digital Crown with Orange Ring Accent */}
      <group position={[0.48, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.11, 0.11, 0.08, 24]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <torusGeometry args={[0.09, 0.015, 12, 24]} />
          <meshStandardMaterial color="#FF6161" roughness={0.4} />
        </mesh>
      </group>

      {/* International Orange Action Button */}
      <mesh position={[-0.47, 0.1, 0]}>
        <boxGeometry args={[0.04, 0.28, 0.1]} />
        <meshStandardMaterial color="#FF6161" roughness={0.4} />
      </mesh>

      {/* Textured Oceanic Strap Wrapping Around */}
      {/* Top Strap */}
      <mesh position={[0, 0.85, -0.1]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.65, 0.85, 0.1]} />
        <meshStandardMaterial color="#0284C7" roughness={0.7} />
      </mesh>
      {/* Bottom Strap */}
      <mesh position={[0, -0.85, -0.1]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.65, 0.85, 0.1]} />
        <meshStandardMaterial color="#0284C7" roughness={0.7} />
      </mesh>
    </group>
  );
}
