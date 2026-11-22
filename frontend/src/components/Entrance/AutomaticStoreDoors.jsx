import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { sounds } from '../../services/soundEffects';

/**
 * Reusable 3D Automatic Glass Store Door Component (Section 7)
 * Features dual sliding frosted glass panels, brushed chrome frames,
 * proximity sensor detection, overhead brand canopy badge, and realistic sound synthesis.
 */
export function AutomaticStoreDoors({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 3.6,
  height = 3.2,
  isOpen = false,
  brandName = 'STORE',
  brandColor = '#2874F0',
  onTriggerEnter = null
}) {
  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const sensorGlowRef = useRef();
  const lastState = useRef(isOpen);

  // Play sound when door opens or closes
  if (lastState.current !== isOpen) {
    if (isOpen) {
      sounds.playDoorOpen();
    }
    lastState.current = isOpen;
  }

  const halfWidth = width / 2;
  const panelWidth = halfWidth * 0.96;
  const slideDistance = panelWidth * 0.95;

  useFrame((_, delta) => {
    const targetOffset = isOpen ? slideDistance : 0;
    const lerpSpeed = delta * 5.0;

    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.lerp(
        leftDoorRef.current.position.x,
        -targetOffset,
        lerpSpeed
      );
    }

    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = THREE.MathUtils.lerp(
        rightDoorRef.current.position.x,
        targetOffset,
        lerpSpeed
      );
    }

    if (sensorGlowRef.current) {
      sensorGlowRef.current.material.opacity = isOpen ? 0.9 : 0.35;
    }
  });

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        if (onTriggerEnter) onTriggerEnter();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* ================= 1. ARCHITECTURAL DOOR PORTAL FRAME ================= */}
      {/* Top Header Beam */}
      <mesh position={[0, height + 0.22, 0]} castShadow>
        <boxGeometry args={[width + 0.6, 0.44, 0.4]} />
        <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Brand Signage on Header */}
      {brandName && (
        <group position={[0, height + 0.22, 0.22]}>
          <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[Math.max(1.8, brandName.length * 0.22), 0.32, 0.02]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.16}
            color={brandColor || '#FFFFFF'}
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            letterSpacing={0.08}
          >
            {brandName.toUpperCase()}
          </Text>
        </group>
      )}

      {/* Motion Sensor Indicator Pill */}
      <mesh ref={sensorGlowRef} position={[0, height + 0.02, 0.21]}>
        <boxGeometry args={[0.3, 0.06, 0.04]} />
        <meshBasicMaterial color={isOpen ? '#22C55E' : brandColor} transparent opacity={0.5} />
      </mesh>

      {/* Left Outer Column */}
      <mesh position={[-halfWidth - 0.15, height / 2, 0]} castShadow>
        <boxGeometry args={[0.3, height, 0.35]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Right Outer Column */}
      <mesh position={[halfWidth + 0.15, height / 2, 0]} castShadow>
        <boxGeometry args={[0.3, height, 0.35]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Ground Stainless Track */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[width + 0.4, 0.04, 0.28]} />
        <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ================= 2. SLIDING LEFT GLASS PANEL ================= */}
      <group position={[-panelWidth / 2, 0, 0]}>
        <group ref={leftDoorRef}>
          {/* Glass Pane */}
          <mesh position={[0, height / 2, 0]}>
            <boxGeometry args={[panelWidth, height - 0.06, 0.05]} />
            <meshPhysicalMaterial
              color="#E0F2FE"
              transmission={0.88}
              transparent
              opacity={0.65}
              roughness={0.08}
              metalness={0.15}
              ior={1.5}
            />
          </mesh>
          {/* Left Door Chrome Handle */}
          <mesh position={[panelWidth / 2 - 0.08, height / 2, 0.06]}>
            <cylinderGeometry args={[0.02, 0.02, height * 0.45, 16]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.08} />
          </mesh>
          {/* Subtle Frosted Safety Decal Band */}
          <mesh position={[0, height * 0.45, 0.03]}>
            <planeGeometry args={[panelWidth * 0.9, 0.06]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} />
          </mesh>
        </group>
      </group>

      {/* ================= 3. SLIDING RIGHT GLASS PANEL ================= */}
      <group position={[panelWidth / 2, 0, 0]}>
        <group ref={rightDoorRef}>
          {/* Glass Pane */}
          <mesh position={[0, height / 2, 0]}>
            <boxGeometry args={[panelWidth, height - 0.06, 0.05]} />
            <meshPhysicalMaterial
              color="#E0F2FE"
              transmission={0.88}
              transparent
              opacity={0.65}
              roughness={0.08}
              metalness={0.15}
              ior={1.5}
            />
          </mesh>
          {/* Right Door Chrome Handle */}
          <mesh position={[-panelWidth / 2 + 0.08, height / 2, 0.06]}>
            <cylinderGeometry args={[0.02, 0.02, height * 0.45, 16]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.08} />
          </mesh>
          {/* Subtle Frosted Safety Decal Band */}
          <mesh position={[0, height * 0.45, 0.03]}>
            <planeGeometry args={[panelWidth * 0.9, 0.06]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
