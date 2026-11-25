import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore, resolveCategoryFloor } from '../../store/useStore';
import { resolveMallCollisions } from '../../utils/mallCollisions';

const FLOOR_Y_MAP = { 0: 0, 1: 8, 2: 16, 3: 24 };

// Brand storefront coordinates matching ElectronicsShowroom.jsx
const FLOOR1_BRAND_STORES = [
  { brand: 'apple', name: 'Apple Flagship Boutique', pos: [-7.5, -5.5] },
  { brand: 'samsung', name: 'Samsung Galaxy Store', pos: [7.5, -5.5] },
  { brand: 'google', name: 'Google Pixel Studio', pos: [-8.5, 3.5] },
  { brand: 'oneplus', name: 'OnePlus Experience Store', pos: [8.5, 3.5] },
  { brand: 'xiaomi', name: 'Xiaomi Leica Gallery', pos: [0, -11.5] },
  { brand: 'nothing', name: 'Nothing Concept Store', pos: [-6.0, 9.5] },
  { brand: 'sony', name: 'Sony & Audio Studio', pos: [6.0, 9.5] }
];

/**
 * 3D Customer Avatar Component (Section 4)
 * Controllable third-person customer avatar with smooth acceleration/turning,
 * architectural collision boundaries, elevator transit synchronization,
 * and proximity interaction handling ('E' key).
 */
export function CustomerAvatar({ floorY = 0 }) {
  const avatarGroupRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const torsoRef = useRef();

  const navigationMode = useStore((state) => state.navigationMode);
  const updateAvatarState = useStore((state) => state.updateAvatarState);
  const setInteractionPrompt = useStore((state) => state.setInteractionPrompt);
  const selectedBrand = useStore((state) => state.selectedBrand);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const currentFloor = useStore((state) => state.currentFloor);
  const targetFloor = useStore((state) => state.targetFloor);
  const phase = useStore((state) => state.phase);
  const elevatorDoorOpen = useStore((state) => state.elevatorDoorOpen);
  const elevatorMoving = useStore((state) => state.elevatorMoving);
  const enterBrandStore = useStore((state) => state.enterBrandStore);
  const exitBrandStore = useStore((state) => state.exitBrandStore);
  const travelToFloor = useStore((state) => state.travelToFloor);

  // Position, smooth velocity, and orientation state
  const pos = useRef(new THREE.Vector3(0, floorY, 8));
  const yaw = useRef(0);
  const forwardVel = useRef(0);
  const turnVel = useRef(0);
  const elevatorYRef = useRef(floorY);
  const prevFloorRef = useRef(currentFloor);
  const prevBrandRef = useRef(selectedBrand);
  const walkCycle = useRef(0);
  const keysDown = useRef({});
  const [isMoving, setIsMoving] = useState(false);

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

  // Position customer cleanly when entering/exiting a brand boutique or jumping floors
  useEffect(() => {
    if (prevBrandRef.current !== selectedBrand) {
      if (selectedBrand) {
        pos.current.set(0, floorY, 6.2);
        yaw.current = 0; // Face into boutique
      } else {
        pos.current.set(0, floorY, -3.8);
        yaw.current = Math.PI; // Face concourse
      }
      prevBrandRef.current = selectedBrand;
    }
  }, [selectedBrand, floorY]);

  useEffect(() => {
    if (prevFloorRef.current !== currentFloor && phase !== 'riding' && phase !== 'toElevator') {
      const spawnZ = currentFloor === 0 ? 7.8 : -4.2;
      pos.current.set(0, floorY, spawnZ);
      yaw.current = currentFloor === 0 ? 0 : Math.PI;
      elevatorYRef.current = floorY;
      prevFloorRef.current = currentFloor;
    }
  }, [currentFloor, floorY, phase]);

  const animateLimbs = (delta, moving, speedFactor = 1) => {
    if (moving) {
      walkCycle.current += delta * 10 * speedFactor;
      const legAngle = Math.sin(walkCycle.current) * 0.55;
      const armAngle = Math.cos(walkCycle.current) * 0.45;

      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle;
      if (torsoRef.current) torsoRef.current.position.y = 0.95 + Math.abs(Math.sin(walkCycle.current * 2)) * 0.04;
    } else {
      const idle = Math.sin(Date.now() * 0.003) * 0.04;
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.12);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.12);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.12);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.12);
      if (torsoRef.current) torsoRef.current.position.y = 0.95 + idle;
    }
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // ================= ELEVATOR JOURNEY SYNCHRONIZATION =================
    if (phase === 'toElevator') {
      // Walk smoothly toward elevator doors
      pos.current.y = floorY;
      pos.current.x = THREE.MathUtils.lerp(pos.current.x, 0, 3.2 * dt);
      pos.current.z = THREE.MathUtils.lerp(pos.current.z, elevatorDoorOpen ? -6.2 : -4.8, 3.2 * dt);
      yaw.current = THREE.MathUtils.lerp(yaw.current, 0, 5.0 * dt);
      elevatorYRef.current = floorY;
      animateLimbs(dt, true, 0.9);
      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.copy(pos.current);
        avatarGroupRef.current.rotation.y = yaw.current;
      }
      return;
    }

    if (phase === 'riding') {
      const destY = FLOOR_Y_MAP[targetFloor] ?? 0;
      if (elevatorMoving) {
        elevatorYRef.current = THREE.MathUtils.lerp(elevatorYRef.current, destY, 1.8 * dt);
      }
      pos.current.set(0, elevatorYRef.current + 0.12, -7.0);
      yaw.current = THREE.MathUtils.lerp(yaw.current, Math.PI, 4.0 * dt); // Face out through panoramic glass
      animateLimbs(dt, false);
      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.copy(pos.current);
        avatarGroupRef.current.rotation.y = yaw.current;
      }
      return;
    }

    if (phase === 'arriving') {
      // Step out of the panoramic elevator onto the destination floor
      const destY = FLOOR_Y_MAP[targetFloor] ?? floorY;
      elevatorYRef.current = destY;
      pos.current.y = destY;
      pos.current.x = THREE.MathUtils.lerp(pos.current.x, 0, 3.5 * dt);
      pos.current.z = THREE.MathUtils.lerp(pos.current.z, -4.2, 2.8 * dt);
      yaw.current = Math.PI;
      prevFloorRef.current = targetFloor;
      animateLimbs(dt, true, 0.85);
      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.copy(pos.current);
        avatarGroupRef.current.rotation.y = yaw.current;
      }
      return;
    }

    // Sync base Y with active floor elevation
    pos.current.y = floorY;

    if (navigationMode !== 'avatar') {
      setInteractionPrompt(null);
      return;
    }

    // ================= SMOOTH WASD + ARROW KEY MOVEMENT =================
    const isSprinting = Boolean(keysDown.current['shift']);
    const maxSpeed = isSprinting ? 7.4 : 5.2;
    const maxTurn = 2.9;

    let targetTurn = 0;
    if (keysDown.current['a'] || keysDown.current['arrowleft']) targetTurn += maxTurn;
    if (keysDown.current['d'] || keysDown.current['arrowright']) targetTurn -= maxTurn;

    let targetSpeed = 0;
    if (keysDown.current['w'] || keysDown.current['arrowup']) targetSpeed += maxSpeed;
    if (keysDown.current['s'] || keysDown.current['arrowdown']) targetSpeed -= maxSpeed * 0.65;

    // Smooth acceleration & deceleration
    forwardVel.current = THREE.MathUtils.damp(forwardVel.current, targetSpeed, 10, dt);
    turnVel.current = THREE.MathUtils.damp(turnVel.current, targetTurn, 12, dt);

    yaw.current += turnVel.current * dt;

    const moving = Math.abs(forwardVel.current) > 0.15;
    if (moving) {
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
      const nextX = pos.current.x + forward.x * forwardVel.current * dt;
      const nextZ = pos.current.z + forward.z * forwardVel.current * dt;

      // Architectural collision resolution
      const resolved = resolveMallCollisions(nextX, nextZ, currentFloor, {
        selectedBrand,
        elevatorDoorOpen
      });
      pos.current.x = resolved.x;
      pos.current.z = resolved.z;
    }

    setIsMoving(moving);

    if (avatarGroupRef.current) {
      avatarGroupRef.current.position.copy(pos.current);
      avatarGroupRef.current.rotation.y = yaw.current;
    }

    animateLimbs(dt, moving, isSprinting ? 1.35 : 1.0);

    // Sync with central store
    updateAvatarState([pos.current.x, pos.current.y, pos.current.z], yaw.current, moving);

    // ================= PROXIMITY DETECTION & INTERACTION ('E') =================
    let nearbyPrompt = null;

    if (currentFloor === 1 && !selectedBrand) {
      for (const store of FLOOR1_BRAND_STORES) {
        const dist = Math.hypot(pos.current.x - store.pos[0], pos.current.z - store.pos[1]);
        if (dist < 3.4) {
          nearbyPrompt = {
            text: `Press [E] to Enter ${store.name}`,
            action: () => enterBrandStore(store.brand)
          };
          break;
        }
      }
    } else if (selectedBrand) {
      const exitDist = Math.hypot(pos.current.x - 0, pos.current.z - 8.2);
      if (exitDist < 2.8) {
        nearbyPrompt = {
          text: 'Press [E] to Exit to Tech Avenue',
          action: () => exitBrandStore()
        };
      }
    }

    // Elevator proximity interaction on any concourse floor
    if (!nearbyPrompt && !selectedBrand) {
      const elevDist = Math.hypot(pos.current.x - 0, pos.current.z - (-5.0));
      if (elevDist < 2.6) {
        if (currentFloor === 0) {
          const destFloor = selectedCategory ? resolveCategoryFloor(selectedCategory) : 1;
          nearbyPrompt = {
            text: selectedCategory
              ? `Press [E] to Ride Elevator to ${selectedCategory.name} (${destFloor}F)`
              : 'Press [E] to Ride Panoramic Glass Elevator (1F)',
            action: () => travelToFloor(destFloor)
          };
        } else {
          nearbyPrompt = {
            text: 'Press [E] to Return to Ground Floor via Elevator',
            action: () => travelToFloor(0)
          };
        }
      }
    }

    // Ground lobby Category Directory Kiosk proximity
    if (!nearbyPrompt && currentFloor === 0) {
      const kioskDist = Math.hypot(pos.current.x - (-2.8), pos.current.z - 6.4);
      if (kioskDist < 3.0) {
        nearbyPrompt = {
          text: 'Press [E] to Open Category Search & Directory',
          action: () => useStore.setState({ searchOpen: true })
        };
      }
    }

    setInteractionPrompt(nearbyPrompt);

    if (nearbyPrompt && keysDown.current['e']) {
      nearbyPrompt.action();
      keysDown.current['e'] = false;
    }
  });

  if (phase === 'exterior' || phase === 'entering' || phase === 'inspecting') {
    return null;
  }

  return (
    <group ref={avatarGroupRef} position={[0, floorY, 8]}>
      {/* ================= 1. AVATAR HEAD & STYLISH HAIR ================= */}
      <group position={[0, 1.62, 0]}>
        {/* Head Skin */}
        <mesh castShadow>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#E8BEAC" roughness={0.6} />
        </mesh>
        {/* Modern Styled Hair */}
        <mesh position={[0, 0.05, -0.02]} castShadow>
          <sphereGeometry args={[0.135, 16, 16]} />
          <meshStandardMaterial color="#2B2118" roughness={0.9} />
        </mesh>
        {/* Sleek Blue Audio Earbuds */}
        <mesh position={[0.13, 0, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        <mesh position={[-0.13, 0, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
      </group>

      {/* ================= 2. TORSO & FLIPKART JACKET ================= */}
      <group ref={torsoRef} position={[0, 0.95, 0]}>
        {/* Flipkart Blue Modern Puffer Jacket */}
        <mesh position={[0, 0.34, 0]} castShadow>
          <boxGeometry args={[0.38, 0.44, 0.22]} />
          <meshStandardMaterial color="#2874F0" roughness={0.35} metalness={0.1} />
        </mesh>
        {/* White Inner Shirt Stripe */}
        <mesh position={[0, 0.35, 0.115]}>
          <planeGeometry args={[0.08, 0.38]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>
        {/* Flipkart Accent Yellow Zipper Tag */}
        <mesh position={[0.04, 0.38, 0.12]}>
          <boxGeometry args={[0.02, 0.05, 0.01]} />
          <meshBasicMaterial color="#FFE500" />
        </mesh>
        {/* Hip Belt */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.34, 0.08, 0.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.5} />
        </mesh>
      </group>

      {/* ================= 3. ARMS ================= */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.23, 1.25, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.08, 0.36, 0.09]} />
          <meshStandardMaterial color="#2874F0" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#E8BEAC" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.23, 1.25, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.08, 0.36, 0.09]} />
          <meshStandardMaterial color="#2874F0" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#E8BEAC" />
        </mesh>
      </group>

      {/* ================= 4. LEGS & SNEAKERS ================= */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.95, 0]}>
        {/* Navy Joggers Pants */}
        <mesh position={[0, -0.42, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.8, 12]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>
        {/* White & Blue Sneaker */}
        <group position={[0, -0.85, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.08, 0.2]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.03, 0]}>
            <boxGeometry args={[0.104, 0.025, 0.204]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.95, 0]}>
        {/* Navy Joggers Pants */}
        <mesh position={[0, -0.42, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.8, 12]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>
        {/* White & Blue Sneaker */}
        <group position={[0, -0.85, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.08, 0.2]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.03, 0]}>
            <boxGeometry args={[0.104, 0.025, 0.204]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
        </group>
      </group>

      {/* Soft Ground Contact Shadow Under Avatar */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 24]} />
        <meshBasicMaterial color="#0F172A" transparent opacity={0.35} />
      </mesh>

      {/* Floating Gamer Overhead Reticle in Avatar Mode */}
      {navigationMode === 'avatar' && (
        <group position={[0, 2.05, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[0.12, 0.14, 24]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          <Text
            position={[0, 0.16, 0]}
            fontSize={0.11}
            color="#172B4D"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            YOU
          </Text>
        </group>
      )}
    </group>
  );
}
