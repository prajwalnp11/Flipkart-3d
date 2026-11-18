import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { SmartphoneModel } from '../ProductViewer/Models3D/SmartphoneModel';
import { LaptopModel } from '../ProductViewer/Models3D/LaptopModel';
import { HeadphonesModel } from '../ProductViewer/Models3D/HeadphonesModel';
import { SmartwatchModel } from '../ProductViewer/Models3D/SmartwatchModel';
import { SneakerModel } from '../ProductViewer/Models3D/SneakerModel';
import { SofaModel } from '../ProductViewer/Models3D/SofaModel';
import { TelevisionModel } from '../ProductViewer/Models3D/TelevisionModel';
import { RefrigeratorModel } from '../ProductViewer/Models3D/RefrigeratorModel';
import { WashingMachineModel } from '../ProductViewer/Models3D/WashingMachineModel';

export function ProductPedestal({ product, position = [0, 0, 0] }) {
  const [hovered, setHovered] = useState(false);
  const openProductInspect = useStore((state) => state.openProductInspect);
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (hovered ? 2.2 : 0.6);
    }
  });

  const modelType = product.model_3d_type || 'smartphone';
  const displayPrice = `₹${Number(product.price).toLocaleString('en-IN')}`;

  const renderProductModel = () => {
    const scale = 0.55;
    switch (modelType) {
      case 'smartphone':
        return (
          <group scale={scale}>
            <SmartphoneModel color="#C2A385" isHovered={hovered} />
          </group>
        );
      case 'laptop':
        return (
          <group scale={scale * 0.9}>
            <LaptopModel color="#1C1D1F" />
          </group>
        );
      case 'headphones':
        return (
          <group scale={scale * 0.95}>
            <HeadphonesModel color="#1B263B" />
          </group>
        );
      case 'smartwatch':
        return (
          <group scale={scale * 1.1}>
            <SmartwatchModel color="#B5AEA4" />
          </group>
        );
      case 'shoe':
        return (
          <group scale={scale * 0.85}>
            <SneakerModel color="#0090FF" />
          </group>
        );
      case 'sofa':
        return (
          <group scale={scale * 0.65}>
            <SofaModel color="#1E3A8A" />
          </group>
        );
      case 'television':
        return (
          <group scale={scale * 0.6}>
            <TelevisionModel color="#9CA3AF" />
          </group>
        );
      case 'refrigerator':
        return (
          <group scale={scale * 0.55}>
            <RefrigeratorModel color="#E2E8F0" />
          </group>
        );
      case 'washing_machine':
        return (
          <group scale={scale * 0.58}>
            <WashingMachineModel color="#F8FAFC" />
          </group>
        );
      default:
        return (
          <group scale={scale}>
            <SmartphoneModel color="#C2A385" />
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
          {renderProductModel()}
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
