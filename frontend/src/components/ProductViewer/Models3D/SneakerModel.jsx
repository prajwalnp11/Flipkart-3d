import React from 'react';
import * as THREE from 'three';

export function SneakerModel({ color = '#0090FF' }) {
  return (
    <group position={[0, -0.3, 0]} rotation={[0, Math.PI / 4, 0]}>
      {/* Rubber Outsole Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.12, 2.2]} />
        <meshStandardMaterial color="#0F172A" roughness={0.9} />
      </mesh>

      {/* 270 Max Air Translucent Heel Bubble */}
      <mesh position={[0, 0.14, -0.65]}>
        <boxGeometry args={[0.85, 0.22, 0.75]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.85}
          opacity={1}
          transparent
          roughness={0.15}
          ior={1.4}
        />
      </mesh>

      {/* Internal Air Dampening Pillars */}
      {[-0.2, 0.2].map((x, idx) => (
        <mesh key={idx} position={[x, 0.14, -0.65]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.2} roughness={0.3} />
        </mesh>
      ))}

      {/* Front Nike React Foam Midsole */}
      <mesh position={[0, 0.12, 0.35]}>
        <boxGeometry args={[0.88, 0.18, 1.2]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
      </mesh>

      {/* Upper Mesh Body */}
      <mesh position={[0, 0.38, 0.1]} castShadow>
        <boxGeometry args={[0.82, 0.38, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>

      {/* Toe Cap Curve */}
      <mesh position={[0, 0.32, 0.9]}>
        <sphereGeometry args={[0.38, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} />
      </mesh>

      {/* Ankle Collar & Tongue */}
      <mesh position={[0, 0.65, -0.3]}>
        <boxGeometry args={[0.72, 0.45, 0.6]} />
        <meshStandardMaterial color="#0F172A" roughness={0.8} />
      </mesh>

      {/* Laces Strands */}
      {[0.0, 0.2, 0.4].map((z, idx) => (
        <mesh key={idx} position={[0, 0.58, z]}>
          <boxGeometry args={[0.5, 0.04, 0.06]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
