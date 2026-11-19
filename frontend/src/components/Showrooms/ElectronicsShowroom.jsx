import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { SmartphoneModel } from '../ProductViewer/Models3D/SmartphoneModel';
import { LaptopModel } from '../ProductViewer/Models3D/LaptopModel';
import { SmartwatchModel } from '../ProductViewer/Models3D/SmartwatchModel';
import { HeadphonesModel } from '../ProductViewer/Models3D/HeadphonesModel';
import { SpeakerModel } from '../ProductViewer/Models3D/SpeakerModel';
import { EarbudsModel } from '../ProductViewer/Models3D/EarbudsModel';
import { CameraModel } from '../ProductViewer/Models3D/CameraModel';

// Interactive Product Table / Display Counter in the Showroom
function InteractiveDisplayItem({ product, position, rotation = [0, 0, 0], scale = 0.55, children, label, brand, price }) {
  const [hovered, setHovered] = useState(false);
  const openProductInspect = useStore((state) => state.openProductInspect);
  const haloRef = useRef();

  useFrame((_, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * (hovered ? 2.5 : 0.8);
    }
  });

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (product) openProductInspect(product);
      }}
    >
      {/* 3D Product Geometry on Stand */}
      <group scale={scale} position={[0, 0.45, 0]}>
        {children}
      </group>

      {/* Tilted Acrylic Display Stand */}
      <mesh position={[0, 0.15, 0]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.1, 0.7]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transmission={0.85}
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Glowing Interactive Halo Ring on Table Surface */}
      <mesh ref={haloRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.62, 32]} />
        <meshBasicMaterial
          color={hovered ? '#FFE500' : '#2874F0'}
          transparent
          opacity={hovered ? 0.95 : 0.5}
        />
      </mesh>

      {/* Floating Info Tag in Dark Navy */}
      <group position={[0, -0.15, 0.52]}>
        {/* White Glass Card */}
        <mesh>
          <boxGeometry args={[1.35, 0.42, 0.04]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.19, 0.02]}>
          <boxGeometry args={[1.35, 0.04, 0.02]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        <Text
          position={[0, 0.06, 0.03]}
          fontSize={0.095}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          {label || product?.name}
        </Text>
        <Text
          position={[0, -0.09, 0.03]}
          fontSize={0.08}
          color="#2874F0"
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
        >
          {price || (product ? `₹${Number(product.price).toLocaleString('en-IN')}` : '')}
        </Text>
      </group>
    </group>
  );
}

export function ElectronicsShowroom({ floorY = 8 }) {
  const products = useStore((state) => state.products);

  // Match products from store/catalog
  const iphone = products.find((p) => p.slug === 'iphone-16-pro-max');
  const macbook = products.find((p) => p.slug === 'macbook-pro-16-m4-max');
  const sonyHeadphones = products.find((p) => p.slug === 'sony-wh-1000xm5');
  const appleWatch = products.find((p) => p.slug === 'apple-watch-ultra-2');
  const cameraProd = products.find((p) => p.slug === 'sony-alpha-a7-iv') || {
    id: 101,
    name: 'Sony Alpha A7 IV Mirrorless Camera',
    slug: 'sony-alpha-a7-iv',
    brand: 'Sony',
    price: 242990,
    floor_number: 1,
    model_3d_type: 'camera'
  };
  const speakerProd = products.find((p) => p.slug === 'jbl-charge-5') || {
    id: 102,
    name: 'JBL Charge 5 Pro Bluetooth Speaker',
    slug: 'jbl-charge-5',
    brand: 'JBL',
    price: 15999,
    floor_number: 1,
    model_3d_type: 'speaker'
  };
  const earbudsProd = products.find((p) => p.slug === 'apple-airpods-pro-2') || {
    id: 103,
    name: 'Apple AirPods Pro 2 (USB-C)',
    slug: 'apple-airpods-pro-2',
    brand: 'Apple',
    price: 24900,
    floor_number: 1,
    model_3d_type: 'earbuds'
  };

  return (
    <group position={[0, floorY, 0]}>
      {/* ================= 1. CARPETED RUNWAY & WHITE MARBLE FLOORING ================= */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 28]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.2} />
      </mesh>
      {/* Polished Blue Ceramic Perimeter Ribbon */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.2, 13.4, 48]} />
        <meshBasicMaterial color="#2874F0" />
      </mesh>

      {/* ================= 2. DEPARTMENT MAIN HEADER BILLBOARD ================= */}
      <group position={[0, 5.8, -7.15]}>
        <mesh>
          <boxGeometry args={[14, 1.4, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.65, 0.02]}>
          <boxGeometry args={[14, 0.1, 0.06]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        <Text
          position={[0, 0.18, 0.06]}
          fontSize={0.38}
          color="#172B4D"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          ELECTRONICS & MOBILES SHOWROOM
        </Text>
        <Text
          position={[0, -0.25, 0.06]}
          fontSize={0.17}
          color="#2874F0"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          FLAGSHIP SMARTPHONES • PRO LAPTOPS • WEARABLES • AUDIO • 4K CAMERAS
        </Text>
      </group>

      {/* ================= 3. ZONE 1: SMARTPHONES PAVILION ================= */}
      <group position={[-5.5, 0, -1.0]}>
        {/* White Gloss Island Table with Blue LED Trim */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.9, 1.8]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.15} />
        </mesh>
        {/* Blue LED Underglow Trim */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[4.22, 0.08, 1.82]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        {/* Zone Overhead Sign */}
        <group position={[0, 3.2, 0]}>
          <mesh>
            <boxGeometry args={[2.8, 0.5, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.23, 0.02]}>
            <boxGeometry args={[2.8, 0.04, 0.04]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.18} color="#172B4D" fontWeight={900}>
            SMARTPHONES
          </Text>
        </group>

        {/* Display Item 1: iPhone 16 Pro Max (Desert Titanium) */}
        <InteractiveDisplayItem
          product={iphone}
          position={[-1.2, 0.9, 0]}
          label="iPhone 16 Pro Max"
          brand="Apple"
          scale={0.52}
        >
          <SmartphoneModel color="#C2A385" />
        </InteractiveDisplayItem>

        {/* Display Item 2: Galaxy S24 Ultra (Titanium Black) */}
        <InteractiveDisplayItem
          product={iphone}
          position={[0, 0.9, 0]}
          label="Galaxy S24 Ultra"
          brand="Samsung"
          scale={0.52}
        >
          <SmartphoneModel color="#1E293B" />
        </InteractiveDisplayItem>

        {/* Display Item 3: Pixel 9 Pro (Porcelain White) */}
        <InteractiveDisplayItem
          product={iphone}
          position={[1.2, 0.9, 0]}
          label="Google Pixel 9 Pro"
          brand="Google"
          scale={0.52}
        >
          <SmartphoneModel color="#F1F5F9" />
        </InteractiveDisplayItem>
      </group>

      {/* ================= 4. ZONE 2: LAPTOPS & COMPUTERS ================= */}
      <group position={[5.5, 0, -1.0]}>
        {/* Modern Wood & White Presentation Desk */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.9, 1.8]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[4.22, 0.08, 1.82]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        {/* Zone Overhead Sign */}
        <group position={[0, 3.2, 0]}>
          <mesh>
            <boxGeometry args={[2.8, 0.5, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.23, 0.02]}>
            <boxGeometry args={[2.8, 0.04, 0.04]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.18} color="#172B4D" fontWeight={900}>
            LAPTOPS & COMPUTERS
          </Text>
        </group>

        {/* Display Item 1: MacBook Pro 16" (Space Black) */}
        <InteractiveDisplayItem
          product={macbook}
          position={[-1.1, 0.9, 0]}
          label={'MacBook Pro 16" M4'}
          brand="Apple"
          scale={0.5}
        >
          <LaptopModel color="#1C1D1F" />
        </InteractiveDisplayItem>

        {/* Display Item 2: Ultrabook Studio (Silver) */}
        <InteractiveDisplayItem
          product={macbook}
          position={[1.1, 0.9, 0]}
          label="Pro Studio Ultra 16"
          brand="Dell"
          scale={0.5}
        >
          <LaptopModel color="#E2E8F0" />
        </InteractiveDisplayItem>
      </group>

      {/* ================= 5. ZONE 3: SMARTWATCHES SHOWCASE ================= */}
      <group position={[0, 0, 1.8]}>
        {/* Cylindrical Glass Showcase Stand */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.9, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.22, 1.22, 0.08, 32]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        {/* Glass Dome Cover */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 0.7, 32]} />
          <meshPhysicalMaterial color="#BAE6FD" transmission={0.92} transparent opacity={0.3} roughness={0.05} />
        </mesh>

        {/* Watch on Showcase: Apple Watch Ultra 2 */}
        <InteractiveDisplayItem
          product={appleWatch}
          position={[0, 0.95, 0]}
          label="Apple Watch Ultra 2"
          brand="Apple"
          scale={0.65}
        >
          <SmartwatchModel color="#B5AEA4" />
        </InteractiveDisplayItem>
      </group>

      {/* ================= 6. ZONE 4: STUDIO AUDIO (LEFT WING) ================= */}
      <group position={[-11.5, 0, 2.5]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.9, 3.2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[2.82, 0.08, 3.22]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        {/* Audio Zone Sign */}
        <group position={[0, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[2.4, 0.45, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.16} color="#172B4D" fontWeight={900}>
            STUDIO AUDIO
          </Text>
        </group>

        {/* Sony Headphones */}
        <InteractiveDisplayItem
          product={sonyHeadphones}
          position={[0, 0.9, -0.8]}
          label="Sony WH-1000XM5"
          brand="Sony"
          scale={0.55}
        >
          <HeadphonesModel color="#1B263B" />
        </InteractiveDisplayItem>

        {/* Wireless Earbuds */}
        <InteractiveDisplayItem
          product={earbudsProd}
          position={[0, 0.9, 0.8]}
          label="AirPods Pro 2"
          brand="Apple"
          scale={0.7}
        >
          <EarbudsModel color="#FFFFFF" />
        </InteractiveDisplayItem>
      </group>

      {/* ================= 7. ZONE 5: PRO CAMERAS (RIGHT WING) ================= */}
      <group position={[11.5, 0, 2.5]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.9, 3.2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[2.82, 0.08, 3.22]} />
          <meshBasicMaterial color="#2874F0" />
        </mesh>
        {/* Cameras Zone Sign */}
        <group position={[0, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[2.4, 0.45, 0.06]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.16} color="#172B4D" fontWeight={900}>
            PRO CAMERAS
          </Text>
        </group>

        {/* Sony Alpha Camera */}
        <InteractiveDisplayItem
          product={cameraProd}
          position={[0, 0.9, -0.8]}
          label="Sony Alpha A7 IV"
          brand="Sony"
          scale={0.52}
        >
          <CameraModel color="#18181B" />
        </InteractiveDisplayItem>

        {/* Bluetooth Speaker */}
        <InteractiveDisplayItem
          product={speakerProd}
          position={[0, 0.9, 0.8]}
          label="JBL Charge 5"
          brand="JBL"
          scale={0.52}
        >
          <SpeakerModel color="#2874F0" />
        </InteractiveDisplayItem>
      </group>
    </group>
  );
}
