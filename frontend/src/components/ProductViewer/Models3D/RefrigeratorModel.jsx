import React from 'react';
import * as THREE from 'three';

export function RefrigeratorModel({ color = '#E2E8F0' }) {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Main Refrigerator Body (Brushed Metallic Steel) */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.4, 1.2]} />
        <meshStandardMaterial
          color={color}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {/* Top Left French Door */}
      <mesh position={[-0.41, 0.9, 0.62]} castShadow>
        <boxGeometry args={[0.76, 1.35, 0.08]} />
        <meshStandardMaterial
          color={color}
          metalness={0.82}
          roughness={0.22}
        />
      </mesh>

      {/* Top Left Door Handle (Vertical Chrome Bar) */}
      <mesh position={[-0.06, 0.85, 0.69]}>
        <cylinderGeometry args={[0.02, 0.02, 0.85, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Top Right Door (with InstaView Glass Window) */}
      <mesh position={[0.41, 0.9, 0.62]} castShadow>
        <boxGeometry args={[0.76, 1.35, 0.08]} />
        <meshStandardMaterial
          color={color}
          metalness={0.82}
          roughness={0.22}
        />
      </mesh>

      {/* InstaView Tinted Glass Panel */}
      <mesh position={[0.41, 0.95, 0.665]}>
        <planeGeometry args={[0.56, 0.95]} />
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Soft Interior Illumination Glow behind InstaView Glass */}
      <mesh position={[0.41, 0.95, 0.662]}>
        <planeGeometry args={[0.52, 0.9]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Top Right Door Handle */}
      <mesh position={[0.06, 0.85, 0.69]}>
        <cylinderGeometry args={[0.02, 0.02, 0.85, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Water & Ice Dispenser Alcove on Left Door */}
      <mesh position={[-0.41, 0.85, 0.665]}>
        <boxGeometry args={[0.34, 0.44, 0.03]} />
        <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Dispenser Lever & Blue LED Indicator */}
      <mesh position={[-0.41, 1.02, 0.68]}>
        <planeGeometry args={[0.22, 0.04]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* Bottom Freezer Pull-Out Drawer */}
      <mesh position={[0, -0.42, 0.62]} castShadow>
        <boxGeometry args={[1.58, 0.85, 0.08]} />
        <meshStandardMaterial
          color={color}
          metalness={0.82}
          roughness={0.22}
        />
      </mesh>

      {/* Freezer Drawer Horizontal Handle */}
      <mesh position={[0, -0.15, 0.69]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 1.1, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Base Trim & Feet */}
      <mesh position={[0, -0.84, 0.58]}>
        <boxGeometry args={[1.56, 0.08, 0.1]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={i} position={[x, -0.87, 0.45]}>
          <cylinderGeometry args={[0.045, 0.045, 0.06, 16]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
      ))}
    </group>
  );
}
