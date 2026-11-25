import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { DynamicProductModel } from '../ProductViewer/DynamicProductModel';

/**
 * Shared Interactive 3D Product Display Pedestal
 * Renders the product's true 3D model via DynamicProductModel, responds to
 * pointer hover and CustomerAvatar proximity, highlights with brand accent halo,
 * displays product name, brand, category & price, and launches 360-degree inspection.
 */
export function InteractiveProductPedestal({
  product,
  position = [0, 0, 0],
  worldPosition = null,
  rotation = [0, 0, 0],
  scale = 0.55,
  accentColor = '#2874F0',
  pedestalType = 'acrylic', // 'acrylic' | 'cylinder' | 'ceramic'
  showBase = true
}) {
  const [hovered, setHovered] = useState(false);
  const openProductInspect = useStore((state) => state.openProductInspect);
  const avatarPosition = useStore((state) => state.avatarPosition);
  const navigationMode = useStore((state) => state.navigationMode);
  const phase = useStore((state) => state.phase);

  const haloRef = useRef();
  const modelWrapRef = useRef();

  const targetWorld = worldPosition || position;
  const isNearAvatar =
    navigationMode === 'avatar' &&
    phase === 'showroom' &&
    Array.isArray(avatarPosition) &&
    Math.hypot(avatarPosition[0] - targetWorld[0], avatarPosition[2] - targetWorld[2]) < 2.25;

  const isActive = hovered || isNearAvatar;

  useEffect(() => {
    if (!isNearAvatar || !product) return;
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key.toLowerCase() === 'e') {
        e.stopPropagation();
        openProductInspect(product);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isNearAvatar, product, openProductInspect]);

  useFrame((_, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * (isActive ? 2.6 : 0.75);
    }
    if (modelWrapRef.current) {
      const targetY = isActive ? 0.52 : 0.45;
      modelWrapRef.current.position.y = THREE.MathUtils.lerp(
        modelWrapRef.current.position.y,
        targetY,
        8 * delta
      );
    }
  });

  if (!product) return null;

  const categoryName = product.category_name || product.category?.name || '';
  const formattedPrice = `₹${Number(product.price || 0).toLocaleString('en-IN')}`;
  const displayName = product.name?.length > 26 ? `${product.name.slice(0, 24)}…` : product.name;

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
        openProductInspect(product);
      }}
    >
      {/* Dynamic Product-Specific 3D Model */}
      <group ref={modelWrapRef} scale={scale} position={[0, 0.45, 0]}>
        <DynamicProductModel
          product={product}
          fallbackColor={accentColor}
          standMode
          isHovered={isActive}
        />
      </group>

      {/* Highlight Spotlight when hovered or approached */}
      {isActive && (
        <pointLight position={[0, 1.45, 0.25]} intensity={1.6} distance={3.5} color="#FFF8E7" />
      )}

      {/* Pedestal / Riser Base */}
      {showBase && pedestalType === 'acrylic' && (
        <mesh position={[0, 0.14, 0]} rotation={[-0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.72, 0.1, 0.72]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={0.85}
            transparent
            opacity={0.45}
            roughness={0.08}
            metalness={0.1}
          />
        </mesh>
      )}

      {showBase && (pedestalType === 'cylinder' || pedestalType === 'ceramic') && (
        <group>
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry
              args={[
                pedestalType === 'ceramic' ? 0.88 : 0.75,
                pedestalType === 'ceramic' ? 0.94 : 0.8,
                0.2,
                32
              ]}
            />
            <meshStandardMaterial color="#FFFFFF" roughness={0.14} metalness={0.12} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry
              args={[
                pedestalType === 'ceramic' ? 0.95 : 0.81,
                pedestalType === 'ceramic' ? 0.95 : 0.81,
                0.03,
                32
              ]}
            />
            <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
          </mesh>
        </group>
      )}

      {/* Glowing Interactive Halo Ring */}
      <mesh
        ref={haloRef}
        position={[0, pedestalType === 'acrylic' ? 0.02 : 0.21, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.56, 0.64, 32]} />
        <meshBasicMaterial
          color={isActive ? '#FFE500' : accentColor}
          transparent
          opacity={isActive ? 0.95 : 0.55}
        />
      </mesh>

      {/* Architectural Product Info Plaque */}
      <group position={[0, pedestalType === 'acrylic' ? -0.14 : -0.04, 0.56]}>
        <mesh>
          <boxGeometry args={[1.48, isActive ? 0.54 : 0.44, 0.04]} />
          <meshStandardMaterial
            color={isActive ? '#0F172A' : '#FFFFFF'}
            roughness={0.15}
            metalness={0.15}
          />
        </mesh>
        <mesh position={[0, isActive ? 0.25 : 0.2, 0.02]}>
          <boxGeometry args={[1.48, 0.04, 0.02]} />
          <meshBasicMaterial color={isActive ? '#FFE500' : accentColor} />
        </mesh>

        {/* Brand & Category Subtitle */}
        <Text
          position={[0, isActive ? 0.16 : 0.13, 0.03]}
          fontSize={0.055}
          color={isActive ? '#38BDF8' : '#64748B'}
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          {`${(product.brand || '').toUpperCase()}${categoryName ? ` • ${categoryName.toUpperCase()}` : ''}`}
        </Text>

        {/* Product Name */}
        <Text
          position={[0, isActive ? 0.04 : 0.01, 0.03]}
          fontSize={0.082}
          color={isActive ? '#FFFFFF' : '#0F172A'}
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {displayName}
        </Text>

        {/* Price */}
        <Text
          position={[0, isActive ? -0.09 : -0.11, 0.03]}
          fontSize={0.08}
          color={isActive ? '#FFE500' : '#2874F0'}
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          {formattedPrice}
        </Text>

        {/* Inspect Action Prompt when highlighted */}
        {isActive && (
          <Text
            position={[0, -0.2, 0.03]}
            fontSize={0.05}
            color="#4ADE80"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            {isNearAvatar ? 'PRESS [E] OR CLICK TO INSPECT 360°' : 'CLICK TO INSPECT 360°'}
          </Text>
        )}
      </group>
    </group>
  );
}

export default InteractiveProductPedestal;
