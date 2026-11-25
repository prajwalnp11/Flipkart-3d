import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { InteractiveProductPedestal } from './InteractiveProductPedestal';
import { getCarraraMarbleTexture, getCarraraMarbleRoughnessTexture } from '../../utils/marbleTextures';

// Clothing Display Rack with Hanging Garments
function ClothingRack({ position, rotation = [0, 0, 0] }) {
  const clothesColors = ['#1E293B', '#EC4899', '#2563EB', '#D97706', '#059669'];

  return (
    <group position={position} rotation={rotation}>
      {/* Heavy Brushed Steel Base */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[3.2, 0.1, 0.8]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Chrome Vertical Support Posts */}
      {[-1.4, 1.4].map((x, idx) => (
        <mesh key={idx} position={[x, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2.3, 16]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* Chrome Horizontal Clothes Rail */}
      <mesh position={[0, 2.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 2.9, 16]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Hanging Garments on Rail */}
      {clothesColors.map((color, idx) => {
        const xPos = -1.1 + idx * 0.55;
        return (
          <group key={idx} position={[xPos, 1.45, 0]}>
            {/* Triangular Gold Hanger */}
            <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.18, 0.02, 3]} />
              <meshStandardMaterial color="#FFE500" metalness={0.8} />
            </mesh>
            {/* Hanging Blazer / Dress Fabric */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.12, 1.4, 0.42]} />
              <meshStandardMaterial color={color} roughness={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* Rack Overhead Label */}
      <Text position={[0, 2.65, 0]} fontSize={0.15} color="#172B4D" fontWeight={900}>
        DESIGNER COLLECTION 2026
      </Text>
    </group>
  );
}

// Fashion Accessories Table (Designer Sunglasses, Belts & Watches)
function AccessoriesDisplayTable({ position }) {
  return (
    <group position={position}>
      {/* White Gloss Table Base */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.9, 1.4]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.15} />
      </mesh>
      {/* Magenta Edge Trim */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[3.02, 0.08, 1.42]} />
        <meshBasicMaterial color="#EC4899" />
      </mesh>

      {/* Overhead Sign */}
      <group position={[0, 2.8, 0]}>
        <mesh>
          <boxGeometry args={[2.4, 0.45, 0.06]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.2, 0.02]}>
          <boxGeometry args={[2.4, 0.04, 0.04]} />
          <meshBasicMaterial color="#EC4899" />
        </mesh>
        <Text position={[0, 0, 0.04]} fontSize={0.16} color="#172B4D" fontWeight={900}>
          FASHION ACCESSORIES
        </Text>
      </group>

      {/* Accessory 1: Luxury Sunglasses on Acrylic Riser */}
      <group position={[-0.85, 0.95, 0]}>
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.6, 0.12, 0.35]} />
          <meshPhysicalMaterial color="#BAE6FD" transmission={0.9} transparent opacity={0.4} />
        </mesh>
        {/* Sunglasses Frames */}
        <mesh position={[0, 0.16, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 16]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.22, 0.16, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 16]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
        </mesh>
        <Text position={[0, 0.32, 0]} fontSize={0.09} color="#172B4D" fontWeight={800}>
          Gucci Aviators
        </Text>
      </group>

      {/* Accessory 2: Luxury Leather Belt Coil with Gold Buckle */}
      <group position={[0.85, 0.95, 0]}>
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 24]} />
          <meshStandardMaterial color="#78350F" roughness={0.4} />
        </mesh>
        {/* Gold Buckle */}
        <mesh position={[0, 0.1, 0.2]}>
          <boxGeometry args={[0.18, 0.14, 0.04]} />
          <meshStandardMaterial color="#FFE500" metalness={0.95} roughness={0.1} />
        </mesh>
        <Text position={[0, 0.32, 0]} fontSize={0.09} color="#172B4D" fontWeight={800}>
          Hermès Leather Belt
        </Text>
      </group>
    </group>
  );
}

export function FashionShowroom({ floorY = 16 }) {
  const products = useStore((state) => state.products);
  const productsLoading = useStore((state) => state.productsLoading);
  const productsError = useStore((state) => state.productsError);

  // Dynamically filter Floor 2 products from Django API
  const floor2Products = useMemo(
    () => products.filter((p) => (p.floor_number !== undefined ? p.floor_number : p.floor) === 2),
    [products]
  );

  // Group dynamically by fashion sub-department/model type
  const apparelProducts = floor2Products.filter((p) => {
    const mt = (p.model_3d?.model_type || p.model_3d_type || '').toLowerCase();
    const cat = (p.category_name || p.category?.name || '').toLowerCase();
    return mt === 'mannequin' || cat.includes('apparel') || cat.includes('fashion');
  });
  const sneakerProducts = floor2Products.filter((p) => {
    const mt = (p.model_3d?.model_type || p.model_3d_type || '').toLowerCase();
    const cat = (p.category_name || p.category?.name || '').toLowerCase();
    return mt === 'shoe' || mt === 'sneaker' || cat.includes('shoe') || cat.includes('sneaker');
  });
  const luxuryProducts = floor2Products.filter(
    (p) => !apparelProducts.includes(p) && !sneakerProducts.includes(p)
  );
  // Ensure handbag items inside Fashion & Apparel also appear in Luxury Gallery if not in apparel
  const leftIslandProducts = apparelProducts.filter(
    (p) => (p.model_3d?.model_type || p.model_3d_type || '').toLowerCase() !== 'handbag'
  );
  const centerLuxuryProducts = [
    ...luxuryProducts,
    ...apparelProducts.filter(
      (p) => (p.model_3d?.model_type || p.model_3d_type || '').toLowerCase() === 'handbag'
    )
  ];

  // Luxury Carrara Marble Textures for Haute Couture Runway Concourse
  const marbleTexture = useMemo(() => getCarraraMarbleTexture(6, 5), []);
  const marbleRoughness = useMemo(() => getCarraraMarbleRoughnessTexture(6, 5), []);

  return (
    <group position={[0, floorY, 0]}>
      {/* ================= 1. RUNWAY MARBLE FLOOR ================= */}
      {/* Carrara Polished Marble Base */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 28]} />
        <meshStandardMaterial
          map={marbleTexture}
          roughnessMap={marbleRoughness}
          roughness={0.12}
          metalness={0.1}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* Central Haute Couture Polished Obsidian Runway */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[4.2, 20]} />
          <meshStandardMaterial color="#0B0F19" roughness={0.08} metalness={0.35} />
        </mesh>
        {/* Champagne Gold Flanking Runway Rails */}
        {[-2.15, 2.15].map((x, idx) => (
          <mesh key={idx} position={[x, -0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 20]} />
            <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
          </mesh>
        ))}
      </group>

      {/* Subtle Rose Gold Peripheral Circular Inlay */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.2, 13.35, 64]} />
        <meshStandardMaterial color="#C5A880" metalness={0.88} roughness={0.2} />
      </mesh>

      {/* Warm Runway Overhead Spotlights */}
      {[-4, 0, 4].map((z, idx) => (
        <pointLight key={idx} position={[0, 5.5, z]} intensity={1.5} distance={7} color="#FFF8E7" />
      ))}

      {/* ================= 2. MAIN BOUTIQUE HEADER BILLBOARD ================= */}
      <group position={[0, 5.8, -7.15]}>
        <mesh>
          <boxGeometry args={[14, 1.4, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.12} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.65, 0.02]}>
          <boxGeometry args={[14, 0.08, 0.06]} />
          <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh position={[0, -0.65, 0.02]}>
          <boxGeometry args={[14, 0.04, 0.04]} />
          <meshStandardMaterial color="#EC4899" />
        </mesh>
        <Text
          position={[0, 0.18, 0.06]}
          fontSize={0.38}
          color="#0F172A"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          FASHION & LIFESTYLE BOUTIQUE
        </Text>
        <Text
          position={[0, -0.25, 0.06]}
          fontSize={0.17}
          color="#EC4899"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          HAUTE COUTURE • SNEAKER VAULT • DESIGNER BAGS • RACKS • WATCHES & ACCESSORIES
        </Text>
      </group>

      {/* Loading / Error / Empty State */}
      {productsLoading && floor2Products.length === 0 ? (
        <Text position={[0, 2.2, 0]} fontSize={0.28} color="#EC4899" fontWeight={900}>
          Loading Fashion & Lifestyle Collection...
        </Text>
      ) : productsError && floor2Products.length === 0 ? (
        <Text position={[0, 2.2, 0]} fontSize={0.24} color="#F43F5E" fontWeight={800}>
          Unable to load Fashion Catalog ({productsError})
        </Text>
      ) : floor2Products.length === 0 ? (
        <Text position={[0, 2.2, 0]} fontSize={0.26} color="#64748B" fontWeight={800}>
          No Fashion products currently stocked
        </Text>
      ) : (
        <>
          {/* ================= 3. ARMANI EXCHANGE & COUTURE ISLAND ================= */}
          <group position={[-5.8, 0, -1.0]}>
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[4.4, 0.5, 2.2]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.14} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[4.44, 0.05, 2.24]} />
              <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
            </mesh>
            <Text position={[0, 2.9, -0.8]} fontSize={0.18} color="#0F172A" fontWeight={900}>
              ARMANI EXCHANGE COUTURE
            </Text>

            {leftIslandProducts.map((prod, idx) => {
              const posX = (idx - (leftIslandProducts.length - 1) / 2) * 2.1;
              return (
                <InteractiveProductPedestal
                  key={prod.id || prod.slug}
                  product={prod}
                  position={[posX, 0.5, 0]}
                  worldPosition={[-5.8 + posX, 0.5, -1.0]}
                  scale={0.55}
                  accentColor="#EC4899"
                  pedestalType="cylinder"
                />
              );
            })}
          </group>

          {/* ================= 4. NIKE SNEAKER VAULT ISLAND ================= */}
          <group position={[5.8, 0, -1.0]}>
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[4.4, 0.5, 2.2]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.14} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[4.44, 0.05, 2.24]} />
              <meshBasicMaterial color="#2874F0" />
            </mesh>
            <Text position={[0, 2.9, -0.8]} fontSize={0.18} color="#0F172A" fontWeight={900}>
              NIKE SNEAKER VAULT
            </Text>

            {sneakerProducts.map((prod, idx) => {
              const posX = (idx - (sneakerProducts.length - 1) / 2) * 2.1;
              return (
                <InteractiveProductPedestal
                  key={prod.id || prod.slug}
                  product={prod}
                  position={[posX, 0.5, 0]}
                  worldPosition={[5.8 + posX, 0.5, -1.0]}
                  scale={0.55}
                  accentColor="#2874F0"
                  pedestalType="cylinder"
                />
              );
            })}
          </group>

          {/* ================= 5. LUXURY CLOTHING DISPLAY RACK (LEFT WING) ================= */}
          <ClothingRack position={[-11.5, 0, 2.5]} rotation={[0, Math.PI / 2, 0]} />

          {/* ================= 6. ACCESSORIES & SUNGLASSES TABLE (RIGHT WING) ================= */}
          <AccessoriesDisplayTable position={[11.5, 0, 2.5]} />

          {/* ================= 7. CENTER LUXURY HANDBAG & BEAUTY SHOWCASES ================= */}
          {centerLuxuryProducts.map((prod, idx) => {
            const posX = (idx - (centerLuxuryProducts.length - 1) / 2) * 3.6;
            const accent = idx % 2 === 0 ? '#EC4899' : '#F43F5E';
            return (
              <group key={prod.id || prod.slug} position={[posX, 0, 2.2]}>
                <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[1.1, 1.1, 0.9, 32]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.14} metalness={0.18} />
                </mesh>
                <mesh position={[0, 0.05, 0]}>
                  <cylinderGeometry args={[1.13, 1.13, 0.08, 32]} />
                  <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.18} />
                </mesh>
                <InteractiveProductPedestal
                  product={prod}
                  position={[0, 0.95, 0]}
                  worldPosition={[posX, 0.95, 2.2]}
                  scale={0.65}
                  accentColor={accent}
                  pedestalType="cylinder"
                />
              </group>
            );
          })}
        </>
      )}
    </group>
  );
}
