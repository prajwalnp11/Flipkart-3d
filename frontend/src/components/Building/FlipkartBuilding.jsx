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
    meshRef.current.position.z -= speed * 0.02;
    if (meshRef.current.position.z < 2.0) {
      meshRef.current.position.z = initialPos[2];
    }
    meshRef.current.position.y = initialPos[1] + Math.abs(Math.sin(t * 8)) * 0.05;

    if (legLeftRef.current && legRightRef.current) {
      legLeftRef.current.rotation.x = Math.sin(t * 8) * 0.4;
      legRightRef.current.rotation.x = -Math.sin(t * 8) * 0.4;
    }
  });

  return (
    <group ref={meshRef} position={initialPos}>
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FCD34D" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.12, 0.55, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh ref={legLeftRef} position={[-0.08, 0.45, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
      <mesh ref={legRightRef} position={[0.08, 0.45, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function FlipkartBuilding() {
  const neonGlowRef = useRef();

  useFrame((state) => {
    if (neonGlowRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 3.0) * 0.15;
      neonGlowRef.current.intensity = pulse * 2.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. MONOLITHIC FUTURISTIC TOWER (CHARCOAL & DEEP NAVY) ================= */}
      <mesh position={[0, 9, -8]} castShadow receiveShadow>
        <boxGeometry args={[18, 18, 12]} />
        <meshStandardMaterial color="#0B0F19" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Roof Parapet Crown with Cyan LED Perimeter */}
      <mesh position={[0, 18.2, -8]}>
        <boxGeometry args={[18.6, 0.6, 12.6]} />
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 18.52, -1.9]}>
        <boxGeometry args={[18.7, 0.08, 0.2]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>

      {/* Futuristic Flipkart Crown Band */}
      <mesh position={[0, 17.2, -1.9]}>
        <boxGeometry args={[18.4, 1.6, 0.4]} />
        <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Giant Illuminated 3D Flipkart 3D Mall Header */}
      <group position={[0, 17.2, -1.65]}>
        <Text
          fontSize={1.15}
          color="#00F0FF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.06}
        >
          FLIPKART
        </Text>
        <Text
          position={[3.5, 0.02, 0]}
          fontSize={0.95}
          color="#FFE500"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          3D
        </Text>
      </group>

      {/* Illuminated Horizontal Floor Slabs with Electric Cyan LED Strips */}
      {[4.5, 8.5, 12.5, 16.5].map((y, idx) => (
        <group key={idx}>
          <mesh position={[0, y, -2.0]}>
            <boxGeometry args={[18.4, 0.4, 0.3]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, y - 0.22, -1.8]}>
            <boxGeometry args={[18.3, 0.08, 0.06]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
        </group>
      ))}

      {/* Tinted Panoramic Curtain Glass Facade with Interior Glow */}
      <mesh position={[0, 9.5, -2.05]}>
        <planeGeometry args={[17.8, 14.5]} />
        <meshPhysicalMaterial
          color="#0284C7"
          transmission={0.85}
          transparent
          opacity={0.35}
          roughness={0.08}
          metalness={0.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* Interior Department Store Lights visible through glass */}
      {[
        [-5, 6, -6], [0, 6, -6], [5, 6, -6],
        [-5, 10, -6], [0, 10, -6], [5, 10, -6],
        [-5, 14, -6], [0, 14, -6], [5, 14, -6],
      ].map((pos, idx) => (
        <pointLight
          key={idx}
          position={pos}
          intensity={1.4}
          distance={8}
          color="#38BDF8"
        />
      ))}

      {/* ================= 2. GRAND ENTRANCE CANOPY & NEON CYAN PORTAL ================= */}
      {/* Floating Dark Charcoal Canopy Roof */}
      <mesh position={[0, 3.4, 0.8]} castShadow>
        <boxGeometry args={[8.8, 0.35, 4.5]} />
        <meshStandardMaterial color="#0B132B" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Glowing Cyan Underside Perimeter Light Band */}
      <mesh position={[0, 3.2, 3.0]}>
        <boxGeometry args={[8.7, 0.08, 0.08]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>

      {/* Neon Cyan Canopy Signboard (Video Reference 2) */}
      <group position={[0, 4.3, 1.2]}>
        <mesh>
          <boxGeometry args={[5.2, 1.1, 0.15]} />
          <meshStandardMaterial color="#070B14" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[5.1, 1.0, 0.02]} />
          <meshBasicMaterial color="#00F0FF" wireframe />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.58}
          color="#00F0FF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.16}
        >
          FLIPKART
        </Text>
      </group>

      {/* Cyan Canopy Downlight casting glowing reflection onto plaza */}
      <spotLight
        ref={neonGlowRef}
        position={[0, 3.3, 1.2]}
        target-position={[0, 0, 1.2]}
        intensity={2.2}
        distance={7}
        angle={Math.PI / 3}
        color="#00F0FF"
      />

      {/* Dual Architectural Support Pillars in Titanium Navy with Cyan Slits */}
      {[-3.8, 3.8].map((x, idx) => (
        <group key={idx} position={[x, 1.6, 2.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.22, 3.2, 24]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <boxGeometry args={[0.04, 3.1, 0.04]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
        </group>
      ))}

      {/* Entrance Door Archway with Automatic Sliding Glass Doors */}
      <AutomaticDoors position={[0, 1.4, -1.9]} />

      {/* Store Entrance Welcome Header Sign */}
      <group position={[0, 3.08, -1.75]}>
        <mesh>
          <boxGeometry args={[4.4, 0.6, 0.1]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.24}
          color="#00F0FF"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
          letterSpacing={0.06}
        >
          WELCOME TO FLIPKART 3D MALL
        </Text>
      </group>

      {/* ================= 3. REFLECTIVE TWILIGHT PLAZA GROUND ================= */}
      {/* High-Gloss Mirror Paving reflecting the neon cyan sign */}
      <mesh position={[0, -0.05, 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[42, 32]} />
        <meshStandardMaterial
          color="#070B14"
          roughness={0.08}
          metalness={0.65}
        />
      </mesh>

      {/* Glowing Cyan Runway Guide Strips leading directly to the doors */}
      {[-1.8, 1.8].map((x, idx) => (
        <mesh key={idx} position={[x, 0.01, 7]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 14]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
      ))}

      {/* Illuminated Planter Boxes */}
      {[-5.8, 5.8].map((x, idx) => (
        <group key={idx} position={[x, 0, 4]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.4, 0.8, 4.0]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[1.44, 0.1, 4.04]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
        </group>
      ))}

      {/* Moving Pedestrians */}
      <Pedestrian initialPos={[-1.2, 0, 11]} speed={1.1} color="#00F0FF" />
      <Pedestrian initialPos={[1.4, 0, 14]} speed={0.9} color="#2874F0" />
      <Pedestrian initialPos={[-0.4, 0, 8]} speed={1.3} color="#FFE500" />
    </group>
  );
}

export default FlipkartBuilding;
