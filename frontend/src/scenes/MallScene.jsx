import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { FlipkartBuilding } from '../components/Building/FlipkartBuilding';
import { GroundLobby } from '../components/Floors/GroundLobby';
import { ShowroomFloor } from '../components/Floors/ShowroomFloor';
import { Elevator3D } from '../components/Elevator/Elevator3D';

// Camera Rig that smoothly animates camera position & lookAt between mall states
function CameraRig() {
  const currentView = useStore((state) => state.currentView);
  const selectedFloor = useStore((state) => state.selectedFloor);

  const targetCamPos = useRef(new THREE.Vector3(0, 3.6, 18));
  const targetLookAt = useRef(new THREE.Vector3(0, 5.2, -2));
  const currentLookAt = useRef(new THREE.Vector3(0, 5.2, -2));

  useFrame((state, delta) => {
    switch (currentView) {
      case 'EXTERIOR':
        targetCamPos.current.set(0, 3.6, 18);
        targetLookAt.current.set(0, 5.2, -2);
        break;
      case 'ENTERING':
        targetCamPos.current.set(0, 1.8, 0.5);
        targetLookAt.current.set(0, 1.8, -7);
        break;
      case 'GROUND_LOBBY':
        targetCamPos.current.set(0, 2.8, 10.5);
        targetLookAt.current.set(0, 1.4, 0);
        break;
      case 'TRANSITION_ELEVATOR':
        targetCamPos.current.set(0, 1.9, -4.2);
        targetLookAt.current.set(0, 1.8, -7.0);
        break;
      case 'IN_ELEVATOR':
        targetCamPos.current.set(0, 1.8, -6.5);
        targetLookAt.current.set(0, 1.8, -2.0);
        break;
      case 'SHOWROOM':
        targetCamPos.current.set(0, 2.6, 9.5);
        targetLookAt.current.set(0, 1.3, 0);
        break;
      default:
        targetCamPos.current.set(0, 2.6, 9.5);
        targetLookAt.current.set(0, 1.3, 0);
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

  const isExterior = currentView === 'EXTERIOR' || currentView === 'ENTERING';
  const isGround = currentView === 'GROUND_LOBBY' || (currentView === 'TRANSITION_ELEVATOR' && selectedFloor === 0);
  const isElevator = currentView === 'IN_ELEVATOR';
  const isShowroom = currentView === 'SHOWROOM' || (currentView === 'TRANSITION_ELEVATOR' && selectedFloor > 0);

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
        <fog attach="fog" args={['#F5F8FE', 22, 70]} />

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
          position={[14, 24, 14]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          color="#FFFFFF"
        />

        {/* Secondary Sky Reflection Fill Light */}
        <directionalLight
          position={[-12, 16, -10]}
          intensity={0.45}
          color="#EAF3FF"
        />

        {/* Dynamic Scene Content Based on Mall Stage */}
        {isExterior && <FlipkartBuilding />}
        {isGround && (
          <group>
            <GroundLobby />
            <Elevator3D position={[0, 0, -7.0]} />
          </group>
        )}
        {isShowroom && <ShowroomFloor floorNumber={selectedFloor || 1} />}
        {isElevator && (
          <group>
            <Elevator3D position={[0, 0, -7.0]} />
          </group>
        )}

        <CameraRig />
      </Canvas>
    </div>
  );
}
