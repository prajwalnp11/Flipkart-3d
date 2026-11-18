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
import { InteractiveHotspots } from '../ProductFeatures/InteractiveHotspots';
import { RotateCw, RefreshCw } from 'lucide-react';

function ProductRenderer({ modelType, color, features }) {
  const renderModel = () => {
    switch (modelType) {
      case 'smartphone':
        return <SmartphoneModel color={color} />;
      case 'laptop':
        return <LaptopModel color={color} />;
      case 'headphones':
        return <HeadphonesModel color={color} />;
      case 'smartwatch':
        return <SmartwatchModel color={color} />;
      case 'shoe':
        return <SneakerModel color={color} />;
      case 'sofa':
        return <SofaModel color={color} />;
      case 'television':
        return <TelevisionModel color={color} />;
      case 'refrigerator':
        return <RefrigeratorModel color={color} />;
      case 'washing_machine':
        return <WashingMachineModel color={color} />;
      default:
        return <SmartphoneModel color={color} />;
    }
  };

  return (
    <group position={[0, 0, 0]}>
      <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.18}>
        {renderModel()}
      </Float>
      <InteractiveHotspots features={features} />
      {/* Soft natural contact shadow on white studio ground */}
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

export function Product3DCanvas() {
  const selectedProduct = useStore((state) => state.selectedProduct);
  const inspectionColor = useStore((state) => state.inspectionColor);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef();

  const modelType = selectedProduct?.model_3d?.model_type || 'smartphone';
  const color = inspectionColor || '#C2A385';
  const features = selectedProduct?.features || [];

  // Camera presets
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
    <div className="relative w-full h-full bg-[#F5F8FE]">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#F5F8FE']} />

        {/* Studio Light Theme Illumination */}
        <hemisphereLight skyColor="#FFFFFF" groundColor="#E2E8F0" intensity={1.1} />
        <ambientLight intensity={0.65} color="#FFFFFF" />

        <directionalLight
          position={[6, 9, 6]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          color="#FFFFFF"
        />
        <directionalLight position={[-6, 5, -6]} intensity={0.6} color="#BAE6FD" />
        <directionalLight position={[0, -4, 4]} intensity={0.3} color="#FFFFFF" />

        <ProductRenderer
          modelType={modelType}
          color={color}
          features={features}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={1.4}
          maxDistance={5.5}
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
          dampingFactor={0.05}
          enableDamping
          touches={{
            ONE: 1, // TOUCH_ROTATE
            TWO: 2, // TOUCH_DOLLY_PAN
          }}
        />
      </Canvas>

      {/* Floating 360 Inspection Controls HUD (Light Theme) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl shadow-glass-light pointer-events-auto border border-slate-200">
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
