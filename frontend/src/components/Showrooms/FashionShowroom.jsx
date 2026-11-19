import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { SneakerModel } from '../ProductViewer/Models3D/SneakerModel';
import { MannequinModel } from '../ProductViewer/Models3D/MannequinModel';
import { HandbagModel } from '../ProductViewer/Models3D/HandbagModel';
import { SmartwatchModel } from '../ProductViewer/Models3D/SmartwatchModel';

function InteractiveFashionItem({ product, position, rotation = [0, 0, 0], scale = 0.6, children, label, price }) {
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

      {/* Glossy White Acrylic Pedestal Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.8, 0.2, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.15} />
      </mesh>

      {/* Glowing Fashion Pink/Magenta Halo Ring */}
      <mesh ref={haloRef} position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.72, 32]} />
        <meshBasicMaterial
          color={hovered ? '#FFE500' : '#EC4899'}
          transparent
          opacity={hovered ? 0.95 : 0.6}
        />
      </mesh>

      {/* Floating Info Tag in Dark Navy */}
      <group position={[0, -0.05, 0.52]}>
        <mesh>
          <boxGeometry args={[1.35, 0.38, 0.04]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.17, 0.02]}>
          <boxGeometry args={[1.35, 0.04, 0.02]} />
          <meshBasicMaterial color="#EC4899" />
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

// Clothing Display Rack with Hanging Garments
function ClothingRack({ position, rotation = [0, 0, 0] }) {
  const clothesColors = ['#1E293B', '#EC4899', '#2563EB', '#D97706', '#059669'];

  return (
    <group position={position} rotation={rotation}>
      {/* Heavy Brushed Steel Base */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[3.2, 0.1, 0.8]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Chrome Vertical Support Posts */}
      {[-1.4, 1.4].map((x, idx) => (
        <mesh key={idx} position={[x, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.3, 16]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* Chrome Horizontal Clothes Rail */}
      <mesh position={[0, 2.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 2.9, 16]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Hanging Garments on Rail */}
      {clothesColors.map((color, idx) => {
        const xPos = -1.1 + idx * 0.55;
        return (
          <group key={idx} position={[xPos, 1.45, 0]}>
            {/* Triangular Gold Hanger */}
            <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.18, 0.02, 3]} />
              <meshStandardMaterial color="#FFE500" metalness={0.8} />
            </mesh>
            {/* Hanging Blazer / Dress Fabric */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.12, 1.4, 0.42]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* Rack Overhead Label */}
      <Text position={[0, 2.65, 0]} fontSize={0.15} color="#172B4D" fontWeight={900}>
        DESIGNER COLLECTION 2026
      </Text>
    </group>
  );
}

// Fashion Accessories Table (Designer Sunglasses, Belts & Watches)
function AccessoriesDisplayTable({ position }) {
  return (
    <group position={position}>
      {/* White Gloss Table Base */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.9, 1.4]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.15} />
      </mesh>
      {/* Magenta Edge Trim */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[3.02, 0.08, 1.42]} />
        <meshBasicMaterial color="#EC4899" />
      </mesh>

      {/* Overhead Sign */}
      <group position={[0, 2.8, 0]}>
        <mesh>
          <boxGeometry args={[2.4, 0.45, 0.06]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.2, 0.02]}>
          <boxGeometry args={[2.4, 0.04, 0.04]} />
          <meshBasicMaterial color="#EC4899" />
        </mesh>
        <Text position={[0, 0, 0.04]} fontSize={0.16} color="#172B4D" fontWeight={900}>
          FASHION ACCESSORIES
        </Text>
      </group>

      {/* Accessory 1: Luxury Sunglasses on Acrylic Riser */}
      <group position={[-0.85, 0.95, 0]}>
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.6, 0.12, 0.35]} />
          <meshPhysicalMaterial color="#BAE6FD" transmission={0.9} transparent opacity={0.4} />
        </mesh>
        {/* Sunglasses Frames */}
        <mesh position={[0, 0.16, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 16]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.22, 0.16, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 16]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
        </mesh>
        <Text position={[0, 0.32, 0]} fontSize={0.09} color="#172B4D" fontWeight={800}>
          Gucci Aviators
        </Text>
      </group>

      {/* Accessory 2: Luxury Leather Belt Coil with Gold Buckle */}
      <group position={[0.85, 0.95, 0]}>
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 24]} />
          <meshStandardMaterial color="#78350F" roughness={0.4} />
        </mesh>
        {/* Gold Buckle */}
        <mesh position={[0, 0.1, 0.2]}>
          <boxGeometry args={[0.18, 0.14, 0.04]} />
          <meshStandardMaterial color="#FFE500" metalness={0.95} roughness={0.1} />
        </mesh>
        <Text position={[0, 0.32, 0]} fontSize={0.09} color="#172B4D" fontWeight={800}>
          Hermès Leather Belt
        </Text>
      </group>
    </group>
  );
}

export function FashionShowroom({ floorY = 16 }) {
  const products = useStore((state) => state.products);
  const sneaker = products.find((p) => p.slug === 'nike-air-max-270-react');
  const blazer = products.find((p) => p.slug === 'armani-exchange-blazer') || {
    id: 201,
    name: 'Armani Exchange Tailored Slim Blazer',
    slug: 'armani-exchange-blazer',
    brand: 'Armani Exchange',
    price: 18990,
    floor_number: 2,
    model_3d_type: 'mannequin'
  };
  const handbag = products.find((p) => p.slug === 'gucci-horsebit-1955') || {
    id: 202,
    name: 'Gucci Horsebit 1955 Leather Bag',
    slug: 'gucci-horsebit-1955',
    brand: 'Gucci',
    price: 245000,
    floor_number: 2,
    model_3d_type: 'handbag'
  };
  const luxuryWatch = products.find((p) => p.slug === 'apple-watch-ultra-2') || {
    id: 203,
    name: 'Rolex Cosmograph Daytona',
    slug: 'rolex-daytona',
    brand: 'Rolex',
    price: 1450000,
    floor_number: 2,
    model_3d_type: 'smartwatch'
  };

  return (
    <group position={[0, floorY, 0]}>
      {/* ================= 1. RUNWAY MARBLE FLOOR ================= */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 28]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.2, 13.4, 48]} />
        <meshBasicMaterial color="#EC4899" />
      </mesh>

      {/* ================= 2. MAIN BOUTIQUE HEADER BILLBOARD ================= */}
      <group position={[0, 5.8, -7.15]}>
        <mesh>
          <boxGeometry args={[14, 1.4, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.65, 0.02]}>
          <boxGeometry args={[14, 0.1, 0.06]} />
          <meshBasicMaterial color="#EC4899" />
        </mesh>
        <Text
          position={[0, 0.18, 0.06]}
          fontSize={0.38}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          FASHION & LIFESTYLE BOUTIQUE
        </Text>
        <Text
          position={[0, -0.25, 0.06]}
          fontSize={0.17}
          color="#EC4899"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          HAUTE COUTURE • SNEAKER VAULT • DESIGNER BAGS • RACKS • WATCHES & ACCESSORIES
        </Text>
      </group>

      {/* ================= 3. 3D MANNEQUINS DISPLAY ISLAND ================= */}
      <group position={[-5.8, 0, -1.0]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 0.5, 2.2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[4.42, 0.05, 2.22]} />
          <meshBasicMaterial color="#EC4899" />
        </mesh>

        <InteractiveFashionItem
          product={blazer}
          position={[-1.2, 0.5, 0]}
          label="Armani Slim Blazer"
          price="₹18,990"
          scale={0.55}
        >
          <MannequinModel color="#1E293B" />
        </InteractiveFashionItem>

        <InteractiveFashionItem
          product={blazer}
          position={[1.2, 0.5, 0]}
          label="Couture Velvet Gown"
          price="₹28,500"
          scale={0.55}
        >
          <MannequinModel color="#EC4899" />
        </InteractiveFashionItem>
      </group>

      {/* ================= 4. SNEAKER VAULT DISPLAY ISLAND ================= */}
      <group position={[5.8, 0, -1.0]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 0.5, 2.2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[4.42, 0.05, 2.22]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>

        <InteractiveFashionItem
          product={sneaker}
          position={[-1.1, 0.5, 0]}
          label="Nike Air Max 270 (Laser)"
          price="₹13,995"
          scale={0.55}
        >
          <SneakerModel color="#0090FF" />
        </InteractiveFashionItem>

        <InteractiveFashionItem
          product={sneaker}
          position={[1.1, 0.5, 0]}
          label="Nike Air Max 270 (Black)"
          price="₹13,995"
          scale={0.55}
        >
          <SneakerModel color="#111827" />
        </InteractiveFashionItem>
      </group>

      {/* ================= 5. LUXURY CLOTHING DISPLAY RACK (LEFT WING) ================= */}
      <ClothingRack position={[-11.5, 0, 2.5]} rotation={[0, Math.PI / 2, 0]} />

      {/* ================= 6. ACCESSORIES & SUNGLASSES TABLE (RIGHT WING) ================= */}
      <AccessoriesDisplayTable position={[11.5, 0, 2.5]} />

      {/* ================= 7. CENTER LUXURY HANDBAG & WATCH SHOWCASES ================= */}
      <group position={[-1.8, 0, 2.2]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.1, 0.9, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.12, 1.12, 0.08, 32]} />
          <meshBasicMaterial color="#EC4899" />
        </mesh>

        <InteractiveFashionItem
          product={handbag}
          position={[0, 0.95, 0]}
          label="Gucci Horsebit 1955"
          price="₹2,45,000"
          scale={0.7}
        >
          <HandbagModel color="#8B4513" />
        </InteractiveFashionItem>
      </group>

      <group position={[1.8, 0, 2.2]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.1, 0.9, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.12, 1.12, 0.08, 32]} />
          <meshBasicMaterial color="#FFE500" />
        </mesh>
        {/* Crystal Dome Cover */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[1.0, 1.0, 0.7, 32]} />
          <meshPhysicalMaterial color="#BAE6FD" transmission={0.92} transparent opacity={0.3} roughness={0.05} />
        </mesh>

        <InteractiveFashionItem
          product={luxuryWatch}
          position={[0, 0.95, 0]}
          label="Rolex Cosmograph Daytona"
          price="₹14,50,000"
          scale={0.65}
        >
          <SmartwatchModel color="#FFE500" />
        </InteractiveFashionItem>
      </group>
    </group>
  );
}
