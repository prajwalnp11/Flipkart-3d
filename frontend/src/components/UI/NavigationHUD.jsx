import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  Volume2,
  VolumeX,
  ArrowLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Sliders,
  Grid,
  Gamepad2,
  Video,
  LogOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  Smartphone
} from 'lucide-react';

export function NavigationHUD() {
  const currentView = useStore((state) => state.currentView);
  const phase = useStore((state) => state.phase);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const currentFloor = useStore((state) => state.currentFloor);
  const targetFloor = useStore((state) => state.targetFloor);
  const selectedProduct = useStore((state) => state.selectedProduct);
  const selectedBrand = useStore((state) => state.selectedBrand);
  const enterBrandStore = useStore((state) => state.enterBrandStore);
  const exitBrandStore = useStore((state) => state.exitBrandStore);
  const navigationMode = useStore((state) => state.navigationMode);
  const toggleNavigationMode = useStore((state) => state.toggleNavigationMode);
  const interactionPrompt = useStore((state) => state.interactionPrompt);
  const quality = useStore((state) => state.quality || 'high');
  const setQuality = useStore((state) => state.setQuality);
  const isClassicView = useStore((state) => state.isClassicView || state.is2DFallback);
  const toggleClassicView = useStore((state) => state.toggleClassicView);

  const quickJumpToFloor = useStore((state) => state.quickJumpToFloor);
  const instantJumpToFloor = useStore((state) => state.instantJumpToFloor);
  const exitToExterior = useStore((state) => state.exitToExterior);
  const closeProductInspect = useStore((state) => state.closeProductInspect);
  const cart = useStore((state) => state.cart);
  const toggleCart = useStore((state) => state.toggleCart);
  const audioMuted = useStore((state) => state.audioMuted || state.isMuted);
  const toggleMute = useStore((state) => state.toggleMute);
  const setSearchOpen = (open) => useStore.setState({ searchOpen: open });

  // Only render when inside the mall
  const isExterior = currentView === 'EXTERIOR' || phase === 'exterior';
  if (isExterior) return null;

  const floorNumber = selectedFloor !== undefined ? selectedFloor : currentFloor;

  const floorTabs = [
    { num: 0, label: 'LOBBY', name: 'Grand Lobby & Categories' },
    { num: 1, label: '1F TECH', name: '1F: Mobiles & Electronics' },
    { num: 2, label: '2F FASHION', name: '2F: Fashion & Lifestyle' },
    { num: 3, label: '3F HOME', name: '3F: Home & Living' },
  ];

  const brandTabs = [
    { key: null, name: 'Concourse' },
    { key: 'apple', name: 'Apple' },
    { key: 'samsung', name: 'Samsung' },
    { key: 'google', name: 'Pixel' },
    { key: 'oneplus', name: 'OnePlus' },
    { key: 'xiaomi', name: 'Xiaomi' },
    { key: 'nothing', name: 'Nothing' },
  ];

  const currentFloorObj = floorTabs.find((f) => f.num === floorNumber) || floorTabs[0];

  const cycleQuality = () => {
    if (quality === 'high') setQuality('medium');
    else if (quality === 'medium') setQuality('low');
    else setQuality('high');
  };

  // Virtual key press trigger for on-screen joystick
  const triggerVirtualKey = (key) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key }));
    }, 120);
  };

  return (
    <>
      {/* ================= 1. TOP BAR (Minimal & Glassy) ================= */}
      <header className="absolute top-0 left-0 right-0 z-40 p-3 md:p-5 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Exit to Plaza & Logo */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={exitToExterior}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F172A]/90 backdrop-blur-md text-slate-300 hover:text-cyan-400 hover:bg-[#1E293B] transition-all text-xs font-bold border border-slate-700/80 shadow-sm hover:scale-105"
              title="Exit to Mall Plaza"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Plaza</span>
            </button>

            <div
              onClick={() => instantJumpToFloor(0)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0F172A]/90 backdrop-blur-md hover:bg-[#1E293B] cursor-pointer transition-all border border-slate-700/80 shadow-sm"
              title="Return to Grand Lobby"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2874F0] to-[#00F0FF] flex items-center justify-center shadow-glow-blue">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <span className="font-black text-sm text-white">Flipkart</span>
                <span className="font-black text-sm text-[#00F0FF]">3D</span>
              </div>
            </div>

            {/* Back to Concourse Button if inside a Brand Boutique */}
            {selectedBrand && (
              <button
                onClick={exitBrandStore}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30 transition-all text-xs font-bold shadow-sm"
                title="Exit Boutique back to Tech Avenue"
              >
                <LogOut className="w-3.5 h-3.5 text-amber-400" />
                <span>Exit {selectedBrand.toUpperCase()}</span>
              </button>
            )}
          </div>

          {/* Center: Floor Navigation Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-[#0F172A]/90 backdrop-blur-md pointer-events-auto shadow-sm border border-slate-700/80">
            {floorTabs.map((tab) => {
              const isCurrent =
                (currentView === 'SHOWROOM' || currentView === 'GROUND_LOBBY' || phase === 'lobby' || phase === 'showroom') &&
                floorNumber === tab.num;
              const isTarget = (currentView === 'IN_ELEVATOR' || phase === 'riding' || phase === 'toElevator') && targetFloor === tab.num;
              const active = isCurrent || isTarget;

              return (
                <button
                  key={tab.num}
                  onClick={() => instantJumpToFloor(tab.num)}
                  className={`relative px-3 md:px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-[#2874F0] to-[#00F0FF] text-white shadow-glow-blue'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-semibold'
                  }`}
                  title={tab.name}
                >
                  <span>{tab.label}</span>
                  {isTarget && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-flipkart-yellow animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Avatar Mode Toggle, Search, Mute & Cart */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Free Avatar Walk vs Guided Tour Toggle (Section 4) */}
            <button
              onClick={toggleNavigationMode}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                navigationMode === 'avatar'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-glow-blue'
                  : 'bg-[#0F172A]/90 backdrop-blur-md text-slate-300 hover:bg-[#1E293B] border-slate-700/80'
              }`}
              title="Toggle Avatar Walk Mode (WASD) vs Cinematic Guided Mode"
            >
              {navigationMode === 'avatar' ? (
                <>
                  <Gamepad2 className="w-4 h-4 text-white" />
                  <span className="hidden md:inline">Avatar Walk (WASD)</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span className="hidden md:inline">Guided Tour</span>
                </>
              )}
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0F172A]/90 backdrop-blur-md text-slate-300 hover:text-cyan-400 hover:bg-[#1E293B] transition-all text-xs font-bold border border-slate-700/80 shadow-sm hover:scale-105"
              title="Search Products across Mall"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Search</span>
            </button>

            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl bg-[#0F172A]/90 backdrop-blur-md text-slate-300 hover:text-cyan-400 hover:bg-[#1E293B] transition-all border border-slate-700/80 shadow-sm"
              title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2874F0] to-[#00B4D8] hover:from-[#1D4ED8] hover:to-[#00F0FF] text-white font-bold text-xs shadow-glow-blue transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cart.total_items > 0 && (
                <span className="px-1.5 py-0.5 text-[11px] font-black rounded-full bg-flipkart-yellow text-navy-dark shadow-sm">
                  {cart.total_items}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ================= FLOOR 1 BRAND STORE CONCOURSE BAR (Section 6) ================= */}
        {floorNumber === 1 && !selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mt-2 flex justify-center pointer-events-auto"
          >
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#070B14]/90 backdrop-blur-xl border border-cyan-500/30 shadow-xl overflow-x-auto max-w-full">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase px-2 hidden sm:inline">
                BRAND STORES:
              </span>
              {brandTabs.map((brand) => {
                const isSelected = selectedBrand === brand.key;
                return (
                  <button
                    key={brand.key || 'all'}
                    onClick={() => {
                      if (brand.key) enterBrandStore(brand.key);
                      else exitBrandStore();
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-cyan-500 text-black shadow-glow-blue'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {brand.name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </header>

      {/* ================= 2. PROXIMITY INTERACTION BANNER ('E') ================= */}
      <AnimatePresence>
        {interactionPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
          >
            <button
              onClick={interactionPrompt.action}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-cyan-400 shadow-glow-blue text-white font-black text-sm hover:scale-105 transition-all group"
            >
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2874F0] to-[#00F0FF] flex items-center justify-center font-mono text-xs shadow-md text-white">
                E
              </span>
              <span>{interactionPrompt.text}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 3. ON-SCREEN AVATAR VIRTUAL D-PAD (Section 4) ================= */}
      {navigationMode === 'avatar' && !selectedProduct && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center pointer-events-auto bg-[#070B14]/85 backdrop-blur-xl p-3 rounded-3xl border border-slate-700/80 shadow-2xl">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase mb-1">
            AVATAR CONTROLS
          </span>
          <div className="grid grid-cols-3 gap-1.5 w-32 h-32 items-center justify-items-center">
            <div />
            <button
              onMouseDown={() => triggerVirtualKey('w')}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white flex items-center justify-center font-black shadow-md active:scale-95 transition-all"
              title="Walk Forward (W)"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <div />

            <button
              onMouseDown={() => triggerVirtualKey('a')}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white flex items-center justify-center font-black shadow-md active:scale-95 transition-all"
              title="Turn Left (A)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onMouseDown={() => triggerVirtualKey('s')}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white flex items-center justify-center font-black shadow-md active:scale-95 transition-all"
              title="Walk Backward (S)"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <button
              onMouseDown={() => triggerVirtualKey('d')}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white flex items-center justify-center font-black shadow-md active:scale-95 transition-all"
              title="Turn Right (D)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= 4. BOTTOM-LEFT: LOCATION & BREADCRUMBS CHIP ================= */}
      <div className="absolute bottom-6 left-6 z-40 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#0F172A]/90 backdrop-blur-md border border-slate-700/80 shadow-lg text-xs font-bold pointer-events-auto text-slate-300"
        >
          {/* Mall Plaza Link */}
          <button
            onClick={exitToExterior}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mall</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />

          {/* Current Floor Link */}
          <button
            onClick={() => {
              if (selectedProduct) closeProductInspect();
              else quickJumpToFloor(floorNumber);
            }}
            className={`hover:text-cyan-400 transition-colors ${
              !selectedProduct && !selectedBrand ? 'text-cyan-400 font-extrabold' : 'text-slate-300'
            }`}
          >
            {currentFloorObj.name}
          </button>

          {/* Active Brand Boutique Crumb */}
          {selectedBrand && !selectedProduct && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-cyan-400 font-extrabold uppercase">
                {selectedBrand} Store
              </span>
            </>
          )}

          {/* Active Product Crumb */}
          {selectedProduct && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-cyan-400 font-extrabold truncate max-w-[140px] md:max-w-[200px]">
                {selectedProduct.name}
              </span>
            </>
          )}
        </motion.div>
      </div>

      {/* ================= 5. BOTTOM-RIGHT: CONTEXT ACTIONS ================= */}
      <div className="absolute bottom-6 right-6 md:right-44 z-40 pointer-events-none flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 pointer-events-auto"
        >
          {/* 2D / 3D Toggle */}
          <button
            onClick={toggleClassicView}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F172A]/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-cyan-400 hover:bg-[#1E293B] text-xs font-bold shadow-md transition-all hover:scale-105"
            title="Switch between 3D Mall & 2D Store Grid"
          >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{isClassicView ? '3D View' : '2D Store'}</span>
          </button>

          {/* Performance Quality Preset Indicator */}
          <button
            onClick={cycleQuality}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F172A]/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-cyan-400 hover:bg-[#1E293B] text-xs font-bold shadow-md transition-all"
            title="Toggle Graphics Quality (High / Medium / Low)"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase text-[11px] font-black">{quality}</span>
          </button>
        </motion.div>
      </div>
    </>
  );
}

export default NavigationHUD;
