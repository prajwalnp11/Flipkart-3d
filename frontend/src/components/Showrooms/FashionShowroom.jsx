import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { SneakerModel } from '../ProductViewer/Models3D/SneakerModel';
import { MannequinModel } from '../ProductViewer/Models3D/MannequinModel';
import { HandbagModel } from '../ProductViewer/Models3D/HandbagModel';

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

      {/* Floating Stand Base */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.15, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.2} />
      </mesh>

      {/* Glowing Accent Ring */}
      <mesh ref={haloRef} position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.62, 32]} />
        <meshBasicMaterial
          color={hovered ? '#FFE500' : '#EC4899'}
          transparent
          opacity={hovered ? 0.95 : 0.6}
        />
      </mesh>

      {/* Price / Name Tag */}
      <group position={[0, -0.05, 0.52]}>
        <mesh>
          <boxGeometry args={[1.3, 0.38, 0.04]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.17, 0.02]}>
          <boxGeometry args={[1.3, 0.04, 0.02]} />
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

export function FashionShowroom({ floorY = 16 }) {
  const products = useStore((state) => state.products);
  const sneaker = products.find((p) => p.slug === 'nike-air-max-270-react');
  const blazer = products.find((p) => p.slug === 'armani-exchange-blazer') || {
    id: 201,
    name: 'Armani Exchange Tailored Slim Blazer',
    slug: 'armani-exchange-blazer',
    brand: 'Armani Exchange',
    price: 18999,
    floor_number: 2,
    model_3d_type: 'mannequin'
  };
  const handbag = products.find((p) => p.slug === 'michael-kors-leather-bag') || {
    id: 202,
    name: 'Michael Kors Mercer Leather Bag',
    slug: 'michael-kors-leather-bag',
    brand: 'Michael Kors',
    price: 26900,
    floor_number: 2,
    model_3d_type: 'handbag'
  };

  return (
    <group position={[0, floorY, 0]}>
      {/* Floor Marble & Runway Inlay */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 28]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.2, 13.4, 48]} />
        <meshBasicMaterial color="#EC4899" />
      </mesh>

      {/* Main Department Header */}
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
          HAUTE COUTURE • SNEAKER VAULT • DESIGNER BAGS • LUXURY WATCHES
        </Text>
      </group>

      {/* Fashion Mannequins Display Island */}
      <group position={[-5.5, 0, -1.0]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.5, 2.2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[4.22, 0.05, 2.22]} />
          <meshBasicMaterial color="#EC4899" />
        </mesh>

        <InteractiveFashionItem
          product={blazer}
          position={[-1.2, 0.5, 0]}
          label="Armani Slim Blazer"
          scale={0.55}
        >
          <MannequinModel color="#1E293B" />
        </InteractiveFashionItem>

        <InteractiveFashionItem
          product={blazer}
          position={[1.2, 0.5, 0]}
          label="Couture Velvet Jacket"
          scale={0.55}
        >
          <MannequinModel color="#EC4899" />
        </InteractiveFashionItem>
      </group>

      {/* Sneaker Feature Wall & Podiums */}
      <group position={[5.5, 0, -1.0]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.5, 2.2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[4.22, 0.05, 2.22]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>

        <InteractiveFashionItem
          product={sneaker}
          position={[-1.1, 0.5, 0]}
          label="Nike Air Max 270 (Laser)"
          scale={0.55}
        >
          <SneakerModel color="#0090FF" />
        </InteractiveFashionItem>

        <InteractiveFashionItem
          product={sneaker}
          position={[1.1, 0.5, 0]}
          label="Nike Air Max 270 (Black)"
          scale={0.55}
        >
          <SneakerModel color="#111827" />
        </InteractiveFashionItem>
      </group>

      {/* Center Luxury Handbag Display */}
      <group position={[0, 0, 1.8]}>
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
          label="MK Leather Handbag"
          scale={0.65}
        >
          <HandbagModel color="#D97706" />
        </InteractiveFashionItem>
      </group>
    </group>
  );
}
