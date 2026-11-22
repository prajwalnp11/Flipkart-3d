import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../../store/useStore';

/**
 * Exploded Smartphone 3D Model (Section 9)
 * Renders physically separated internal layers with smooth animated explosion distance,
 * interactive component picking, and holographic hardware annotations.
 */
export function ExplodedSmartphoneModel({ color = '#C2A385' }) {
  const explosionProgress = useStore((state) => state.explosionProgress);
  const selectedExplodedComponent = useStore((state) => state.selectedExplodedComponent);
  const setSelectedExplodedComponent = useStore((state) => state.setSelectedExplodedComponent);

  // Group references for each individual hardware layer
  const frontGlassRef = useRef();
  const oledDisplayRef = useRef();
  const titaniumFrameRef = useRef();
  const motherboardRef = useRef();
  const batteryRef = useRef();
  const cameraModuleRef = useRef();
  const speakerAssemblyRef = useRef();
  const chargingPortRef = useRef();
  const backGlassRef = useRef();

  useFrame(() => {
    // Distance multiplier based on 0 to 1 explosion progress
    const d = explosionProgress;

    // Smooth Z-axis expansion
    if (frontGlassRef.current) frontGlassRef.current.position.z = THREE.MathUtils.lerp(frontGlassRef.current.position.z, 0.08 + d * 0.95, 0.1);
    if (oledDisplayRef.current) oledDisplayRef.current.position.z = THREE.MathUtils.lerp(oledDisplayRef.current.position.z, 0.05 + d * 0.65, 0.1);
    if (titaniumFrameRef.current) titaniumFrameRef.current.position.z = THREE.MathUtils.lerp(titaniumFrameRef.current.position.z, 0.0, 0.1);
    if (motherboardRef.current) motherboardRef.current.position.z = THREE.MathUtils.lerp(motherboardRef.current.position.z, -0.04 - d * 0.35, 0.1);
    if (batteryRef.current) batteryRef.current.position.z = THREE.MathUtils.lerp(batteryRef.current.position.z, -0.05 - d * 0.55, 0.1);
    if (cameraModuleRef.current) {
      cameraModuleRef.current.position.z = THREE.MathUtils.lerp(cameraModuleRef.current.position.z, -0.06 - d * 0.85, 0.1);
      cameraModuleRef.current.position.y = THREE.MathUtils.lerp(cameraModuleRef.current.position.y, 0.55 + d * 0.25, 0.1);
    }
    if (speakerAssemblyRef.current) {
      speakerAssemblyRef.current.position.z = THREE.MathUtils.lerp(speakerAssemblyRef.current.position.z, -0.04 - d * 0.45, 0.1);
      speakerAssemblyRef.current.position.y = THREE.MathUtils.lerp(speakerAssemblyRef.current.position.y, -0.65 - d * 0.25, 0.1);
    }
    if (chargingPortRef.current) {
      chargingPortRef.current.position.z = THREE.MathUtils.lerp(chargingPortRef.current.position.z, -0.02 - d * 0.3, 0.1);
      chargingPortRef.current.position.y = THREE.MathUtils.lerp(chargingPortRef.current.position.y, -0.8 - d * 0.35, 0.1);
    }
    if (backGlassRef.current) backGlassRef.current.position.z = THREE.MathUtils.lerp(backGlassRef.current.position.z, -0.08 - d * 1.15, 0.1);
  });

  const isSelected = (key) => selectedExplodedComponent === key;

  return (
    <group scale={1.2}>
      {/* ================= 1. FRONT GLASS (CERAMIC SHIELD) ================= */}
      <group
        ref={frontGlassRef}
        position={[0, 0, 0.08]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedExplodedComponent('front_glass');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh>
          <boxGeometry args={[0.82, 1.66, 0.015]} />
          <meshPhysicalMaterial
            color="#E0F2FE"
            transmission={0.92}
            transparent
            opacity={0.4}
            roughness={0.05}
            ior={1.52}
            emissive={isSelected('front_glass') ? '#0284C7' : '#000000'}
            emissiveIntensity={isSelected('front_glass') ? 0.6 : 0}
          />
        </mesh>
        {explosionProgress > 0.4 && (
          <Text position={[0.6, 0.6, 0]} fontSize={0.07} color="#2874F0" fontWeight={900}>
            1. CERAMIC SHIELD GLASS
          </Text>
        )}
      </group>

      {/* ================= 2. OLED DISPLAY PANEL & DIGITIZER ================= */}
      <group
        ref={oledDisplayRef}
        position={[0, 0, 0.05]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedExplodedComponent('display');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh>
          <boxGeometry args={[0.8, 1.64, 0.012]} />
          <meshStandardMaterial
            color="#090A0F"
            roughness={0.15}
            metalness={0.8}
            emissive={isSelected('display') ? '#2874F0' : '#0F172A'}
            emissiveIntensity={isSelected('display') ? 0.7 : 0.1}
          />
        </mesh>
        {/* Dynamic Island Cutout */}
        <mesh position={[0, 0.66, 0.008]}>
          <capsuleGeometry args={[0.025, 0.09, 8, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {explosionProgress > 0.4 && (
          <Text position={[-0.65, 0.4, 0]} fontSize={0.07} color="#2874F0" fontWeight={900}>
            2. SUPER RETINA OLED (120Hz)
          </Text>
        )}
      </group>

      {/* ================= 3. TITANIUM CHASSIS FRAME ================= */}
      <group
        ref={titaniumFrameRef}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedExplodedComponent('frame');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Outer CNC Machined Bezel */}
        <mesh>
          <boxGeometry args={[0.84, 1.68, 0.07]} />
          <meshStandardMaterial
            color={color}
            metalness={0.92}
            roughness={0.25}
            emissive={isSelected('frame') ? '#FFE500' : '#000000'}
            emissiveIntensity={isSelected('frame') ? 0.5 : 0}
          />
        </mesh>
        {/* Internal Hollow Cavity for Electronics */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.78, 1.62, 0.075]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.4} />
        </mesh>
        {/* Antenna Band Insets */}
        <mesh position={[0.422, 0.4, 0]}>
          <boxGeometry args={[0.006, 0.04, 0.072]} />
          <meshBasicMaterial color="#475569" />
        </mesh>
        <mesh position={[-0.422, 0.4, 0]}>
          <boxGeometry args={[0.006, 0.04, 0.072]} />
          <meshBasicMaterial color="#475569" />
        </mesh>
        {explosionProgress > 0.4 && (
          <Text position={[0.65, 0, 0]} fontSize={0.07} color="#64748B" fontWeight={900}>
            3. GRADE 5 TITANIUM FRAME
          </Text>
        )}
      </group>

      {/* ================= 4. MOTHERBOARD / LOGIC BOARD ================= */}
      <group
        ref={motherboardRef}
        position={[0.16, 0.35, -0.04]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedExplodedComponent('motherboard');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Dual-Layer Logic Board PCB */}
        <mesh>
          <boxGeometry args={[0.42, 0.65, 0.02]} />
          <meshStandardMaterial
            color="#047857"
            roughness={0.4}
            metalness={0.6}
            emissive={isSelected('motherboard') ? '#10B981' : '#000000'}
            emissiveIntensity={isSelected('motherboard') ? 0.6 : 0}
          />
        </mesh>
        {/* A18 Pro / Snapdragon SoC Heat Spreader Shield */}
        <mesh position={[0, 0.05, 0.012]}>
          <boxGeometry args={[0.24, 0.24, 0.01]} />
          <meshStandardMaterial color="#B45309" metalness={0.95} roughness={0.15} />
        </mesh>
        <Text position={[0, 0.05, 0.02]} fontSize={0.045} color="#FFFFFF" fontWeight={900}>
          3nm SoC
        </Text>
        {explosionProgress > 0.4 && (
          <Text position={[0.55, 0.35, 0]} fontSize={0.07} color="#10B981" fontWeight={900}>
            4. MAIN LOGIC BOARD (A18 / SNAPDRAGON)
          </Text>
        )}
      </group>

      {/* ================= 5. HIGH-DENSITY BATTERY PACK ================= */}
      <group
        ref={batteryRef}
        position={[-0.14, -0.15, -0.05]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedExplodedComponent('battery');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* L-Shaped Lithium-Cobalt High-Density Cell */}
        <mesh>
          <boxGeometry args={[0.42, 0.95, 0.025]} />
          <meshStandardMaterial
            color="#18181B"
            roughness={0.6}
            metalness={0.2}
            emissive={isSelected('battery') ? '#EAB308' : '#000000'}
            emissiveIntensity={isSelected('battery') ? 0.5 : 0}
          />
        </mesh>
        {/* Battery Safety Label */}
        <Text position={[0, 0.1, 0.015]} fontSize={0.05} color="#94A3B8" fontWeight={700}>
          4,685 mAh • Li-Ion
        </Text>
        <Text position={[0, -0.1, 0.015]} fontSize={0.038} color="#64748B">
          100% Recycled Cobalt Cell
        </Text>
        {explosionProgress > 0.4 && (
          <Text position={[-0.65, -0.15, 0]} fontSize={0.07} color="#EAB308" fontWeight={900}>
            5. 4,685mAh BATTERY PACK
          </Text>
        )}
      </group>

      {/* ================= 6. PRO TRIPLE CAMERA MODULE ================= */}
      <group
        ref={cameraModuleRef}
        position={[-0.22, 0.55, -0.06]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedExplodedComponent('camera');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Camera Base Platform */}
        <mesh>
          <boxGeometry args={[0.34, 0.36, 0.03]} />
          <meshStandardMaterial
            color="#27272A"
            metalness={0.8}
            roughness={0.2}
            emissive={isSelected('camera') ? '#EF4444' : '#000000'}
            emissiveIntensity={isSelected('camera') ? 0.6 : 0}
          />
        </mesh>
        {/* 3 Physical Optical Lenses */}
        <mesh position={[-0.08, 0.08, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 24]} />
          <meshStandardMaterial color="#000000" metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh position={[-0.08, -0.08, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 24]} />
          <meshStandardMaterial color="#000000" metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh position={[0.08, 0, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 24]} />
          <meshStandardMaterial color="#000000" metalness={0.95} roughness={0.05} />
        </mesh>
        {explosionProgress > 0.4 && (
          <Text position={[-0.6, 0.75, 0]} fontSize={0.07} color="#EF4444" fontWeight={900}>
            6. 48MP FUSION TRIPLE CAMERA (OIS)
          </Text>
        )}
      </group>

      {/* ================= 7. STEREO SPEAKERS & TAPTIC ENGINE ================= */}
      <group
        ref={speakerAssemblyRef}
        position={[0, -0.65, -0.04]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedExplodedComponent('speakers');
        }}
      >
        <mesh>
          <boxGeometry args={[0.55, 0.14, 0.025]} />
          <meshStandardMaterial
            color="#3F3F46"
            metalness={0.7}
            roughness={0.3}
            emissive={isSelected('speakers') ? '#8B5CF6' : '#000000'}
            emissiveIntensity={isSelected('speakers') ? 0.5 : 0}
          />
        </mesh>
        {explosionProgress > 0.4 && (
          <Text position={[-0.65, -0.65, 0]} fontSize={0.07} color="#8B5CF6" fontWeight={900}>
            7. SPATIAL STEREO ACOUSTICS
          </Text>
        )}
      </group>

      {/* ================= 8. USB-C 10Gb/s CHARGING PORT ================= */}
      <group
        ref={chargingPortRef}
        position={[0, -0.8, -0.02]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedExplodedComponent('charging_port');
        }}
      >
        <mesh>
          <boxGeometry args={[0.18, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#E2E8F0"
            metalness={0.95}
            roughness={0.1}
            emissive={isSelected('charging_port') ? '#38BDF8' : '#000000'}
            emissiveIntensity={isSelected('charging_port') ? 0.5 : 0}
          />
        </mesh>
        {explosionProgress > 0.4 && (
          <Text position={[0.65, -0.8, 0]} fontSize={0.07} color="#38BDF8" fontWeight={900}>
            8. USB-C CONTROLLER (10Gb/s)
          </Text>
        )}
      </group>

      {/* ================= 9. FROSTED REAR GLASS & WIRELESS COIL ================= */}
      <group
        ref={backGlassRef}
        position={[0, 0, -0.08]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedExplodedComponent('back_glass');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Back Matte Glass */}
        <mesh>
          <boxGeometry args={[0.82, 1.66, 0.018]} />
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.3}
            emissive={isSelected('back_glass') ? '#2874F0' : '#000000'}
            emissiveIntensity={isSelected('back_glass') ? 0.5 : 0}
          />
        </mesh>
        {/* Circular Copper Wireless Charging Coil */}
        <mesh position={[0, -0.05, 0.012]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.18, 0.28, 32]} />
          <meshStandardMaterial color="#B45309" metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Magnet Alignment Array */}
        <mesh position={[0, -0.05, 0.013]}>
          <ringGeometry args={[0.29, 0.31, 32]} />
          <meshBasicMaterial color="#94A3B8" />
        </mesh>
        {explosionProgress > 0.4 && (
          <Text position={[0.65, -0.35, 0]} fontSize={0.07} color="#2874F0" fontWeight={900}>
            9. TEXTURED REAR GLASS & Qi2 COIL
          </Text>
        )}
      </group>
    </group>
  );
}
