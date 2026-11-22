import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { AutomaticStoreDoors } from '../Entrance/AutomaticStoreDoors';
import { SmartphoneModel } from '../ProductViewer/Models3D/SmartphoneModel';
import { LaptopModel } from '../ProductViewer/Models3D/LaptopModel';
import { SmartwatchModel } from '../ProductViewer/Models3D/SmartwatchModel';
import { HeadphonesModel } from '../ProductViewer/Models3D/HeadphonesModel';
import { SpeakerModel } from '../ProductViewer/Models3D/SpeakerModel';
import { EarbudsModel } from '../ProductViewer/Models3D/EarbudsModel';
import { CameraModel } from '../ProductViewer/Models3D/CameraModel';
import { TabletModel } from '../ProductViewer/Models3D/TabletModel';

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

      {/* Floating Info Tag */}
      <group position={[0, -0.15, 0.52]}>
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

// Brand Boutique Facade Card on Tech Avenue Concourse
function BrandStorefrontPortal({ position, rotation, brandKey, name, tagline, color, logoColor, onEnter }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position} rotation={rotation}>
      {/* Store Exterior Building Structure */}
      <mesh position={[0, 2.5, -0.2]} castShadow>
        <boxGeometry args={[6.4, 5.0, 0.4]} />
        <meshStandardMaterial color="#0F172A" roughness={0.25} metalness={0.8} />
      </mesh>

      {/* Brand Fascia Canopy */}
      <mesh position={[0, 4.4, 0.1]}>
        <boxGeometry args={[6.2, 0.9, 0.6]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Brand Glowing Neon Perimeter Edge */}
      <mesh position={[0, 4.86, 0.42]}>
        <boxGeometry args={[6.2, 0.06, 0.06]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Brand 3D Name Sign */}
      <Text
        position={[0, 4.45, 0.45]}
        fontSize={0.42}
        color={logoColor || '#FFFFFF'}
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        letterSpacing={0.08}
      >
        {name.toUpperCase()}
      </Text>

      {/* Slogan */}
      <Text
        position={[0, 4.08, 0.45]}
        fontSize={0.14}
        color={color}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {tagline}
      </Text>

      {/* Automatic Glass Doors */}
      <AutomaticStoreDoors
        position={[0, 0, 0]}
        width={3.4}
        height={3.2}
        isOpen={hovered}
        brandName={name}
        brandColor={color}
        onTriggerEnter={onEnter}
      />

      {/* Clickable Proximity Floor Hotspot */}
      <group
        position={[0, 0.05, 1.8]}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={onEnter}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.8, 1.2]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.35 : 0.15} />
        </mesh>
        <Text
          position={[0, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.18}
          color={hovered ? '#FFE500' : '#FFFFFF'}
          fontWeight={900}
        >
          ENTER {name.toUpperCase()} STORE
        </Text>
      </group>
    </group>
  );
}

export function ElectronicsShowroom({ floorY = 8 }) {
  const products = useStore((state) => state.products);
  const selectedBrand = useStore((state) => state.selectedBrand);
  const enterBrandStore = useStore((state) => state.enterBrandStore);
  const exitBrandStore = useStore((state) => state.exitBrandStore);

  // Filter products by brand when inside a brand store
  const appleProducts = products.filter((p) => p.brand?.toLowerCase() === 'apple');
  const samsungProducts = products.filter((p) => p.brand?.toLowerCase() === 'samsung');
  const googleProducts = products.filter((p) => p.brand?.toLowerCase() === 'google');
  const oneplusProducts = products.filter((p) => p.brand?.toLowerCase() === 'oneplus');
  const xiaomiProducts = products.filter((p) => p.brand?.toLowerCase() === 'xiaomi');
  const nothingProducts = products.filter((p) => p.brand?.toLowerCase() === 'nothing');

  // Active Brand Store Data
  const BRAND_CONFIGS = {
    apple: {
      name: 'Apple',
      tagline: 'Titanium Innovation • Pro Performance',
      themeColor: '#0284C7',
      floorColor: '#F8FAFC',
      accentColor: '#C2A385',
      products: appleProducts
    },
    samsung: {
      name: 'Samsung Galaxy',
      tagline: 'Galaxy AI Is Here • 200MP Quad Tele',
      themeColor: '#2874F0',
      floorColor: '#0F172A',
      accentColor: '#38BDF8',
      products: samsungProducts
    },
    google: {
      name: 'Google Pixel',
      tagline: 'Engineered by Google • Gemini Built-In',
      themeColor: '#EA4335',
      floorColor: '#F5F5F0',
      accentColor: '#34A853',
      products: googleProducts
    },
    oneplus: {
      name: 'OnePlus',
      tagline: 'Never Settle • 100W SUPERVOOC & Hasselblad',
      themeColor: '#EB0029',
      floorColor: '#18181B',
      accentColor: '#EB0029',
      products: oneplusProducts
    },
    xiaomi: {
      name: 'Xiaomi Leica',
      tagline: 'Co-Engineered with Leica • 1-inch Optical Beast',
      themeColor: '#FF6900',
      floorColor: '#1E293B',
      accentColor: '#FF6900',
      products: xiaomiProducts
    },
    nothing: {
      name: 'Nothing',
      tagline: 'Pure Glyph Design • Dot-Matrix Futurism',
      themeColor: '#FFFFFF',
      floorColor: '#111827',
      accentColor: '#00F0FF',
      products: nothingProducts
    }
  };

  const currentBrandConfig = selectedBrand ? BRAND_CONFIGS[selectedBrand] : null;

  return (
    <group position={[0, floorY, 0]}>
      {/* ================= MODE A: TECH AVENUE (BRAND CONCOURSE) ================= */}
      {!selectedBrand && (
        <group>
          {/* Reflective Concourse Marble Floor */}
          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[38, 30]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.12} metalness={0.25} />
          </mesh>

          {/* Central Blue Neon Concourse Guide Ribbons */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[5.2, 5.35, 48]} />
            <meshBasicMaterial color="#2874F0" />
          </mesh>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[11.5, 11.65, 48]} />
            <meshBasicMaterial color="#0284C7" />
          </mesh>

          {/* Grand Concourse Entrance Billboard */}
          <group position={[0, 5.8, -12.5]}>
            <mesh>
              <boxGeometry args={[16, 1.4, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.65, 0.02]}>
              <boxGeometry args={[16, 0.1, 0.08]} />
              <meshBasicMaterial color="#2874F0" />
            </mesh>
            <Text position={[0, 0.18, 0.08]} fontSize={0.38} color="#172B4D" fontWeight={900}>
              TECH AVENUE – FLAGSHIP BRAND CONCOURSE
            </Text>
            <Text position={[0, -0.25, 0.08]} fontSize={0.16} color="#2874F0" fontWeight={700}>
              SELECT A BRAND STOREFRONT TO ENTER ITS EXCLUSIVE SHOWROOM
            </Text>
          </group>

          {/* ================= 6 INDIVIDUAL BRAND STOREFRONTS (Section 6) ================= */}
          {/* 1. Apple Flagship Storefront */}
          <BrandStorefrontPortal
            position={[-7.5, 0, -5.5]}
            rotation={[0, Math.PI / 6, 0]}
            brandKey="apple"
            name="Apple"
            tagline="Titanium Innovation • Pro Performance"
            color="#0284C7"
            logoColor="#FFFFFF"
            onEnter={() => enterBrandStore('apple')}
          />

          {/* 2. Samsung Galaxy Storefront */}
          <BrandStorefrontPortal
            position={[7.5, 0, -5.5]}
            rotation={[0, -Math.PI / 6, 0]}
            brandKey="samsung"
            name="Samsung Galaxy"
            tagline="Galaxy AI Is Here • 200MP Quad Tele"
            color="#2874F0"
            logoColor="#38BDF8"
            onEnter={() => enterBrandStore('samsung')}
          />

          {/* 3. Google Pixel Studio */}
          <BrandStorefrontPortal
            position={[-8.5, 0, 3.5]}
            rotation={[0, Math.PI / 3, 0]}
            brandKey="google"
            name="Google Pixel"
            tagline="Engineered by Google • Gemini Built-In"
            color="#EA4335"
            logoColor="#FFFFFF"
            onEnter={() => enterBrandStore('google')}
          />

          {/* 4. OnePlus Experience Store */}
          <BrandStorefrontPortal
            position={[8.5, 0, 3.5]}
            rotation={[0, -Math.PI / 3, 0]}
            brandKey="oneplus"
            name="OnePlus"
            tagline="Never Settle • 100W SUPERVOOC Flash"
            color="#EB0029"
            logoColor="#FFFFFF"
            onEnter={() => enterBrandStore('oneplus')}
          />

          {/* 5. Xiaomi Leica Gallery */}
          <BrandStorefrontPortal
            position={[0, 0, -11.5]}
            rotation={[0, 0, 0]}
            brandKey="xiaomi"
            name="Xiaomi Leica"
            tagline="Co-Engineered with Leica 1-inch Optics"
            color="#FF6900"
            logoColor="#FFFFFF"
            onEnter={() => enterBrandStore('xiaomi')}
          />

          {/* 6. Nothing Concept Store */}
          <BrandStorefrontPortal
            position={[0, 0, 9.5]}
            rotation={[0, Math.PI, 0]}
            brandKey="nothing"
            name="Nothing"
            tagline="Transparent Glyph Futurism"
            color="#00F0FF"
            logoColor="#FFFFFF"
            onEnter={() => enterBrandStore('nothing')}
          />
        </group>
      )}

      {/* ================= MODE B: EXCLUSIVE BRAND BOUTIQUE (Section 6) ================= */}
      {selectedBrand && currentBrandConfig && (
        <group>
          {/* Custom Brand Showroom Floor */}
          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[26, 22]} />
            <meshStandardMaterial
              color={currentBrandConfig.floorColor}
              roughness={0.15}
              metalness={0.3}
            />
          </mesh>

          {/* Brand Overhead Billboard & Header Sign */}
          <group position={[0, 5.4, -7.5]}>
            <mesh>
              <boxGeometry args={[13, 1.3, 0.08]} />
              <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.6, 0.02]}>
              <boxGeometry args={[13, 0.08, 0.06]} />
              <meshBasicMaterial color={currentBrandConfig.themeColor} />
            </mesh>
            <Text
              position={[0, 0.16, 0.06]}
              fontSize={0.4}
              color={currentBrandConfig.accentColor}
              fontWeight={900}
              letterSpacing={0.06}
            >
              {currentBrandConfig.name.toUpperCase()} BOUTIQUE
            </Text>
            <Text
              position={[0, -0.26, 0.06]}
              fontSize={0.15}
              color="#94A3B8"
              fontWeight={700}
            >
              {currentBrandConfig.tagline}
            </Text>
          </group>

          {/* Back to Concourse Interactive Portal */}
          <group position={[0, 0, 8.5]}>
            <AutomaticStoreDoors
              position={[0, 0, 0]}
              width={3.4}
              height={3.0}
              isOpen={false}
              brandName="EXIT TO TECH AVENUE"
              brandColor="#2874F0"
              onTriggerEnter={exitBrandStore}
            />
          </group>

          {/* Brand Product Island Counters (Strictly that Brand's Catalog) */}
          <group position={[0, 0, 0]}>
            {/* White Gloss Island Display Counter */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[7.2, 0.9, 2.4]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.12} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[7.24, 0.08, 2.44]} />
              <meshBasicMaterial color={currentBrandConfig.themeColor} />
            </mesh>

            {/* Display Products of this Brand */}
            {currentBrandConfig.products.length > 0 ? (
              currentBrandConfig.products.slice(0, 3).map((prod, idx) => {
                const posX = (idx - (Math.min(currentBrandConfig.products.length, 3) - 1) / 2) * 2.2;
                return (
                  <InteractiveDisplayItem
                    key={prod.id || prod.slug}
                    product={prod}
                    position={[posX, 0.9, 0]}
                    label={prod.name}
                    brand={prod.brand}
                    price={`₹${Number(prod.price).toLocaleString('en-IN')}`}
                    scale={0.52}
                  >
                    <SmartphoneModel color={prod.model_3d?.color_options?.[0]?.hex || currentBrandConfig.accentColor} />
                  </InteractiveDisplayItem>
                );
              })
            ) : (
              <Text position={[0, 1.2, 0]} fontSize={0.25} color="#172B4D" fontWeight={900}>
                Flagship Devices on Display
              </Text>
            )}
          </group>
        </group>
      )}
    </group>
  );
}
