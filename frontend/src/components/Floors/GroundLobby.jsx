import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

// 8 Major Flipkart Product Category Definitions
export const LOBBY_CATEGORIES = [
  {
    id: 1,
    name: 'Electronics & Mobiles',
    slug: 'mobiles',
    floor_number: 1,
    floor_label: 'FLOOR 1',
    color: '#2874F0',
    subtitle: 'Flagship Phones, Laptops, Audio & Wearables',
    icon_type: 'electronics',
    position: [-9.2, 0, 1.2],
    rotation: [0, 0.45, 0]
  },
  {
    id: 2,
    name: 'TVs & Appliances',
    slug: 'home-appliances',
    floor_number: 3,
    floor_label: 'FLOOR 3',
    color: '#0284C7',
    subtitle: '8K Neo QLED, Smart Fridges & Washers',
    icon_type: 'appliances',
    position: [9.2, 0, 1.2],
    rotation: [0, -0.45, 0]
  },
  {
    id: 3,
    name: 'Fashion & Lifestyle',
    slug: 'fashion',
    floor_number: 2,
    floor_label: 'FLOOR 2',
    color: '#EC4899',
    subtitle: 'Haute Couture, Sneaker Vault & Handbags',
    icon_type: 'fashion',
    position: [-7.2, 0, -3.8],
    rotation: [0, 0.25, 0]
  },
  {
    id: 4,
    name: 'Home & Furniture',
    slug: 'furniture',
    floor_number: 3,
    floor_label: 'FLOOR 3',
    color: '#10B981',
    subtitle: 'Luxury Sofas, Beds & Modern Decor',
    icon_type: 'furniture',
    position: [7.2, 0, -3.8],
    rotation: [0, -0.25, 0]
  },
  {
    id: 5,
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    floor_number: 2,
    floor_label: 'FLOOR 2',
    color: '#F43F5E',
    subtitle: 'Luxury Fragrances, Skincare & Grooming',
    icon_type: 'beauty',
    position: [-8.8, 0, 6.2],
    rotation: [0, 0.6, 0]
  },
  {
    id: 6,
    name: 'Grocery & Essentials',
    slug: 'grocery',
    floor_number: 1,
    floor_label: 'FLOOR 1',
    color: '#F59E0B',
    subtitle: 'Gourmet Pantry, Organic & Superfoods',
    icon_type: 'grocery',
    position: [8.8, 0, 6.2],
    rotation: [0, -0.6, 0]
  },
  {
    id: 7,
    name: 'Sports, Books & Gaming',
    slug: 'sports-gaming',
    floor_number: 1,
    floor_label: 'FLOOR 1',
    color: '#8B5CF6',
    subtitle: 'Consoles, Pro Fitness & Best Sellers',
    icon_type: 'gaming',
    position: [-3.8, 0, 8.2],
    rotation: [0, 0.15, 0]
  },
  {
    id: 8,
    name: 'Automotive & EVs',
    slug: 'automotive',
    floor_number: 1,
    floor_label: 'FLOOR 1',
    color: '#06B6D4',
    subtitle: 'Electric Two-Wheelers & Smart Mobility',
    icon_type: 'automotive',
    position: [3.8, 0, 8.2],
    rotation: [0, -0.15, 0]
  }
];

// Architectural Potted Palm Tree (Matching Reference Video 1 & Video 2)
function PottedPalmTree({ position = [0, 0, 0], scale = 1.0 }) {
  return (
    <group position={position} scale={scale}>
      {/* Modern Fluted White Ceramic Planter Pot */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.32, 0.9, 24]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </mesh>
      {/* Blue Planter Accent Ring */}
      <mesh position={[0, 0.88, 0]}>
        <torusGeometry args={[0.42, 0.02, 12, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>
      {/* Dark Soil */}
      <mesh position={[0, 0.87, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.05, 24]} />
        <meshStandardMaterial color="#1C1917" roughness={0.9} />
      </mesh>
      {/* Palm Trunk */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.12, 1.8, 12]} />
        <meshStandardMaterial color="#78350F" roughness={0.8} />
      </mesh>
      {/* Segmented Ring Trims on Trunk */}
      {[1.15, 1.4, 1.65, 1.9, 2.15, 2.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.09, 0.018, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#572205" roughness={0.9} />
        </mesh>
      ))}
      {/* Cascading Tropical Palm Fronds radiating in 8 directions */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <group key={i} position={[0, 2.65, 0]} rotation={[0.45, rad, 0]}>
            <mesh position={[0, 0, 0.75]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.24, 0.02, 1.4]} />
              <meshStandardMaterial color="#15803D" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.22, 1.55]} rotation={[-0.6, 0, 0]}>
              <boxGeometry args={[0.2, 0.02, 0.8]} />
              <meshStandardMaterial color="#16A34A" roughness={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Standing Interactive Ground Floor Directory Kiosk (Matching Reference Video 1 Frame 02 & Frame 03)
function DirectoryKiosk({ position = [-2.6, 0, 7.2], onSelectFloor }) {
  const [hovered, setHovered] = useState(false);

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
    >
      {/* Weighted Base Plinth */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.12, 0.45]} />
        <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Upright Totem Body */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[0.84, 2.45, 0.14]} />
        <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Glossy Front Glass Bezel */}
      <mesh position={[0, 1.45, 0.075]}>
        <planeGeometry args={[0.76, 1.95]} />
        <meshStandardMaterial color="#090D16" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Ambient Illuminated Touchscreen Display */}
      <mesh position={[0, 1.45, 0.078]}>
        <planeGeometry args={[0.72, 1.88]} />
        <meshBasicMaterial color="#0A1E3F" />
      </mesh>

      {/* Screen Title: GROUND FLOOR DIRECTORY (Matching Video 1 Frame 03) */}
      <Text
        position={[0, 2.22, 0.082]}
        fontSize={0.048}
        color="#38BDF8"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
      >
        GROUND FLOOR DIRECTORY
      </Text>
      <mesh position={[0, 2.14, 0.082]}>
        <planeGeometry args={[0.62, 0.005]} />
        <meshBasicMaterial color="#0284C7" />
      </mesh>

      {/* Interactive Department Rows */}
      {[
        { label: 'FASHION & APPAREL', floor: 2, y: 1.95, badge: '2F' },
        { label: 'ELECTRONICS & GADGETS', floor: 1, y: 1.72, badge: '1F' },
        { label: 'BEAUTY & COSMETICS', floor: 2, y: 1.49, badge: '2F' },
        { label: 'HOME & LIVING', floor: 3, y: 1.26, badge: '3F' },
        { label: 'GROCERY & DINING', floor: 0, y: 1.03, badge: 'G' },
      ].map((item, idx) => (
        <group
          key={idx}
          position={[0, item.y, 0.082]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectFloor(item.floor);
          }}
        >
          {/* Button Row Plate */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.64, 0.16]} />
            <meshBasicMaterial color={hovered ? '#1E293B' : '#0B192C'} />
          </mesh>
          <Text
            position={[-0.26, 0, 0.005]}
            fontSize={0.04}
            color="#E2E8F0"
            anchorX="left"
            anchorY="middle"
            fontWeight={800}
          >
            {item.label}
          </Text>
          {/* Floor Badge Indicator */}
          <mesh position={[0.24, 0, 0.004]}>
            <planeGeometry args={[0.1, 0.08]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          <Text
            position={[0.24, 0, 0.006]}
            fontSize={0.038}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            {item.badge}
          </Text>
        </group>
      ))}

      {/* Isometric 3D Mall Schematic Map Section (Bottom) */}
      <group position={[0, 0.72, 0.082]}>
        <mesh>
          <planeGeometry args={[0.64, 0.34]} />
          <meshBasicMaterial color="#081426" />
        </mesh>
        <Text
          position={[0, 0.11, 0.005]}
          fontSize={0.032}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          INTERACTIVE 3D MALL MAP
        </Text>
        <mesh position={[0, -0.04, 0.005]} rotation={[0, 0, 0.35]}>
          <planeGeometry args={[0.26, 0.16]} />
          <meshBasicMaterial color="#38BDF8" wireframe />
        </mesh>
      </group>
    </group>
  );
}

// Detailed 3D Category Model Renderer
function CategoryModel({ type }) {
  switch (type) {
    case 'electronics':
      return (
        <group scale={0.85}>
          <group position={[-0.22, 0.45, 0]} rotation={[0, 0.25, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.38, 0.76, 0.04]} />
              <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <planeGeometry args={[0.35, 0.72]} />
              <meshBasicMaterial color="#2874F0" />
            </mesh>
            <mesh position={[-0.1, 0.26, -0.024]}>
              <boxGeometry args={[0.14, 0.16, 0.02]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} />
            </mesh>
          </group>
          <group position={[0.22, 0.5, -0.1]} rotation={[0, -0.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.62, 0.85, 0.03]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.017]}>
              <planeGeometry args={[0.58, 0.81]} />
              <meshBasicMaterial color="#0284C7" />
            </mesh>
          </group>
        </group>
      );

    case 'appliances':
      return (
        <group scale={0.85} position={[0, 0.55, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.7, 0.035]} />
            <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[1.15, 0.65]} />
            <meshBasicMaterial color="#0052CC" />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <boxGeometry args={[0.45, 0.04, 0.3]} />
            <meshStandardMaterial color="#D1D5DB" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
            <meshStandardMaterial color="#D1D5DB" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      );

    case 'fashion':
      return (
        <group scale={0.85} position={[0, 0.45, 0]}>
          <mesh castShadow position={[0, 0.25, 0]}>
            <coneGeometry args={[0.32, 0.7, 24]} />
            <meshStandardMaterial color="#EC4899" roughness={0.35} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.68, 0]}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color="#FCE7F3" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.52, 0.08]} rotation={[0.4, 0, 0]}>
            <torusGeometry args={[0.11, 0.015, 12, 24]} />
            <meshStandardMaterial color="#FFE500" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} />
            <meshStandardMaterial color="#D1D5DB" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.04, 24]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} />
          </mesh>
        </group>
      );

    case 'furniture':
      return (
        <group scale={0.85} position={[0, 0.45, 0]}>
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.72, 0.32, 0.58]} />
            <meshStandardMaterial color="#10B981" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.32, -0.22]}>
            <boxGeometry args={[0.72, 0.42, 0.16]} />
            <meshStandardMaterial color="#059669" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[-0.32, 0.15, 0]}>
            <boxGeometry args={[0.12, 0.28, 0.58]} />
            <meshStandardMaterial color="#059669" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0.32, 0.15, 0]}>
            <boxGeometry args={[0.12, 0.28, 0.58]} />
            <meshStandardMaterial color="#059669" roughness={0.5} />
          </mesh>
          {[[-0.28, -0.25, -0.2], [0.28, -0.25, -0.2], [-0.28, -0.25, 0.2], [0.28, -0.25, 0.2]].map((pos, idx) => (
            <mesh key={idx} position={pos} rotation={[0.1, 0, idx % 2 === 0 ? 0.1 : -0.1]}>
              <cylinderGeometry args={[0.02, 0.035, 0.22, 12]} />
              <meshStandardMaterial color="#B45309" roughness={0.7} />
            </mesh>
          ))}
        </group>
      );

    case 'beauty':
      return (
        <group scale={0.9} position={[0, 0.45, 0]}>
          <mesh castShadow position={[0, 0.05, 0]}>
            <boxGeometry args={[0.34, 0.44, 0.22]} />
            <meshPhysicalMaterial
              color="#FDA4AF"
              transmission={0.88}
              transparent
              opacity={0.5}
              roughness={0.06}
              clearcoat={1.0}
            />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.16, 20]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.05, 0.115]}>
            <planeGeometry args={[0.22, 0.2]} />
            <meshStandardMaterial color="#FFFBEB" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      );

    case 'grocery':
      return (
        <group scale={0.85} position={[0, 0.45, 0]}>
          <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.38, 0.3, 0.38, 20]} />
            <meshStandardMaterial color="#D97706" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.19, 0]}>
            <torusGeometry args={[0.38, 0.03, 12, 24]} />
            <meshStandardMaterial color="#B45309" roughness={0.6} />
          </mesh>
          <mesh position={[-0.12, 0.26, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#EF4444" roughness={0.4} />
          </mesh>
          <mesh position={[0.12, 0.24, -0.05]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#10B981" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.32, 0.1]}>
            <cylinderGeometry args={[0.05, 0.06, 0.28, 12]} />
            <meshStandardMaterial color="#166534" roughness={0.2} metalness={0.3} />
          </mesh>
        </group>
      );

    case 'gaming':
      return (
        <group scale={0.9} position={[0, 0.45, 0]} rotation={[0.4, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.38, 0.16]} />
            <meshStandardMaterial color="#1E1B4B" metalness={0.7} roughness={0.25} />
          </mesh>
          {[-0.26, 0.26].map((x, idx) => (
            <mesh key={idx} position={[x, -0.1, 0.02]} rotation={[0, 0, idx === 0 ? -0.3 : 0.3]}>
              <cylinderGeometry args={[0.08, 0.11, 0.28, 16]} />
              <meshStandardMaterial color="#8B5CF6" roughness={0.4} />
            </mesh>
          ))}
          {[-0.14, 0.12].map((x, idx) => (
            <group key={idx} position={[x, -0.02, 0.09]}>
              <mesh>
                <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
                <meshStandardMaterial color="#18181B" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.035, 0]}>
                <torusGeometry args={[0.055, 0.012, 8, 16]} />
                <meshBasicMaterial color="#6366F1" />
              </mesh>
            </group>
          ))}
        </group>
      );

    case 'automotive':
      return (
        <group scale={0.85} position={[0, 0.45, 0]}>
          <mesh castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[0.55, 0.65, 0.35]} />
            <meshStandardMaterial color="#0891B2" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.45, -0.05]} rotation={[-0.3, 0, 0]}>
            <planeGeometry args={[0.45, 0.32]} />
            <meshPhysicalMaterial
              color="#BAE6FD"
              transmission={0.85}
              transparent
              opacity={0.4}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, 0.12, 0.18]}>
            <boxGeometry args={[0.38, 0.12, 0.03]} />
            <meshBasicMaterial color="#E0F2FE" />
          </mesh>
          <mesh position={[0, 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.82, 16]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} />
          </mesh>
        </group>
      );

    default:
      return null;
  }
}

// Individual 3D Interactive Category Pavilion in Ground Lobby
function CategoryPavilion({ category, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef();

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (hovered ? 2.5 : 0.8);
    }
  });

  return (
    <group
      position={category.position}
      rotation={category.rotation}
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
      {/* 1. Large Circular White Marble Floor Pedestal Base */}
      <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.65, 1.75, 0.24, 36]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.12}
          metalness={0.15}
        />
      </mesh>

      {/* Chrome Accent Base Trim */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.66, 1.66, 0.04, 36]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* Glowing Department LED Ring on Pedestal */}
      <mesh ref={ringRef} position={[0, 0.275, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.38, 1.54, 40]} />
        <meshBasicMaterial
          color={hovered ? '#FFE500' : category.color}
          transparent
          opacity={hovered ? 0.95 : 0.65}
        />
      </mesh>

      {/* 2. Floating 3D Category Iconic Model */}
      <group position={[0, 0.35, 0]}>
        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.25}>
          <CategoryModel type={category.icon_type} />
        </Float>
      </group>

      {/* 3. Luxury Signboard & Floor Navigation Placard */}
      <group position={[0, 1.65, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.5, 0.88, 0.06]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>

        <mesh position={[0, 0.41, 0.032]}>
          <boxGeometry args={[2.5, 0.06, 0.02]} />
          <meshBasicMaterial color={category.color} />
        </mesh>

        {/* Floor Navigation Badge */}
        <group position={[-0.8, 0.22, 0.04]}>
          <mesh>
            <boxGeometry args={[0.62, 0.18, 0.02]} />
            <meshBasicMaterial color={category.color} />
          </mesh>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.095}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            {category.floor_label}
          </Text>
        </group>

        {/* Category Main Name */}
        <Text
          position={[0.15, 0.22, 0.04]}
          fontSize={0.13}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {category.name}
        </Text>

        {/* Subtitle / Department Contents */}
        <Text
          position={[0, -0.04, 0.04]}
          fontSize={0.088}
          color="#475569"
          anchorX="center"
          anchorY="middle"
          fontWeight={600}
        >
          {category.subtitle}
        </Text>

        {/* Interactive "ENTER DEPARTMENT →" Button Strip */}
        <group position={[0, -0.27, 0.04]}>
          <mesh>
            <boxGeometry args={[2.2, 0.2, 0.02]} />
            <meshBasicMaterial color={hovered ? category.color : '#F1F5F9'} />
          </mesh>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.088}
            color={hovered ? '#FFFFFF' : category.color}
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            {hovered ? 'TAKE EXPRESS ELEVATOR →' : 'ENTER DEPARTMENT →'}
          </Text>
        </group>
      </group>
    </group>
  );
}

// Glowing Holographic Centerpiece (Matching Reference Video 2 Frame 03)
function HologramCenterpiece() {
  const holoRef = useRef();

  useFrame((state, delta) => {
    if (holoRef.current) {
      holoRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={holoRef} position={[0, 1.85, 0]}>
      {/* Floating Holographic Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.55, 0.03, 12, 32]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.8} />
      </mesh>
      {/* Second Counter-Rotating Ring */}
      <mesh rotation={[-Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.42, 0.025, 12, 32]} />
        <meshBasicMaterial color="#0284C7" transparent opacity={0.7} />
      </mesh>
      {/* Inner Glowing Crystal Core */}
      <mesh>
        <octahedronGeometry args={[0.22, 0]} />
        <meshBasicMaterial color="#FFE500" />
      </mesh>
    </group>
  );
}

export function GroundLobby() {
  const selectCategory = useStore((state) => state.selectCategory);
  const travelToFloor = useStore((state) => state.travelToFloor);

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. CARPETED ATRIUM & CARRARA MARBLE FLOOR ================= */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[38, 32]} />
        <meshStandardMaterial
          color="#F8FAFC"
          roughness={0.12}
          metalness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Dark Marble Center Aisle Inlay (Matching Reference Video 2 Frame 03) */}
      <mesh position={[0, -0.045, 2.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 16]} />
        <meshStandardMaterial
          color="#1E293B"
          roughness={0.15}
          metalness={0.4}
        />
      </mesh>

      {/* Decorative Floor Inlay Rings in Lobby Center */}
      <mesh position={[0, 0.01, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.4, 6.65, 64]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>
      <mesh position={[0, 0.01, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.8, 6.95, 64]} />
        <meshBasicMaterial color="#CBD5E1" />
      </mesh>

      {/* ================= 2. POTTED PALM TREES (Matching Reference Video 1 & Video 2) ================= */}
      <PottedPalmTree position={[-3.6, 0, 8.2]} scale={1.1} />
      <PottedPalmTree position={[3.6, 0, 8.2]} scale={1.1} />
      <PottedPalmTree position={[-5.4, 0, 3.8]} scale={1.15} />
      <PottedPalmTree position={[5.4, 0, 3.8]} scale={1.15} />

      {/* ================= 3. STANDING DIRECTORY KIOSK (Matching Reference Video 1 Frame 03) ================= */}
      <DirectoryKiosk position={[-2.4, 0, 7.0]} onSelectFloor={travelToFloor} />

      {/* ================= 4. CENTRAL ATRIUM CONCIERGE DESK & HOLOGRAPHIC CENTERPIECE ================= */}
      <group position={[0, 0, 2.0]}>
        {/* Curved White Marble Concierge Desk Counter */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 1.8, 1.1, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.15} roughness={0.15} />
        </mesh>
        {/* Desk Top Trim in Polished Flipkart Blue */}
        <mesh position={[0, 1.12, 0]}>
          <cylinderGeometry args={[1.88, 1.88, 0.08, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#2874F0" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Yellow Accent LED Strip */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.82, 1.82, 0.08, 32, 1, false, 0, Math.PI]} />
          <meshBasicMaterial color="#FFE500" />
        </mesh>

        <Text
          position={[0, 0.62, 1.82]}
          fontSize={0.2}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          CONCIERGE & STORE DIRECTORY
        </Text>
        <Text
          position={[0, 0.35, 1.82]}
          fontSize={0.11}
          color="#2874F0"
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          SELECT ANY DEPARTMENT TO TAKE THE GLASS ELEVATOR
        </Text>

        {/* Holographic Glowing Centerpiece */}
        <HologramCenterpiece />
      </group>

      {/* ================= 5. RENDER 8 DETAILED CATEGORY PAVILIONS ================= */}
      {LOBBY_CATEGORIES.map((cat) => (
        <CategoryPavilion
          key={cat.id}
          category={cat}
          onSelect={selectCategory}
        />
      ))}
    </group>
  );
}

export default GroundLobby;
