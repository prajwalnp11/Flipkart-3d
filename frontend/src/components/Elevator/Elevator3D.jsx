import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

export function Elevator3D({ position = [0, 0, -7.0] }) {
  const elevatorDoorOpen = useStore((state) => state.elevatorDoorOpen);
  const elevatorMoving = useStore((state) => state.elevatorMoving);
  const elevatorFloorDisplay = useStore((state) => state.elevatorFloorDisplay);
  const quickJumpToFloor = useStore((state) => state.quickJumpToFloor);
  const targetFloor = useStore((state) => state.targetFloor);

  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const cabRef = useRef();

  useFrame((state, delta) => {
    // Smooth motorized sliding doors animation
    const targetLeft = elevatorDoorOpen ? -1.35 : -0.55;
    const targetRight = elevatorDoorOpen ? 1.35 : 0.55;

    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.damp(
        leftDoorRef.current.position.x,
        targetLeft,
        7,
        delta
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = THREE.MathUtils.damp(
        rightDoorRef.current.position.x,
        targetRight,
        7,
        delta
      );
    }

    // Gentle vertical vibration hum when elevator is traveling
    if (cabRef.current) {
      if (elevatorMoving) {
        cabRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 25) * 0.02;
      } else {
        cabRef.current.position.y = 0;
      }
    }
  });

  return (
    <group position={position}>
      {/* Outer Elevator Structural Frame (Polished White & Chrome Finish) */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[3.25, 3.65, 2.65]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.8} roughness={0.2} wireframe />
      </mesh>

      {/* Glass Surroundings on Elevator Shaft (Crystal Transparent Panels) */}
      {/* Left Glass Panel */}
      <mesh position={[-1.55, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.5, 3.5]} />
        <meshPhysicalMaterial
          color="#E0F2FE"
          transmission={0.85}
          transparent
          opacity={0.35}
          roughness={0.05}
          metalness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      {/* Right Glass Panel */}
      <mesh position={[1.55, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.5, 3.5]} />
        <meshPhysicalMaterial
          color="#E0F2FE"
          transmission={0.85}
          transparent
          opacity={0.35}
          roughness={0.05}
          metalness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      {/* Chrome Corner Support Columns */}
      {[-1.58, 1.58].map((x, idx) => (
        <group key={idx}>
          <mesh position={[x, 1.8, 1.25]}>
            <cylinderGeometry args={[0.04, 0.04, 3.6, 16]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[x, 1.8, -1.25]}>
            <cylinderGeometry args={[0.04, 0.04, 3.6, 16]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Interior Cab Group */}
      <group ref={cabRef}>
        {/* Interior Walls (Brushed Stainless Steel & Polished Mirror) */}
        {/* Back Wall (Mirror / Bright Silver Stainless Steel) */}
        <mesh position={[0, 1.8, -1.25]}>
          <planeGeometry args={[2.85, 3.4]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.12} />
        </mesh>
        {/* Left Interior Wall */}
        <mesh position={[-1.44, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.45, 3.4]} />
          <meshStandardMaterial color="#F1F5F9" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Right Interior Wall with Control Panel */}
        <mesh position={[1.44, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2.45, 3.4]} />
          <meshStandardMaterial color="#F1F5F9" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Interior Ceiling with Bright Downlight */}
        <mesh position={[0, 3.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.9, 2.5]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* High-Intensity Downlight inside Elevator */}
        <pointLight position={[0, 3.2, 0]} intensity={2.8} distance={6} color="#FFFFFF" />
        <pointLight position={[0, 1.8, 0]} intensity={1.2} distance={4} color="#EAF3FF" />

        {/* Floor (Bright Light Marble / Brushed Steel) */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.9, 2.5]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Blue Digital Floor Indicator Display over Doors */}
        <group position={[0, 3.15, 0.05]}>
          {/* Bezel */}
          <mesh>
            <boxGeometry args={[1.5, 0.48, 0.06]} />
            <meshStandardMaterial color="#172B4D" roughness={0.3} />
          </mesh>
          {/* Glowing Inner Screen */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[1.4, 0.38]} />
            <meshBasicMaterial color="#0A1E3F" />
          </mesh>
          {/* Digital Floor Indicator */}
          <Text
            position={[0, 0, 0.045]}
            fontSize={0.26}
            color="#FFE500"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            {elevatorFloorDisplay}
          </Text>
        </group>

        {/* Interactive Elevator Control Panel Buttons (Right Interior Wall) */}
        <group position={[1.4, 1.6, 0.2]} rotation={[0, -Math.PI / 2, 0]}>
          {/* Brushed Metal Base Plate */}
          <mesh>
            <boxGeometry args={[0.55, 1.3, 0.04]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Buttons: 3F, 2F, 1F, G */}
          {[
            { label: '3', floor: 3, y: 0.38 },
            { label: '2', floor: 2, y: 0.13 },
            { label: '1', floor: 1, y: -0.13 },
            { label: 'G', floor: 0, y: -0.38 },
          ].map((btn) => (
            <group
              key={btn.label}
              position={[0, btn.y, 0.03]}
              onClick={(e) => {
                e.stopPropagation();
                quickJumpToFloor(btn.floor);
              }}
            >
              <mesh>
                <circleGeometry args={[0.085, 24]} />
                <meshStandardMaterial
                  color={targetFloor === btn.floor ? '#FFE500' : '#2874F0'}
                  emissive={targetFloor === btn.floor ? '#FFE500' : '#2874F0'}
                  emissiveIntensity={targetFloor === btn.floor ? 0.9 : 0.4}
                />
              </mesh>
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.095}
                color={targetFloor === btn.floor ? '#172B4D' : '#FFFFFF'}
                anchorX="center"
                anchorY="middle"
                fontWeight={900}
              >
                {btn.label}
              </Text>
            </group>
          ))}
        </group>
      </group>

      {/* Silver Metallic Motorized Sliding Doors */}
      {/* Left Silver Door */}
      <group ref={leftDoorRef} position={[-0.55, 1.6, 0.02]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.12, 3.1, 0.06]} />
          <meshStandardMaterial
            color="#D1D5DB"
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>
        {/* Chrome Door Handle */}
        <mesh position={[0.42, 0, 0.04]}>
          <cylinderGeometry args={[0.015, 0.015, 1.0, 16]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.1} />
        </mesh>
      </group>

      {/* Right Silver Door */}
      <group ref={rightDoorRef} position={[0.55, 1.6, 0.02]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.12, 3.1, 0.06]} />
          <meshStandardMaterial
            color="#D1D5DB"
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>
        {/* Chrome Door Handle */}
        <mesh position={[-0.42, 0, 0.04]}>
          <cylinderGeometry args={[0.015, 0.015, 1.0, 16]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
