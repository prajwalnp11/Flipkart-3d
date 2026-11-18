import React, { useRef } from 'react';
import * as THREE from 'three';

export function LaptopModel({ color = '#1C1D1F' }) {
  const isSpaceBlack = color.toLowerCase().includes('1c') || color.toLowerCase().includes('black');
  const chassisColor = isSpaceBlack ? '#1C1D1F' : '#D1D5DB';

  return (
    <group position={[0, -0.4, 0]}>
      {/* Base / Keyboard Lower Chassis */}
      <mesh position={[0, 0, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.08, 1.5]} />
        <meshStandardMaterial color={chassisColor} metalness={0.88} roughness={0.25} />
      </mesh>

      {/* Recessed Keyboard Well */}
      <mesh position={[0, 0.042, 0.35]}>
        <boxGeometry args={[1.9, 0.005, 0.78]} />
        <meshStandardMaterial color="#0b0e14" roughness={0.6} />
      </mesh>

      {/* Keyboard Keycaps Grid representation */}
      <mesh position={[0, 0.046, 0.35]}>
        <boxGeometry args={[1.86, 0.008, 0.74]} />
        <meshStandardMaterial color="#171717" roughness={0.4} />
      </mesh>

      {/* Large Force Touch Trackpad */}
      <mesh position={[0, 0.043, 0.94]}>
        <boxGeometry args={[0.82, 0.004, 0.52]} />
        <meshStandardMaterial color={chassisColor} roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Open Screen Lid tilted back ~115 degrees */}
      <group position={[0, 0.04, -0.25]} rotation={[-Math.PI / 1.7, 0, 0]}>
        {/* Screen Outer Aluminum Shell */}
        <mesh position={[0, 0.75, 0.02]} castShadow>
          <boxGeometry args={[2.2, 1.5, 0.04]} />
          <meshStandardMaterial color={chassisColor} metalness={0.88} roughness={0.25} />
        </mesh>

        {/* Display Glass Bezel */}
        <mesh position={[0, 0.75, -0.002]}>
          <planeGeometry args={[2.14, 1.44]} rotation={[0, Math.PI, 0]} />
          <meshBasicMaterial color="#050811" />
        </mesh>

        {/* Active Vibrant Liquid Retina Screen Visual */}
        <mesh position={[0, 0.75, -0.003]}>
          <planeGeometry args={[2.08, 1.38]} rotation={[0, Math.PI, 0]} />
          <meshBasicMaterial color="#0A192F" />
        </mesh>
        {/* Vibrant Gradient Wallpaper on Display */}
        <mesh position={[0, 0.75, -0.004]}>
          <planeGeometry args={[2.0, 1.3]} rotation={[0, Math.PI, 0]} />
          <meshBasicMaterial
            color="#2874F0"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh position={[0.4, 0.9, -0.005]}>
          <circleGeometry args={[0.5, 32]} rotation={[0, Math.PI, 0]} />
          <meshBasicMaterial
            color="#06B6D4"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Top Camera Notch */}
        <mesh position={[0, 1.41, -0.006]}>
          <planeGeometry args={[0.18, 0.04]} rotation={[0, Math.PI, 0]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  );
}
