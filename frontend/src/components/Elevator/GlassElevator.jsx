import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

export function GlassElevator({ position = [0, 0, -7.0] }) {
  const elevatorDoorOpen = useStore((state) => state.elevatorDoorOpen);
  const elevatorFloorDisplay = useStore((state) => state.elevatorFloorDisplay);
  const elevatorMoving = useStore((state) => state.elevatorMoving);
  const targetFloor = useStore((state) => state.targetFloor);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const quickJumpToFloor = useStore((state) => state.quickJumpToFloor);

  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const cabGroupRef = useRef();

  // Floor Y mappings
  const floorYMap = { 0: 0, 1: 8, 2: 16, 3: 24 };
  const targetY = floorYMap[targetFloor] !== undefined ? floorYMap[targetFloor] : 0;
  const currentY = floorYMap[selectedFloor] !== undefined ? floorYMap[selectedFloor] : 0;

  useFrame((_, delta) => {
    // 1. Physical Vertical Smooth Transit
    if (cabGroupRef.current) {
      if (elevatorMoving) {
        // Smoothly interpolate towards target floor Y
        cabGroupRef.current.position.y = THREE.MathUtils.lerp(
          cabGroupRef.current.position.y,
          targetY,
          1.8 * delta
        );
      } else {
        // Locked at destination floor Y
        cabGroupRef.current.position.y = THREE.MathUtils.lerp(
          cabGroupRef.current.position.y,
          currentY,
          3.0 * delta
        );
      }
    }

    // 2. Sliding Elevator Double Doors
    const openOffset = elevatorDoorOpen ? 0.76 : 0;
    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.lerp(
        leftDoorRef.current.position.x,
        -0.4 - openOffset,
        6.0 * delta
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = THREE.MathUtils.lerp(
        rightDoorRef.current.position.x,
        0.4 + openOffset,
        6.0 * delta
      );
    }
  });

  return (
    <group ref={cabGroupRef} position={[position[0], currentY, position[2]]}>
      {/* ================= PANORAMIC GLASS CAB ================= */}
      {/* 1. Floor & Ceiling Base (Brushed Silver Metal & Stainless Steel) */}
      {/* Floor Slab */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.1, 2.6]} />
        <meshStandardMaterial
          color="#D1D5DB"
          metalness={0.92}
          roughness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* Stainless Steel Ribbed Floor Inlay */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[2.9, 0.02, 2.3]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.88} roughness={0.25} />
      </mesh>

      {/* Ceiling Roof */}
      <mesh position={[0, 3.45, 0]} castShadow>
        <boxGeometry args={[3.2, 0.12, 2.6]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.3} roughness={0.2} />
      </mesh>

      {/* 2. Panoramic Transparent Glass Walls (Left, Right, and Rear) */}
      {/* Left Glass Wall */}
      <mesh position={[-1.55, 1.75, 0]}>
        <boxGeometry args={[0.06, 3.25, 2.5]} />
        <meshPhysicalMaterial
          color="#BAE6FD"
          transmission={0.94}
          transparent
          opacity={0.35}
          roughness={0.04}
          metalness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      {/* Right Glass Wall */}
      <mesh position={[1.55, 1.75, 0]}>
        <boxGeometry args={[0.06, 3.25, 2.5]} />
        <meshPhysicalMaterial
          color="#BAE6FD"
          transmission={0.94}
          transparent
          opacity={0.35}
          roughness={0.04}
          metalness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      {/* Rear Glass Wall */}
      <mesh position={[0, 1.75, -1.25]}>
        <boxGeometry args={[3.1, 3.25, 0.06]} />
        <meshPhysicalMaterial
          color="#BAE6FD"
          transmission={0.94}
          transparent
          opacity={0.35}
          roughness={0.04}
          metalness={0.1}
          clearcoat={1.0}
        />
      </mesh>

      {/* 3. Brushed Silver Corner Columns & Handrails */}
      {[
        [-1.52, -1.22],
        [1.52, -1.22],
        [-1.52, 1.22],
        [1.52, 1.22]
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.75, z]}>
          <boxGeometry args={[0.1, 3.3, 0.1]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.92} roughness={0.18} />
        </mesh>
      ))}

      {/* Interior Brushed Chrome Grab Handrail (Around Perimeter) */}
      <mesh position={[-1.46, 1.05, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[1.46, 1.05, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.05, -1.18]}>
        <cylinderGeometry args={[0.02, 0.02, 2.9, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* 4. Sliding Front Double Doors (Brushed Silver Metallic + Vertical Chrome Handles) */}
      {/* Door Frame Top Header */}
      <mesh position={[0, 3.15, 1.25]}>
        <boxGeometry args={[3.1, 0.5, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Left Sliding Metallic Door */}
      <group ref={leftDoorRef} position={[-0.4, 1.55, 1.26]}>
        <mesh castShadow>
          <boxGeometry args={[0.78, 2.85, 0.05]} />
          <meshStandardMaterial
            color="#D1D5DB"
            metalness={0.92}
            roughness={0.18}
            envMapIntensity={1.3}
          />
        </mesh>
        {/* Full-Height Vertical Chrome Handle */}
        <mesh position={[0.32, 0, 0.045]}>
          <cylinderGeometry args={[0.016, 0.016, 1.8, 16]} />
          <meshStandardMaterial color="#F8FAFC" metalness={0.98} roughness={0.05} />
        </mesh>
      </group>

      {/* Right Sliding Metallic Door */}
      <group ref={rightDoorRef} position={[0.4, 1.55, 1.26]}>
        <mesh castShadow>
          <boxGeometry args={[0.78, 2.85, 0.05]} />
          <meshStandardMaterial
            color="#D1D5DB"
            metalness={0.92}
            roughness={0.18}
            envMapIntensity={1.3}
          />
        </mesh>
        {/* Full-Height Vertical Chrome Handle */}
        <mesh position={[-0.32, 0, 0.045]}>
          <cylinderGeometry args={[0.016, 0.016, 1.8, 16]} />
          <meshStandardMaterial color="#F8FAFC" metalness={0.98} roughness={0.05} />
        </mesh>
      </group>

      {/* 5. Glowing Digital LED Floor Matrix Indicator (Above Door Header) */}
      <group position={[0, 3.15, 1.3]}>
        {/* Dark Bezel Screen */}
        <mesh>
          <boxGeometry args={[1.1, 0.32, 0.02]} />
          <meshStandardMaterial color="#0A1E3F" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Blue/Yellow Matrix LED Text Display */}
        <Text
          position={[0, 0, 0.015]}
          fontSize={0.2}
          color="#FFE500"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {elevatorFloorDisplay}
        </Text>
      </group>

      {/* 6. Tactile Blue Illuminated In-Cab Floor Selection Buttons */}
      <group position={[1.45, 1.6, 0.6]}>
        {/* Wall Panel Plate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.03, 0.9, 0.28]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Floor Buttons (3, 2, 1, G) */}
        {[
          { label: '3F', floor: 3, y: 0.3 },
          { label: '2F', floor: 2, y: 0.1 },
          { label: '1F', floor: 1, y: -0.1 },
          { label: 'G', floor: 0, y: -0.3 }
        ].map((btn) => {
          const isCurrent = selectedFloor === btn.floor;
          return (
            <group
              key={btn.floor}
              position={[0.02, btn.y, 0]}
              onClick={(e) => {
                e.stopPropagation();
                quickJumpToFloor(btn.floor);
              }}
            >
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
                <meshStandardMaterial
                  color={isCurrent ? '#FFE500' : '#2874F0'}
                  emissive={isCurrent ? '#FFE500' : '#2874F0'}
                  emissiveIntensity={0.6}
                  metalness={0.5}
                />
              </mesh>
              <Text
                position={[0.02, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
                fontSize={0.045}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                fontWeight={900}
              >
                {btn.label}
              </Text>
            </group>
          );
        })}
      </group>

      {/* 7. Bright Interior Downlight Spotlighting Inside the Cab */}
      <pointLight position={[0, 3.2, 0]} intensity={2.8} distance={7} color="#FFFFFF" />
      <mesh position={[0, 3.39, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 24]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}
