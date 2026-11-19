import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import {
  Camera,
  Monitor,
  Cpu,
  BatteryCharging,
  ShieldCheck,
  Volume2,
  Zap,
  Sun,
  Feather,
  Sliders,
  Sparkles,
  X,
  Info
} from 'lucide-react';

const HOTSPOT_ICONS = {
  camera: Camera,
  Camera: Camera,
  display: Monitor,
  Display: Monitor,
  screen: Monitor,
  processor: Cpu,
  Processor: Cpu,
  cpu: Cpu,
  battery: BatteryCharging,
  Battery: BatteryCharging,
  build: ShieldCheck,
  Build: ShieldCheck,
  durability: ShieldCheck,
  ShieldCheck: ShieldCheck,
  audio: Volume2,
  Volume2: Volume2,
  anc: Volume2,
  sound: Volume2,
  performance: Zap,
  Zap: Zap,
  cushion: Feather,
  panel: Monitor,
  sensor: Sparkles,
  default: Info
};

function SingleHotspotItem({ feat, isActive, onToggle }) {
  const haloRef = useRef();
  const IconComponent = HOTSPOT_ICONS[feat.icon] || HOTSPOT_ICONS[feat.name] || HOTSPOT_ICONS.default;
  const pos = feat.hotspot_position || { x: 0, y: 0, z: 0 };
  const position = [pos.x || 0, pos.y || 0, pos.z || 0];

  useFrame((_, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * (isActive ? 3.0 : 1.2);
    }
  });

  return (
    <group position={position}>
      {/* 3D Visual Halo Ring highlighting product component */}
      <mesh ref={haloRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial
          color={isActive ? '#FFE500' : '#2874F0'}
          transparent
          opacity={isActive ? 0.95 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* HTML Overlay with 3D Depth Clipping */}
      <Html center distanceFactor={6.5} zIndexRange={[100, 0]}>
        <div className="relative group cursor-pointer pointer-events-auto select-none">
          {/* Pulsing Hotspot Marker Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(feat);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              isActive
                ? 'bg-flipkart-blue text-white shadow-glow-blue scale-115 ring-4 ring-blue-300'
                : 'bg-white text-flipkart-blue hover:bg-flipkart-blue hover:text-white border-2 border-flipkart-blue shadow-lg hover:scale-110'
            }`}
            title={feat.title || feat.name}
          >
            <IconComponent className="w-4 h-4" />
            {/* Animated Pulse Ping */}
            <span className="absolute inset-0 rounded-full bg-blue-500 opacity-35 animate-ping pointer-events-none" />
          </button>

          {/* Contextual Hotspot Info Card Popup */}
          {isActive && (
            <div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 bg-white/95 backdrop-blur-xl border border-blue-200/90 p-4 rounded-2xl shadow-2xl z-50 text-left animate-in fade-in zoom-in-95 duration-200 text-[#172B4D]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-50 rounded-lg text-flipkart-blue border border-blue-100">
                    <IconComponent className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#172B4D] leading-tight">
                      {feat.title || feat.name}
                    </h4>
                    {feat.badge_text && (
                      <span className="inline-block mt-0.5 px-2 py-0.2 text-[9px] font-black tracking-wider uppercase rounded-full bg-blue-50 text-flipkart-blue border border-blue-200">
                        {feat.badge_text}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(null);
                  }}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {feat.description}
              </p>

              {feat.specs && Object.keys(feat.specs).length > 0 && (
                <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200 space-y-1">
                  {Object.entries(feat.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">{key}:</span>
                      <span className="font-bold text-[#172B4D]">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

export function ProductHotspots({ features = [] }) {
  const activeHotspot = useStore((state) => state.activeHotspot);
  const setActiveHotspot = useStore((state) => state.setActiveHotspot);

  if (!features || features.length === 0) return null;

  const handleToggle = (feat) => {
    if (!feat) {
      setActiveHotspot(null);
      return;
    }
    const isCurrent = activeHotspot?.id === feat.id || activeHotspot?.name === feat.name;
    setActiveHotspot(isCurrent ? null : feat);
  };

  return (
    <group>
      {features.map((feat) => {
        const isActive = activeHotspot?.id === feat.id || activeHotspot?.name === feat.name;
        return (
          <SingleHotspotItem
            key={feat.id || feat.name}
            feat={feat}
            isActive={isActive}
            onToggle={handleToggle}
          />
        );
      })}
    </group>
  );
}
