import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function CentralAtrium() {
  const floorLevels = [
    { level: 1, y: 8, title: '1F: TECH & ELECTRONICS' },
    { level: 2, y: 16, title: '2F: FASHION & LIFESTYLE' },
    { level: 3, y: 24, title: '3F: HOME & APPLIANCES' }
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. MULTI-LEVEL MEZZANINE VOID & GLASS RAILINGS ================= */}
      {floorLevels.map(({ level, y, title }) => (
        <group key={level} position={[0, y, 0]}>
          {/* Floor Mezzanine Slab Outer Ring */}
          {/* Left Walkway Slab */}
          <mesh position={[-12, -0.2, 0]} receiveShadow>
            <boxGeometry args={[12, 0.4, 28]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.15} metalness={0.1} />
          </mesh>
          {/* Right Walkway Slab */}
          <mesh position={[12, -0.2, 0]} receiveShadow>
            <boxGeometry args={[12, 0.4, 28]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.15} metalness={0.1} />
          </mesh>
          {/* Back Walkway Slab around Elevator */}
          <mesh position={[0, -0.2, -8.5]} receiveShadow>
            <boxGeometry args={[36, 0.4, 11]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.15} metalness={0.1} />
          </mesh>
          {/* Front Bridge / Walkway */}
          <mesh position={[0, -0.2, 11.5]} receiveShadow>
            <boxGeometry args={[36, 0.4, 5]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.15} metalness={0.1} />
          </mesh>

          {/* Flipkart Blue Glowing Trim on Slab Edge */}
          <mesh position={[-5.95, -0.05, 0]}>
            <boxGeometry args={[0.08, 0.12, 18]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          <mesh position={[5.95, -0.05, 0]}>
            <boxGeometry args={[0.08, 0.12, 18]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          <mesh position={[0, -0.05, 9.0]}>
            <boxGeometry args={[12, 0.12, 0.08]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          <mesh position={[0, -0.05, -3.0]}>
            <boxGeometry args={[12, 0.12, 0.08]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>

          {/* Transparent Glass Railing around the Central Atrium Void */}
          {/* Left Glass Railing */}
          <mesh position={[-5.95, 0.65, 3]}>
            <boxGeometry args={[0.05, 1.1, 12]} />
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
          {/* Left Handrail (Brushed Chrome) */}
          <mesh position={[-5.95, 1.22, 3]}>
            <boxGeometry args={[0.1, 0.06, 12]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Right Glass Railing */}
          <mesh position={[5.95, 0.65, 3]}>
            <boxGeometry args={[0.05, 1.1, 12]} />
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
          {/* Right Handrail */}
          <mesh position={[5.95, 1.22, 3]}>
            <boxGeometry args={[0.1, 0.06, 12]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Front Curved/Cross Railing */}
          <mesh position={[0, 0.65, 8.95]}>
            <boxGeometry args={[11.8, 1.1, 0.05]} />
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
          <mesh position={[0, 1.22, 8.95]}>
            <boxGeometry args={[11.8, 0.06, 0.1]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Chrome Railing Support Balusters */}
          {[-5, -2.5, 0, 2.5, 5].map((x, idx) => (
            <mesh key={idx} position={[x, 0.6, 8.95]}>
              <cylinderGeometry args={[0.025, 0.025, 1.15, 16]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
            </mesh>
          ))}

          {/* Mezzanine Department Signboard on Atrium Facia */}
          <group position={[0, -0.65, 9.0]}>
            <mesh>
              <boxGeometry args={[8, 0.65, 0.06]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.3, 0.02]}>
              <boxGeometry args={[8, 0.05, 0.04]} />
              <meshBasicMaterial color="#2874F0" />
            </mesh>
            <Text
              position={[0, 0, 0.04]}
              fontSize={0.26}
              color="#172B4D"
              anchorX="center"
              anchorY="middle"
              fontWeight={900}
            >
              {title}
            </Text>
          </group>
        </group>
      ))}

      {/* ================= 2. CENTRAL MODERN ESCALATORS ================= */}
      {/* Ground to Floor 1 Escalator Pair (Positioned on Left Void) */}
      <group position={[-3.8, 0, 3]}>
        {/* Ascending Escalator Truss (35 degree tilt) */}
        <group position={[0, 4, 0]} rotation={[0.55, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.5, 14.5]} />
            <meshStandardMaterial color="#F1F5F9" roughness={0.2} metalness={0.4} />
          </mesh>
          {/* Glass Balustrade on Escalator */}
          <mesh position={[-0.55, 0.65, 0]}>
            <boxGeometry args={[0.04, 0.85, 14.2]} />
            <meshPhysicalMaterial color="#BAE6FD" transmission={0.9} transparent opacity={0.4} roughness={0.05} />
          </mesh>
          <mesh position={[0.55, 0.65, 0]}>
            <boxGeometry args={[0.04, 0.85, 14.2]} />
            <meshPhysicalMaterial color="#BAE6FD" transmission={0.9} transparent opacity={0.4} roughness={0.05} />
          </mesh>
          {/* Black Moving Handrails */}
          <mesh position={[-0.55, 1.1, 0]}>
            <boxGeometry args={[0.08, 0.06, 14.4]} />
            <meshStandardMaterial color="#0F172A" roughness={0.7} />
          </mesh>
          <mesh position={[0.55, 1.1, 0]}>
            <boxGeometry args={[0.08, 0.06, 14.4]} />
            <meshStandardMaterial color="#0F172A" roughness={0.7} />
          </mesh>
          {/* Chrome Ribbed Steps */}
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.95, 0.05, 13.8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Floor 1 to Floor 2 Escalator Pair (Positioned on Right Void) */}
      <group position={[3.8, 8, 3]}>
        <group position={[0, 4, 0]} rotation={[-0.55, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.5, 14.5]} />
            <meshStandardMaterial color="#F1F5F9" roughness={0.2} metalness={0.4} />
          </mesh>
          <mesh position={[-0.55, 0.65, 0]}>
            <boxGeometry args={[0.04, 0.85, 14.2]} />
            <meshPhysicalMaterial color="#BAE6FD" transmission={0.9} transparent opacity={0.4} roughness={0.05} />
          </mesh>
          <mesh position={[0.55, 0.65, 0]}>
            <boxGeometry args={[0.04, 0.85, 14.2]} />
            <meshPhysicalMaterial color="#BAE6FD" transmission={0.9} transparent opacity={0.4} roughness={0.05} />
          </mesh>
          <mesh position={[-0.55, 1.1, 0]}>
            <boxGeometry args={[0.08, 0.06, 14.4]} />
            <meshStandardMaterial color="#0F172A" roughness={0.7} />
          </mesh>
          <mesh position={[0.55, 1.1, 0]}>
            <boxGeometry args={[0.08, 0.06, 14.4]} />
            <meshStandardMaterial color="#0F172A" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.95, 0.05, 13.8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ================= 3. FOUR FULL-HEIGHT ARCHITECTURAL PILLARS ================= */}
      {[
        [-5.8, -3.0],
        [5.8, -3.0],
        [-5.8, 9.0],
        [5.8, 9.0]
      ].map(([x, z], idx) => (
        <group key={idx} position={[x, 16, z]}>
          {/* Main Structural Column (Height = 32 units) */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.55, 32, 32]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
          </mesh>
          {/* Blue LED Accent Rings at each floor level */}
          {[0, 8, 16, 24].map((yLevel, i) => (
            <mesh key={i} position={[0, yLevel - 16, 0]}>
              <cylinderGeometry args={[0.58, 0.58, 0.12, 32]} />
              <meshBasicMaterial color="#2874F0" />
            </mesh>
          ))}
        </group>
      ))}

      {/* ================= 4. GRAND ATRIUM SKYLIGHT ROOF (Y = 32) ================= */}
      <group position={[0, 32, 3]}>
        {/* Skylight Ceilings surrounding the Glass Dome */}
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[36, 30]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Massive Oval Glass Skylight Dome */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[7.5, 7.5, 0.35, 48]} />
          <meshPhysicalMaterial
            color="#BAE6FD"
            transmission={0.9}
            transparent
            opacity={0.35}
            roughness={0.04}
            metalness={0.1}
            clearcoat={1.0}
          />
        </mesh>
        {/* Space Frame Grid */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[7.55, 7.55, 0.4, 48]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.7} roughness={0.2} wireframe />
        </mesh>
        {/* High-power warm sunbeam streaming down through the skylight */}
        <pointLight position={[0, -2, 0]} intensity={3.5} distance={38} color="#FFFBEB" />
      </group>

      {/* ================= 5. LUXURY INDOOR TROPICAL PLANTERS ================= */}
      {[
        [-5.2, 0, 0],
        [5.2, 0, 0],
        [-5.2, 0, 6],
        [5.2, 0, 6]
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.45, 0.9, 24]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.15} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.62, 0.62, 0.1, 24]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          <mesh position={[0, 1.25, 0]} castShadow>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshStandardMaterial color="#10B981" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
