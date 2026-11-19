import React from 'react';
import * as THREE from 'three';

export function SpeakerModel({ color = '#2874F0' }) {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Cylindrical High-Performance Speaker Body */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 1.35, 36]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Top Brushed Aluminium Control Cap */}
      <mesh position={[0, 1.14, 0]}>
        <cylinderGeometry args={[0.41, 0.41, 0.05, 36]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Top Touch Volume Indicator Ring (Glowing Blue) */}
      <mesh position={[0, 1.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.26, 0.32, 32]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>
      {/* Power / Bluetooth status LED */}
      <mesh position={[0, 1.17, 0.15]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>

      {/* Bottom Passive Bass Radiator Subwoofer Cap */}
      <mesh position={[0, -0.24, 0]}>
        <cylinderGeometry args={[0.41, 0.41, 0.05, 36]} />
        <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Metallic Trim Ring */}
      <mesh position={[0, -0.23, 0]}>
        <torusGeometry args={[0.39, 0.02, 16, 36]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Speaker Silicone Base Feet */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.04, 32]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} />
      </mesh>
    </group>
  );
}
