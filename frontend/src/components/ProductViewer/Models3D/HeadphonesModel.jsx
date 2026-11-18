import React from 'react';
import * as THREE from 'three';

export function HeadphonesModel({ color = '#1B263B' }) {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Top Headband Arch */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <torusGeometry args={[0.75, 0.065, 16, 48, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Headband Comfort Cushion Underneath */}
      <mesh position={[0, 0.73, 0]}>
        <torusGeometry args={[0.72, 0.045, 12, 36, Math.PI * 0.7]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>

      {/* Left & Right Ear Cups Assembly */}
      {[-0.75, 0.75].map((xOffset, idx) => {
        const isLeft = xOffset < 0;
        return (
          <group key={idx} position={[xOffset, 0.05, 0]}>
            {/* Sliding Metal Arm Stem */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.4, 16]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.15} />
            </mesh>

            {/* Pivot Yoke */}
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[0.12, 0.1, 0.14]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
            </mesh>

            {/* Ear Cup Shell */}
            <mesh position={[isLeft ? 0.05 : -0.05, 0, 0]} rotation={[0, 0, isLeft ? -0.15 : 0.15]} castShadow>
              <cylinderGeometry args={[0.34, 0.38, 0.22, 32]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
            </mesh>

            {/* Memory Foam Ear Cushion (Soft Synthetic Leather) */}
            <mesh position={[isLeft ? 0.16 : -0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.26, 0.11, 16, 32]} />
              <meshStandardMaterial color="#0F172A" roughness={0.85} metalness={0.05} />
            </mesh>

            {/* Inner Driver Mesh Cloth */}
            <mesh position={[isLeft ? 0.14 : -0.14, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.24, 24]} />
              <meshBasicMaterial color="#020617" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
