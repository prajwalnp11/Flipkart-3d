import React from 'react';

export function TabletModel({ color = '#1C1D1F' }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Ultra-thin tablet chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.92, 0.03]} />
        <meshStandardMaterial color={color} metalness={0.92} roughness={0.18} />
      </mesh>

      {/* Front Tandem OLED Liquid Retina Display */}
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[1.24, 0.86]} />
        <meshBasicMaterial color="#0A1E3F" />
      </mesh>

      {/* Screen Wallpaper Glow Accent */}
      <mesh position={[0, 0, 0.018]}>
        <planeGeometry args={[1.18, 0.8]} />
        <meshBasicMaterial color="#0284C7" />
      </mesh>

      {/* Minimalist Camera Bump */}
      <mesh position={[-0.52, 0.34, -0.018]}>
        <boxGeometry args={[0.16, 0.16, 0.015]} />
        <meshStandardMaterial color="#111827" metalness={0.9} />
      </mesh>
      <mesh position={[-0.52, 0.34, -0.026]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#0284C7" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Magnetic Apple Pencil on Top Edge */}
      <mesh position={[0, 0.48, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.85, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Pencil Nib */}
      <mesh position={[0.44, 0.48, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.02, 0.05, 16]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
      </mesh>
    </group>
  );
}
