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
import { CustomerAvatar } from '../components/Navigation/CustomerAvatar';

// Exact floor vertical Y coordinates across the 4-storey architecture
const FLOOR_Y_MAP = {
  0: 0,   // Ground Lobby & Grand Atrium
  1: 8,   // Floor 1: Electronics Showroom
  2: 16,  // Floor 2: Fashion Showroom
  3: 24   // Floor 3: Home & Living Showroom
};

// Camera Rig that smoothly animates camera position & lookAt between mall floors and avatar
function CameraRig() {
  const currentView = useStore((state) => state.currentView);
  const phase = useStore((state) => state.phase);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const currentFloor = useStore((state) => state.currentFloor);
  const targetFloor = useStore((state) => state.targetFloor);
  const selectedBrand = useStore((state) => state.selectedBrand);
  const navigationMode = useStore((state) => state.navigationMode);
  const avatarPosition = useStore((state) => state.avatarPosition || [0, 0, 8]);
  const avatarRotation = useStore((state) => state.avatarRotation || 0);

  const targetCamPos = useRef(new THREE.Vector3(0, 3.6, 18));
  const targetLookAt = useRef(new THREE.Vector3(0, 5.2, -2));
  const currentLookAt = useRef(new THREE.Vector3(0, 5.2, -2));
  const elevatorCurrentY = useRef(0);

  const activeFloor = selectedFloor !== undefined ? selectedFloor : currentFloor;

  useFrame((state, delta) => {
    const currentFloorY = FLOOR_Y_MAP[activeFloor] ?? 0;
    const destFloorY = FLOOR_Y_MAP[targetFloor] ?? 0;

    const isExteriorPhase = currentView === 'EXTERIOR' || phase === 'exterior';
    const isEnteringPhase = currentView === 'ENTERING' || phase === 'entering';
    const isLobbyPhase = currentView === 'GROUND_LOBBY' || phase === 'lobby';
    const isToElevatorPhase = currentView === 'TRANSITION_ELEVATOR' || phase === 'toElevator';
    const isRidingPhase = currentView === 'IN_ELEVATOR' || phase === 'riding';
    const isShowroomPhase = currentView === 'SHOWROOM' || phase === 'showroom';

    if (isExteriorPhase) {
      targetCamPos.current.set(0, 3.6, 18);
      targetLookAt.current.set(0, 5.2, -2);
      elevatorCurrentY.current = 0;
    } else if (isEnteringPhase) {
      // Smooth cinematic glide into the ground floor grand atrium with upward gaze
      targetCamPos.current.set(0, 2.4, 12.0);
      targetLookAt.current.set(0, 6.5, -1.0);
      elevatorCurrentY.current = 0;
    } else if (isToElevatorPhase) {
      // Camera smoothly moves towards the glass elevator entrance at current floor
      targetCamPos.current.set(0, currentFloorY + 1.8, -4.2);
      targetLookAt.current.set(0, currentFloorY + 1.8, -7.0);
      elevatorCurrentY.current = currentFloorY;
    } else if (isRidingPhase) {
      // Camera rides inside the panoramic glass elevator cab during vertical transit
      elevatorCurrentY.current = THREE.MathUtils.lerp(
        elevatorCurrentY.current,
        destFloorY,
        1.8 * delta
      );
      targetCamPos.current.set(0, elevatorCurrentY.current + 1.75, -6.8);
      // Look outward through front panoramic glass into the open central atrium
      targetLookAt.current.set(0, elevatorCurrentY.current + 1.75, 4.5);
    } else if (navigationMode === 'avatar') {
      // Third-Person Over-the-Shoulder Camera following Customer Avatar (Section 4)
      const offset = new THREE.Vector3(0, 1.9, 3.8).applyAxisAngle(new THREE.Vector3(0, 1, 0), avatarRotation);
      targetCamPos.current.set(
        avatarPosition[0] + offset.x,
        avatarPosition[1] + offset.y,
        avatarPosition[2] + offset.z
      );
      targetLookAt.current.set(
        avatarPosition[0],
        avatarPosition[1] + 1.35,
        avatarPosition[2]
      );
    } else if (isShowroomPhase && selectedBrand) {
      // Inside selected Brand Store Boutique on Floor 1 (Section 6)
      elevatorCurrentY.current = currentFloorY;
      targetCamPos.current.set(0, currentFloorY + 1.8, 4.8);
      targetLookAt.current.set(0, currentFloorY + 1.05, 0);
    } else if (isLobbyPhase) {
      // Grand Atrium perspective looking up into the 4-floor void (Section 3)
      targetCamPos.current.set(0, 2.4, 12.0);
      targetLookAt.current.set(0, 6.5, -1.0);
      elevatorCurrentY.current = 0;
    } else {
      // Standard Floor View
      elevatorCurrentY.current = currentFloorY;
      targetCamPos.current.set(0, currentFloorY + 2.5, 9.2);
      targetLookAt.current.set(0, currentFloorY + 1.4, 0);
    }

    // Smooth camera position dampening
    state.camera.position.lerp(targetCamPos.current, 2.8 * delta);

    // Smooth lookAt dampening
    currentLookAt.current.lerp(targetLookAt.current, 3.2 * delta);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

// Adaptive Performance Monitor (UX Principle #8)
function AdaptivePerformanceMonitor() {
  const quality = useStore((state) => state.quality);
  const setQuality = useStore((state) => state.setQuality);
  const addToast = useStore((state) => state.addToast);

  const fpsHistory = useRef([]);
  const lastCheck = useRef(0);

  useFrame((_, delta) => {
    const fps = 1 / Math.max(delta, 0.001);
    fpsHistory.current.push(fps);
    if (fpsHistory.current.length > 180) {
      fpsHistory.current.shift();
    }

    lastCheck.current += delta;
    if (lastCheck.current > 3.0) {
      lastCheck.current = 0;
      if (fpsHistory.current.length >= 60) {
        const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
        if (avgFps < 30) {
          if (quality === 'high') {
            setQuality('medium');
            addToast('Graphics Adjusted', 'Adjusted graphics for smoother experience.', 'info');
          } else if (quality === 'medium') {
            setQuality('low');
            addToast('Graphics Adjusted', 'Adjusted graphics for smoother experience.', 'info');
          }
        }
      }
    }
  });

  return null;
}

export function MallScene() {
  const currentView = useStore((state) => state.currentView);
  const phase = useStore((state) => state.phase);
  const currentFloor = useStore((state) => state.currentFloor);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const quality = useStore((state) => state.quality || 'high');

  const activeFloor = selectedFloor !== undefined ? selectedFloor : currentFloor;
  const isExterior = currentView === 'EXTERIOR' && phase === 'exterior';

  const dpr = quality === 'high' ? [1, 2] : quality === 'medium' ? [1, 1.5] : 1;
  const shadowMapSize = quality === 'high' ? [2048, 2048] : [1024, 1024];
  const shadowsEnabled = quality !== 'low';

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${isExterior ? 'bg-[#070B14]' : 'bg-[#F8FAFC]'}`}>
      <Canvas
        camera={{ position: [0, 3.6, 18], fov: 52 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
        dpr={dpr}
      >
        {/* Dynamic Architectural Sky Background & Atmospheric Fog */}
        <color attach="background" args={[isExterior ? '#070B14' : '#F8FAFC']} />
        <fog
          attach="fog"
          args={[
            isExterior ? '#070B14' : '#F1F5F9',
            isExterior ? 28 : 45,
            isExterior ? 85 : 120
          ]}
        />

        {/* Balanced Architectural Daylight & Hemisphere Illumination */}
        <hemisphereLight
          skyColor={isExterior ? '#1E3A8A' : '#FFFFFF'}
          groundColor={isExterior ? '#0B0F19' : '#F8FAFC'}
          intensity={isExterior ? 1.25 : 1.45}
        />

        {/* Soft Ambient Daylight Fill */}
        <ambientLight
          intensity={isExterior ? 0.65 : 0.75}
          color={isExterior ? '#E0F2FE' : '#FFFDF7'}
        />

        {/* Primary Natural Sunlight Streaming Through Skylight */}
        <directionalLight
          position={isExterior ? [14, 28, 14] : [8, 36, 6]}
          intensity={isExterior ? 1.65 : 2.2}
          castShadow={shadowsEnabled}
          shadow-mapSize={shadowMapSize}
          shadow-bias={-0.0001}
          color={isExterior ? '#FFFFFF' : '#FFFBF5'}
        />

        {/* Soft Sky-Blue Secondary Daylight Bounce */}
        <directionalLight
          position={[-10, 32, -6]}
          intensity={isExterior ? 0.85 : 0.9}
          color={isExterior ? '#00F0FF' : '#E0F2FE'}
        />

        {/* Warm 3000K Interior Architectural Fill Light */}
        {!isExterior && (
          <directionalLight
            position={[0, -2, 10]}
            intensity={0.4}
            color="#FEF3C7"
          />
        )}

        {/* 1. Exterior Building Scene (Futuristic Mall Plaza) */}
        {isExterior && <FlipkartBuilding />}

        {/* 2. Grand Interior Shopping Mall Architecture (Multi-Storey Open Atrium) */}
        {!isExterior && (
          <group>
            {/* Grand Architecture */}
            <MallArchitecture />

            {/* Panoramic Glass Elevator with Vertical Physical Transit */}
            <GlassElevator position={[0, 0, -7.0]} />

            {/* Ground Floor (Y = 0): Grand Lobby & Category Gateways */}
            <GroundLobby />

            {/* Floor 1 (Y = 8): Electronics Showroom & Brand Boutiques */}
            <ElectronicsShowroom floorY={8} />

            {/* Floor 2 (Y = 16): Fashion Showroom & Luxury Boutiques */}
            <FashionShowroom floorY={16} />

            {/* Floor 3 (Y = 24): Home, Living, Appliances, Supermarket & Books */}
            <HomeShowroom floorY={24} />

            {/* Controllable 3D Customer Avatar */}
            <CustomerAvatar floorY={FLOOR_Y_MAP[activeFloor] || 0} />
          </group>
        )}

        <CameraRig />
        <AdaptivePerformanceMonitor />
      </Canvas>
    </div>
  );
}

export default MallScene;
