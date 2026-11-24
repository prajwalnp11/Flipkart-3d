import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { getCarraraMarbleTexture, getCarraraMarbleRoughnessTexture } from '../../utils/marbleTextures';

// Luxury Sculptural Concentric Chandelier Rings suspended from the central skylight
function LuxurySkylightChandelier() {
  const chandelierRef = useRef();

  useFrame((_, delta) => {
    if (chandelierRef.current) {
      chandelierRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={chandelierRef} position={[0, 28.5, 3.0]}>
      {/* Tier 1: Large Outer Halo Ring (Soft 3000K Warm White Architectural Glow) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5.6, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#FEF3C7"
          emissive="#FDE68A"
          emissiveIntensity={0.85}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Tier 2: Mid-Level Halo Ring */}
      <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.2, 0.07, 16, 48]} />
        <meshStandardMaterial
          color="#FFFBEB"
          emissive="#FEF3C7"
          emissiveIntensity={0.75}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Tier 3: Inner Halo Ring */}
      <mesh position={[0, -4.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.06, 16, 36]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#E0F2FE"
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Micro-Gauge Aircraft Stainless Steel Suspension Cables */}
      {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle, i) => {
        const cx = Math.cos(angle) * 5.6;
        const cz = Math.sin(angle) * 5.6;
        return (
          <mesh key={i} position={[cx, 1.8, cz]}>
            <cylinderGeometry args={[0.012, 0.012, 3.6, 8]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
          </mesh>
        );
      })}

      {/* Soft Ambient Downward Point Light from Chandelier */}
      <pointLight position={[0, -2.5, 0]} intensity={1.8} distance={28} color="#FEF3C7" />
    </group>
  );
}

// Single Multi-Storey Balcony Level with Curved Balustrades, Recessed Lighting & Signage
function BalconyLevel({ level, y, title, subtitle }) {
  // Cantilevered Mezzanine Balcony Slab with Fluted Carrara Marble Facia
  return (
    <group position={[0, y, 0]}>
      {/* 1. Walkway Slabs (West, East, North/Back, South/Front) */}
      {/* West Wing Walkway Slab */}
      <mesh position={[-12.2, -0.22, 1.5]} receiveShadow>
        <boxGeometry args={[11.6, 0.44, 25]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </mesh>
      {/* East Wing Walkway Slab */}
      <mesh position={[12.2, -0.22, 1.5]} receiveShadow>
        <boxGeometry args={[11.6, 0.44, 25]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </mesh>
      {/* North / Elevator Overlook Bridge */}
      <mesh position={[0, -0.22, -8.6]} receiveShadow>
        <boxGeometry args={[36, 0.44, 8.2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </mesh>
      {/* South Entrance Overlook Bridge */}
      <mesh position={[0, -0.22, 11.8]} receiveShadow>
        <boxGeometry args={[36, 0.44, 6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </mesh>

      {/* 2. Fluted Architectural Marble Facia Edging along Atrium Void */}
      {/* West Facia */}
      <mesh position={[-6.38, -0.22, 1.5]}>
        <boxGeometry args={[0.16, 0.46, 20]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.15} />
      </mesh>
      {/* East Facia */}
      <mesh position={[6.38, -0.22, 1.5]}>
        <boxGeometry args={[0.16, 0.46, 20]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.15} />
      </mesh>
      {/* South Facia */}
      <mesh position={[0, -0.22, 8.8]}>
        <boxGeometry args={[12.8, 0.46, 0.16]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.15} />
      </mesh>
      {/* North Facia */}
      <mesh position={[0, -0.22, -4.5]}>
        <boxGeometry args={[12.8, 0.46, 0.16]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.15} />
      </mesh>

      {/* 3. Concealed Warm 3000K Linear LED Cove Light Ribbon along Balcony Underside */}
      {/* West Cove Ribbon */}
      <mesh position={[-6.32, -0.44, 1.5]}>
        <boxGeometry args={[0.04, 0.03, 19.8]} />
        <meshStandardMaterial
          color="#FEF3C7"
          emissive="#FDE68A"
          emissiveIntensity={1.2}
          roughness={0.3}
        />
      </mesh>
      {/* East Cove Ribbon */}
      <mesh position={[6.32, -0.44, 1.5]}>
        <boxGeometry args={[0.04, 0.03, 19.8]} />
        <meshStandardMaterial
          color="#FEF3C7"
          emissive="#FDE68A"
          emissiveIntensity={1.2}
          roughness={0.3}
        />
      </mesh>
      {/* South Cove Ribbon */}
      <mesh position={[0, -0.44, 8.74]}>
        <boxGeometry args={[12.6, 0.03, 0.04]} />
        <meshStandardMaterial
          color="#FEF3C7"
          emissive="#FDE68A"
          emissiveIntensity={1.2}
          roughness={0.3}
        />
      </mesh>

      {/* 4. Recessed LED Downlights underneath the Balcony Soffit */}
      {[-4, -1.5, 1.5, 4].map((z, idx) => (
        <group key={`downlight-w-${idx}`} position={[-8.5, -0.45, z]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
            <meshStandardMaterial
              color="#FFFBEB"
              emissive="#FEF3C7"
              emissiveIntensity={1.0}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[0.12, 0.16, 16]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
      {[-4, -1.5, 1.5, 4].map((z, idx) => (
        <group key={`downlight-e-${idx}`} position={[8.5, -0.45, z]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
            <meshStandardMaterial
              color="#FFFBEB"
              emissive="#FEF3C7"
              emissiveIntensity={1.0}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[0.12, 0.16, 16]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* 5. Crystal-Clear Tempered Glass Balustrades */}
      {/* West Glass Railing */}
      <mesh position={[-6.38, 0.65, 2.0]} castShadow>
        <boxGeometry args={[0.04, 1.15, 15]} />
        <meshPhysicalMaterial
          color="#E0F2FE"
          transmission={0.93}
          transparent
          opacity={0.35}
          roughness={0.03}
          metalness={0.05}
          clearcoat={1.0}
          ior={1.52}
        />
      </mesh>
      {/* East Glass Railing */}
      <mesh position={[6.38, 0.65, 2.0]} castShadow>
        <boxGeometry args={[0.04, 1.15, 15]} />
        <meshPhysicalMaterial
          color="#E0F2FE"
          transmission={0.93}
          transparent
          opacity={0.35}
          roughness={0.03}
          metalness={0.05}
          clearcoat={1.0}
          ior={1.52}
        />
      </mesh>
      {/* South Cross Railing */}
      <mesh position={[0, 0.65, 8.8]} castShadow>
        <boxGeometry args={[12.7, 1.15, 0.04]} />
        <meshPhysicalMaterial
          color="#E0F2FE"
          transmission={0.93}
          transparent
          opacity={0.35}
          roughness={0.03}
          metalness={0.05}
          clearcoat={1.0}
          ior={1.52}
        />
      </mesh>

      {/* 6. Brushed 316 Stainless Steel Continuous Top Handrails */}
      {/* West Handrail */}
      <mesh position={[-6.38, 1.25, 2.0]}>
        <boxGeometry args={[0.08, 0.05, 15.2]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.94} roughness={0.12} />
      </mesh>
      {/* East Handrail */}
      <mesh position={[6.38, 1.25, 2.0]}>
        <boxGeometry args={[0.08, 0.05, 15.2]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.94} roughness={0.12} />
      </mesh>
      {/* South Handrail */}
      <mesh position={[0, 1.25, 8.8]}>
        <boxGeometry args={[12.8, 0.05, 0.08]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.94} roughness={0.12} />
      </mesh>

      {/* Chrome Glass Support Spigots */}
      {[-5.0, -2.5, 0, 2.5, 5.0].map((x, i) => (
        <mesh key={`post-s-${i}`} position={[x, 0.15, 8.8]}>
          <boxGeometry args={[0.04, 0.3, 0.06]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* 7. Department Illuminated Signage Plaque on Balcony Facia */}
      <group position={[0, -0.65, 8.88]}>
        {/* Brushed Stainless Backplate */}
        <mesh>
          <boxGeometry args={[9.4, 0.68, 0.05]} />
          <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Thin Gold / Nickel Accent Perimeter Trim */}
        <mesh position={[0, 0.32, 0.03]}>
          <boxGeometry args={[9.4, 0.03, 0.02]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[0, -0.32, 0.03]}>
          <boxGeometry args={[9.4, 0.03, 0.02]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <Text
          position={[0, 0.06, 0.04]}
          fontSize={0.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.08}
        >
          {title}
        </Text>
        <Text
          position={[0, -0.18, 0.04]}
          fontSize={0.11}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
          letterSpacing={0.06}
        >
          {subtitle}
        </Text>
      </group>
    </group>
  );
}

// Modern High-Speed Escalator Pair
function LuxuryEscalator({ position, rotation, reverse = false }) {
  return (
    <group position={position} rotation={rotation}>
      <group position={[0, 4, 0]} rotation={[reverse ? -0.55 : 0.55, 0, 0]}>
        {/* Main Escalator Truss Cladding (Brushed Titanium Nickel) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.52, 14.8]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.18} metalness={0.35} />
        </mesh>

        {/* Clear Glass Balustrades */}
        <mesh position={[-0.6, 0.68, 0]}>
          <boxGeometry args={[0.03, 0.88, 14.5]} />
          <meshPhysicalMaterial
            color="#E0F2FE"
            transmission={0.92}
            transparent
            opacity={0.35}
            roughness={0.04}
            metalness={0.05}
            clearcoat={1.0}
          />
        </mesh>
        <mesh position={[0.6, 0.68, 0]}>
          <boxGeometry args={[0.03, 0.88, 14.5]} />
          <meshPhysicalMaterial
            color="#E0F2FE"
            transmission={0.92}
            transparent
            opacity={0.35}
            roughness={0.04}
            metalness={0.05}
            clearcoat={1.0}
          />
        </mesh>

        {/* Continuous Soft White LED Ribbon Under Handrails */}
        <mesh position={[-0.6, 1.05, 0]}>
          <boxGeometry args={[0.03, 0.02, 14.4]} />
          <meshStandardMaterial color="#FEF3C7" emissive="#FDE68A" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.6, 1.05, 0]}>
          <boxGeometry args={[0.03, 0.02, 14.4]} />
          <meshStandardMaterial color="#FEF3C7" emissive="#FDE68A" emissiveIntensity={0.8} />
        </mesh>

        {/* Charcoal Textured Handrails */}
        <mesh position={[-0.6, 1.15, 0]}>
          <boxGeometry args={[0.08, 0.06, 14.6]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>
        <mesh position={[0.6, 1.15, 0]}>
          <boxGeometry args={[0.08, 0.06, 14.6]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>

        {/* Metal Step Tread Deck */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[1.05, 0.04, 14.0]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
}

export function CentralAtrium() {
  const floorLevels = [
    {
      level: 1,
      y: 8,
      title: '1F: TECH AVENUE & FLAGSHIP BOUTIQUES',
      subtitle: 'Apple • Samsung Galaxy • Google Pixel • OnePlus • Xiaomi Leica • Audio'
    },
    {
      level: 2,
      y: 16,
      title: '2F: HAUTE COUTURE & LIFESTYLE GALLERIA',
      subtitle: 'Luxury Fashion • Designer Apparel • Sneaker Vault • Fragrance & Beauty'
    },
    {
      level: 3,
      y: 24,
      title: '3F: MODERN LIVING & APPLIANCE PAVILION',
      subtitle: 'Contemporary Furniture • 8K Neo QLED • Smart Kitchen • Home Decor'
    }
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. MULTI-LEVEL CURVED BALCONIES & ATRIUM VOID ================= */}
      {floorLevels.map((lvl) => (
        <BalconyLevel
          key={lvl.level}
          level={lvl.level}
          y={lvl.y}
          title={lvl.title}
          subtitle={lvl.subtitle}
        />
      ))}

      {/* ================= 2. SIX COLOSSAL POLISHED MARBLE PILLARS ================= */}
      {[
        [-6.4, -3.2],
        [6.4, -3.2],
        [-6.4, 3.2],
        [6.4, 3.2],
        [-6.4, 9.2],
        [6.4, 9.2]
      ].map(([x, z], idx) => (
        <group key={idx} position={[x, 16, z]}>
          {/* Main Column Body in Polished Carrara Marble */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.52, 0.52, 32, 36]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.14}
              metalness={0.08}
            />
          </mesh>
          {/* Satin Nickel Architectural Collars at Every Floor Level */}
          {[0, 8, 16, 24, 32].map((yLevel, i) => (
            <group key={i} position={[0, yLevel - 16, 0]}>
              <mesh>
                <cylinderGeometry args={[0.56, 0.56, 0.16, 36]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.92} roughness={0.15} />
              </mesh>
              <mesh position={[0, 0.09, 0]}>
                <torusGeometry args={[0.56, 0.015, 12, 36]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ================= 3. SUSPENDED LUXURY CHANDELIER ================= */}
      <LuxurySkylightChandelier />

      {/* ================= 4. MODERN HIGH-SPEED ESCALATORS ================= */}
      {/* Ground to Floor 1 Escalator */}
      <LuxuryEscalator position={[-3.6, 0, 2.5]} rotation={[0, 0, 0]} reverse={false} />
      {/* Floor 1 to Floor 2 Escalator */}
      <LuxuryEscalator position={[3.6, 8, 2.5]} rotation={[0, 0, 0]} reverse={true} />

      {/* ================= 5. GRAND SKYLIGHT & CEILING ARCHITECTURE (Y = 32) ================= */}
      <group position={[0, 32, 2.5]}>
        {/* Layered White Coffered Ceiling Bulkheads */}
        <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[38, 32]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.05} />
        </mesh>

        {/* Concealed Architectural Perimeter Cove Light Ribbon around Skylight */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[18.4, 0.1, 24.4]} />
          <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <ringGeometry args={[9.5, 9.7, 48]} rotation={[-Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color="#FFFBEB"
            emissive="#FEF3C7"
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* Double-Curved Structural Skylight Truss Structure (White Steel) */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[8.8, 8.8, 0.38, 48, 4, true]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.8} roughness={0.15} />
        </mesh>

        {/* Glass Skylight Glazing Panes (Letting in Natural Daylight) */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[8.75, 8.75, 0.32, 48]} />
          <meshPhysicalMaterial
            color="#F0F9FF"
            transmission={0.95}
            transparent
            opacity={0.25}
            roughness={0.02}
            metalness={0.05}
            clearcoat={1.0}
            ior={1.5}
          />
        </mesh>

        {/* Structural Space-Frame Mullion Ribs Radiating Across Skylight */}
        {[0, 30, 60, 90, 120, 150].map((deg, i) => (
          <mesh key={i} position={[0, 0.24, 0]} rotation={[0, (deg * Math.PI) / 180, 0]}>
            <boxGeometry args={[17.4, 0.08, 0.06]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.15} />
          </mesh>
        ))}

        {/* Powerful Sunlight Point / Spotlight pouring down from the Skylight */}
        <pointLight position={[0, -1.5, 0]} intensity={4.5} distance={42} color="#FFFBF5" />
      </group>
    </group>
  );
}

export default CentralAtrium;
