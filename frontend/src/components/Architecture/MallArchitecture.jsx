import React from 'react';
import { CentralAtrium } from './CentralAtrium';
import * as THREE from 'three';

export function MallArchitecture() {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Ground Floor White Carrara Marble Slabs (Spacious Base) */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[42, 36]} />
        <meshStandardMaterial
          color="#F8FAFC"
          roughness={0.12}
          metalness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Decorative Floor Inlay Rings */}
      <mesh position={[0, 0.01, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.8, 7.05, 64]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>
      <mesh position={[0, 0.01, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.2, 7.35, 64]} />
        <meshBasicMaterial color="#CBD5E1" />
      </mesh>

      {/* 2. Side Panoramic Glass Curtain Walls (Floor-to-Ceiling Daylight) */}
      {/* Left Glass Wall */}
      <mesh position={[-18.5, 16, 0]}>
        <boxGeometry args={[0.2, 32, 34]} />
        <meshPhysicalMaterial
          color="#BAE6FD"
          transmission={0.92}
          transparent
          opacity={0.35}
          roughness={0.05}
          metalness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      {/* Left Wall Mullion Grid */}
      {[-12, -4, 4, 12].map((z, idx) => (
        <mesh key={idx} position={[-18.4, 16, z]}>
          <boxGeometry args={[0.3, 32, 0.2]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.3} />
        </mesh>
      ))}

      {/* Right Glass Wall */}
      <mesh position={[18.5, 16, 0]}>
        <boxGeometry args={[0.2, 32, 34]} />
        <meshPhysicalMaterial
          color="#BAE6FD"
          transmission={0.92}
          transparent
          opacity={0.35}
          roughness={0.05}
          metalness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      {/* Right Wall Mullion Grid */}
      {[-12, -4, 4, 12].map((z, idx) => (
        <mesh key={idx} position={[18.4, 16, z]}>
          <boxGeometry args={[0.3, 32, 0.2]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.3} />
        </mesh>
      ))}

      {/* 3. Rear Architectural Core & Elevator Shaft Backing Wall */}
      <mesh position={[0, 16, -11.5]} receiveShadow>
        <boxGeometry args={[42, 32, 0.6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.1} />
      </mesh>

      {/* Vertical Glass Elevator Shaft Frame at Z = -7.5 */}
      <group position={[0, 16, -7.5]}>
        {/* Left & Right Chrome Guide Rails (Height = 32) */}
        <mesh position={[-2.4, 0, 0]}>
          <boxGeometry args={[0.15, 32, 0.25]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[2.4, 0, 0]}>
          <boxGeometry args={[0.15, 32, 0.25]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Rear Counterweight Steel Cables */}
        {[-0.8, -0.4, 0.4, 0.8].map((x, i) => (
          <mesh key={i} position={[x, 0, -1.8]}>
            <cylinderGeometry args={[0.015, 0.015, 32, 8]} />
            <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Shaft Glass Enclosure Panels */}
        <mesh position={[-2.4, 0, -0.9]}>
          <boxGeometry args={[0.05, 32, 1.8]} />
          <meshPhysicalMaterial color="#BAE6FD" transmission={0.92} transparent opacity={0.3} roughness={0.05} />
        </mesh>
        <mesh position={[2.4, 0, -0.9]}>
          <boxGeometry args={[0.05, 32, 1.8]} />
          <meshPhysicalMaterial color="#BAE6FD" transmission={0.92} transparent opacity={0.3} roughness={0.05} />
        </mesh>
      </group>

      {/* 4. Central Multi-Storey Open Atrium */}
      <CentralAtrium />
    </group>
  );
}
