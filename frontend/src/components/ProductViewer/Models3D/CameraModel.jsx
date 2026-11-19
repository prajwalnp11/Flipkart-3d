import React from 'react';
import * as THREE from 'three';

export function CameraModel({ color = '#18181B' }) {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Camera Main Body (Textured Black Magnesium Alloy) */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.95, 0.6]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Right Ergonomic Handgrip */}
      <mesh position={[0.55, 0.15, 0.15]} castShadow>
        <boxGeometry args={[0.42, 0.9, 0.65]} />
        <meshStandardMaterial
          color="#111827"
          roughness={0.85}
          metalness={0.2}
        />
      </mesh>

      {/* Top Viewfinder & Hot Shoe Prism Hump */}
      <mesh position={[0, 0.75, -0.05]} castShadow>
        <boxGeometry args={[0.55, 0.35, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Hot Shoe Mount on top of prism */}
      <mesh position={[0, 0.94, -0.05]}>
        <boxGeometry args={[0.22, 0.04, 0.25]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Mode Dial on Top Left */}
      <mesh position={[-0.45, 0.72, -0.05]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 24]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Shutter Button & Control Wheel on Grip */}
      <mesh position={[0.58, 0.65, 0.32]} rotation={[-0.3, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
        <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Large Professional Camera Lens Barrel */}
      <group position={[0, 0.2, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Lens Mount Base Ring (Chrome / Metallic) */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.1, 32]} />
          <meshStandardMaterial color="#9CA3AF" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Main Outer Barrel */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.5, 32]} />
          <meshStandardMaterial color="#18181B" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Zoom Rubber Grip Ring */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 0.25, 32]} />
          <meshStandardMaterial color="#0F172A" roughness={0.9} />
        </mesh>
        {/* Red Ring for Professional Series (L-Series / G-Master accent) */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.455, 0.455, 0.03, 32]} />
          <meshBasicMaterial color="#DC2626" />
        </mesh>
        {/* Front Lens Element Bezel */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.48, 0.45, 0.18, 32]} />
          <meshStandardMaterial color="#18181B" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Front Optical Glass Element */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
          <meshPhysicalMaterial
            color="#1E3A8A"
            transmission={0.85}
            roughness={0.05}
            metalness={0.2}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            reflectivity={0.9}
          />
        </mesh>
      </group>

      {/* Rear LCD Screen */}
      <mesh position={[0.05, 0.2, -0.31]}>
        <planeGeometry args={[0.88, 0.62]} />
        <meshPhysicalMaterial
          color="#020617"
          roughness={0.1}
          metalness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      {/* Camera Live View UI Graphic on LCD */}
      <mesh position={[0.05, 0.2, -0.312]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.84, 0.58]} />
        <meshBasicMaterial color="#0F172A" />
      </mesh>
      <mesh position={[0.05, 0.2, -0.313]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.78, 0.52]} />
        <meshBasicMaterial
          color="#2874F0"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Rear Eyepiece Viewfinder */}
      <mesh position={[0, 0.75, -0.32]}>
        <boxGeometry args={[0.26, 0.18, 0.1]} />
        <meshStandardMaterial color="#000000" roughness={0.8} />
      </mesh>
    </group>
  );
}
