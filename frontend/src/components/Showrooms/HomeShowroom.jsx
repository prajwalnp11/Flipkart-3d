import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { SofaModel } from '../ProductViewer/Models3D/SofaModel';
import { TelevisionModel } from '../ProductViewer/Models3D/TelevisionModel';
import { RefrigeratorModel } from '../ProductViewer/Models3D/RefrigeratorModel';
import { WashingMachineModel } from '../ProductViewer/Models3D/WashingMachineModel';
import { getCarraraMarbleTexture, getCarraraMarbleRoughnessTexture } from '../../utils/marbleTextures';

function InteractiveHomeItem({ product, position, rotation = [0, 0, 0], scale = 0.55, children, label, price }) {
  const [hovered, setHovered] = useState(false);
  const openProductInspect = useStore((state) => state.openProductInspect);
  const haloRef = useRef();

  useFrame((_, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * (hovered ? 2.5 : 0.8);
    }
  });

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (product) openProductInspect(product);
      }}
    >
      <group scale={scale} position={[0, 0.45, 0]}>
        {children}
      </group>

      {/* Glossy White Ceramic Pedestal Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.95, 0.2, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.15} />
      </mesh>

      {/* Glowing Emerald Halo Ring */}
      <mesh ref={haloRef} position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.86, 32]} />
        <meshBasicMaterial
          color={hovered ? '#FFE500' : '#10B981'}
          transparent
          opacity={hovered ? 0.95 : 0.6}
        />
      </mesh>

      {/* Floating Info Tag in Dark Navy */}
      <group position={[0, -0.05, 0.62]}>
        <mesh>
          <boxGeometry args={[1.45, 0.38, 0.04]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.17, 0.02]}>
          <boxGeometry args={[1.45, 0.04, 0.02]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        <Text position={[0, 0.04, 0.03]} fontSize={0.09} color="#172B4D" fontWeight={900}>
          {label || product?.name}
        </Text>
        <Text position={[0, -0.08, 0.03]} fontSize={0.08} color="#2874F0" fontWeight={800}>
          {price || (product ? `₹${Number(product.price).toLocaleString('en-IN')}` : '')}
        </Text>
      </group>
    </group>
  );
}

// 3D Luxury King Bed Suite with Headboard, Pillows & Nightstands
function LuxuryBedSuite({ position }) {
  return (
    <group position={position}>
      {/* Platform Bed Frame */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.45, 3.4]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Plush Mattress */}
      <mesh position={[0, 0.55, 0.1]} castShadow>
        <boxGeometry args={[2.9, 0.35, 3.1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      {/* Luxury Duvet Quilt */}
      <mesh position={[0, 0.72, 0.4]} castShadow>
        <boxGeometry args={[2.95, 0.06, 2.3]} />
        <meshStandardMaterial color="#0284C7" roughness={0.5} />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, 1.25, -1.6]} castShadow>
        <boxGeometry args={[3.4, 1.8, 0.25]} />
        <meshStandardMaterial color="#1E293B" roughness={0.5} />
      </mesh>
      {/* 2 Plush Pillows */}
      {[-0.8, 0.8].map((x, idx) => (
        <mesh key={idx} position={[x, 0.82, -1.0]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 0.18, 0.55]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>
      ))}
      <Text position={[0, 2.35, -1.5]} fontSize={0.18} color="#172B4D" fontWeight={900}>
        CALIFORNIA KING MASTER BED
      </Text>
    </group>
  );
}

// 6-Seater Scandinavian Solid Oak Dining Suite
function DiningSuite({ position }) {
  return (
    <group position={position}>
      {/* Natural Oak Tabletop */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.08, 1.6]} />
        <meshStandardMaterial color="#D97706" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* 4 Solid Wood Legs */}
      {[
        [-1.4, -0.6],
        [1.4, -0.6],
        [-1.4, 0.6],
        [1.4, 0.6]
      ].map(([x, z], idx) => (
        <mesh key={idx} position={[x, 0.45, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.9, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      <Text position={[0, 1.45, 0]} fontSize={0.18} color="#172B4D" fontWeight={900}>
        SOLID OAK 6-SEATER DINING
      </Text>
    </group>
  );
}

// Kitchen Appliances Counter
function KitchenAppliancesCounter({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.9, 1.4]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[3.45, 0.06, 1.45]} />
        <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.3} />
      </mesh>
      <Text position={[0, 1.4, 0]} fontSize={0.16} color="#172B4D" fontWeight={900}>
        SMART KITCHEN APPLIANCES
      </Text>
    </group>
  );
}

// Luxury Perfume & Beauty Showcase (Section 13)
function LuxuryBeautyShowcase({ position }) {
  const products = useStore((state) => state.products);
  const openProductInspect = useStore((state) => state.openProductInspect);
  const perfume = products.find((p) => p.slug === 'dior-sauvage-edp');

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (perfume) openProductInspect(perfume);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Glass Showcase Counter */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 1.0, 1.4]} />
        <meshPhysicalMaterial
          color="#FDFBF7"
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      {/* Rose Gold Edge Trim */}
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[3.05, 0.04, 1.45]} />
        <meshStandardMaterial color="#F43F5E" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* 3D Glass Perfume Bottle Display */}
      <group position={[0, 1.35, 0]}>
        {/* Cylindrical Deep Navy Perfume Glass Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.22, 0.5, 24]} />
          <meshPhysicalMaterial
            color="#0F172A"
            transmission={0.8}
            roughness={0.05}
            metalness={0.3}
            ior={1.55}
          />
        </mesh>
        {/* Magnetic Silver Atomizer Cap */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.16, 24]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* Warm Amber Showcase Spotlight */}
      <pointLight position={[0, 2.2, 0]} intensity={1.5} distance={5} color="#FFE4E6" />

      {/* Showcase Sign */}
      <group position={[0, 2.3, 0]}>
        <Text position={[0, 0.15, 0]} fontSize={0.18} color="#172B4D" fontWeight={900}>
          HAUTE PARFUMERIE & BEAUTY
        </Text>
        <Text position={[0, -0.05, 0]} fontSize={0.12} color="#F43F5E" fontWeight={700}>
          DIOR SAUVAGE • CHANEL • LUXURY COSMETICS
        </Text>
      </group>
    </group>
  );
}

// Gourmet Supermarket & Gaming Showcase (Section 14)
function SupermarketAndBooksAisle({ position }) {
  return (
    <group position={position}>
      {/* Supermarket Display Shelving Rack */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.4, 0.8]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* 3 Illuminated Shelf Insets */}
      {[-0.5, 0.1, 0.7].map((y, idx) => (
        <group key={idx} position={[0, y, 0.42]}>
          <mesh>
            <boxGeometry args={[3.1, 0.05, 0.4]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.04, 0.2]}>
            <boxGeometry args={[3.1, 0.02, 0.02]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
        </group>
      ))}
      <Text position={[0, 2.6, 0]} fontSize={0.18} color="#172B4D" fontWeight={900}>
        GOURMET ESSENTIALS & GAMING
      </Text>
      <Text position={[0, 2.35, 0]} fontSize={0.12} color="#F59E0B" fontWeight={700}>
        SINGLE-ORIGIN COFFEES • PS5 PRO • BOOKS
      </Text>
    </group>
  );
}

export function HomeShowroom({ floorY = 24 }) {
  const products = useStore((state) => state.products);
  const sofa = products.find((p) => p.slug === 'nordic-cloud-velvet-sofa');
  const tv = products.find((p) => p.slug === 'samsung-75-neo-qled-8k');
  const fridge = products.find((p) => p.slug === 'lg-655l-instaview-refrigerator');
  const washingMachine = products.find((p) => p.slug === 'bosch-series-8-9kg-idos');

  // Luxury Carrara Marble Textures for Home Living Concourse
  const marbleTexture = useMemo(() => getCarraraMarbleTexture(6, 5), []);
  const marbleRoughness = useMemo(() => getCarraraMarbleRoughnessTexture(6, 5), []);

  return (
    <group position={[0, floorY, 0]}>
      {/* ================= 1. MARBLE FLOORING & ACCENT INLAY ================= */}
      {/* Carrara Polished Marble Base */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[38, 30]} />
        <meshStandardMaterial
          map={marbleTexture}
          roughnessMap={marbleRoughness}
          roughness={0.12}
          metalness={0.1}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* Nero Marquina Perimeter Border */}
      <mesh position={[0, -0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.2, 13.8, 64]} />
        <meshStandardMaterial color="#0F172A" roughness={0.15} metalness={0.3} />
      </mesh>

      {/* Champagne Gold Floor Inlay Rings */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[11.2, 11.28, 64]} />
        <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
      </mesh>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 5.58, 64]} />
        <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
      </mesh>

      {/* Warm Downlights for Furniture Showroom Vignette */}
      {[-5, 5].map((x, idx) => (
        <pointLight key={idx} position={[x, 5.0, 0]} intensity={1.3} distance={7} color="#FFF8E7" />
      ))}

      {/* ================= 2. MAIN HEADER BILLBOARD ================= */}
      <group position={[0, 5.8, -7.15]}>
        <mesh>
          <boxGeometry args={[15, 1.4, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.12} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.65, 0.02]}>
          <boxGeometry args={[15, 0.08, 0.06]} />
          <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh position={[0, -0.65, 0.02]}>
          <boxGeometry args={[15, 0.04, 0.04]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
        <Text
          position={[0, 0.18, 0.06]}
          fontSize={0.38}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          HOME, LIVING, BEAUTY & SUPERMARKET
        </Text>
        <Text
          position={[0, -0.25, 0.06]}
          fontSize={0.16}
          color="#10B981"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          CONTEMPORARY SOFAS • BEDS • 8K CINEMA • REFRIGERATORS • LUXURY PERFUMES • GOURMET
        </Text>
      </group>

      {/* ================= 3. ZONE 1: NORDIC LIVING ROOM ================= */}
      <InteractiveHomeItem
        product={sofa}
        position={[-5.8, 0, -1.2]}
        label="Nordic Cloud Velvet Sofa"
        scale={0.52}
      >
        <SofaModel color="#1E3A8A" />
      </InteractiveHomeItem>

      <InteractiveHomeItem
        product={tv}
        position={[-1.9, 0, -2.2]}
        label={'Samsung 75" 8K TV'}
        scale={0.52}
      >
        <TelevisionModel color="#9CA3AF" />
      </InteractiveHomeItem>

      {/* ================= 4. ZONE 2: SMART APPLIANCES ================= */}
      <InteractiveHomeItem
        product={fridge}
        position={[1.9, 0, -2.2]}
        label="LG 655L InstaView Fridge"
        scale={0.52}
      >
        <RefrigeratorModel color="#CBD5E1" />
      </InteractiveHomeItem>

      <InteractiveHomeItem
        product={washingMachine}
        position={[5.8, 0, -1.2]}
        label="Bosch 9kg i-DOS Washer"
        scale={0.52}
      >
        <WashingMachineModel color="#F8FAFC" />
      </InteractiveHomeItem>

      {/* ================= 5. ZONE 3: MASTER BED SUITE (LEFT WING) ================= */}
      <LuxuryBedSuite position={[-11.5, 0, 3.2]} />

      {/* ================= 6. ZONE 4: DINING TABLE SUITE (RIGHT WING) ================= */}
      <DiningSuite position={[11.5, 0, 3.2]} />

      {/* ================= 7. ZONE 5: KITCHEN APPLIANCES (CENTER) ================= */}
      <KitchenAppliancesCounter position={[0, 0, 3.2]} />

      {/* ================= 8. ZONE 6: HAUTE PARFUMERIE & BEAUTY (Section 13) ================= */}
      <LuxuryBeautyShowcase position={[-9.5, 0, 8.5]} />

      {/* ================= 9. ZONE 7: GOURMET ESSENTIALS & GAMING (Section 14) ================= */}
      <SupermarketAndBooksAisle position={[9.5, 0, 8.5]} />

      {/* Ambient Floor Lamp Decor in Living Corner */}
      <group position={[-8.5, 0, -2.2]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.8, 12]} />
          <meshStandardMaterial color="#FFE500" metalness={0.9} />
        </mesh>
        <mesh position={[0, 2.7, 0]}>
          <coneGeometry args={[0.35, 0.4, 20]} />
          <meshStandardMaterial color="#FFFBEB" roughness={0.3} />
        </mesh>
        <pointLight position={[0, 2.6, 0]} intensity={1.8} distance={6} color="#FFFBEB" />
      </group>
    </group>
  );
}
