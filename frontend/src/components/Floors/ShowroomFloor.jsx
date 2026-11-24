import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { ProductPedestal } from '../Showroom/ProductPedestal';
import { Elevator3D } from '../Elevator/Elevator3D';
import { getCarraraMarbleTexture, getCarraraMarbleRoughnessTexture } from '../../utils/marbleTextures';

export function ShowroomFloor({ floorNumber = 1 }) {
  const products = useStore((state) => state.products);
  const floors = useStore((state) => state.floors);

  const marbleTexture = useMemo(() => getCarraraMarbleTexture(6, 6), []);
  const marbleRoughness = useMemo(() => getCarraraMarbleRoughnessTexture(6, 6), []);

  const currentFloorData = floors.find((f) => f.floor_number === floorNumber) || {
    name: floorNumber === 1 ? 'First Floor – Mobiles & Electronics' : floorNumber === 2 ? 'Second Floor – Fashion & Lifestyle' : 'Third Floor – Home & Living',
    theme_color: floorNumber === 1 ? '#0284C7' : floorNumber === 2 ? '#D946EF' : '#10B981',
    short_title: floorNumber === 1 ? 'MOBILES & ELECTRONICS' : floorNumber === 2 ? 'FASHION & LIFESTYLE' : 'HOME & LIVING',
    subtitle: 'Interactive 3D Showroom'
  };

  const floorProducts = products.filter(
    (p) => (p.floor_number !== undefined ? p.floor_number : p.floor) === floorNumber
  );

  // Pedestal layout grid coordinates (well-spaced and balanced in the showroom)
  const slotPositions = [
    [-4.5, 0, -1.2],
    [-1.5, 0, -2.2],
    [1.5, 0, -2.2],
    [4.5, 0, -1.2],
    [-3.0, 0, 2.0],
    [0.0, 0, 2.5],
    [3.0, 0, 2.0],
  ];

  const themeColor = currentFloorData.theme_color || '#2874F0';

  return (
    <group position={[0, 0, 0]}>
      {/* ================= BRIGHT LUXURY SHOWROOM ARCHITECTURE ================= */}
      {/* 1. Polished White Carrara Marble Floor with Natural Reflections */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 28]} />
        <meshStandardMaterial
          map={marbleTexture}
          roughnessMap={marbleRoughness}
          color="#FFFFFF"
          roughness={0.11}
          metalness={0.22}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Decorative Light Blue / Chrome Floor Accent Inlay Border */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[11.5, 11.65, 48]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[11.8, 11.88, 48]} />
        <meshBasicMaterial color="#E2E8F0" />
      </mesh>

      {/* 2. Bright White Architectural Ceiling with Recessed Light Troffers */}
      <mesh position={[0, 8.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, 28]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>

      {/* Modern Linear Ceiling Light Tracks */}
      {[-6, 0, 6].map((x, idx) => (
        <group key={idx} position={[x, 8.44, 0]}>
          <mesh>
            <boxGeometry args={[1.2, 0.08, 22]} />
            <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.9, 0.02, 21.6]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFFFF"
              emissiveIntensity={1.2}
            />
          </mesh>
          <pointLight position={[0, -0.4, 0]} intensity={1.8} distance={15} color="#FFFFFF" />
        </group>
      ))}

      {/* 3. Back Architectural Wall with Silver Elevator Entrance */}
      <mesh position={[0, 4.25, -7.5]} receiveShadow>
        <boxGeometry args={[32, 8.5, 0.5]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
      </mesh>

      {/* Subtle Flipkart Blue Accent Stripe along Back Wall Header */}
      <mesh position={[0, 7.8, -7.2]}>
        <boxGeometry args={[30, 0.15, 0.05]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>

      {/* Left Wall with Floor-to-Ceiling Panoramic Glass Windows */}
      <group position={[-15.8, 4.25, 0]}>
        {/* Wall Framing */}
        <mesh receiveShadow>
          <boxGeometry args={[0.4, 8.5, 28]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Large Window Cutouts with Sky Blue Glass */}
        {[-8, 0, 8].map((z, idx) => (
          <group key={idx} position={[0.1, 0, z]}>
            <mesh>
              <boxGeometry args={[0.1, 6.2, 5.5]} />
              <meshPhysicalMaterial
                color="#BAE6FD"
                transmission={0.88}
                transparent
                opacity={0.35}
                roughness={0.05}
                metalness={0.1}
                clearcoat={1.0}
              />
            </mesh>
            {/* White Window Mullion Frames */}
            <mesh>
              <boxGeometry args={[0.15, 6.3, 5.6]} />
              <meshStandardMaterial color="#F1F5F9" metalness={0.5} roughness={0.2} wireframe />
            </mesh>
            {/* Natural Sunlight streaming in through windows */}
            <pointLight position={[2.5, 2.0, 0]} intensity={1.6} distance={14} color="#FFFBEB" />
          </group>
        ))}
      </group>

      {/* Right Wall with Luxury Boutique Display Niches */}
      <group position={[15.8, 4.25, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.4, 8.5, 28]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {[-8, 0, 8].map((z, idx) => (
          <group key={idx} position={[-0.1, 0, z]}>
            <mesh>
              <boxGeometry args={[0.1, 6.2, 5.5]} />
              <meshPhysicalMaterial
                color="#BAE6FD"
                transmission={0.88}
                transparent
                opacity={0.35}
                roughness={0.05}
                metalness={0.1}
                clearcoat={1.0}
              />
            </mesh>
            <mesh>
              <boxGeometry args={[0.15, 6.3, 5.6]} />
              <meshStandardMaterial color="#F1F5F9" metalness={0.5} roughness={0.2} wireframe />
            </mesh>
            <pointLight position={[-2.5, 2.0, 0]} intensity={1.6} distance={14} color="#FFFBEB" />
          </group>
        ))}
      </group>

      {/* 4. Luxury Showroom Billboard Header on Back Wall */}
      <group position={[0, 6.0, -7.15]}>
        {/* White Translucent Glass Backing Plate */}
        <mesh>
          <boxGeometry args={[13, 1.4, 0.08]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.15}
            metalness={0.1}
          />
        </mesh>
        {/* Flipkart Blue Accent Top Bar */}
        <mesh position={[0, 0.65, 0.02]}>
          <boxGeometry args={[13, 0.1, 0.06]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        {/* Department Title in Crisp Dark Navy */}
        <Text
          position={[0, 0.18, 0.06]}
          fontSize={0.36}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {currentFloorData.name || currentFloorData.short_title}
        </Text>
        {/* Subtitle / Department Guidance in Flipkart Blue */}
        <Text
          position={[0, -0.25, 0.06]}
          fontSize={0.16}
          color="#2874F0"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          {currentFloorData.subtitle || 'TAP ANY 3D PRODUCT TO ROTATE & INSPECT IN DETAIL'}
        </Text>
      </group>

      {/* 5. Properly Illuminated Elevator Entrance with Glass Surroundings */}
      <Elevator3D position={[0, 0, -7.0]} />
      {/* Downlight specifically spotlighting the silver elevator doors */}
      <pointLight position={[0, 4.5, -6.0]} intensity={2.5} distance={8} color="#FFFFFF" />

      {/* 6. Decorative Architectural Showroom Columns */}
      {[-7.5, 7.5].map((x, idx) => (
        <group key={idx} position={[x, 4.25, 1.0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.45, 0.45, 8.5, 32]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
          </mesh>
          {/* Blue LED Accent Ring around Column */}
          <mesh position={[0, -2.8, 0]}>
            <cylinderGeometry args={[0.48, 0.48, 0.1, 32]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
        </group>
      ))}

      {/* 7. Luxury Indoor Decorative Planters */}
      {[-8.5, 8.5].map((x, idx) => (
        <group key={idx} position={[x, 0, -3.5]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.45, 0.9, 24]} />
            <meshStandardMaterial color="#F1F5F9" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.58, 0.58, 0.1, 24]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <sphereGeometry args={[0.65, 16, 16]} />
            <meshStandardMaterial color="#10B981" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 8. Render Floor Products on Premium White Gloss Pedestals */}
      {floorProducts.map((prod, idx) => {
        const pos = slotPositions[idx] || [idx * 2 - 4, 0, 0];
        return (
          <ProductPedestal
            key={prod.id || prod.slug}
            product={prod}
            position={pos}
          />
        );
      })}
    </group>
  );
}
