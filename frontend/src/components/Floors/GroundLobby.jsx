import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

// 8 Main Flipkart Product Category Definitions matching User Requirements
export const MAIN_MALL_CATEGORIES = [
  {
    id: 1,
    name: 'Electronics & Mobiles',
    slug: 'mobiles',
    floor_number: 1,
    icon_3d_type: 'smartphone',
    color: '#2874F0',
    subtitle: 'Smartphones, Laptops, Audio & Wearables',
    items_desc: 'iPhone, Galaxy, MacBooks, Sony ANC'
  },
  {
    id: 2,
    name: 'TVs & Appliances',
    slug: 'home-appliances',
    floor_number: 3,
    icon_3d_type: 'television',
    color: '#0284C7',
    subtitle: '8K Smart TVs, Inverter ACs & Kitchen',
    items_desc: 'Neo QLED, Refrigerators, Washing'
  },
  {
    id: 3,
    name: 'Fashion & Apparel',
    slug: 'fashion',
    floor_number: 2,
    icon_3d_type: 'fashion',
    color: '#EC4899',
    subtitle: 'Designer Wear, Sneakers & Accessories',
    items_desc: 'Luxury Apparel, Nike Air Max, Bags'
  },
  {
    id: 4,
    name: 'Home & Furniture',
    slug: 'furniture',
    floor_number: 3,
    icon_3d_type: 'sofa',
    color: '#10B981',
    subtitle: 'Designer Sofas, Beds & Modern Decor',
    items_desc: 'Nordic Sofas, Dining, Ambient Lamps'
  },
  {
    id: 5,
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    floor_number: 2,
    icon_3d_type: 'beauty',
    color: '#F43F5E',
    subtitle: 'Luxury Skincare, Grooming & Fragrances',
    items_desc: 'Dior, Dyson Styler, Premium Scents'
  },
  {
    id: 6,
    name: 'Grocery & Essentials',
    slug: 'grocery',
    floor_number: 1,
    icon_3d_type: 'grocery',
    color: '#F59E0B',
    subtitle: 'Packaged Foods & Household Essentials',
    items_desc: 'Organic Superfoods, Daily Pantry'
  },
  {
    id: 7,
    name: 'Sports & Gaming',
    slug: 'gaming',
    floor_number: 1,
    icon_3d_type: 'gaming',
    color: '#6366F1',
    subtitle: 'Consoles, Sports Gear & Fitness',
    items_desc: 'PlayStation 5, Gym Tech, Gaming'
  },
  {
    id: 8,
    name: 'Automotive & EV',
    slug: 'automotive',
    floor_number: 3,
    icon_3d_type: 'automotive',
    color: '#059669',
    subtitle: 'Electric Vehicles & Smart Auto Tech',
    items_desc: 'EV Mobility, Helmets, Dash Cams'
  }
];

// Floating 3D Category Pedestal / Portal in the Ground Lobby
function CategoryPedestal({ category, position, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef();

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (hovered ? 2.2 : 0.6);
    }
  });

  // Render high quality 3D symbolic representative model per category
  const renderIcon3D = () => {
    switch (category.icon_3d_type) {
      case 'smartphone':
        return (
          <group rotation={[0, 0.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.38, 0.76, 0.045]} />
              <meshStandardMaterial color="#2874F0" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0, 0.026]}>
              <planeGeometry args={[0.35, 0.72]} />
              <meshBasicMaterial color="#0A1E3F" />
            </mesh>
          </group>
        );
      case 'television':
        return (
          <group rotation={[0, -0.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.82, 0.5, 0.035]} />
              <meshStandardMaterial color="#0284C7" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[0.78, 0.46]} />
              <meshBasicMaterial color="#0B2046" />
            </mesh>
          </group>
        );
      case 'fashion':
        return (
          <group>
            <mesh castShadow position={[0, 0, 0]}>
              <coneGeometry args={[0.38, 0.72, 16]} />
              <meshStandardMaterial color="#EC4899" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.42, 0]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color="#F472B6" roughness={0.4} />
            </mesh>
          </group>
        );
      case 'sofa':
        return (
          <mesh castShadow>
            <boxGeometry args={[0.78, 0.38, 0.46]} />
            <meshStandardMaterial color="#10B981" roughness={0.6} />
          </mesh>
        );
      case 'beauty':
        return (
          <group>
            {/* Perfume Bottle Crystal Body */}
            <mesh castShadow position={[0, -0.05, 0]}>
              <boxGeometry args={[0.36, 0.45, 0.22]} />
              <meshPhysicalMaterial
                color="#FDA4AF"
                transmission={0.8}
                transparent
                roughness={0.1}
                clearcoat={1.0}
              />
            </mesh>
            {/* Gold Sprayer Cap */}
            <mesh position={[0, 0.26, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.18, 16]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        );
      case 'grocery':
        return (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[0.35, 0.28, 0.42, 16]} />
              <meshStandardMaterial color="#D97706" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.24, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#10B981" roughness={0.5} />
            </mesh>
          </group>
        );
      case 'gaming':
        return (
          <group rotation={[0.4, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.62, 0.36, 0.16]} />
              <meshStandardMaterial color="#4F46E5" metalness={0.7} roughness={0.3} />
            </mesh>
            {[-0.2, 0.2].map((x, idx) => (
              <mesh key={idx} position={[x, 0.1, 0.05]}>
                <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
                <meshStandardMaterial color="#FFE500" roughness={0.4} />
              </mesh>
            ))}
          </group>
        );
      case 'automotive':
      default:
        return (
          <group rotation={[0, Math.PI / 4, 0]}>
            <mesh castShadow>
              <torusGeometry args={[0.32, 0.1, 16, 32]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
              <meshStandardMaterial color="#2874F0" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group
      position={position}
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
        onSelect(category);
      }}
    >
      {/* Gloss White Ceramic Pedestal Column */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.94, 0.84, 32]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.12}
          metalness={0.08}
          clearcoat={1.0}
        />
      </mesh>

      {/* Chrome Base Trim */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.96, 0.96, 0.08, 32]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Illuminated Base Halo Ring */}
      <mesh ref={ringRef} position={[0, 0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.81, 32]} />
        <meshBasicMaterial
          color={hovered ? '#FFE500' : category.color || '#2874F0'}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D Category Object */}
      <group position={[0, 1.45, 0]}>
        <Float speed={hovered ? 3.5 : 2} rotationIntensity={0.25} floatIntensity={0.2}>
          {renderIcon3D()}
        </Float>
      </group>

      {/* Information Billboard Card (White Glass Plate) */}
      <group position={[0, 2.24, 0]}>
        {/* Backing Card Plate */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[2.4, 0.68, 0.04]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.2}
            metalness={0.05}
          />
        </mesh>
        {/* Top Colored Accent Strip */}
        <mesh position={[0, 0.32, -0.01]}>
          <boxGeometry args={[2.4, 0.04, 0.04]} />
          <meshBasicMaterial color={hovered ? '#FFE500' : category.color || '#2874F0'} />
        </mesh>

        {/* Category Name in Bold Dark Navy */}
        <Text
          position={[0, 0.12, 0.02]}
          fontSize={0.15}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {category.name}
        </Text>

        {/* Floor Target Badge in Flipkart Blue */}
        <Text
          position={[0, -0.1, 0.02]}
          fontSize={0.12}
          color="#2874F0"
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          {`FLOOR ${category.floor_number} DEPARTMENT →`}
        </Text>

        {hovered && (
          <Text
            position={[0, -0.25, 0.02]}
            fontSize={0.095}
            color="#0053C2"
            anchorX="center"
            anchorY="middle"
            fontWeight={800}
          >
            TAKE EXPRESS ELEVATOR
          </Text>
        )}
      </group>

      {/* Hover Pulse Light */}
      {hovered && (
        <pointLight position={[0, 1.8, 0]} intensity={2.2} distance={4} color="#FFE500" />
      )}
    </group>
  );
}

export function GroundLobby() {
  const categories = useStore((state) => state.categories);
  const selectCategory = useStore((state) => state.selectCategory);

  // Combine backend categories or fallback to the 8 official Flipkart categories
  const activeCategories = (categories && categories.length > 0)
    ? categories
    : MAIN_MALL_CATEGORIES;

  // 8 Spacious Category Display Locations in a Grand Symmetrical Atrium
  const pedestalSlots = [
    [-6.8, 0, -2.2], // 1. Electronics & Mobiles
    [-4.8, 0, 1.2],  // 2. TVs & Appliances
    [-2.8, 0, 4.4],  // 3. Fashion & Apparel
    [-6.2, 0, 5.2],  // 4. Home & Furniture
    [2.8, 0, 4.4],   // 5. Beauty & Care
    [4.8, 0, 1.2],   // 6. Grocery & Essentials
    [6.8, 0, -2.2],  // 7. Sports & Gaming
    [6.2, 0, 5.2],   // 8. Automotive & EV
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================= GRAND LOBBY LIGHT ARCHITECTURE ================= */}
      {/* 1. White Carrara Marble Floor with Soft Natural Reflections */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[34, 30]} />
        <meshStandardMaterial
          color="#F8FAFC"
          roughness={0.12}
          metalness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Central Inlaid Floor Pattern (Polished Travertine and Chrome Ring) */}
      <mesh position={[0, 0.01, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.2, 6.45, 64]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>
      <mesh position={[0, 0.01, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.6, 6.75, 64]} />
        <meshBasicMaterial color="#CBD5E1" />
      </mesh>

      {/* 2. High-Ceiling Skylight Roof with Daylight Sunbeams */}
      <mesh position={[0, 9.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 30]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>

      {/* Central Magnificent Glass Skylight Dome */}
      <group position={[0, 8.95, 1.5]}>
        <mesh>
          <cylinderGeometry args={[5.8, 5.8, 0.2, 32]} />
          <meshPhysicalMaterial
            color="#BAE6FD"
            transmission={0.88}
            transparent
            opacity={0.35}
            roughness={0.05}
            metalness={0.1}
            clearcoat={1.0}
          />
        </mesh>
        {/* Skylight Frame Rings */}
        <mesh>
          <cylinderGeometry args={[5.85, 5.85, 0.25, 32]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.6} roughness={0.2} wireframe />
        </mesh>
        {/* Soft Sunlight beam streaming down from the skylight */}
        <pointLight position={[0, -0.5, 0]} intensity={2.8} distance={18} color="#FFFBEB" />
      </group>

      {/* 3. Back Wall with Express Elevators Entrance */}
      <mesh position={[0, 4.5, -7.5]} receiveShadow>
        <boxGeometry args={[34, 9.0, 0.5]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
      </mesh>

      {/* Primary Flipkart Blue Architectural Header Trim */}
      <mesh position={[0, 8.2, -7.2]}>
        <boxGeometry args={[32, 0.18, 0.06]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>

      {/* Luxury Grand Signboard above Elevators on Back Wall */}
      <group position={[0, 6.2, -7.15]}>
        {/* White Translucent Glass Backing Panel */}
        <mesh>
          <boxGeometry args={[8.5, 1.35, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.62, 0.02]}>
          <boxGeometry args={[8.5, 0.08, 0.06]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        <Text
          position={[0, 0.16, 0.06]}
          fontSize={0.32}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          EXPRESS GLASS ELEVATORS
        </Text>
        <Text
          position={[0, -0.22, 0.06]}
          fontSize={0.16}
          color="#2874F0"
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          DIRECT TRANSIT TO FLOORS 1, 2 & 3
        </Text>
      </group>

      {/* 4. Luxury Concierge & Customer Assistance Desk in Center Lobby */}
      <group position={[0, 0, 1.5]}>
        {/* Curved White Marble Desk Counter */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.7, 1.7, 1.1, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.15} roughness={0.15} />
        </mesh>
        {/* Desk Top Trim in Polished Flipkart Blue */}
        <mesh position={[0, 1.12, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 0.08, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#2874F0" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Base Accent LED Trim */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.74, 1.74, 0.08, 32, 1, false, 0, Math.PI]} />
          <meshBasicMaterial color="#FFE500" />
        </mesh>
        <Text
          position={[0, 0.62, 1.72]}
          fontSize={0.18}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          CONCIERGE & STORE DIRECTORY
        </Text>
      </group>

      {/* 5. Render 8 Main Product Category Displays */}
      {activeCategories.slice(0, 8).map((cat, idx) => {
        const slot = pedestalSlots[idx] || [idx * 2 - 7, 0, 0];
        return (
          <CategoryPedestal
            key={cat.id || cat.slug || idx}
            category={cat}
            position={slot}
            onSelect={selectCategory}
          />
        );
      })}
    </group>
  );
}
