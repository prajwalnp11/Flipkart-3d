import React from 'react';
import { motion } from 'framer-motion';
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
  Grid
} from 'lucide-react';

export function NavigationHUD() {
  const currentView = useStore((state) => state.currentView);
  const phase = useStore((state) => state.phase);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const currentFloor = useStore((state) => state.currentFloor);
  const targetFloor = useStore((state) => state.targetFloor);
  const selectedProduct = useStore((state) => state.selectedProduct);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const quality = useStore((state) => state.quality || 'high');
  const setQuality = useStore((state) => state.setQuality);
  const isClassicView = useStore((state) => state.isClassicView || state.is2DFallback);
  const toggleClassicView = useStore((state) => state.toggleClassicView);

  const quickJumpToFloor = useStore((state) => state.quickJumpToFloor);
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

  const currentFloorObj = floorTabs.find((f) => f.num === floorNumber) || floorTabs[0];

  const cycleQuality = () => {
    if (quality === 'high') setQuality('medium');
    else if (quality === 'medium') setQuality('low');
    else setQuality('high');
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-700 hover:text-flipkart-blue hover:bg-white transition-all text-xs font-bold border border-slate-200/80 shadow-sm hover:scale-105"
              title="Exit to Mall Plaza"
            >
              <ArrowLeft className="w-4 h-4 text-flipkart-blue" />
              <span className="hidden sm:inline">Plaza</span>
            </button>

            <div
              onClick={() => quickJumpToFloor(0)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md hover:bg-white cursor-pointer transition-all border border-slate-200/80 shadow-sm"
              title="Return to Grand Lobby"
            >
              <div className="w-7 h-7 rounded-lg bg-flipkart-blue flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <span className="font-black text-sm text-navy-dark">Flipkart</span>
                <span className="font-black text-sm text-flipkart-blue">3D</span>
              </div>
            </div>
          </div>

          {/* Center: Floor Navigation Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-white/90 backdrop-blur-md pointer-events-auto shadow-sm border border-slate-200/90">
            {floorTabs.map((tab) => {
              const isCurrent =
                (currentView === 'SHOWROOM' || currentView === 'GROUND_LOBBY' || phase === 'lobby' || phase === 'showroom') &&
                floorNumber === tab.num;
              const isTarget = (currentView === 'IN_ELEVATOR' || phase === 'riding' || phase === 'toElevator') && targetFloor === tab.num;
              const active = isCurrent || isTarget;

              return (
                <button
                  key={tab.num}
                  onClick={() => quickJumpToFloor(tab.num)}
                  className={`relative px-3 md:px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    active
                      ? 'bg-flipkart-blue text-white shadow-md'
                      : 'text-slate-600 hover:text-flipkart-blue hover:bg-blue-50/60 font-semibold'
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

          {/* Right: Search, Mute & Cart */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-700 hover:text-flipkart-blue hover:bg-white transition-all text-xs font-bold border border-slate-200/80 shadow-sm hover:scale-105"
              title="Search Products across Mall"
            >
              <Search className="w-4 h-4 text-flipkart-blue" />
              <span className="hidden md:inline">Search</span>
            </button>

            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-700 hover:text-flipkart-blue hover:bg-white transition-all border border-slate-200/80 shadow-sm"
              title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-flipkart-blue" />}
            </button>

            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-flipkart-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
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
      </header>

      {/* ================= 2. BOTTOM-LEFT: LOCATION & BREADCRUMBS CHIP (UX Principle #3 & #6) ================= */}
      <div className="absolute bottom-6 left-6 z-40 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg text-xs font-bold pointer-events-auto text-slate-600"
        >
          {/* Mall Plaza Link */}
          <button
            onClick={exitToExterior}
            className="hover:text-flipkart-blue transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-flipkart-blue" />
            <span>Mall</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

          {/* Current Floor Link */}
          <button
            onClick={() => {
              if (selectedProduct) closeProductInspect();
              else quickJumpToFloor(floorNumber);
            }}
            className={`hover:text-flipkart-blue transition-colors ${
              !selectedProduct ? 'text-flipkart-blue font-extrabold' : 'text-slate-600'
            }`}
          >
            {currentFloorObj.name}
          </button>

          {/* Active Product Crumb */}
          {selectedProduct && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-flipkart-blue font-extrabold truncate max-w-[140px] md:max-w-[200px]">
                {selectedProduct.name}
              </span>
            </>
          )}
        </motion.div>
      </div>

      {/* ================= 3. BOTTOM-RIGHT: CONTEXT ACTIONS (UX Principle #3) ================= */}
      <div className="absolute bottom-6 right-6 z-40 pointer-events-none flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 pointer-events-auto"
        >
          {/* 2D / 3D Toggle */}
          <button
            onClick={toggleClassicView}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-navy-dark hover:text-flipkart-blue hover:bg-white text-xs font-bold shadow-md transition-all hover:scale-105"
            title="Switch between 3D Mall & 2D Store Grid"
          >
            <Grid className="w-3.5 h-3.5 text-flipkart-blue" />
            <span className="hidden sm:inline">{isClassicView ? '3D View' : '2D Store'}</span>
          </button>

          {/* Performance Quality Preset Indicator */}
          <button
            onClick={cycleQuality}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-navy-dark hover:text-flipkart-blue hover:bg-white text-xs font-bold shadow-md transition-all"
            title="Toggle Graphics Quality (High / Medium / Low)"
          >
            <Sliders className="w-3.5 h-3.5 text-flipkart-blue" />
            <span className="uppercase text-[11px] font-black">{quality}</span>
          </button>
        </motion.div>
      </div>
    </>
  );
}

export default NavigationHUD;
