import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { FlipkartBuilding } from '../components/Building/FlipkartBuilding';
import { MallArchitecture } from '../components/Architecture/MallArchitecture';
import { GlassElevator } from '../components/Elevator/GlassElevator';
import { GroundLobby } from '../components/Floors/GroundLobby';
import { ElectronicsShowroom } from '../components/Showrooms/ElectronicsShowroom';
import { FashionShowroom } from '../components/Showrooms/FashionShowroom';
import { HomeShowroom } from '../components/Showrooms/HomeShowroom';

// Exact floor vertical Y coordinates across the 4-storey architecture
const FLOOR_Y_MAP = {
  0: 0,   // Ground Lobby & Grand Atrium
  1: 8,   // Floor 1: Electronics Showroom
  2: 16,  // Floor 2: Fashion Showroom
  3: 24   // Floor 3: Home & Living Showroom
};

// Camera Rig that smoothly animates camera position & lookAt between mall floors and elevator
function CameraRig() {
  const currentView = useStore((state) => state.currentView);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const targetFloor = useStore((state) => state.targetFloor);

  const targetCamPos = useRef(new THREE.Vector3(0, 3.6, 18));
  const targetLookAt = useRef(new THREE.Vector3(0, 5.2, -2));
  const currentLookAt = useRef(new THREE.Vector3(0, 5.2, -2));
  const elevatorCurrentY = useRef(0);

  useFrame((state, delta) => {
    const currentFloorY = FLOOR_Y_MAP[selectedFloor] ?? 0;
    const destFloorY = FLOOR_Y_MAP[targetFloor] ?? 0;

    switch (currentView) {
      case 'EXTERIOR':
        targetCamPos.current.set(0, 3.6, 18);
        targetLookAt.current.set(0, 5.2, -2);
        elevatorCurrentY.current = 0;
        break;

      case 'ENTERING':
        // Smooth cinematic glide through the entrance doors into the ground floor lobby
        targetCamPos.current.set(0, 2.6, 10.5);
        targetLookAt.current.set(0, 1.4, 0);
        elevatorCurrentY.current = 0;
        break;

      case 'GROUND_LOBBY':
        targetCamPos.current.set(0, 2.6, 10.5);
        targetLookAt.current.set(0, 1.4, 0);
        elevatorCurrentY.current = 0;
        break;

      case 'TRANSITION_ELEVATOR':
        // Camera smoothly moves towards the glass elevator entrance at current floor
        targetCamPos.current.set(0, currentFloorY + 1.8, -4.2);
        targetLookAt.current.set(0, currentFloorY + 1.8, -7.0);
        elevatorCurrentY.current = currentFloorY;
        break;

      case 'IN_ELEVATOR':
        // Camera rides inside the panoramic glass elevator cab during vertical transit
        elevatorCurrentY.current = THREE.MathUtils.lerp(
          elevatorCurrentY.current,
          destFloorY,
          1.8 * delta
        );
        targetCamPos.current.set(0, elevatorCurrentY.current + 1.75, -6.8);
        // Look outward through front panoramic glass into the open central atrium
        targetLookAt.current.set(0, elevatorCurrentY.current + 1.75, 4.5);
        break;

      case 'SHOWROOM':
        // Inside the selected showroom floor
        elevatorCurrentY.current = currentFloorY;
        targetCamPos.current.set(0, currentFloorY + 2.5, 9.2);
        targetLookAt.current.set(0, currentFloorY + 1.4, 0);
        break;

      default:
        targetCamPos.current.set(0, currentFloorY + 2.5, 9.2);
        targetLookAt.current.set(0, currentFloorY + 1.4, 0);
        break;
    }

    // Smooth camera position dampening
    state.camera.position.lerp(targetCamPos.current, 2.8 * delta);

    // Smooth lookAt dampening
    currentLookAt.current.lerp(targetLookAt.current, 3.2 * delta);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

export function MallScene() {
  const currentView = useStore((state) => state.currentView);
  const selectedFloor = useStore((state) => state.selectedFloor);

  const isExterior = currentView === 'EXTERIOR';

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#F5F8FE]">
      <Canvas
        camera={{ position: [0, 3.6, 18], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
        dpr={[1, 2]}
      >
        {/* Bright daylight sky background and soft atmospheric fog */}
        <color attach="background" args={['#F5F8FE']} />
        <fog attach="fog" args={['#F5F8FE', 24, 75]} />

        {/* Natural Daylight Hemisphere Lighting - Soft sky blue from above, warm floor bounce */}
        <hemisphereLight
          skyColor="#FFFFFF"
          groundColor="#DCE8FA"
          intensity={1.15}
        />

        {/* Ambient base fill light */}
        <ambientLight intensity={0.55} color="#FFFFFF" />

        {/* Primary Sunlight (Directional with high-res soft shadows) */}
        <directionalLight
          position={[14, 28, 14]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          color="#FFFFFF"
        />

        {/* Secondary Sky Reflection Fill Light */}
        <directionalLight
          position={[-12, 18, -10]}
          intensity={0.45}
          color="#EAF3FF"
        />

        {/* 1. Exterior Building Scene */}
        {isExterior && <FlipkartBuilding />}

        {/* 2. Grand Interior Shopping Mall Architecture (Multi-Storey Open Atrium) */}
        {!isExterior && (
          <group>
            {/* Grand Architecture (Carrara Marble, Multi-Level Atrium, Escalators, Pillars, Skylight) */}
            <MallArchitecture />

            {/* Panoramic Glass Elevator with Vertical Physical Transit */}
            <GlassElevator position={[0, 0, -7.0]} />

            {/* Ground Floor (Y = 0): Grand Lobby & Category Gateways */}
            <GroundLobby />

            {/* Floor 1 (Y = 8): Electronics Showroom (5 Tech Zones) */}
            <ElectronicsShowroom floorY={8} />

            {/* Floor 2 (Y = 16): Fashion Showroom (Sneaker Vault, Blazers & Handbags) */}
            <FashionShowroom floorY={16} />

            {/* Floor 3 (Y = 24): Home & Living Showroom (Nordic Furniture & Smart Appliances) */}
            <HomeShowroom floorY={24} />
          </group>
        )}

        <CameraRig />
      </Canvas>
    </div>
  );
}
