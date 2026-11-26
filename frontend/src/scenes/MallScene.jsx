import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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

// Camera Rig supporting Free 3D Orbit/Pan/Zoom/WASD Exploration, Customer Walk Mode, and Guided View
function CameraRig() {
  const currentView = useStore((state) => state.currentView);
  const phase = useStore((state) => state.phase);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const currentFloor = useStore((state) => state.currentFloor);
  const targetFloor = useStore((state) => state.targetFloor);
  const selectedBrand = useStore((state) => state.selectedBrand);
  const navigationMode = useStore((state) => state.navigationMode);
  const elevatorStatus = useStore((state) => state.elevatorStatus);
  const avatarPosition = useStore((state) => state.avatarPosition || [0, 0, 8]);
  const avatarRotation = useStore((state) => state.avatarRotation || 0);

  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const keysDown = useRef({});
  const dragLookOffset = useRef({ yaw: 0, pitch: 0, dragging: false, lastX: 0, lastY: 0 });

  const targetCamPos = useRef(new THREE.Vector3(0, 3.6, 18));
  const targetLookAt = useRef(new THREE.Vector3(0, 5.2, -2));
  const currentLookAt = useRef(new THREE.Vector3(0, 5.2, -2));
  const elevatorCurrentY = useRef(0);
  const lastContextKey = useRef('');

  const activeFloor = selectedFloor !== undefined ? selectedFloor : currentFloor;
  const currentFloorY = FLOOR_Y_MAP[activeFloor] ?? 0;

  const isExteriorPhase = currentView === 'EXTERIOR' || phase === 'exterior';
  const isEnteringPhase = currentView === 'ENTERING' || phase === 'entering';
  const isLobbyPhase = currentView === 'GROUND_LOBBY' || phase === 'lobby';
  const isToElevatorPhase = currentView === 'TRANSITION_ELEVATOR' || phase === 'toElevator';
  const isRidingPhase = currentView === 'IN_ELEVATOR' || phase === 'riding' || phase === 'arriving';
  const isShowroomPhase = currentView === 'SHOWROOM' || phase === 'showroom';
  const isInspecting = phase === 'inspecting' || currentView === 'PRODUCT_INSPECT';

  const isFreeExplore =
    navigationMode === 'free' &&
    !isExteriorPhase &&
    !isEnteringPhase &&
    !isToElevatorPhase &&
    !isRidingPhase &&
    !isInspecting;

  // Keyboard tracking for Free Explore WASD/Arrows gliding
  useEffect(() => {
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      keysDown.current[e.key.toLowerCase()] = true;
    };
    const onKeyUp = (e) => {
      keysDown.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Mouse-drag look-around offset for Customer Walking Mode ('avatar')
  useEffect(() => {
    const dom = gl.domElement;
    if (!dom) return;

    const onPointerDown = (e) => {
      if (navigationMode !== 'avatar') return;
      dragLookOffset.current.dragging = true;
      dragLookOffset.current.lastX = e.clientX;
      dragLookOffset.current.lastY = e.clientY;
    };
    const onPointerMove = (e) => {
      if (!dragLookOffset.current.dragging || navigationMode !== 'avatar') return;
      const dx = e.clientX - dragLookOffset.current.lastX;
      const dy = e.clientY - dragLookOffset.current.lastY;
      dragLookOffset.current.lastX = e.clientX;
      dragLookOffset.current.lastY = e.clientY;
      dragLookOffset.current.yaw = THREE.MathUtils.clamp(dragLookOffset.current.yaw - dx * 0.005, -1.4, 1.4);
      dragLookOffset.current.pitch = THREE.MathUtils.clamp(dragLookOffset.current.pitch + dy * 0.004, -0.45, 0.75);
    };
    const onPointerUp = () => {
      dragLookOffset.current.dragging = false;
    };

    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl, navigationMode]);

  // Smoothly frame the new floor/storefront whenever floor, brand, or mode changes into Free Explore
  useEffect(() => {
    if (!isFreeExplore) return;
    const key = `${activeFloor}-${selectedBrand || 'none'}-${navigationMode}`;
    if (lastContextKey.current === key) return;
    lastContextKey.current = key;

    if (selectedBrand) {
      camera.position.set(0, currentFloorY + 2.1, 6.2);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, currentFloorY + 1.1, -0.8);
        controlsRef.current.update();
      }
    } else if (activeFloor === 0) {
      // Natural human eye-level view showing ground lobby, kiosks, storefronts, escalators, elevator & upper balconies
      camera.position.set(0, 2.2, 13.8);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 2.5, -2.5);
        controlsRef.current.update();
      }
    } else {
      camera.position.set(0, currentFloorY + 2.4, 10.8);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, currentFloorY + 1.5, -1.5);
        controlsRef.current.update();
      }
    }
  }, [isFreeExplore, activeFloor, selectedBrand, navigationMode, currentFloorY, camera]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const destFloorY = FLOOR_Y_MAP[targetFloor] ?? 0;

    // 1. Free 3D Exploration Mode (OrbitControls + WASD/Arrows + Mall Boundary Clamping)
    if (isFreeExplore && controlsRef.current) {
      const controls = controlsRef.current;

      // WASD / Arrow horizontal glide relative to camera facing direction
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      if (forward.lengthSq() > 0.0001) forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      const moveSpeed = (keysDown.current['shift'] ? 9.5 : 6.2) * dt;
      const moveDelta = new THREE.Vector3();

      if (keysDown.current['w'] || keysDown.current['arrowup']) moveDelta.addScaledVector(forward, moveSpeed);
      if (keysDown.current['s'] || keysDown.current['arrowdown']) moveDelta.addScaledVector(forward, -moveSpeed);
      if (keysDown.current['a'] || keysDown.current['arrowleft']) moveDelta.addScaledVector(right, -moveSpeed);
      if (keysDown.current['d'] || keysDown.current['arrowright']) moveDelta.addScaledVector(right, moveSpeed);

      if (moveDelta.lengthSq() > 0) {
        camera.position.add(moveDelta);
        controls.target.add(moveDelta);
      }

      // Clamp camera and target inside mall architectural bounds to prevent clipping/leaving
      const minX = selectedBrand ? -9.0 : -16.5;
      const maxX = selectedBrand ? 9.0 : 16.5;
      const minZ = selectedBrand ? -7.2 : -10.5;
      const maxZ = selectedBrand ? 8.0 : 15.8;

      controls.target.x = THREE.MathUtils.clamp(controls.target.x, minX + 1.5, maxX - 1.5);
      controls.target.y = THREE.MathUtils.clamp(controls.target.y, currentFloorY + 0.5, currentFloorY + 12.0);
      controls.target.z = THREE.MathUtils.clamp(controls.target.z, minZ + 1.0, maxZ - 1.0);

      camera.position.x = THREE.MathUtils.clamp(camera.position.x, minX, maxX);
      camera.position.y = THREE.MathUtils.clamp(camera.position.y, Math.max(0.85, currentFloorY + 0.75), 29.5);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, minZ, maxZ);

      controls.update();
      currentLookAt.current.copy(controls.target);
      return;
    }

    // 2. Cinematic / Elevator / Avatar Camera Modes
    lastContextKey.current = '';

    if (isExteriorPhase) {
      targetCamPos.current.set(0, 3.6, 18);
      targetLookAt.current.set(0, 5.2, -2);
      elevatorCurrentY.current = 0;
    } else if (isEnteringPhase) {
      // Natural human eye-level entry into the grand mall concourse
      targetCamPos.current.set(0, 2.2, 13.8);
      targetLookAt.current.set(0, 2.5, -2.5);
      elevatorCurrentY.current = 0;
    } else if (isToElevatorPhase) {
      targetCamPos.current.set(0, currentFloorY + 1.8, -3.6);
      targetLookAt.current.set(0, currentFloorY + 1.8, -7.0);
      elevatorCurrentY.current = currentFloorY;
    } else if (isRidingPhase) {
      elevatorCurrentY.current = THREE.MathUtils.lerp(
        elevatorCurrentY.current,
        destFloorY,
        1.8 * dt
      );
      if (elevatorStatus === 'exiting') {
        targetCamPos.current.set(0, destFloorY + 2.0, -1.5);
        targetLookAt.current.set(0, destFloorY + 1.4, 4.5);
      } else {
        targetCamPos.current.set(0, elevatorCurrentY.current + 1.75, -6.8);
        targetLookAt.current.set(0, elevatorCurrentY.current + 1.75, 4.5);
      }
    } else if (navigationMode === 'avatar') {
      // Third-Person Over-the-Shoulder Camera with optional mouse look-around
      const camYaw = avatarRotation + dragLookOffset.current.yaw;
      const camHeight = 1.95 + dragLookOffset.current.pitch * 1.4;
      const offset = new THREE.Vector3(0, camHeight, 4.0).applyAxisAngle(new THREE.Vector3(0, 1, 0), camYaw);
      targetCamPos.current.set(
        THREE.MathUtils.clamp(avatarPosition[0] + offset.x, -16.2, 16.2),
        Math.max(currentFloorY + 0.85, avatarPosition[1] + offset.y),
        THREE.MathUtils.clamp(avatarPosition[2] + offset.z, -10.2, 15.2)
      );
      targetLookAt.current.set(
        avatarPosition[0],
        avatarPosition[1] + 1.35,
        avatarPosition[2]
      );
    } else if (isShowroomPhase && selectedBrand) {
      elevatorCurrentY.current = currentFloorY;
      targetCamPos.current.set(0, currentFloorY + 2.1, 6.2);
      targetLookAt.current.set(0, currentFloorY + 1.1, -0.8);
    } else if (isLobbyPhase) {
      // Eye-level Grand Lobby view showing storefronts, kiosk, escalators, elevator & balconies
      targetCamPos.current.set(0, 2.2, 13.8);
      targetLookAt.current.set(0, 2.5, -2.5);
      elevatorCurrentY.current = 0;
    } else {
      elevatorCurrentY.current = currentFloorY;
      targetCamPos.current.set(0, currentFloorY + 2.4, 10.8);
      targetLookAt.current.set(0, currentFloorY + 1.5, -1.5);
    }

    state.camera.position.lerp(targetCamPos.current, 3.2 * dt);
    currentLookAt.current.lerp(targetLookAt.current, 3.6 * dt);
    state.camera.lookAt(currentLookAt.current);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={isFreeExplore}
      enableDamping
      dampingFactor={0.07}
      enableRotate
      enableZoom
      enablePan
      rotateSpeed={0.65}
      zoomSpeed={0.85}
      panSpeed={0.7}
      minDistance={2.2}
      maxDistance={22.0}
      minPolarAngle={0.22}
      maxPolarAngle={Math.PI * 0.485}
    />
  );
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
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${isExterior ? 'bg-[#070B14]' : 'bg-[#F3ECE0]'}`}>
      <Canvas
        camera={{ position: [0, 3.6, 18], fov: 58 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12
        }}
        dpr={dpr}
      >
        {/* Dynamic Architectural Sky Background & Warm Cream Atmospheric Fog */}
        <color attach="background" args={[isExterior ? '#070B14' : '#F3ECE0']} />
        <fog
          attach="fog"
          args={[
            isExterior ? '#070B14' : '#EFE6D8',
            isExterior ? 28 : 48,
            isExterior ? 85 : 125
          ]}
        />

        {/* Balanced Warm Architectural Daylight & Hemisphere Illumination */}
        <hemisphereLight
          skyColor={isExterior ? '#1E3A8A' : '#FFFDF8'}
          groundColor={isExterior ? '#0B0F19' : '#E8DFD1'}
          intensity={isExterior ? 1.25 : 1.35}
        />

        {/* Soft Ambient Warm Daylight Fill */}
        <ambientLight
          intensity={isExterior ? 0.65 : 0.7}
          color={isExterior ? '#E0F2FE' : '#FFF8EB'}
        />

        {/* Primary Natural Sunlight Streaming Through Skylight */}
        <directionalLight
          position={isExterior ? [14, 28, 14] : [8, 36, 6]}
          intensity={isExterior ? 1.65 : 2.0}
          castShadow={shadowsEnabled}
          shadow-mapSize={shadowMapSize}
          shadow-bias={-0.0001}
          color={isExterior ? '#FFFFFF' : '#FFF7E6'}
        />

        {/* Soft Sky-Blue Secondary Daylight Bounce */}
        <directionalLight
          position={[-10, 32, -6]}
          intensity={isExterior ? 0.85 : 0.75}
          color={isExterior ? '#00F0FF' : '#E6F0FA'}
        />

        {/* Warm 3000K Interior Architectural Fill Light */}
        {!isExterior && (
          <directionalLight
            position={[0, -2, 10]}
            intensity={0.45}
            color="#FDE68A"
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
