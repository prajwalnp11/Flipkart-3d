import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { ShoppingBag, ArrowRight, Volume2, VolumeX, Sparkles, Building2, FastForward } from 'lucide-react';

export function WelcomeOverlay() {
  const currentView = useStore((state) => state.currentView);
  const phase = useStore((state) => state.phase);
  const enterStore = useStore((state) => state.enterStore);
  const skipCinematic = useStore((state) => state.skipCinematic);
  const audioMuted = useStore((state) => state.audioMuted);
  const toggleMute = useStore((state) => state.toggleMute);

  // During cinematic entering sequence, render visible Skip button (UX Principle #2)
  if (currentView === 'ENTERING' || phase === 'entering') {
    return (
      <div className="absolute top-6 right-6 z-50 pointer-events-auto">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={skipCinematic}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-navy-dark hover:text-flipkart-blue hover:bg-white transition-all font-bold text-xs shadow-lg hover:scale-105"
        >
          <FastForward className="w-4 h-4 text-flipkart-blue" />
          <span>Skip Cinematic</span>
        </motion.button>
      </div>
    );
  }

  if (currentView !== 'EXTERIOR' && phase !== 'exterior') return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-40 bg-gradient-to-t from-white/85 via-white/10 to-white/60">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-flipkart-blue to-blue-500 flex items-center justify-center shadow-md">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-navy-dark">Flipkart</span>
              <span className="text-xl font-black text-flipkart-blue">3D</span>
            </div>
            <span className="text-[10px] tracking-wider font-bold text-slate-500 uppercase">
              Virtual Shopping Mall
            </span>
          </div>
        </div>

        <button
          onClick={toggleMute}
          className="p-3 rounded-full glass-panel hover:bg-blue-50 text-slate-700 hover:text-flipkart-blue transition-all shadow-md border border-slate-200/80"
          title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {audioMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-flipkart-blue" />}
        </button>
      </div>

      {/* Main Center Call-to-Action */}
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center pointer-events-auto my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-flipkart-blue text-xs font-bold uppercase tracking-widest mb-6 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-flipkart-blue" />
          Next-Generation Virtual Retail
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl md:text-6xl font-black tracking-tight text-navy-dark leading-tight md:leading-none mb-4"
        >
          WELCOME TO THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-flipkart-blue via-blue-600 to-sky-600">
            FUTURE OF SHOPPING
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base md:text-xl text-slate-600 font-medium max-w-lg mb-8"
        >
          Experience Shopping in a New Dimension. Step inside our multi-storey 3D mall, take express elevators, and inspect products in 360°.
        </motion.p>

        {/* ENTER STORE Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          onClick={enterStore}
          className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-flipkart-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-lg tracking-wide shadow-glow-blue flex items-center gap-3 border border-blue-400 hover:shadow-xl transition-all"
        >
          <Building2 className="w-5 h-5 text-flipkart-yellow" />
          <span>ENTER STORE</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </motion.button>
      </div>

      {/* Bottom Disclaimer & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-2 text-xs text-slate-500 border-t border-slate-300/60 pt-4 pointer-events-auto">
        <p className="text-[11px] text-slate-500 font-medium">
          Independent concept project. Not affiliated with Flipkart.
        </p>
        <div className="flex items-center gap-4 text-slate-500 font-medium">
          <span>WebGL Powered</span>
          <span>•</span>
          <span>Real-time 3D Graphics</span>
          <span>•</span>
          <span>Full-Stack DRF & React</span>
        </div>
      </div>
    </div>
  );
}

export default WelcomeOverlay;
