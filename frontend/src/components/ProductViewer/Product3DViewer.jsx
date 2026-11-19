import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { SmartphoneModel } from './Models3D/SmartphoneModel';
import { LaptopModel } from './Models3D/LaptopModel';
import { HeadphonesModel } from './Models3D/HeadphonesModel';
import { SmartwatchModel } from './Models3D/SmartwatchModel';
import { SneakerModel } from './Models3D/SneakerModel';
import { SofaModel } from './Models3D/SofaModel';
import { TelevisionModel } from './Models3D/TelevisionModel';
import { RefrigeratorModel } from './Models3D/RefrigeratorModel';
import { WashingMachineModel } from './Models3D/WashingMachineModel';
import { CameraModel } from './Models3D/CameraModel';
import { SpeakerModel } from './Models3D/SpeakerModel';
import { EarbudsModel } from './Models3D/EarbudsModel';
import { MannequinModel } from './Models3D/MannequinModel';
import { HandbagModel } from './Models3D/HandbagModel';
import { ProductHotspots } from './ProductHotspots';
import { RotateCw, RefreshCw, Compass } from 'lucide-react';

function DynamicProductMesh({ modelType, color }) {
  switch (modelType?.toLowerCase()) {
    case 'smartphone':
    case 'phone':
    case 'mobile':
      return <SmartphoneModel color={color} />;
    case 'laptop':
    case 'computer':
    case 'macbook':
      return <LaptopModel color={color} />;
    case 'headphones':
    case 'headset':
      return <HeadphonesModel color={color} />;
    case 'smartwatch':
    case 'watch':
      return <SmartwatchModel color={color} />;
    case 'shoe':
    case 'sneaker':
    case 'footwear':
      return <SneakerModel color={color} />;
    case 'sofa':
    case 'couch':
    case 'furniture':
      return <SofaModel color={color} />;
    case 'television':
    case 'tv':
      return <TelevisionModel color={color} />;
    case 'refrigerator':
    case 'fridge':
      return <RefrigeratorModel color={color} />;
    case 'washing_machine':
    case 'washer':
      return <WashingMachineModel color={color} />;
    case 'camera':
    case 'dslr':
      return <CameraModel color={color} />;
    case 'speaker':
    case 'bluetooth_speaker':
      return <SpeakerModel color={color} />;
    case 'earbuds':
    case 'airpods':
      return <EarbudsModel color={color} />;
    case 'mannequin':
    case 'apparel':
    case 'clothing':
      return <MannequinModel color={color} />;
    case 'handbag':
    case 'bag':
      return <HandbagModel color={color} />;
    default:
      return <SmartphoneModel color={color} />;
  }
}

function ProductViewerScene({ modelType, color, features }) {
  // Adjust scale based on product category for natural canvas framing
  const getCategoryScale = () => {
    switch (modelType?.toLowerCase()) {
      case 'television':
      case 'tv':
        return 0.85;
      case 'sofa':
        return 0.9;
      case 'refrigerator':
        return 0.78;
      case 'washing_machine':
        return 0.82;
      case 'camera':
        return 1.15;
      case 'speaker':
        return 1.25;
      case 'earbuds':
        return 1.45;
      case 'mannequin':
        return 0.82;
      case 'handbag':
        return 1.2;
      default:
        return 1.0;
    }
  };

  return (
    <group position={[0, 0, 0]} scale={getCategoryScale()}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.16}>
        <DynamicProductMesh modelType={modelType} color={color} />
      </Float>

      {/* Interactive 3D Hotspots on Product */}
      <ProductHotspots features={features} />

      {/* Realistic Soft Contact Shadow on Clean White Marble Studio Ground */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.35}
        scale={6}
        blur={2.0}
        far={4}
        color="#1E3A8A"
      />
    </group>
  );
}

export function Product3DViewer({ product: propProduct, className = '' }) {
  const storeProduct = useStore((state) => state.selectedProduct);
  const inspectionColor = useStore((state) => state.inspectionColor);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef();

  const product = propProduct || storeProduct;
  const modelType = product?.model_3d?.model_type || product?.model_3d_type || 'smartphone';
  const color = inspectionColor || product?.model_3d?.color_options?.[0]?.hex || '#2874F0';
  const features = product?.features || [];

  const setCameraAngle = (azimuth, polar) => {
    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(azimuth);
      controlsRef.current.setPolarAngle(polar);
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className={`relative w-full h-full bg-[#F5F8FE] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#F5F8FE']} />

        {/* Daylight Studio Lighting with Soft Contrast */}
        <hemisphereLight skyColor="#FFFFFF" groundColor="#E2E8F0" intensity={1.15} />
        <ambientLight intensity={0.6} color="#FFFFFF" />

        {/* Primary Key Light */}
        <directionalLight
          position={[6, 9, 6]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          color="#FFFFFF"
        />
        {/* Soft Sky Blue Rim Light */}
        <directionalLight position={[-6, 5, -6]} intensity={0.65} color="#BAE6FD" />
        {/* Under-Bounce Ground Light */}
        <directionalLight position={[0, -4, 4]} intensity={0.35} color="#FFFFFF" />

        <ProductViewerScene
          modelType={modelType}
          color={color}
          features={features}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={1.3}
          maxDistance={5.8}
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
          dampingFactor={0.05}
          enableDamping
          touches={{
            ONE: 1, // TOUCH_ROTATE
            TWO: 2  // TOUCH_DOLLY_PAN
          }}
        />
      </Canvas>

      {/* Floating 360° Inspection Toolbar (Light Theme Glassmorphic HUD) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl shadow-glass-light pointer-events-auto border border-slate-200">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            autoRotate
              ? 'bg-flipkart-blue text-white shadow-glow-blue'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Toggle 360 Auto-Rotate"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span>360° Auto</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-200 mx-1" />

        <button
          onClick={() => setCameraAngle(0, Math.PI / 2)}
          className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
          title="Front View"
        >
          Front
        </button>

        <button
          onClick={() => setCameraAngle(Math.PI, Math.PI / 2)}
          className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
          title="Back View"
        >
          Back
        </button>

        <button
          onClick={() => setCameraAngle(Math.PI / 2, Math.PI / 2)}
          className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
          title="Side View"
        >
          Side
        </button>

        <button
          onClick={() => setCameraAngle(0, 0.2)}
          className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
          title="Top View"
        >
          Top
        </button>

        <button
          onClick={() => setCameraAngle(Math.PI / 4, Math.PI / 3)}
          className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-1"
          title="Isometric Hero View"
        >
          <Compass className="w-3 h-3 text-flipkart-blue" />
          <span>45°</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-200 mx-1" />

        <button
          onClick={handleResetCamera}
          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
          title="Reset Camera Angle"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
