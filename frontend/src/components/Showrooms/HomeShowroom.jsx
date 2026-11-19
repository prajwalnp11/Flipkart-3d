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
      <group position={[0, -0.05, 0.75]}>
        <mesh>
          <boxGeometry args={[1.5, 0.42, 0.04]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.19, 0.02]}>
          <boxGeometry args={[1.5, 0.04, 0.02]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        <Text position={[0, 0.06, 0.03]} fontSize={0.1} color="#172B4D" fontWeight={900}>
          {label || product?.name}
        </Text>
        <Text position={[0, -0.09, 0.03]} fontSize={0.085} color="#2874F0" fontWeight={800}>
          {price || (product ? `₹${Number(product.price).toLocaleString('en-IN')}` : '')}
        </Text>
      </group>
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
      {/* Floor Marble & Living Carpet */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 28]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.2, 13.4, 48]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>

      {/* Main Department Header Billboard */}
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
          HOME & LIVING SHOWROOM
        </Text>
        <Text
          position={[0, -0.25, 0.06]}
          fontSize={0.17}
          color="#10B981"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          LUXURY FURNITURE • 8K CINEMA TVS • SMART REFRIGERATORS • WASHING TECH
        </Text>
      </group>

      {/* Display 1: Nordic Cloud Velvet Sofa (Living Suite) */}
      <InteractiveHomeItem
        product={sofa}
        position={[-5.5, 0, -1.0]}
        label="Nordic Cloud Sofa"
        scale={0.52}
      >
        <SofaModel color="#1E3A8A" />
      </InteractiveHomeItem>

      {/* Display 2: Samsung 75" Neo QLED 8K Smart TV */}
      <InteractiveHomeItem
        product={tv}
        position={[-1.8, 0, -2.2]}
        label={'Samsung 75" 8K TV'}
        scale={0.52}
      >
        <TelevisionModel color="#9CA3AF" />
      </InteractiveHomeItem>

      {/* Display 3: LG InstaView Smart Refrigerator */}
      <InteractiveHomeItem
        product={fridge}
        position={[1.8, 0, -2.2]}
        label="LG InstaView Refrigerator"
        scale={0.5}
      >
        <RefrigeratorModel color="#CBD5E1" />
      </InteractiveHomeItem>

      {/* Display 4: Bosch Series 8 i-DOS Washing Machine */}
      <InteractiveHomeItem
        product={washingMachine}
        position={[5.5, 0, -1.0]}
        label="Bosch Series 8 Washing"
        scale={0.52}
      >
        <WashingMachineModel color="#F8FAFC" />
      </InteractiveHomeItem>
    </group>
  );
}
