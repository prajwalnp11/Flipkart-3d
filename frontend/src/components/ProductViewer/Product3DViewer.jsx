import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { DynamicProductModel, resolveModelType } from './DynamicProductModel';
import { ProductHotspots } from './ProductHotspots';
import { RotateCw, RefreshCw, Compass, Layers, Check, Info, X } from 'lucide-react';

const EXPLODED_COMPONENT_SPECS = {
  front_glass: {
    title: 'Ceramic Shield Front Glass',
    badge: 'MOHS LEVEL 7',
    desc: 'Nano-scale ceramic crystals embedded into ultra-pure glass through a dual-ion exchange infusion, providing 4x drop performance resistance.'
  },
  display: {
    title: 'Super Retina XDR OLED Panel',
    badge: '120Hz PROMOTION',
    desc: 'Border-less flexible OLED display with ultra-narrow 1.15mm bezels, 2000 nits outdoor peak brightness, and True Tone color management.'
  },
  frame: {
    title: 'Aerospace Grade 5 Titanium Frame',
    badge: 'GRADE 5 Ti-6Al-4V',
    desc: 'Sub-millimeter CNC milled structural enclosure engineered with an internal 100% recycled aluminum thermal substructure for sustained performance.'
  },
  motherboard: {
    title: 'Main Logic Board (3nm Silicon SoC)',
    badge: '3nm ARCHITECTURE',
    desc: 'Stacked dual-layer motherboard with vapor chamber copper heat spreader, 16-core Neural Engine, LPDDR5X unified memory, and 5G NR modem.'
  },
  battery: {
    title: 'High-Density Lithium-Cobalt Cell',
    badge: '4,685 mAh',
    desc: 'Custom-sculpted L-shaped cell with 100% recycled cobalt cathode, 33-hour continuous video playback, and 30W Qi2 / MagSafe wireless fast charging.'
  },
  camera: {
    title: '48MP Pro Triple Camera System',
    badge: '5x OPTICAL PERISCOPE',
    desc: 'Quad-pixel sensor with 2nd-generation sensor-shift optical image stabilisation (OIS), 100% focus pixels, and 4K 120 fps Dolby Vision HDR.'
  },
  speakers: {
    title: 'Spatial Stereo Acoustic Chambers',
    badge: 'DOLBY ATMOS',
    desc: 'High-excursion stereo transducers paired with custom amplifiers for room-filling Spatial Audio and ultra-low distortion bass notes.'
  },
  charging_port: {
    title: 'USB-C 10Gb/s Controller & Flex Cable',
    badge: 'USB 3 CONTROLLER',
    desc: 'Ultra-durable titanium-reinforced USB-C port supporting 10Gb/s transfer speeds, 4K DisplayPort video output, and 45W Power Delivery.'
  },
  back_glass: {
    title: 'Matte Textured Glass & Qi2 Copper Coil',
    badge: 'SATIN MATTE FINISH',
    desc: 'Micro-etched tactile matte back panel featuring an embedded circular magnetic array and multi-strand copper induction coil for fast wireless charging.'
  }
};

function DynamicProductMesh({ modelType, color, isExploded }) {
  return (
    <DynamicProductModel
      modelType={modelType}
      color={color}
      isExploded={isExploded}
    />
  );
}

function ProductViewerScene({ modelType, color, features, isExploded }) {
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
      <Float speed={isExploded ? 0 : 1.5} rotationIntensity={isExploded ? 0 : 0.1} floatIntensity={isExploded ? 0 : 0.16}>
        <DynamicProductMesh modelType={modelType} color={color} isExploded={isExploded} />
      </Float>

      {/* Show Standard Hotspots only in non-exploded mode */}
      {!isExploded && <ProductHotspots features={features} />}

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
  const isExplodedView = useStore((state) => state.isExplodedView);
  const explosionProgress = useStore((state) => state.explosionProgress);
  const toggleExplodedView = useStore((state) => state.toggleExplodedView);
  const setExplosionProgress = useStore((state) => state.setExplosionProgress);
  const selectedExplodedComponent = useStore((state) => state.selectedExplodedComponent);
  const setSelectedExplodedComponent = useStore((state) => state.setSelectedExplodedComponent);

  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef();

  const product = propProduct || storeProduct;
  const modelType = resolveModelType(product);
  const color = inspectionColor || product?.model_3d?.color_options?.[0]?.hex || '#2874F0';
  const features = product?.features || [];

  const isPhone = ['smartphone', 'phone', 'mobile'].includes(modelType?.toLowerCase());
  const activeCompData = selectedExplodedComponent ? EXPLODED_COMPONENT_SPECS[selectedExplodedComponent] : null;

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
    <div className={`relative w-full h-full bg-[#070B14] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#070B14']} />

        {/* Studio Lighting with High Contrast */}
        <hemisphereLight skyColor="#1E3A8A" groundColor="#070B14" intensity={1.3} />
        <ambientLight intensity={0.7} color="#FFFFFF" />

        {/* Primary Key Light */}
        <directionalLight
          position={[6, 9, 6]}
          intensity={2.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
          color="#FFFFFF"
        />
        {/* Soft Electric Cyan Rim Light */}
        <directionalLight position={[-6, 5, -6]} intensity={0.9} color="#00F0FF" />
        {/* Royal Blue Under-Bounce Ground Light */}
        <directionalLight position={[0, -4, 4]} intensity={0.45} color="#2874F0" />

        <ProductViewerScene
          modelType={modelType}
          color={color}
          features={features}
          isExploded={isExplodedView}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={1.2}
          maxDistance={5.8}
          autoRotate={autoRotate && !isExplodedView}
          autoRotateSpeed={1.0}
          dampingFactor={0.05}
          enableDamping
          touches={{
            ONE: 1, // TOUCH_ROTATE
            TWO: 2  // TOUCH_DOLLY_PAN
          }}
        />
      </Canvas>

      {/* Floating Holographic Exploded Component Card (Section 9 & 10) */}
      {isExplodedView && activeCompData && (
        <div className="absolute top-6 left-6 max-w-sm bg-[#0F172A]/95 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-4 shadow-2xl z-20 transition-all animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/50 shadow-glow-blue">
              {activeCompData.badge}
            </span>
            <button
              onClick={() => setSelectedExplodedComponent(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="font-extrabold text-sm text-white mb-1">{activeCompData.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{activeCompData.desc}</p>
        </div>
      )}

      {/* Exploded View Control Bar (When Phone is Active) */}
      {isPhone && (
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#0F172A]/90 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-slate-700/80 z-10">
          <button
            onClick={toggleExplodedView}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isExplodedView
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-blue'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isExplodedView ? 'Assemble Model' : 'Exploded View'}</span>
          </button>

          {isExplodedView && (
            <div className="flex items-center gap-2 px-2 border-l border-slate-700">
              <span className="text-[11px] font-bold text-slate-300">Spread:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={explosionProgress}
                onChange={(e) => setExplosionProgress(parseFloat(e.target.value))}
                className="w-24 h-1.5 accent-cyan-400 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-cyan-300 w-8">
                {Math.round(explosionProgress * 100)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Floating 360° Inspection Toolbar (Cyber-Glass Theme) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#0F172A]/90 backdrop-blur-xl p-1.5 rounded-2xl shadow-2xl pointer-events-auto border border-slate-700/80 z-10">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            autoRotate && !isExplodedView
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-glow-blue'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle 360 Auto-Rotate"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate && !isExplodedView ? 'animate-spin' : ''}`} />
          <span>360° Auto</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-1" />

        <button
          onClick={() => setCameraAngle(0, Math.PI / 2)}
          className="px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          title="Front View"
        >
          Front
        </button>

        <button
          onClick={() => setCameraAngle(Math.PI, Math.PI / 2)}
          className="px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          title="Back View"
        >
          Back
        </button>

        <button
          onClick={() => setCameraAngle(Math.PI / 2, Math.PI / 2)}
          className="px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          title="Side View"
        >
          Side
        </button>

        <button
          onClick={() => setCameraAngle(0, 0.2)}
          className="px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          title="Top View"
        >
          Top
        </button>

        <button
          onClick={() => setCameraAngle(Math.PI / 4, Math.PI / 3)}
          className="px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all flex items-center gap-1"
          title="Isometric Hero View"
        >
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>45°</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-1" />

        <button
          onClick={handleResetCamera}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          title="Reset Camera Angle"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
