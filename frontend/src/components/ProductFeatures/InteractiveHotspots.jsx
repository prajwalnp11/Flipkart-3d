import React from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { Camera, Tv, Cpu, BatteryCharging, Volume2, Zap, Shield, Sun, Feather, Activity, Smile, ShieldCheck, Monitor, Sliders, X } from 'lucide-react';

const iconMap = {
  Camera,
  Tv,
  Cpu,
  BatteryCharging,
  Volume2,
  Zap,
  Shield,
  Sun,
  Feather,
  Activity,
  Smile,
  ShieldCheck,
  Monitor,
  Sliders
};

export function InteractiveHotspots({ features = [] }) {
  const activeHotspot = useStore((state) => state.activeHotspot);
  const setActiveHotspot = useStore((state) => state.setActiveHotspot);

  if (!features || features.length === 0) return null;

  return (
    <group>
      {features.map((feat) => {
        const pos = feat.hotspot_position || { x: 0, y: 0, z: 0 };
        const position = [pos.x || 0, pos.y || 0, pos.z || 0];
        const isActive = activeHotspot?.id === feat.id || activeHotspot?.name === feat.name;
        const IconComponent = iconMap[feat.icon] || Cpu;

        return (
          <group key={feat.id || feat.name} position={position}>
            <Html center distanceFactor={7} zIndexRange={[100, 0]}>
              <div className="relative group cursor-pointer pointer-events-auto">
                {/* Pulsing Hotspot Marker Button (Light Theme) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(isActive ? null : feat);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-flipkart-blue text-white shadow-glow-blue scale-110 ring-4 ring-blue-300'
                      : 'bg-white text-flipkart-blue hover:bg-flipkart-blue hover:text-white border-2 border-flipkart-blue shadow-lg hover:scale-110'
                  }`}
                  title={feat.title}
                >
                  <IconComponent className="w-4 h-4" />
                  {/* Ping Animation Wave */}
                  <span className="absolute inset-0 rounded-full bg-blue-500 opacity-40 animate-ping pointer-events-none" />
                </button>

                {/* Hotspot Info Popup Overlay (Light Theme Glassmorphic Card) */}
                {isActive && (
                  <div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 bg-white/95 backdrop-blur-xl border border-blue-200/80 p-4 rounded-2xl shadow-2xl z-50 text-left animate-in fade-in zoom-in-95 duration-200 text-[#172B4D]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-blue-50 rounded-lg text-flipkart-blue border border-blue-100">
                          <IconComponent className="w-4 h-4" />
                        </span>
                        <h4 className="font-extrabold text-sm text-[#172B4D] leading-tight">
                          {feat.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => setActiveHotspot(null)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {feat.badge_text && (
                      <span className="inline-block mb-2 px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-blue-50 text-flipkart-blue border border-blue-200">
                        {feat.badge_text}
                      </span>
                    )}

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
      })}
    </group>
  );
}
