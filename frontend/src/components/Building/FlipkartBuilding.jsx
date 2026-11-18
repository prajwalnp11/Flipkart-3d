import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AutomaticDoors } from '../Entrance/AutomaticDoors';

// Stylized Animated Pedestrian entering the mall
function Pedestrian({ initialPos, speed, color = '#2874F0' }) {
  const meshRef = useRef();
  const legLeftRef = useRef();
  const legRightRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    // Walk along z towards entrance (z = 0)
    meshRef.current.position.z -= speed * 0.02;
    if (meshRef.current.position.z < 2.0) {
      meshRef.current.position.z = initialPos[2];
    }
    // Subtle natural bounce
    meshRef.current.position.y = initialPos[1] + Math.abs(Math.sin(t * 8)) * 0.05;

    // Leg swing
    if (legLeftRef.current && legRightRef.current) {
      legLeftRef.current.rotation.x = Math.sin(t * 8) * 0.4;
      legRightRef.current.rotation.x = -Math.sin(t * 8) * 0.4;
    }
  });

  return (
    <group ref={meshRef} position={initialPos}>
      {/* Head */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FCD34D" roughness={0.4} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.12, 0.55, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Left Leg */}
      <mesh ref={legLeftRef} position={[-0.08, 0.45, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
      {/* Right Leg */}
      <mesh ref={legRightRef} position={[0.08, 0.45, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function FlipkartBuilding() {
  return (
    <group position={[0, 0, 0]}>
      {/* ================= MAIN MALL BUILDING (BRIGHT LUXURY ARCHITECTURE) ================= */}
      {/* Central High-Rise Tower (Floors 0 - 3) in Bright White Composite */}
      <mesh position={[0, 9, -8]} castShadow receiveShadow>
        <boxGeometry args={[18, 18, 12]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.15} roughness={0.2} />
      </mesh>

      {/* Blue & White Architectural Accent Slabs */}
      {/* White Modern Upper Shell */}
      <mesh position={[0, 18.2, -8]}>
        <boxGeometry args={[18.6, 0.6, 12.6]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.3} roughness={0.15} />
      </mesh>

      {/* Flipkart Blue Crown Header Band */}
      <mesh position={[0, 17.2, -1.9]}>
        <boxGeometry args={[18.4, 1.6, 0.4]} />
        <meshStandardMaterial
          color="#2874F0"
          emissive="#2874F0"
          emissiveIntensity={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Giant 3D Flipkart Mall Sign on Crown */}
      <group position={[0, 17.2, -1.65]}>
        <Text
          fontSize={1.05}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          Flipkart
        </Text>
        <Text
          position={[3.0, 0.05, 0]}
          fontSize={0.85}
          color="#FFE500"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          3D
        </Text>
      </group>

      {/* Illuminated Floor Divisions with Horizontal Blue Ribbons */}
      {[4.5, 8.5, 12.5, 16.5].map((y, idx) => (
        <group key={idx}>
          {/* White Architectural Floor Slab */}
          <mesh position={[0, y, -2.0]}>
            <boxGeometry args={[18.4, 0.4, 0.3]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.15} />
          </mesh>
          {/* Blue LED Light Strip */}
          <mesh position={[0, y - 0.25, -1.8]}>
            <boxGeometry args={[18.2, 0.1, 0.05]} />
            <meshStandardMaterial
              color="#2874F0"
              emissive="#2874F0"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Transparent Crystal Glass Curtain Facade (Reflective Sky-Blue Windows) */}
      <mesh position={[0, 9.5, -2.05]}>
        <planeGeometry args={[17.8, 14.5]} />
        <meshPhysicalMaterial
          color="#BAE6FD"
          transmission={0.8}
          transparent
          opacity={0.4}
          roughness={0.05}
          metalness={0.15}
          clearcoat={1.0}
        />
      </mesh>

      {/* Interior Store Lights visible through glass */}
      {[
        [-5, 6, -6], [0, 6, -6], [5, 6, -6],
        [-5, 10, -6], [0, 10, -6], [5, 10, -6],
        [-5, 14, -6], [0, 14, -6], [5, 14, -6],
      ].map((pos, idx) => (
        <pointLight
          key={idx}
          position={pos}
          intensity={1.2}
          distance={8}
          color="#FFFFFF"
        />
      ))}

      {/* ================= GRAND ENTRANCE CANOPY ================= */}
      {/* Floating Modern White Canopy Roof */}
      <mesh position={[0, 3.4, 0.8]} castShadow>
        <boxGeometry args={[8.5, 0.35, 4.5]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.2} roughness={0.15} />
      </mesh>
      {/* Glowing Flipkart Yellow Underside Edge Strip */}
      <mesh position={[0, 3.2, 3.0]}>
        <boxGeometry args={[8.4, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#FFE500"
          emissive="#FFE500"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Two Cylindrical Architectural Support Columns in Flipkart Blue */}
      {[-3.8, 3.8].map((x, idx) => (
        <mesh key={idx} position={[x, 1.6, 2.5]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 3.2, 24]} />
          <meshStandardMaterial color="#2874F0" metalness={0.6} roughness={0.2} />
        </mesh>
      ))}

      {/* Entrance Door Archway with Automatic Sliding Glass Doors */}
      <AutomaticDoors position={[0, 1.4, -1.9]} />

      {/* Store Entrance Signboard */}
      <group position={[0, 3.1, -1.75]}>
        <mesh>
          <boxGeometry args={[4.2, 0.65, 0.1]} />
          <meshStandardMaterial color="#0053C2" />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.28}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          WELCOME TO FLIPKART 3D
        </Text>
      </group>

      {/* ================= OUTDOOR SUNLIT PLAZA & ENVIRONMENT ================= */}
      {/* Main Plaza Ground (Bright Travertine / White Granite Tiles) */}
      <mesh position={[0, -0.05, 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial
          color="#EEF2F7"
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Blue LED Plaza Guide Runway Strip leading into doors */}
      {[-1.8, 1.8].map((x, idx) => (
        <mesh key={idx} position={[x, 0.01, 7]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 14]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
      ))}

      {/* Plaza Modern Planter Boxes with Lush Greenery */}
      {[-5.5, 5.5].map((x, idx) => (
        <group key={idx} position={[x, 0, 4]}>
          {/* Concrete Base Box in Clean White */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.4, 0.8, 4.0]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
          </mesh>
          {/* Glowing Blue Base Trim */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[1.44, 0.1, 4.04]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          {/* Stylized Shrub Foliage */}
          {[-1.2, 0, 1.2].map((z, jdx) => (
            <mesh key={jdx} position={[0, 1.0, z]} castShadow>
              <sphereGeometry args={[0.45, 16, 16]} />
              <meshStandardMaterial color="#10B981" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Plaza Architectural Lamp Posts with Soft Daylight Light */}
      {[
        [-7, 0, 8],
        [7, 0, 8],
        [-7, 0, 14],
        [7, 0, 14]
      ].map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Pole */}
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 4.4, 16]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
          </mesh>
          {/* Lamp Head */}
          <mesh position={[pos[0] > 0 ? -0.3 : 0.3, 4.3, 0]}>
            <boxGeometry args={[0.7, 0.12, 0.3]} />
            <meshStandardMaterial color="#0284C7" metalness={0.9} />
          </mesh>
          <pointLight
            position={[pos[0] > 0 ? -0.3 : 0.3, 4.1, 0]}
            intensity={0.6}
            distance={8}
            color="#FFFFFF"
          />
        </group>
      ))}

      {/* Animated Stylized Pedestrians in Summer Apparel Walking into Mall */}
      <Pedestrian initialPos={[-1.2, 0, 12]} speed={1.2} color="#0284C7" />
      <Pedestrian initialPos={[0.8, 0, 15]} speed={1.0} color="#EC4899" />
      <Pedestrian initialPos={[-0.4, 0, 18]} speed={1.4} color="#10B981" />
      <Pedestrian initialPos={[1.5, 0, 20]} speed={0.9} color="#F59E0B" />
    </group>
  );
}
