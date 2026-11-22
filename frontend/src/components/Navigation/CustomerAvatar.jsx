import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

/**
 * 3D Customer Avatar Component (Section 4)
 * Controllable third-person customer avatar with walking/idle procedural animations,
 * WASD / Arrow movement, turning, and proximity interaction handling ('E' key).
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
  const currentFloor = useStore((state) => state.currentFloor);
  const phase = useStore((state) => state.phase);
  const enterBrandStore = useStore((state) => state.enterBrandStore);
  const openProductInspect = useStore((state) => state.openProductInspect);
  const products = useStore((state) => state.products);

  // Position and movement state
  const pos = useRef(new THREE.Vector3(0, floorY, 8));
  const yaw = useRef(0);
  const walkCycle = useRef(0);
  const keysDown = useRef({});
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      // Ignore if user is inside an input/textarea
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

  useFrame((_, delta) => {
    // Sync base Y with active floor elevation
    pos.current.y = floorY;

    if (navigationMode !== 'avatar') {
      return;
    }

    const moveSpeed = 5.2 * delta;
    const turnSpeed = 2.8 * delta;
    let moving = false;

    // Turning left / right
    if (keysDown.current['a'] || keysDown.current['arrowleft']) {
      yaw.current += turnSpeed;
    }
    if (keysDown.current['d'] || keysDown.current['arrowright']) {
      yaw.current -= turnSpeed;
    }

    // Walking forward / backward
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    if (keysDown.current['w'] || keysDown.current['arrowup']) {
      pos.current.addScaledVector(forward, moveSpeed);
      moving = true;
    }
    if (keysDown.current['s'] || keysDown.current['arrowdown']) {
      pos.current.addScaledVector(forward, -moveSpeed * 0.65);
      moving = true;
    }

    // Boundary constraints for safety within the mall floor
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -14, 14);
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -12, 12);

    setIsMoving(moving);

    // Apply avatar transforms
    if (avatarGroupRef.current) {
      avatarGroupRef.current.position.copy(pos.current);
      avatarGroupRef.current.rotation.y = yaw.current;
    }

    // Procedural leg/arm swing walking cycle
    if (moving) {
      walkCycle.current += delta * 10;
      const legAngle = Math.sin(walkCycle.current) * 0.55;
      const armAngle = Math.cos(walkCycle.current) * 0.45;

      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle;
      if (torsoRef.current) torsoRef.current.position.y = 0.95 + Math.abs(Math.sin(walkCycle.current * 2)) * 0.04;
    } else {
      // Idle breathing
      const idle = Math.sin(Date.now() * 0.003) * 0.04;
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.1);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.1);
      if (torsoRef.current) torsoRef.current.position.y = 0.95 + idle;
    }

    // Sync with central store
    updateAvatarState([pos.current.x, pos.current.y, pos.current.z], yaw.current, moving);

    // ================= PROXIMITY DETECTION & INTERACTION ('E') =================
    // Brand Stores Proximity on Floor 1
    if (currentFloor === 1 && !selectedBrand) {
      const brandStores = [
        { brand: 'samsung', name: 'Samsung Galaxy Store', pos: [-7.5, 0] },
        { brand: 'apple', name: 'Apple Flagship Boutique', pos: [0, -3.5] },
        { brand: 'google', name: 'Google Pixel Studio', pos: [7.5, 0] },
        { brand: 'oneplus', name: 'OnePlus Experience Store', pos: [-7.5, 5.5] },
        { brand: 'nothing', name: 'Nothing Concept Store', pos: [7.5, 5.5] }
      ];

      let nearbyPrompt = null;
      for (const store of brandStores) {
        const dist = Math.hypot(pos.current.x - store.pos[0], pos.current.z - store.pos[1]);
        if (dist < 3.2) {
          nearbyPrompt = {
            text: `Press [E] to Enter ${store.name}`,
            action: () => enterBrandStore(store.brand)
          };
          break;
        }
      }

      setInteractionPrompt(nearbyPrompt);

      if (nearbyPrompt && keysDown.current['e']) {
        nearbyPrompt.action();
        keysDown.current['e'] = false;
      }
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
