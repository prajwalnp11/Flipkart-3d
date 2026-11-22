import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import {
  ShoppingBag,
  ArrowRight,
  Volume2,
  VolumeX,
  Sparkles,
  Building2,
  FastForward,
  Smartphone,
  Layers,
  Shirt,
  Armchair,
  Compass
} from 'lucide-react';

export function WelcomeOverlay() {
  const currentView = useStore((state) => state.currentView);
  const phase = useStore((state) => state.phase);
  const enterStore = useStore((state) => state.enterStore);
  const skipCinematic = useStore((state) => state.skipCinematic);
  const quickJumpToFloor = useStore((state) => state.quickJumpToFloor);
  const instantJumpToFloor = useStore((state) => state.instantJumpToFloor);
  const instantJumpToBrand = useStore((state) => state.instantJumpToBrand);
  const enterBrandStore = useStore((state) => state.enterBrandStore);
  const openProductInspect = useStore((state) => state.openProductInspect);
  const products = useStore((state) => state.products);
  const audioMuted = useStore((state) => state.audioMuted || state.isMuted);
  const toggleMute = useStore((state) => state.toggleMute);

  // During cinematic entering sequence, render visible Skip button
  if (currentView === 'ENTERING' || phase === 'entering') {
    return (
      <div className="absolute top-6 right-6 z-50 pointer-events-auto">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={skipCinematic}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0F172A]/90 backdrop-blur-md border border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-cyan-600 transition-all font-bold text-xs shadow-glow-blue hover:scale-105"
        >
          <FastForward className="w-4 h-4 text-cyan-400" />
          <span>Skip Cinematic</span>
        </motion.button>
      </div>
    );
  }

  if (currentView !== 'EXTERIOR' && phase !== 'exterior') return null;

  const handleTeleportToBrand = (brandSlug) => {
    instantJumpToBrand(brandSlug);
  };

  const handleInspectExplodedPhone = () => {
    const s24 = products.find((p) => p.slug === 'samsung-galaxy-s24-ultra') || products[0];
    if (s24) {
      openProductInspect(s24);
      setTimeout(() => {
        useStore.getState().toggleExplodedView();
      }, 300);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10 z-40 bg-gradient-to-t from-[#070B14]/95 via-transparent to-[#070B14]/70">
      {/* ================= 1. TOP HEADER BAR ================= */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2874F0] to-[#00F0FF] flex items-center justify-center shadow-glow-blue border border-cyan-300/40">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">Flipkart</span>
              <span className="text-xl font-black text-[#00F0FF]">3D</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                PRO MALL
              </span>
            </div>
            <span className="text-[10px] tracking-widest font-bold text-slate-400 uppercase">
              Virtual Shopping Mall
            </span>
          </div>
        </div>

        <button
          onClick={toggleMute}
          className="p-3 rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl hover:bg-[#1E293B] text-slate-300 hover:text-cyan-400 transition-all shadow-md border border-slate-700/80"
          title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {audioMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-[#00F0FF]" />}
        </button>
      </div>

      {/* ================= 2. MAIN CENTER CALL-TO-ACTION ================= */}
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center pointer-events-auto my-auto py-4">
        {/* Futuristic Sub-Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-glow-blue"
        >
          <Sparkles className="w-4 h-4 text-[#00F0FF] animate-pulse" />
          <span>Cinematic Virtual Retail Experience</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight mb-3"
        >
          THE BUILDING <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#2874F0] to-[#FFE500]">
            IS THE NAVIGATION
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-sm md:text-base text-slate-300 font-medium max-w-xl mb-6 leading-relaxed"
        >
          Explore a 4-storey luxury shopping mall in real-time 3D. Visit flagship company stores, ride glass elevators, walk with a customer avatar, and inspect products with 360° exploded views.
        </motion.p>

        {/* Primary Action Button: ENTER 3D MALL */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={enterStore}
          className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#2874F0] to-[#00B4D8] hover:from-[#1D4ED8] hover:to-[#00F0FF] text-white font-black text-sm tracking-wide shadow-glow-blue transition-all mb-8 border border-cyan-300/50"
        >
          <Building2 className="w-5 h-5 text-[#FFE500]" />
          <span>ENTER 3D VIRTUAL MALL</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </motion.button>

        {/* Direct Access Quick-Jumper Bar (Section 2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex flex-col items-center gap-2"
        >
          <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
            OR DIRECT JUMP INTO A DEPARTMENT:
          </span>

          <div className="flex flex-wrap justify-center items-center gap-2 max-w-2xl">
            {/* Ground Atrium */}
            <button
              onClick={() => instantJumpToFloor(0)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 hover:bg-[#1E293B] border border-slate-700 hover:border-cyan-400 text-xs font-bold text-slate-200 hover:text-cyan-400 transition-all shadow-sm hover:scale-105"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ground Atrium</span>
            </button>

            {/* Samsung Store */}
            <button
              onClick={() => handleTeleportToBrand('samsung')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 hover:bg-[#1E293B] border border-blue-500/40 hover:border-blue-400 text-xs font-bold text-blue-300 hover:text-white transition-all shadow-sm hover:scale-105"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>Samsung Galaxy</span>
            </button>

            {/* Apple Store */}
            <button
              onClick={() => handleTeleportToBrand('apple')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 hover:bg-[#1E293B] border border-cyan-500/40 hover:border-cyan-400 text-xs font-bold text-cyan-300 hover:text-white transition-all shadow-sm hover:scale-105"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Apple Boutique</span>
            </button>

            {/* Fashion Floor */}
            <button
              onClick={() => instantJumpToFloor(2)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 hover:bg-[#1E293B] border border-pink-500/40 hover:border-pink-400 text-xs font-bold text-pink-300 hover:text-white transition-all shadow-sm hover:scale-105"
            >
              <Shirt className="w-3.5 h-3.5 text-pink-400" />
              <span>Fashion Runway</span>
            </button>

            {/* Home Living */}
            <button
              onClick={() => instantJumpToFloor(3)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 hover:bg-[#1E293B] border border-emerald-500/40 hover:border-emerald-400 text-xs font-bold text-emerald-300 hover:text-white transition-all shadow-sm hover:scale-105"
            >
              <Armchair className="w-3.5 h-3.5 text-emerald-400" />
              <span>Home & Living</span>
            </button>

            {/* Exploded 3D View */}
            <button
              onClick={handleInspectExplodedPhone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/50 text-xs font-black text-amber-300 hover:text-white transition-all shadow-sm hover:scale-105"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Exploded 3D View</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ================= 3. BOTTOM FOOTER ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2 pointer-events-auto border-t border-slate-800/80 pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            4 FLOORS READY
          </span>
          <span>•</span>
          <span>10 DEPARTMENTS</span>
          <span>•</span>
          <span>6 FLAGSHIP BRAND BOUTIQUES</span>
        </div>
        <p className="text-slate-500">
          Independent concept project. Not affiliated with Flipkart.
        </p>
      </div>
    </div>
  );
}

export default WelcomeOverlay;
