import React from 'react';

export function SofaModel({ color = '#1E3A8A' }) {
  return (
    <group position={[0, -0.4, 0]}>
      {/* 4 Wooden & Brass Tapered Legs */}
      {[
        [-1.3, -0.25, 0.45],
        [1.3, -0.25, 0.45],
        [-1.3, -0.25, -0.45],
        [1.3, -0.25, -0.45],
      ].map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Oak Wood Upper Leg */}
          <mesh rotation={[0.1, 0, 0.1 * (pos[0] > 0 ? -1 : 1)]}>
            <cylinderGeometry args={[0.045, 0.03, 0.35, 16]} />
            <meshStandardMaterial color="#78350F" roughness={0.6} />
          </mesh>
          {/* Brushed Brass Foot Tip */}
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.032, 0.025, 0.08, 16]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Solid Seat Base Structure */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.25, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>

      {/* 3 Plush Dual-Density Cloud Seat Cushions */}
      {[-0.95, 0, 0.95].map((x, idx) => (
        <mesh key={idx} position={[x, 0.22, 0.05]} castShadow>
          <boxGeometry args={[0.9, 0.28, 1.05]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}

      {/* Backrest Wall */}
      <mesh position={[0, 0.6, -0.5]} castShadow>
        <boxGeometry args={[3.0, 0.95, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* 3 Plush Back Pillow Cushions */}
      {[-0.95, 0, 0.95].map((x, idx) => (
        <mesh key={idx} position={[x, 0.62, -0.32]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.88, 0.65, 0.2]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}

      {/* Left and Right Armrests */}
      {[-1.5, 1.5].map((x, idx) => (
        <mesh key={idx} position={[x, 0.45, 0]} castShadow>
          <boxGeometry args={[0.25, 0.65, 1.25]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}
