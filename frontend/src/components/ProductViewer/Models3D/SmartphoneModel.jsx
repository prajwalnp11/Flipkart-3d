import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SmartphoneModel({ color = '#C2A385', isHovered = false }) {
  const groupRef = useRef();

  return (
    <group ref={groupRef} dispose={null}>
      {/* Phone Body / Outer Frame (Titanium) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 2.05, 0.1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.88}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Front Screen (Glossy Glass & OLED) */}
      <mesh position={[0, 0, 0.052]}>
        <planeGeometry args={[0.94, 1.98]} />
        <meshPhysicalMaterial
          color="#090d16"
          roughness={0.05}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Screen Wallpaper visual */}
      <mesh position={[0, 0, 0.053]}>
        <planeGeometry args={[0.91, 1.94]} />
        <meshBasicMaterial color="#0b1736" />
      </mesh>

      {/* Dynamic Glow Gradient on screen */}
      <mesh position={[0, 0.2, 0.054]}>
        <planeGeometry args={[0.85, 1.2]} />
        <meshBasicMaterial
          color="#2874F0"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0.1, -0.3, 0.054]}>
        <planeGeometry args={[0.7, 0.9]} />
        <meshBasicMaterial
          color="#FB641B"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Dynamic Island Pill Cutout */}
      <mesh position={[0, 0.86, 0.055]}>
        <planeGeometry args={[0.22, 0.05]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Back Cover (Textured Matte Glass) */}
      <mesh position={[0, 0, -0.052]}>
        <planeGeometry args={[0.96, 2.0]} rotation={[0, Math.PI, 0]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.45}
          metalness={0.2}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Camera Plateau Bump */}
      <mesh position={[-0.24, 0.58, -0.065]} castShadow>
        <boxGeometry args={[0.42, 0.44, 0.035]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* Camera Lenses (Triple Camera System) */}
      {[
        [-0.32, 0.68, -0.086],
        [-0.32, 0.48, -0.086],
        [-0.16, 0.58, -0.086]
      ].map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Metal Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.02, 32]} />
            <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Optical Glass Lens */}
          <mesh position={[0, 0, -0.012]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.005, 32]} />
            <meshPhysicalMaterial
              color="#020617"
              roughness={0.05}
              metalness={0.3}
              clearcoat={1.0}
            />
          </mesh>
        </group>
      ))}

      {/* Camera Flash */}
      <mesh position={[-0.16, 0.72, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.01, 16]} />
        <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.6} />
      </mesh>

      {/* LiDAR Scanner */}
      <mesh position={[-0.16, 0.45, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Side Buttons & Camera Control */}
      {/* Power Button */}
      <mesh position={[0.505, 0.35, 0]}>
        <boxGeometry args={[0.015, 0.22, 0.03]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Camera Control Button */}
      <mesh position={[0.505, -0.35, 0]}>
        <boxGeometry args={[0.012, 0.16, 0.035]} />
        <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Volume Buttons */}
      <mesh position={[-0.505, 0.45, 0]}>
        <boxGeometry args={[0.015, 0.15, 0.03]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.505, 0.25, 0]}>
        <boxGeometry args={[0.015, 0.15, 0.03]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Bottom USB-C Port */}
      <mesh position={[0, -1.03, 0]}>
        <boxGeometry args={[0.18, 0.02, 0.04]} />
        <meshStandardMaterial color="#050811" roughness={0.8} />
      </mesh>
    </group>
  );
}
