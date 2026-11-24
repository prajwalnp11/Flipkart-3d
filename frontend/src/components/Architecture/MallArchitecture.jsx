import React, { useMemo } from 'react';
import { CentralAtrium } from './CentralAtrium';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { getCarraraMarbleTexture, getCarraraMarbleRoughnessTexture } from '../../utils/marbleTextures';

// Luxury Retail Storefront Module on Mall Side Corridors
function RetailStorefront({ position, rotation, brandName, tagline, categoryBadge, brandColor = '#2874F0' }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 1. Storefront Outer Architectural Dark Bronze / Graphite Framing */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[7.2, 6.4, 0.35]} />
        <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.85} />
      </mesh>

      {/* 2. Full-Height Tempered Glass Shopfront Window */}
      <mesh position={[0, 2.7, 0.12]}>
        <planeGeometry args={[6.6, 5.2]} />
        <meshPhysicalMaterial
          color="#F0F9FF"
          transmission={0.93}
          transparent
          opacity={0.3}
          roughness={0.03}
          metalness={0.05}
          clearcoat={1.0}
          ior={1.52}
        />
      </mesh>

      {/* Storefront Vertical Mullion Dividers */}
      {[-2.2, 0, 2.2].map((x, i) => (
        <mesh key={i} position={[x, 2.7, 0.14]}>
          <boxGeometry args={[0.06, 5.2, 0.08]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* 3. Illuminated Architectural Header Signboard */}
      <group position={[0, 5.75, 0.2]}>
        <mesh>
          <boxGeometry args={[6.6, 0.9, 0.08]} />
          <meshStandardMaterial color="#0A0E17" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Accent Brand LED Line */}
        <mesh position={[0, 0.42, 0.02]}>
          <boxGeometry args={[6.6, 0.04, 0.03]} />
          <meshBasicMaterial color={brandColor} />
        </mesh>
        <Text
          position={[0, 0.08, 0.045]}
          fontSize={0.34}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.08}
        >
          {brandName}
        </Text>
        <Text
          position={[0, -0.25, 0.045]}
          fontSize={0.12}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
          letterSpacing={0.06}
        >
          {tagline}
        </Text>
      </group>

      {/* 4. Warm Boutique Interior Display visible inside the store */}
      <group position={[0, 1.4, -0.8]}>
        {/* Warm Interior Back Wall */}
        <mesh position={[0, 1.5, -1.2]}>
          <planeGeometry args={[6.8, 5.8]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
        </mesh>
        {/* Boutique Illuminated Feature Display Shelf */}
        <mesh position={[0, 1.8, -1.1]}>
          <boxGeometry args={[4.8, 0.08, 0.5]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 1.1, -1.1]}>
          <boxGeometry args={[4.8, 0.08, 0.5]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Central Pedestal Display Vitrine with Warm Interior Spotlight */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 0.9, 24]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.56, 0.56, 0.04, 24]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Interior Boutique Warm Downlight */}
        <pointLight position={[0, 2.8, 0]} intensity={1.8} distance={8} color="#FEF3C7" />
      </group>
    </group>
  );
}

export function MallArchitecture() {
  const marbleMap = useMemo(() => getCarraraMarbleTexture(10, 10), []);
  const marbleRoughnessMap = useMemo(() => getCarraraMarbleRoughnessTexture(10, 10), []);

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. PHOTOREALISTIC POLISHED CARRARA MARBLE GROUND FLOOR ================= */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 38]} />
        <meshStandardMaterial
          map={marbleMap}
          roughnessMap={marbleRoughnessMap}
          color="#FFFFFF"
          roughness={0.11}
          metalness={0.25}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Decorative Polished Architectural Floor Inlay Border Medallions (Satin Nickel & Gold) */}
      <mesh position={[0, 0.01, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.8, 6.95, 64]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.01, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.15, 7.25, 64]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* ================= 2. FULL-HEIGHT RETAIL STOREFRONTS (West & East Wings) ================= */}
      {/* West Wing Storefronts (Ground Floor) */}
      <RetailStorefront
        position={[-18.2, 0, -4.5]}
        rotation={[0, Math.PI / 2, 0]}
        brandName="APPLE STORE"
        tagline="Titanium Innovation • Pro Performance"
        brandColor="#0284C7"
      />
      <RetailStorefront
        position={[-18.2, 0, 4.5]}
        rotation={[0, Math.PI / 2, 0]}
        brandName="ONEPLUS FLAGSHIP"
        tagline="Never Settle • Hasselblad Camera"
        brandColor="#EB0029"
      />
      <RetailStorefront
        position={[-18.2, 0, 13.5]}
        rotation={[0, Math.PI / 2, 0]}
        brandName="SEPHORA LUXURY"
        tagline="Haute Fragrances & Skincare"
        brandColor="#EC4899"
      />

      {/* East Wing Storefronts (Ground Floor) */}
      <RetailStorefront
        position={[18.2, 0, -4.5]}
        rotation={[0, -Math.PI / 2, 0]}
        brandName="SAMSUNG GALAXY"
        tagline="Galaxy AI • 200MP Quad Tele"
        brandColor="#2874F0"
      />
      <RetailStorefront
        position={[18.2, 0, 4.5]}
        rotation={[0, -Math.PI / 2, 0]}
        brandName="LEICA GALLERIA"
        tagline="1-inch Optical Beast & Optics"
        brandColor="#FF6900"
      />
      <RetailStorefront
        position={[18.2, 0, 13.5]}
        rotation={[0, -Math.PI / 2, 0]}
        brandName="WEST ELM LIVING"
        tagline="Modern Architectural Furniture"
        brandColor="#10B981"
      />

      {/* Upper Floor West & East Retail Facades (Floors 1 & 2) */}
      {/* 1F West */}
      <mesh position={[-18.3, 12, 4.5]}>
        <boxGeometry args={[0.3, 7.5, 30]} />
        <meshPhysicalMaterial
          color="#F0F9FF"
          transmission={0.92}
          transparent
          opacity={0.3}
          roughness={0.04}
          metalness={0.1}
        />
      </mesh>
      {/* 1F East */}
      <mesh position={[18.3, 12, 4.5]}>
        <boxGeometry args={[0.3, 7.5, 30]} />
        <meshPhysicalMaterial
          color="#F0F9FF"
          transmission={0.92}
          transparent
          opacity={0.3}
          roughness={0.04}
          metalness={0.1}
        />
      </mesh>

      {/* 2F West */}
      <mesh position={[-18.3, 20, 4.5]}>
        <boxGeometry args={[0.3, 7.5, 30]} />
        <meshPhysicalMaterial
          color="#F0F9FF"
          transmission={0.92}
          transparent
          opacity={0.3}
          roughness={0.04}
          metalness={0.1}
        />
      </mesh>
      {/* 2F East */}
      <mesh position={[18.3, 20, 4.5]}>
        <boxGeometry args={[0.3, 7.5, 30]} />
        <meshPhysicalMaterial
          color="#F0F9FF"
          transmission={0.92}
          transparent
          opacity={0.3}
          roughness={0.04}
          metalness={0.1}
        />
      </mesh>

      {/* Architectural Storefront Mullions along the perimeter */}
      {[-12, -4, 4, 12].map((z, idx) => (
        <group key={`mullion-${idx}`}>
          <mesh position={[-18.15, 16, z]}>
            <boxGeometry args={[0.25, 32, 0.22]} />
            <meshStandardMaterial color="#1E293B" metalness={0.88} roughness={0.18} />
          </mesh>
          <mesh position={[18.15, 16, z]}>
            <boxGeometry args={[0.25, 32, 0.22]} />
            <meshStandardMaterial color="#1E293B" metalness={0.88} roughness={0.18} />
          </mesh>
        </group>
      ))}

      {/* ================= 3. REAR ARCHITECTURAL CORE & ELEVATOR SHAFT ================= */}
      {/* Fluted White Carrara Marble & Charcoal Architectural Backing Wall */}
      <mesh position={[0, 16, -11.6]} receiveShadow>
        <boxGeometry args={[44, 32, 0.6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.18} metalness={0.12} />
      </mesh>

      {/* Recessed Warm 3000K Vertical Light Coves on Rear Core Wall */}
      {[-15, -9, 9, 15].map((x, idx) => (
        <mesh key={`cove-${idx}`} position={[x, 16, -11.25]}>
          <boxGeometry args={[0.08, 30, 0.04]} />
          <meshStandardMaterial
            color="#FEF3C7"
            emissive="#FDE68A"
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}

      {/* Vertical Structural Glass Elevator Shaft Frame at Z = -7.5 */}
      <group position={[0, 16, -7.5]}>
        {/* Polished Stainless Steel Guide Rails */}
        <mesh position={[-2.4, 0, 0]}>
          <boxGeometry args={[0.16, 32, 0.24]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.96} roughness={0.1} />
        </mesh>
        <mesh position={[2.4, 0, 0]}>
          <boxGeometry args={[0.16, 32, 0.24]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.96} roughness={0.1} />
        </mesh>

        {/* Steel Suspension Cables */}
        {[-0.8, -0.4, 0.4, 0.8].map((x, i) => (
          <mesh key={`cable-${i}`} position={[x, 0, -1.8]}>
            <cylinderGeometry args={[0.015, 0.015, 32, 8]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}

        {/* Crystal Clear Tempered Glass Enclosure Panels */}
        <mesh position={[-2.4, 0, -0.9]}>
          <boxGeometry args={[0.04, 32, 1.8]} />
          <meshPhysicalMaterial
            color="#E0F2FE"
            transmission={0.94}
            transparent
            opacity={0.3}
            roughness={0.03}
            metalness={0.05}
            clearcoat={1.0}
            ior={1.52}
          />
        </mesh>
        <mesh position={[2.4, 0, -0.9]}>
          <boxGeometry args={[0.04, 32, 1.8]} />
          <meshPhysicalMaterial
            color="#E0F2FE"
            transmission={0.94}
            transparent
            opacity={0.3}
            roughness={0.03}
            metalness={0.05}
            clearcoat={1.0}
            ior={1.52}
          />
        </mesh>
      </group>

      {/* 4. Central Multi-Storey Open Atrium & Curved Balconies */}
      <CentralAtrium />
    </group>
  );
}

export default MallArchitecture;
