import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

// Floating Holographic Category Badges orbiting in the central atrium void (matching Reference Video 2 Frame 03)
function FloatingHologramCategory({ name, y, radius, angle, color, floorNumber, onSelect }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle floating bob
    groupRef.current.position.y = y + Math.sin(t * 1.6 + angle) * 0.16;
  });

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius + 3.0;

  return (
    <group
      ref={groupRef}
      position={[x, y, z]}
      rotation={[0, -angle + Math.PI / 2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(floorNumber);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Outer Cyan/Blue Glowing Holographic Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.92, 1.02, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner Rotating Dashed Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.82, 20]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} wireframe side={THREE.DoubleSide} />
      </mesh>
      {/* Holographic Glowing Glass Card */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[1.9, 0.52, 0.04]} />
        <meshPhysicalMaterial
          color="#0C4A6E"
          transmission={0.88}
          transparent
          opacity={0.55}
          roughness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      {/* Neon Cyan Border Strips */}
      <mesh position={[0, 0.62, 0.025]}>
        <boxGeometry args={[1.86, 0.035, 0.015]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>
      <mesh position={[0, 0.14, 0.025]}>
        <boxGeometry args={[1.86, 0.035, 0.015]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>
      {/* Category Name Hologram Text */}
      <Text
        position={[0, 0.38, 0.035]}
        fontSize={0.165}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        letterSpacing={0.04}
      >
        {name}
      </Text>
    </group>
  );
}

export function CentralAtrium() {
  const travelToFloor = useStore((state) => state.travelToFloor);

  const floorLevels = [
    { level: 1, y: 8, title: '1F: TECH & ELECTRONICS' },
    { level: 2, y: 16, title: '2F: FASHION & LIFESTYLE' },
    { level: 3, y: 24, title: '3F: HOME & APPLIANCES' }
  ];

  // Floating holographic badges matching Reference Video 2 Frame 03
  const atriumHolograms = [
    { name: 'MOBILES', y: 5.2, radius: 4.6, angle: 0.1, color: '#2874F0', floorNumber: 1 },
    { name: 'ELECTRONICS', y: 5.8, radius: 4.8, angle: 1.15, color: '#0284C7', floorNumber: 1 },
    { name: 'FURNITURE', y: 6.4, radius: 4.7, angle: 2.2, color: '#10B981', floorNumber: 3 },
    { name: 'HOME APPLIANCE', y: 5.4, radius: 4.9, angle: 3.25, color: '#06B6D4', floorNumber: 3 },
    { name: 'BEAUTY', y: 6.0, radius: 4.6, angle: 4.3, color: '#F43F5E', floorNumber: 2 },
    { name: 'GROCERY', y: 5.5, radius: 4.8, angle: 5.35, color: '#F59E0B', floorNumber: 1 }
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

          {/* Continuous Warm White LED Edge Cove on Balcony Slab Bottom (as seen in Video 2 Frame 03) */}
          <mesh position={[-5.92, -0.18, 0]}>
            <boxGeometry args={[0.04, 0.04, 18]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
          <mesh position={[5.92, -0.18, 0]}>
            <boxGeometry args={[0.04, 0.04, 18]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
          <mesh position={[0, -0.18, 8.97]}>
            <boxGeometry args={[11.9, 0.04, 0.04]} />
            <meshBasicMaterial color="#FEF08A" />
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

      {/* ================= 2. FLOATING HOLOGRAPHIC CATEGORY ORBIT (Reference Video 2 Frame 03) ================= */}
      <group position={[0, 0, 0]}>
        {atriumHolograms.map((hologram, idx) => (
          <FloatingHologramCategory
            key={idx}
            {...hologram}
            onSelect={travelToFloor}
          />
        ))}
      </group>

      {/* ================= 3. SUSPENDED CIRCULAR CHANDELIER RINGS (Reference Video 1 & 2) ================= */}
      <group position={[0, 27.5, 3]}>
        {/* Top Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.2, 0.09, 16, 64]} />
          <meshBasicMaterial color="#E0F2FE" />
        </mesh>
        {/* Middle Ring */}
        <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.8, 0.08, 16, 48]} />
          <meshBasicMaterial color="#BAE6FD" />
        </mesh>
        {/* Bottom Ring */}
        <mesh position={[0, -4.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.4, 0.07, 16, 36]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        {/* Suspension Steel Cables */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => {
          const cx = Math.cos(angle) * 5.2;
          const cz = Math.sin(angle) * 5.2;
          return (
            <mesh key={i} position={[cx, 2.2, cz]}>
              <cylinderGeometry args={[0.015, 0.015, 4.4, 8]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} />
            </mesh>
          );
        })}
      </group>

      {/* ================= 4. CENTRAL MODERN ESCALATORS ================= */}
      {/* Ground to Floor 1 Escalator Pair (Positioned on Left Void) */}
      <group position={[-3.8, 0, 3]}>
        <group position={[0, 4, 0]} rotation={[0.55, 0, 0]}>
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

      {/* ================= 5. FOUR FULL-HEIGHT ARCHITECTURAL PILLARS ================= */}
      {[
        [-5.8, -3.0],
        [5.8, -3.0],
        [-5.8, 9.0],
        [5.8, 9.0]
      ].map(([x, z], idx) => (
        <group key={idx} position={[x, 16, z]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.55, 32, 32]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
          </mesh>
          {[0, 8, 16, 24].map((yLevel, i) => (
            <mesh key={i} position={[0, yLevel - 16, 0]}>
              <cylinderGeometry args={[0.58, 0.58, 0.12, 32]} />
              <meshBasicMaterial color="#2874F0" />
            </mesh>
          ))}
        </group>
      ))}

      {/* ================= 6. GRAND ATRIUM SKYLIGHT ROOF (Y = 32) ================= */}
      <group position={[0, 32, 3]}>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[36, 30]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
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
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[7.55, 7.55, 0.4, 48]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.7} roughness={0.2} wireframe />
        </mesh>
        <pointLight position={[0, -2, 0]} intensity={3.5} distance={38} color="#FFFBEB" />
      </group>
    </group>
  );
}

export default CentralAtrium;
