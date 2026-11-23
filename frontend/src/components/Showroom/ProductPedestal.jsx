import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { DynamicProductModel } from '../ProductViewer/DynamicProductModel';

export function ProductPedestal({ product, position = [0, 0, 0] }) {
  const [hovered, setHovered] = useState(false);
  const openProductInspect = useStore((state) => state.openProductInspect);
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (hovered ? 2.2 : 0.6);
    }
  });

  const displayPrice = `₹${Number(product.price).toLocaleString('en-IN')}`;

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
        openProductInspect(product);
      }}
    >
      {/* Sleek Gloss White Ceramic Display Table Pedestal */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.02, 0.9, 32]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.12}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Chrome Base Foot Trim */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[1.04, 1.04, 0.08, 32]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Floating Glowing Halo Rim */}
      <mesh ref={ringRef} position={[0, 0.91, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.88, 32]} />
        <meshBasicMaterial
          color={hovered ? '#FFE500' : '#2874F0'}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Product Rotating Gently on Pedestal */}
      <group position={[0, 1.48, 0]}>
        <Float speed={hovered ? 3 : 1.5} rotationIntensity={0.2} floatIntensity={0.15}>
          <DynamicProductModel product={product} standMode isHovered={hovered} />
        </Float>
      </group>

      {/* Floating Price & Information Badge (White Translucent Glass) */}
      <group position={[0, 2.3, 0]}>
        {/* Backing Card Plate */}
        <mesh position={[0, -0.04, -0.02]}>
          <boxGeometry args={[2.5, 0.72, 0.05]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.15}
            metalness={0.05}
          />
        </mesh>
        {/* Top Accent Strip */}
        <mesh position={[0, 0.31, -0.01]}>
          <boxGeometry args={[2.5, 0.04, 0.05]} />
          <meshBasicMaterial color={hovered ? '#FFE500' : '#2874F0'} />
        </mesh>

        {/* Product Title in Dark Navy */}
        <Text
          position={[0, 0.12, 0.02]}
          fontSize={0.15}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {product.name}
        </Text>

        {/* Price & Rating */}
        <Text
          position={[0, -0.1, 0.02]}
          fontSize={0.135}
          color="#2874F0"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {`${displayPrice}  ★ ${product.rating}`}
        </Text>

        {/* Click to Inspect Prompt */}
        {hovered && (
          <Text
            position={[0, -0.25, 0.02]}
            fontSize={0.10}
            color="#0053C2"
            anchorX="center"
            anchorY="middle"
            fontWeight={800}
          >
            CLICK TO ROTATE & INSPECT 360°
          </Text>
        )}
      </group>

      {/* Pedestal Spotlight on Hover */}
      {hovered && (
        <pointLight position={[0, 2.0, 0]} intensity={2.4} distance={4} color="#FFE500" />
      )}
    </group>
  );
}
