import React from 'react';
import { useStore } from '../../store/useStore';
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Search,
  Volume2,
  VolumeX,
  Layers,
  ArrowLeft,
  Compass
} from 'lucide-react';

export function NavigationHUD() {
  const currentView = useStore((state) => state.currentView);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const targetFloor = useStore((state) => state.targetFloor);
  const quickJumpToFloor = useStore((state) => state.quickJumpToFloor);
  const exitToExterior = useStore((state) => state.exitToExterior);
  const cart = useStore((state) => state.cart);
  const toggleCart = useStore((state) => state.toggleCart);
  const wishlist = useStore((state) => state.wishlist);
  const audioMuted = useStore((state) => state.audioMuted);
  const toggleMute = useStore((state) => state.toggleMute);
  const setSearchOpen = (open) => useStore.setState({ searchOpen: open });

  // Only render when inside the mall
  if (currentView === 'EXTERIOR') return null;

  const floorTabs = [
    { num: 0, label: 'LOBBY', title: 'Grand Lobby & Categories' },
    { num: 1, label: '1F TECH', title: 'Mobiles & Electronics' },
    { num: 2, label: '2F FASHION', title: 'Apparel & Footwear' },
    { num: 3, label: '3F HOME', title: 'Furniture & Living' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-40 p-3 md:p-5 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Exit button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={exitToExterior}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-slate-700 hover:text-flipkart-blue hover:bg-blue-50/70 transition-all text-xs font-bold border border-slate-200/80 shadow-sm"
            title="Exit to Mall Plaza"
          >
            <ArrowLeft className="w-4 h-4 text-flipkart-blue" />
            <span className="hidden sm:inline">Plaza</span>
          </button>

          <div
            onClick={() => quickJumpToFloor(0)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl glass-panel hover:bg-blue-50/70 cursor-pointer transition-all border border-slate-200/80 shadow-sm"
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

        {/* Center: Floor Navigation Quick-Jump Pill */}
        <div className="flex items-center p-1 rounded-2xl glass-panel pointer-events-auto shadow-glass-light border border-slate-200/90">
          {floorTabs.map((tab) => {
            const isCurrent = (currentView === 'SHOWROOM' || currentView === 'GROUND_LOBBY') && selectedFloor === tab.num;
            const isTarget = currentView === 'IN_ELEVATOR' && targetFloor === tab.num;
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
                title={tab.title}
              >
                <span>{tab.label}</span>
                {isTarget && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-flipkart-yellow animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Search, Audio, Wishlist & Cart */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl glass-panel text-slate-700 hover:text-flipkart-blue hover:bg-blue-50/70 transition-all text-xs font-bold border border-slate-200/80 shadow-sm"
            title="Search Products across Mall"
          >
            <Search className="w-4 h-4 text-flipkart-blue" />
            <span className="hidden md:inline">Search Mall</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl glass-panel text-slate-700 hover:text-flipkart-blue hover:bg-blue-50/70 transition-all border border-slate-200/80 shadow-sm"
            title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-flipkart-blue" />}
          </button>

          {/* Cart Trigger */}
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
  );
}
