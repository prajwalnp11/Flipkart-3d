import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { resolveCategoryFloor } from '../../store/useExperienceStore';
import { DynamicProductModel, normalizeModelType } from '../ProductViewer/DynamicProductModel';
import { getCarraraMarbleTexture, getCarraraMarbleRoughnessTexture } from '../../utils/marbleTextures';

// Predefined Bilateral Grand Colonnade Anchor Positions for dynamic category pavilions
export const LOBBY_ANCHOR_SLOTS = [
  // Slot 0 - West Colonnade (Left Wing, Mid)
  { position: [-9.2, 0, -2.5], rotation: [0, 0.35, 0] },
  // Slot 1 - East Colonnade (Right Wing, Mid)
  { position: [9.2, 0, -2.5], rotation: [0, -0.35, 0] },
  // Slot 2 - West Colonnade (Left Wing, Forward)
  { position: [-9.4, 0, 1.8], rotation: [0, 0.45, 0] },
  // Slot 3 - East Colonnade (Right Wing, Forward)
  { position: [9.4, 0, 1.8], rotation: [0, -0.45, 0] },
  // Slot 4 - West Colonnade (Left Wing, Front)
  { position: [-8.8, 0, 6.0], rotation: [0, 0.55, 0] },
  // Slot 5 - East Colonnade (Right Wing, Front)
  { position: [8.8, 0, 6.0], rotation: [0, -0.55, 0] },
  // Slot 6 - West Colonnade (Left Wing, North/Deep)
  { position: [-7.2, 0, -6.5], rotation: [0, 0.25, 0] },
  // Slot 7 - East Colonnade (Right Wing, North/Deep)
  { position: [7.2, 0, -6.5], rotation: [0, -0.25, 0] },
  // Slot 8 - West Wing (South Forecourt)
  { position: [-6.8, 0, 9.8], rotation: [0, 0.70, 0] },
  // Slot 9 - East Wing (South Forecourt)
  { position: [6.8, 0, 9.8], rotation: [0, -0.70, 0] },
  // Slot 10 - West Outer Promenade
  { position: [-12.2, 0, 0.0], rotation: [0, 0.50, 0] },
  // Slot 11 - East Outer Promenade
  { position: [12.2, 0, 0.0], rotation: [0, -0.50, 0] },
  // Slot 12 - West Outer Forecourt
  { position: [-11.8, 0, 4.5], rotation: [0, 0.60, 0] },
  // Slot 13 - East Outer Forecourt
  { position: [11.8, 0, 4.5], rotation: [0, -0.60, 0] }
];

/**
 * Computes a symmetric spatial slot for any category index.
 * Gracefully scales to arbitrary category counts.
 */
export function getCategorySlot(index) {
  if (index < LOBBY_ANCHOR_SLOTS.length) {
    return LOBBY_ANCHOR_SLOTS[index];
  }
  const side = index % 2 === 0 ? -1 : 1;
  const step = Math.floor(index / 2);
  const z = -6.0 + (step * 2.2);
  const x = side * (10.5 + (step % 2) * 1.5);
  const rotY = side > 0 ? -0.45 : 0.45;
  return { position: [x, 0, z], rotation: [0, rotY, 0] };
}

// Offline fallback category definitions (Preserved for offline resilience)
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

// Visual styling and monogram resolver for the 11 Mall Categories
export function getCategoryVisuals(category) {
  const slug = (category?.slug || category?.name || '').toLowerCase();
  const icon3D = (category?.icon_3d_type || category?.icon_type || '').toLowerCase();

  if (slug.includes('mobile') || icon3D === 'smartphone') {
    return { glyph: 'MOB', symbol: '📱', label: '1F TECH', color: '#2874F0' };
  }
  if (slug.includes('laptop') || slug.includes('computer') || icon3D === 'laptop') {
    return { glyph: 'LAP', symbol: '💻', label: '1F TECH', color: '#0284C7' };
  }
  if (slug.includes('audio') || slug.includes('speaker')) {
    return { glyph: 'AUD', symbol: '🔊', label: '1F TECH', color: '#8B5CF6' };
  }
  if (slug.includes('wearable') || slug.includes('watch') || icon3D === 'smartwatch') {
    return { glyph: 'WCH', symbol: '⌚', label: '1F TECH', color: '#06B6D4' };
  }
  if (slug.includes('electronic') || icon3D === 'headphones') {
    return { glyph: 'ELC', symbol: '🎧', label: '1F TECH', color: '#4F46E5' };
  }
  if (slug.includes('shoe') || slug.includes('sneaker') || icon3D === 'shoe') {
    return { glyph: 'SHO', symbol: '👟', label: '2F FASHION', color: '#F97316' };
  }
  if (slug.includes('fashion') || slug.includes('apparel') || icon3D === 'fashion') {
    return { glyph: 'FSH', symbol: '👗', label: '2F FASHION', color: '#EC4899' };
  }
  if (slug.includes('beauty') || slug.includes('cosmetic') || icon3D === 'beauty') {
    return { glyph: 'BTY', symbol: '✨', label: '2F FASHION', color: '#F43F5E' };
  }
  if (slug.includes('accessori') || icon3D === 'accessories') {
    return { glyph: 'ACC', symbol: '👜', label: '2F FASHION', color: '#E11D48' };
  }
  if (slug.includes('furnitur') || icon3D === 'sofa') {
    return { glyph: 'FUR', symbol: '🛋️', label: '3F LIVING', color: '#10B981' };
  }
  if (slug.includes('appliance') || slug.includes('tv') || icon3D === 'television') {
    return { glyph: 'APP', symbol: '📺', label: '3F LIVING', color: '#059669' };
  }

  return { glyph: 'DEP', symbol: '🛍️', label: 'MALL', color: '#2874F0' };
}

// 3D Animated Loading State Inside Directory Panel
function DirectoryLoadingView() {
  const crystalRef = useRef();
  useFrame((_, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 1.5;
      crystalRef.current.rotation.x += delta * 0.8;
    }
  });

  return (
    <group position={[0, 1.85, 0.08]}>
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.65, 0.025, 16, 40]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.8} />
      </mesh>
      <mesh ref={crystalRef}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} wireframe />
      </mesh>
      <Text
        position={[0, -0.65, 0]}
        fontSize={0.072}
        color="#38BDF8"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
      >
        CONNECTING TO FLIPKART CATALOG...
      </Text>
      <Text
        position={[0, -0.78, 0]}
        fontSize={0.042}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        Retrieving Live 3D Department Portals
      </Text>
    </group>
  );
}

// 3D Error State Inside Directory Panel
function DirectoryErrorView({ error, onRetry }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0, 1.85, 0.08]}>
      <mesh position={[0, 0.65, 0]}>
        <planeGeometry args={[2.2, 0.08]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <Text
        position={[0, 0.35, 0]}
        fontSize={0.076}
        color="#F87171"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
      >
        DIRECTORY OFFLINE
      </Text>
      <Text
        position={[0, 0.15, 0]}
        fontSize={0.042}
        color="#CBD5E1"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.0}
        fontWeight={600}
      >
        {error || 'Unable to establish live connection to the category directory.'}
      </Text>
      <group
        position={[0, -0.32, 0]}
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
          if (onRetry) onRetry();
        }}
      >
        <mesh>
          <planeGeometry args={[1.5, 0.22]} />
          <meshBasicMaterial color={hovered ? '#1D4ED8' : '#2874F0'} />
        </mesh>
        <Text
          position={[0, 0, 0.005]}
          fontSize={0.048}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          RETRY CONNECTION
        </Text>
      </group>
    </group>
  );
}

// 3D Empty State Inside Directory Panel
function DirectoryEmptyView({ onRefresh }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0, 1.85, 0.08]}>
      <Text
        position={[0, 0.35, 0]}
        fontSize={0.076}
        color="#F59E0B"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
      >
        NO DEPARTMENTS AVAILABLE
      </Text>
      <Text
        position={[0, 0.15, 0]}
        fontSize={0.042}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
        fontWeight={600}
      >
        The shopping mall catalog is currently undergoing scheduled updates.
      </Text>
      <group
        position={[0, -0.32, 0]}
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
          if (onRefresh) onRefresh();
        }}
      >
        <mesh>
          <planeGeometry args={[1.5, 0.22]} />
          <meshBasicMaterial color={hovered ? '#1D4ED8' : '#2874F0'} />
        </mesh>
        <Text
          position={[0, 0, 0.005]}
          fontSize={0.048}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          REFRESH DIRECTORY
        </Text>
      </group>
    </group>
  );
}

// Interactive Category Card in the 3-Column Grid of the Directory Panel
function DirectoryCategoryCard({ category, col, row, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const visuals = getCategoryVisuals(category);
  const cardColor = category.color || visuals.color;
  const floorNumber = resolveCategoryFloor(category);
  const floorBadge = category.floor_label || visuals.label || `FLOOR ${floorNumber}`;

  const colX = (col - 1) * 0.84;
  const rowY = 2.48 - (row * 0.42);
  const active = isSelected || hovered;

  return (
    <group
      position={[colX, rowY, active ? 0.092 : 0.078]}
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
      {/* 1. Main Card Surface */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.78, 0.38]} />
        <meshStandardMaterial
          color={active ? '#162033' : '#0B1322'}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* 2. Sleek Colored Border Lines (Top, Bottom, Left, Right) */}
      <mesh position={[0, 0.188, 0.002]}>
        <planeGeometry args={[0.78, 0.006]} />
        <meshBasicMaterial color={active ? (hovered ? '#FFE500' : '#00F0FF') : (cardColor || '#1E3A8A')} />
      </mesh>
      <mesh position={[0, -0.188, 0.002]}>
        <planeGeometry args={[0.78, 0.006]} />
        <meshBasicMaterial color={active ? (hovered ? '#FFE500' : '#00F0FF') : (cardColor || '#1E3A8A')} />
      </mesh>
      <mesh position={[-0.388, 0, 0.002]}>
        <planeGeometry args={[0.006, 0.38]} />
        <meshBasicMaterial color={active ? (hovered ? '#FFE500' : '#00F0FF') : (cardColor || '#1E3A8A')} />
      </mesh>
      <mesh position={[0.388, 0, 0.002]}>
        <planeGeometry args={[0.006, 0.38]} />
        <meshBasicMaterial color={active ? (hovered ? '#FFE500' : '#00F0FF') : (cardColor || '#1E3A8A')} />
      </mesh>

      {/* 3. Left Circular Icon & Monogram Badge */}
      <group position={[-0.25, 0.035, 0.004]}>
        <mesh>
          <circleGeometry args={[0.105, 32]} />
          <meshBasicMaterial color={cardColor} />
        </mesh>
        <mesh position={[0, 0, 0.001]}>
          <ringGeometry args={[0.106, 0.114, 32]} />
          <meshBasicMaterial color={active ? '#FFFFFF' : '#94A3B8'} />
        </mesh>
        <Text
          position={[0, 0, 0.003]}
          fontSize={0.048}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {visuals.glyph}
        </Text>
      </group>

      {/* 4. Category Name */}
      <Text
        position={[-0.11, 0.075, 0.004]}
        fontSize={category.name.length > 20 ? 0.038 : 0.044}
        color={active ? '#FFFFFF' : '#F1F5F9'}
        anchorX="left"
        anchorY="middle"
        fontWeight={900}
        maxWidth={0.48}
        lineHeight={1.05}
      >
        {category.name}
      </Text>

      {/* 5. Destination Floor Badge */}
      <group position={[-0.11, -0.025, 0.004]}>
        <mesh position={[0.105, 0, 0]}>
          <planeGeometry args={[0.22, 0.065]} />
          <meshBasicMaterial color={cardColor} />
        </mesh>
        <Text
          position={[0.105, 0, 0.003]}
          fontSize={0.034}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {floorBadge}
        </Text>
      </group>

      {/* 6. Active Filter Indicator */}
      {isSelected && (
        <group position={[0.24, -0.025, 0.004]}>
          <mesh>
            <planeGeometry args={[0.18, 0.055]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          <Text
            position={[0, 0, 0.003]}
            fontSize={0.026}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            ACTIVE
          </Text>
        </group>
      )}

      {/* 7. Bottom Call-To-Action Ribbon */}
      <group position={[0, -0.138, 0.004]}>
        <mesh>
          <planeGeometry args={[0.74, 0.065]} />
          <meshBasicMaterial color={active ? (hovered ? '#FFE500' : cardColor) : '#0F172A'} />
        </mesh>
        <Text
          position={[0, 0, 0.003]}
          fontSize={0.032}
          color={active ? (hovered ? '#0F172A' : '#FFFFFF') : '#94A3B8'}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {hovered ? 'RIDE EXPRESS ELEVATOR →' : 'TOUCH TO SELECT DEPARTMENT'}
        </Text>
      </group>
    </group>
  );
}

// 12th Tile in the 3x4 Grid: Central Concierge & Overview
function DirectoryConciergeCard({ onSelectFloor }) {
  const [hovered, setHovered] = useState(false);

  const colX = (2 - 1) * 0.84; // +0.84
  const rowY = 2.48 - (3 * 0.42); // 1.22

  return (
    <group
      position={[colX, rowY, hovered ? 0.092 : 0.078]}
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
        if (onSelectFloor) onSelectFloor(0);
      }}
    >
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.78, 0.38]} />
        <meshStandardMaterial
          color={hovered ? '#162033' : '#0B1322'}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 0.188, 0.002]}>
        <planeGeometry args={[0.78, 0.006]} />
        <meshBasicMaterial color={hovered ? '#FFE500' : '#2874F0'} />
      </mesh>
      <mesh position={[0, -0.188, 0.002]}>
        <planeGeometry args={[0.78, 0.006]} />
        <meshBasicMaterial color={hovered ? '#FFE500' : '#2874F0'} />
      </mesh>
      <mesh position={[-0.388, 0, 0.002]}>
        <planeGeometry args={[0.006, 0.38]} />
        <meshBasicMaterial color={hovered ? '#FFE500' : '#2874F0'} />
      </mesh>
      <mesh position={[0.388, 0, 0.002]}>
        <planeGeometry args={[0.006, 0.38]} />
        <meshBasicMaterial color={hovered ? '#FFE500' : '#2874F0'} />
      </mesh>

      <group position={[-0.25, 0.035, 0.004]}>
        <mesh>
          <circleGeometry args={[0.105, 32]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        <Text
          position={[0, 0, 0.003]}
          fontSize={0.048}
          color="#FFE500"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          3D
        </Text>
      </group>

      <Text
        position={[-0.11, 0.075, 0.004]}
        fontSize={0.042}
        color="#FFFFFF"
        anchorX="left"
        anchorY="middle"
        fontWeight={900}
      >
        Flipkart 3D Mall
      </Text>

      <Text
        position={[-0.11, -0.025, 0.004]}
        fontSize={0.034}
        color="#38BDF8"
        anchorX="left"
        anchorY="middle"
        fontWeight={700}
      >
        4 Floors • 11 Departments
      </Text>

      <group position={[0, -0.138, 0.004]}>
        <mesh>
          <planeGeometry args={[0.74, 0.065]} />
          <meshBasicMaterial color={hovered ? '#2874F0' : '#0F172A'} />
        </mesh>
        <Text
          position={[0, 0, 0.003]}
          fontSize={0.032}
          color={hovered ? '#FFFFFF' : '#94A3B8'}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {hovered ? 'RETURN TO LOBBY' : 'GRAND LOBBY CONCIERGE'}
        </Text>
      </group>
    </group>
  );
}

// Quick Jump Floor Button in Directory Panel Footer
function DirectoryFloorButton({ label, floor, x, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[x, 0, 0.006]}
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
        if (onSelect) onSelect(floor);
      }}
    >
      <mesh>
        <planeGeometry args={[0.38, 0.12]} />
        <meshBasicMaterial color={hovered ? '#2874F0' : '#1E293B'} />
      </mesh>
      <Text
        position={[0, 0, 0.004]}
        fontSize={0.034}
        color={hovered ? '#FFFFFF' : '#E2E8F0'}
        anchorX="center"
        anchorY="middle"
        fontWeight={800}
      >
        {label}
      </Text>
    </group>
  );
}

// Large Premium Interactive Category Directory Touchscreen Panel
export function CategoryDirectoryPanel({
  position = [-2.8, 0, 6.4],
  rotation = [0, 0.35, 0],
  onSelectFloor
}) {
  const categories = useStore((state) => state.categories);
  const categoriesLoading = useStore((state) => state.categoriesLoading);
  const categoriesError = useStore((state) => state.categoriesError);
  const fetchCategories = useStore((state) => state.fetchCategories);
  const selectCategory = useStore((state) => state.selectCategory);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const travelToFloor = useStore((state) => state.travelToFloor);

  const displayCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories.filter((c) => c.is_active !== false);
    }
    return [];
  }, [categories]);

  const handleFloorSelect = onSelectFloor || travelToFloor;

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Curved White Marble Floor Base Plinth */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.08, 0.16, 0.65]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
      </mesh>

      {/* Blue LED Plinth Underglow Ring */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[3.14, 0.04, 0.71]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>

      {/* Polished Silver Chrome Base Trim */}
      <mesh position={[0, 0.155, 0]}>
        <boxGeometry args={[3.02, 0.03, 0.61]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* 2. Dual Brushed Silver Upright Supporting Columns */}
      <mesh position={[-1.38, 1.75, 0]} castShadow>
        <boxGeometry args={[0.12, 3.2, 0.22]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.92} roughness={0.15} />
      </mesh>
      <mesh position={[1.38, 1.75, 0]} castShadow>
        <boxGeometry args={[0.12, 3.2, 0.22]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* 3. Main Touchscreen Outer Casing Housing (White Gloss Enamel) */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <boxGeometry args={[2.76, 2.72, 0.12]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.2} />
      </mesh>

      {/* Polished Silver Inner Bezel Frame */}
      <mesh position={[0, 1.9, 0.062]}>
        <boxGeometry args={[2.72, 2.68, 0.015]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Blue Illuminated Perimeter LED Borders */}
      {/* Top Edge */}
      <mesh position={[0, 3.24, 0.07]}>
        <boxGeometry args={[2.68, 0.015, 0.02]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>
      {/* Bottom Edge */}
      <mesh position={[0, 0.56, 0.07]}>
        <boxGeometry args={[2.68, 0.015, 0.02]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>
      {/* Left Edge */}
      <mesh position={[-1.34, 1.9, 0.07]}>
        <boxGeometry args={[0.015, 2.68, 0.02]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>
      {/* Right Edge */}
      <mesh position={[1.34, 1.9, 0.07]}>
        <boxGeometry args={[0.015, 2.68, 0.02]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>

      {/* Top Architectural Hood Cap with Flipkart Blue Trim */}
      <mesh position={[0, 3.28, 0.02]}>
        <boxGeometry args={[2.84, 0.08, 0.2]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 3.32, 0.09]}>
        <boxGeometry args={[2.80, 0.02, 0.04]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>

      {/* 4. Glossy Touchscreen Face Glass */}
      <mesh position={[0, 1.9, 0.068]}>
        <planeGeometry args={[2.62, 2.58]} />
        <meshStandardMaterial color="#060C18" roughness={0.08} metalness={0.9} />
      </mesh>

      {/* 5. Header Area */}
      <group position={[0, 3.02, 0.078]}>
        <mesh position={[0, 0.09, 0]}>
          <planeGeometry args={[0.82, 0.08]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        <Text
          position={[0, 0.09, 0.004]}
          fontSize={0.042}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          FLIPKART 3D MALL
        </Text>

        <Text
          position={[0, 0.01, 0.004]}
          fontSize={0.072}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          INTERACTIVE STORE DIRECTORY
        </Text>
        <Text
          position={[0, -0.07, 0.004]}
          fontSize={0.038}
          color="#38BDF8"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          SELECT ANY DEPARTMENT TO RIDE THE PANORAMIC GLASS ELEVATOR
        </Text>
        <mesh position={[0, -0.11, 0.004]}>
          <planeGeometry args={[2.48, 0.008]} />
          <meshBasicMaterial color="#FFE500" />
        </mesh>
      </group>

      {/* 6. Touchscreen Display Body States */}
      {categoriesLoading && displayCategories.length === 0 && (
        <DirectoryLoadingView />
      )}

      {!categoriesLoading && categoriesError && displayCategories.length === 0 && (
        <DirectoryErrorView error={categoriesError} onRetry={fetchCategories} />
      )}

      {!categoriesLoading && !categoriesError && displayCategories.length === 0 && (
        <DirectoryEmptyView onRefresh={fetchCategories} />
      )}

      {/* 7. Dynamic 3-Column Category Grid */}
      {displayCategories.length > 0 && (
        <group>
          {displayCategories.map((cat, idx) => {
            const col = idx % 3;
            const row = Math.floor(idx / 3);
            const isSelected = selectedCategory && (selectedCategory.id === cat.id || selectedCategory.slug === cat.slug);

            return (
              <DirectoryCategoryCard
                key={cat.id || cat.slug || idx}
                category={cat}
                col={col}
                row={row}
                isSelected={isSelected}
                onSelect={selectCategory}
              />
            );
          })}

          {/* Slot 11: Concierge & Help Tile to Complete the 3x4 Grid */}
          <DirectoryConciergeCard onSelectFloor={handleFloorSelect} />
        </group>
      )}

      {/* 8. Bottom Direct Floor Navigation Quick Strip */}
      <group position={[0, 0.72, 0.078]}>
        <mesh>
          <planeGeometry args={[2.56, 0.18]} />
          <meshBasicMaterial color="#070D18" />
        </mesh>
        <Text
          position={[-0.95, 0, 0.004]}
          fontSize={0.034}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          EXPRESS FLOORS:
        </Text>
        {[
          { label: 'G LOBBY', floor: 0, x: -0.42 },
          { label: '1F ELECTRONICS', floor: 1, x: 0.05 },
          { label: '2F FASHION', floor: 2, x: 0.52 },
          { label: '3F HOME', floor: 3, x: 0.98 }
        ].map((btn, i) => (
          <DirectoryFloorButton
            key={i}
            label={btn.label}
            floor={btn.floor}
            x={btn.x}
            onSelect={handleFloorSelect}
          />
        ))}
      </group>
    </group>
  );
}

// Backwards compatibility export alias
export const DirectoryKiosk = CategoryDirectoryPanel;

// Detailed 3D Category Model Renderer with Dynamic Model Resolution
function CategoryModel({ type, category }) {
  const rawType = (type || category?.icon_3d_type || category?.icon_type || category?.slug || category?.name || '').toLowerCase().trim();
  const color = category?.color || '#2874F0';

  // 1. Audio / Speaker Mapping
  if (rawType === 'audio' || rawType === 'speaker') {
    return (
      <group scale={0.7} position={[0, 0.4, 0]}>
        <DynamicProductModel modelType="speaker" color={color} />
      </group>
    );
  }

  // 2. Shoes / Footwear Mapping
  if (rawType === 'shoe' || rawType === 'shoes' || rawType === 'sneaker') {
    return (
      <group scale={0.7} position={[0, 0.4, 0]}>
        <DynamicProductModel modelType="sneaker" color={color} />
      </group>
    );
  }

  // 3. Accessories / Handbag Mapping
  if (rawType === 'accessories' || rawType === 'accessory' || rawType === 'handbag') {
    return (
      <group scale={0.7} position={[0, 0.4, 0]}>
        <DynamicProductModel modelType="handbag" color={color} />
      </group>
    );
  }

  // 4. Try canonical DynamicProductModel (Task 1 model system: smartphone, laptop, smartwatch, headphones, etc.)
  const canonical = normalizeModelType(rawType);
  if (canonical && canonical !== 'handbag') {
    const s = canonical === 'television' || canonical === 'laptop' || canonical === 'sofa' ? 0.62 : 0.7;
    return (
      <group scale={s} position={[0, 0.4, 0]}>
        <DynamicProductModel modelType={canonical} color={color} />
      </group>
    );
  }

  // 5. Rich Procedural category models (preserves all existing procedural designs)
  switch (rawType) {
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
    case 'home-appliances':
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
    case 'sports-gaming':
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
      return (
        <group scale={0.7} position={[0, 0.4, 0]}>
          <DynamicProductModel modelType="smartphone" color={color} />
        </group>
      );
  }
}

// Individual 3D Interactive Category Pavilion in Ground Lobby
function CategoryPavilion({ category, slotPosition, slotRotation, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef();

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (hovered ? 2.5 : 0.8);
    }
  });

  const position = category.position || slotPosition || [0, 0, 0];
  const rotation = category.rotation || slotRotation || [0, 0, 0];
  const color = category.color || '#2874F0';
  const floorNumber = resolveCategoryFloor(category);
  const floorLabel = category.floor_label || (floorNumber === 0 ? 'GROUND' : `FLOOR ${floorNumber}`);
  const name = category.name || 'Department';
  const subtitle = category.description || category.subtitle || 'Explore premium department offerings';

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
          color={hovered ? '#FFE500' : color}
          transparent
          opacity={hovered ? 0.95 : 0.65}
        />
      </mesh>

      {/* 2. Floating 3D Category Iconic Model */}
      <group position={[0, 0.35, 0]}>
        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.25}>
          <CategoryModel category={category} type={category.icon_3d_type || category.icon_type} />
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
          <meshBasicMaterial color={color} />
        </mesh>

        {/* Floor Navigation Badge */}
        <group position={[-0.8, 0.22, 0.04]}>
          <mesh>
            <boxGeometry args={[0.62, 0.18, 0.02]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.095}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            {floorLabel}
          </Text>
        </group>

        {/* Category Main Name */}
        <Text
          position={[0.15, 0.22, 0.04]}
          fontSize={name.length > 20 ? 0.105 : 0.13}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          maxWidth={1.6}
        >
          {name}
        </Text>

        {/* Subtitle / Department Contents */}
        <Text
          position={[0, -0.04, 0.04]}
          fontSize={0.082}
          color="#475569"
          anchorX="center"
          anchorY="middle"
          fontWeight={600}
          maxWidth={2.3}
          lineHeight={1.1}
        >
          {subtitle}
        </Text>

        {/* Interactive "ENTER DEPARTMENT →" Button Strip */}
        <group position={[0, -0.27, 0.04]}>
          <mesh>
            <boxGeometry args={[2.2, 0.2, 0.02]} />
            <meshBasicMaterial color={hovered ? color : '#F1F5F9'} />
          </mesh>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.088}
            color={hovered ? '#FFFFFF' : color}
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

// 3D Animated Loading State Indicator in Ground Lobby
function LobbyLoadingIndicator() {
  const crystalRef = useRef();
  useFrame((_, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 1.5;
      crystalRef.current.rotation.x += delta * 0.8;
    }
  });

  return (
    <group position={[0, 2.8, 5.0]}>
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.9, 0.03, 16, 48]} />
        <meshBasicMaterial color="#2874F0" transparent opacity={0.8} />
      </mesh>
      <mesh ref={crystalRef}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} wireframe />
      </mesh>
      <Text
        position={[0, -0.9, 0]}
        fontSize={0.22}
        color="#2874F0"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
      >
        CONNECTING TO FLIPKART CATALOG...
      </Text>
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.12}
        color="#64748B"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        Retrieving Department Portals from Django API
      </Text>
    </group>
  );
}

// 3D Error Notice Placard with Interactive Retry Button
function LobbyErrorPlacard({ error, onRetry }) {
  const [retryHovered, setRetryHovered] = useState(false);

  return (
    <group position={[0, 1.8, 5.0]}>
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[4.2, 2.0, 0.12]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.95, 0.02]}>
        <boxGeometry args={[4.2, 0.1, 0.04]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <Text
        position={[0, 0.55, 0.04]}
        fontSize={0.22}
        color="#DC2626"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
      >
        CATALOG TEMPORARILY OFFLINE
      </Text>
      <Text
        position={[0, 0.22, 0.04]}
        fontSize={0.12}
        color="#475569"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.8}
        fontWeight={600}
      >
        {error || 'Unable to establish live connection to the category directory.'}
      </Text>
      <group
        position={[0, -0.45, 0.04]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setRetryHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setRetryHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onRetry) onRetry();
        }}
      >
        <mesh>
          <boxGeometry args={[2.2, 0.36, 0.04]} />
          <meshBasicMaterial color={retryHovered ? '#1D4ED8' : '#2874F0'} />
        </mesh>
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.13}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          RETRY CONNECTION
        </Text>
      </group>
    </group>
  );
}

// 3D Empty Notice Placard with Interactive Refresh Button
function LobbyEmptyPlacard({ onRefresh }) {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <group position={[0, 1.8, 5.0]}>
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[4.2, 1.8, 0.12]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.85, 0.02]}>
        <boxGeometry args={[4.2, 0.1, 0.04]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
      <Text
        position={[0, 0.45, 0.04]}
        fontSize={0.2}
        color="#B45309"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
      >
        NO DEPARTMENTS AVAILABLE
      </Text>
      <Text
        position={[0, 0.15, 0.04]}
        fontSize={0.12}
        color="#64748B"
        anchorX="center"
        anchorY="middle"
        fontWeight={600}
      >
        The shopping mall catalog is currently undergoing scheduled updates.
      </Text>
      <group
        position={[0, -0.4, 0.04]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setBtnHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setBtnHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onRefresh) onRefresh();
        }}
      >
        <mesh>
          <boxGeometry args={[2.0, 0.34, 0.04]} />
          <meshBasicMaterial color={btnHovered ? '#1D4ED8' : '#2874F0'} />
        </mesh>
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.12}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          REFRESH CATALOG
        </Text>
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
  const categories = useStore((state) => state.categories);
  const categoriesLoading = useStore((state) => state.categoriesLoading);
  const categoriesError = useStore((state) => state.categoriesError);
  const fetchCategories = useStore((state) => state.fetchCategories);
  const selectCategory = useStore((state) => state.selectCategory);
  const travelToFloor = useStore((state) => state.travelToFloor);

  useEffect(() => {
    if ((!categories || categories.length === 0) && !categoriesLoading && !categoriesError) {
      fetchCategories();
    }
  }, [categories, categoriesLoading, categoriesError, fetchCategories]);

  // Active category items for dynamic spatial layout
  const displayCategories = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories.filter((c) => c.is_active !== false);
    }
    return [];
  }, [categories]);

  // Procedural Italian Carrara Marble textures for Ground Lobby
  const marbleTexture = useMemo(() => getCarraraMarbleTexture(8, 8), []);
  const marbleRoughness = useMemo(() => getCarraraMarbleRoughnessTexture(8, 8), []);

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. PHOTOREALISTIC WARM CALACATTA MARBLE GROUND LOBBY FLOOR ================= */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[38, 32]} />
        <meshStandardMaterial
          map={marbleTexture}
          roughnessMap={marbleRoughness}
          color="#FAF6EE"
          roughness={0.12}
          metalness={0.22}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Dark Nero Marquina Marble Center Aisle Inlay with Champagne Gold Seam */}
      <mesh position={[0, -0.045, 2.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 16]} />
        <meshStandardMaterial
          color="#171C26"
          roughness={0.12}
          metalness={0.32}
        />
      </mesh>
      {/* Architectural Champagne Gold Border Lines on Center Aisle */}
      <mesh position={[-2.1, -0.042, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
      </mesh>
      <mesh position={[2.1, -0.042, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
      </mesh>

      {/* Decorative Floor Inlay Rings in Lobby Center (Champagne Gold & Bronze) */}
      <mesh position={[0, 0.01, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.4, 6.55, 64]} />
        <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.01, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.75, 6.85, 64]} />
        <meshStandardMaterial color="#8B6F47" metalness={0.88} roughness={0.2} />
      </mesh>

      {/* ================= 2. POTTED PALM TREES ================= */}
      <PottedPalmTree position={[-3.6, 0, 8.2]} scale={1.1} />
      <PottedPalmTree position={[3.6, 0, 8.2]} scale={1.1} />
      <PottedPalmTree position={[-5.4, 0, 3.8]} scale={1.15} />
      <PottedPalmTree position={[5.4, 0, 3.8]} scale={1.15} />
      <PottedPalmTree position={[-2.6, 0, -4.5]} scale={1.05} />
      <PottedPalmTree position={[2.6, 0, -4.5]} scale={1.05} />

      {/* ================= 3. LUXURY INTERACTIVE CATEGORY DIRECTORY PANEL ================= */}
      <CategoryDirectoryPanel position={[-2.8, 0, 6.4]} rotation={[0, 0.35, 0]} onSelectFloor={travelToFloor} />

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

      {/* ================= 5. DYNAMIC 3D CATEGORY PAVILIONS & SYSTEM STATES ================= */}
      {categoriesLoading && displayCategories.length === 0 && (
        <LobbyLoadingIndicator />
      )}

      {!categoriesLoading && categoriesError && displayCategories.length === 0 && (
        <LobbyErrorPlacard error={categoriesError} onRetry={fetchCategories} />
      )}

      {!categoriesLoading && !categoriesError && displayCategories.length === 0 && (
        <LobbyEmptyPlacard onRefresh={fetchCategories} />
      )}

      {displayCategories.map((cat, idx) => {
        const slot = getCategorySlot(idx);
        return (
          <CategoryPavilion
            key={cat.id || cat.slug || idx}
            category={cat}
            slotPosition={slot.position}
            slotRotation={slot.rotation}
            onSelect={selectCategory}
          />
        );
      })}
    </group>
  );
}

export default GroundLobby;
