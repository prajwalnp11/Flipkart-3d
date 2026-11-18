import React from 'react';
import * as THREE from 'three';

export function WashingMachineModel({ color = '#F8FAFC' }) {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Main Washing Machine Cabinet */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.35, 1.6, 1.25]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.25}
        />
      </mesh>

      {/* Top Front Control Fascia Panel */}
      <mesh position={[0, 0.88, 0.63]}>
        <boxGeometry args={[1.34, 0.32, 0.04]} />
        <meshStandardMaterial color="#0F172A" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Detergent Drawer on Top Left */}
      <mesh position={[-0.42, 0.88, 0.655]}>
        <boxGeometry args={[0.38, 0.24, 0.02]} />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Rotary Cycle Selector Dial (Metallic Silver) */}
      <mesh position={[0, 0.88, 0.66]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 32]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Dial Center Indicator Dot */}
      <mesh position={[0, 0.93, 0.685]}>
        <circleGeometry args={[0.012, 16]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* Digital LED Display Screen on Top Right */}
      <mesh position={[0.42, 0.88, 0.655]}>
        <planeGeometry args={[0.36, 0.2]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      {/* Glowing Cycle Time Text Indicator */}
      <mesh position={[0.42, 0.88, 0.658]}>
        <planeGeometry args={[0.26, 0.08]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.85} />
      </mesh>

      {/* Large Front Loading Door Outer Rim (Chrome / Gloss Black) */}
      <mesh position={[0, 0.15, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.07, 16, 48]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Chrome Inner Trim Ring */}
      <mesh position={[0, 0.15, 0.645]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.03, 16, 48]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Tinted Glass Porthole Window */}
      <mesh position={[0, 0.15, 0.63]}>
        <circleGeometry args={[0.36, 36]} />
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Stainless Steel Drum Interior Visible Through Glass */}
      <mesh position={[0, 0.15, 0.52]}>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Door Handle Latch */}
      <mesh position={[0.42, 0.15, 0.66]}>
        <boxGeometry args={[0.04, 0.16, 0.03]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Bottom Service Filter Flap */}
      <mesh position={[0.45, -0.42, 0.63]}>
        <circleGeometry args={[0.07, 24]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Anti-Vibration Feet */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, -0.58, 0.45]}>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
