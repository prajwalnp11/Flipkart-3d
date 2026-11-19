import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { SofaModel } from '../ProductViewer/Models3D/SofaModel';
import { TelevisionModel } from '../ProductViewer/Models3D/TelevisionModel';
import { RefrigeratorModel } from '../ProductViewer/Models3D/RefrigeratorModel';
import { WashingMachineModel } from '../ProductViewer/Models3D/WashingMachineModel';

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
      {/* Platform Bed Frame (Oak & Fabric) */}
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

      {/* Upholstered Fluted Headboard */}
      <mesh position={[0, 1.45, -1.6]} castShadow>
        <boxGeometry args={[3.4, 1.8, 0.3]} />
        <meshStandardMaterial color="#1E293B" roughness={0.4} />
      </mesh>

      {/* Two Sleeping Pillows */}
      {[-0.8, 0.8].map((x, idx) => (
        <mesh key={idx} position={[x, 0.82, -1.1]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.9, 0.2, 0.55]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.7} />
        </mesh>
      ))}

      {/* Two Nightstands with Lamps */}
      {[-2.05, 2.05].map((x, idx) => (
        <group key={idx} position={[x, 0, -1.2]}>
          {/* Nightstand Table */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
          </mesh>
          {/* Gold Handle */}
          <mesh position={[0, 0.45, 0.36]}>
            <boxGeometry args={[0.18, 0.03, 0.03]} />
            <meshStandardMaterial color="#FFE500" metalness={0.9} />
          </mesh>
          {/* Bedside Ambient Lamp */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.35, 16]} />
            <meshStandardMaterial color="#FFFBEB" roughness={0.3} />
          </mesh>
          <pointLight position={[0, 0.9, 0]} intensity={1.5} distance={4} color="#FFFBEB" />
        </group>
      ))}

      <Text position={[0, 2.5, -1.5]} fontSize={0.18} color="#172B4D" fontWeight={900}>
        ROYAL ORTHOPEDIC KING BED SUITE
      </Text>
    </group>
  );
}

// 3D Modern Dining Table with Chairs
function DiningSuite({ position }) {
  return (
    <group position={position}>
      {/* Solid Oak Dining Table Top */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.08, 1.4]} />
        <meshStandardMaterial color="#B45309" roughness={0.4} />
      </mesh>
      {/* Table Legs */}
      {[[-1.2, 0.45, -0.55], [1.2, 0.45, -0.55], [-1.2, 0.45, 0.55], [1.2, 0.45, 0.55]].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <cylinderGeometry args={[0.04, 0.04, 0.85, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
      ))}

      {/* 4 Modern Dining Chairs */}
      {[[-0.7, 0, -0.85], [0.7, 0, -0.85], [-0.7, 0, 0.85], [0.7, 0, 0.85]].map((pos, idx) => (
        <group key={idx} position={pos} rotation={[0, idx >= 2 ? Math.PI : 0, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.5, 0.06, 0.45]} />
            <meshStandardMaterial color="#10B981" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.85, -0.2]}>
            <boxGeometry args={[0.5, 0.65, 0.05]} />
            <meshStandardMaterial color="#10B981" roughness={0.5} />
          </mesh>
          {[[-0.2, 0.25, -0.18], [0.2, 0.25, -0.18], [-0.2, 0.25, 0.18], [0.2, 0.25, 0.18]].map((p, i) => (
            <mesh key={i} position={p}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Decorative Center Fruit / Flower Bowl */}
      <mesh position={[0, 0.98, 0]}>
        <cylinderGeometry args={[0.22, 0.1, 0.12, 16]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.2} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#EF4444" roughness={0.4} />
      </mesh>

      <Text position={[0, 2.0, 0]} fontSize={0.16} color="#172B4D" fontWeight={900}>
        NORDIC 6-SEATER DINING TABLE
      </Text>
    </group>
  );
}

// Kitchen Appliances Counter (Espresso Machine, Microwave & Air Fryer)
function KitchenAppliancesCounter({ position }) {
  return (
    <group position={position}>
      {/* Kitchen Island Counter */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.9, 1.4]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.15} />
      </mesh>
      {/* Granite Countertop */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[3.45, 0.06, 1.45]} />
        <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[3.42, 0.08, 1.42]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>

      {/* Appliance 1: Espresso Coffee Machine */}
      <group position={[-1.0, 1.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.55, 0.45]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.92} roughness={0.15} />
        </mesh>
        <mesh position={[0, -0.15, 0.24]}>
          <cylinderGeometry args={[0.08, 0.06, 0.14, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <Text position={[0, 0.42, 0]} fontSize={0.09} color="#172B4D" fontWeight={800}>
          Barista Espresso Pro
        </Text>
      </group>

      {/* Appliance 2: Digital Air Fryer */}
      <group position={[0, 1.25, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.26, 0.28, 0.55, 24]} />
          <meshStandardMaterial color="#18181B" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.15, 0.27]}>
          <planeGeometry args={[0.2, 0.14]} />
          <meshBasicMaterial color="#0284C7" />
        </mesh>
        <Text position={[0, 0.42, 0]} fontSize={0.09} color="#172B4D" fontWeight={800}>
          Smart Digital Air Fryer
        </Text>
      </group>

      {/* Appliance 3: Convection Microwave */}
      <group position={[1.0, 1.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.42, 0.45]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.88} roughness={0.2} />
        </mesh>
        <mesh position={[-0.08, 0, 0.23]}>
          <planeGeometry args={[0.32, 0.32]} />
          <meshPhysicalMaterial color="#0A0A0A" transmission={0.7} transparent opacity={0.6} />
        </mesh>
        <Text position={[0, 0.42, 0]} fontSize={0.09} color="#172B4D" fontWeight={800}>
          Convection Microwave 32L
        </Text>
      </group>

      <Text position={[0, 2.0, 0]} fontSize={0.16} color="#172B4D" fontWeight={900}>
        SMART KITCHEN APPLIANCES
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

  return (
    <group position={[0, floorY, 0]}>
      {/* ================= 1. MARBLE FLOORING & ACCENT INLAY ================= */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 28]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.2, 13.4, 48]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>

      {/* ================= 2. MAIN HEADER BILLBOARD ================= */}
      <group position={[0, 5.8, -7.15]}>
        <mesh>
          <boxGeometry args={[14, 1.4, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.65, 0.02]}>
          <boxGeometry args={[14, 0.1, 0.06]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        <Text
          position={[0, 0.18, 0.06]}
          fontSize={0.38}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          HOME, LIVING & SMART APPLIANCES
        </Text>
        <Text
          position={[0, -0.25, 0.06]}
          fontSize={0.17}
          color="#10B981"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          CONTEMPORARY SOFAS • BEDS • 8K CINEMA • REFRIGERATORS • WASHING • DINING & KITCHEN
        </Text>
      </group>

      {/* ================= 3. ZONE 1: NORDIC LIVING ROOM (SOFA & 8K TV) ================= */}
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

      {/* ================= 4. ZONE 2: SMART APPLIANCES (FRIDGE & WASHER) ================= */}
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

      {/* ================= 5. ZONE 3: LUXURY KING BED SUITE (LEFT WING) ================= */}
      <LuxuryBedSuite position={[-11.5, 0, 3.2]} />

      {/* ================= 6. ZONE 4: DINING TABLE SUITE (RIGHT WING) ================= */}
      <DiningSuite position={[11.5, 0, 3.2]} />

      {/* ================= 7. ZONE 5: SMART KITCHEN APPLIANCES (CENTER ATRIUM WALKWAY) ================= */}
      <KitchenAppliancesCounter position={[0, 0, 3.2]} />

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
