import React from 'react';
import * as THREE from 'three';

export function EarbudsModel({ color = '#FFFFFF' }) {
  return (
    <group position={[0, -0.05, 0]}>
      {/* Charging Case Lower Body (Smooth Pebble Shape) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.65, 0.45]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Case Seam / Cut Line */}
      <mesh position={[0, 0.16, 0.228]}>
        <planeGeometry args={[0.88, 0.015]} />
        <meshBasicMaterial color="#94A3B8" />
      </mesh>

      {/* Front LED Battery Status Indicator */}
      <mesh position={[0, -0.05, 0.23]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>

      {/* Left Earbud (Resting Angled Outside Case) */}
      <group position={[-0.65, 0.28, 0.2]} rotation={[0.3, 0.4, 0.2]}>
        {/* Acoustic Head Bulb */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.15}
            metalness={0.1}
            clearcoat={1.0}
          />
        </mesh>
        {/* Silicone Ear Tip */}
        <mesh position={[0, 0.16, 0.1]}>
          <cylinderGeometry args={[0.07, 0.11, 0.09, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, -0.04, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.32, 16]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.15}
            metalness={0.1}
            clearcoat={1.0}
          />
        </mesh>
        {/* Silver Charging Tip */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.04, 16]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* Right Earbud (Resting Angled on Other Side) */}
      <group position={[0.65, 0.28, 0.2]} rotation={[0.3, -0.4, -0.2]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.15}
            metalness={0.1}
            clearcoat={1.0}
          />
        </mesh>
        <mesh position={[0, 0.16, 0.1]}>
          <cylinderGeometry args={[0.07, 0.11, 0.09, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.04, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.32, 16]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.15}
            metalness={0.1}
            clearcoat={1.0}
          />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.04, 16]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
