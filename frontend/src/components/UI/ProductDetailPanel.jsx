import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Product3DCanvas } from '../ProductViewer/Product3DCanvas';
import {
  X,
  Star,
  ShieldCheck,
  RotateCcw,
  Truck,
  Heart,
  ShoppingCart,
  Zap,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export function ProductDetailPanel() {
  const currentView = useStore((state) => state.currentView);
  const selectedProduct = useStore((state) => state.selectedProduct);
  const closeProductInspect = useStore((state) => state.closeProductInspect);
  const inspectionColor = useStore((state) => state.inspectionColor);
  const setInspectionColor = useStore((state) => state.setInspectionColor);
  const selectedVariant = useStore((state) => state.selectedVariant);
  const setSelectedVariant = useStore((state) => state.setSelectedVariant);
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const setCheckoutOpen = useStore((state) => state.setCheckoutOpen);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'reviews'
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (currentView !== 'PRODUCT_INSPECT' || !selectedProduct) return null;

  const colorOptions = selectedProduct.model_3d?.color_options || [
    { name: 'Standard Color', hex: '#2874F0' }
  ];

  const variants = selectedProduct.variants || [];
  const specs = selectedProduct.specifications || {};
  const reviews = selectedProduct.reviews || [];

  const handleAddToCart = async () => {
    await addToCart(selectedProduct, selectedVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = async () => {
    await addToCart(selectedProduct, selectedVariant, 1);
    setCheckoutOpen(true);
  };

  const finalPrice = Number(selectedProduct.price) + (selectedVariant ? Number(selectedVariant.price_modifier || 0) : 0);

  return (
    <div className="absolute inset-0 z-50 flex flex-col md:flex-row bg-[#F5F8FE]/96 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
      {/* ================= LEFT / TOP: 3D INTERACTIVE CANVAS ================= */}
      <div className="relative flex-1 h-[50vh] md:h-full w-full">
        {/* Top Back / Close Button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={closeProductInspect}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 text-[#172B4D] hover:bg-white hover:text-flipkart-blue transition-all font-bold text-xs shadow-glass-light"
          >
            <X className="w-4 h-4" />
            <span>Return to Showroom</span>
          </button>
        </div>

        {/* 3D Product Canvas with OrbitControls & Hotspots */}
        <Product3DCanvas />
      </div>

      {/* ================= RIGHT / BOTTOM: SPECIFICATIONS & PURCHASE PANEL ================= */}
      <div className="w-full md:w-[480px] lg:w-[520px] h-[50vh] md:h-full flex flex-col bg-white/95 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-slate-200 shadow-2xl text-[#172B4D]">
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-5">
          {/* Header & Brand */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black tracking-wider uppercase text-flipkart-blue bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {selectedProduct.brand || 'Flipkart Select'}
              </span>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified 3D Model</span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-[#172B4D] leading-tight">
              {selectedProduct.name}
            </h2>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center gap-1 bg-emerald-600 text-white font-black text-xs px-2.5 py-0.5 rounded-md">
                <span>{selectedProduct.rating}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {Number(selectedProduct.review_count).toLocaleString()} Ratings & Verified Reviews
              </span>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#172B4D]">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              {selectedProduct.original_price && (
                <span className="text-sm line-through text-slate-400 font-semibold">
                  ₹{Number(selectedProduct.original_price).toLocaleString('en-IN')}
                </span>
              )}
              {selectedProduct.discount_percentage > 0 && (
                <span className="text-sm font-black text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded">
                  {selectedProduct.discount_percentage}% OFF
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Inclusive of all taxes & free warranty</p>
          </div>

          {/* Color Variants Switcher (Real-time 3D model material change) */}
          {colorOptions.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Available Colors: <span className="text-[#172B4D] font-black">{colorOptions.find(c => c.hex === inspectionColor)?.name || 'Default'}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {colorOptions.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setInspectionColor(c.hex)}
                    className={`group relative flex items-center gap-2 p-1.5 pr-3 rounded-xl border transition-all ${
                      inspectionColor === c.hex
                        ? 'border-flipkart-blue bg-blue-50/80 shadow-sm ring-2 ring-blue-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-md shadow-sm border border-slate-300"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs font-bold text-[#172B4D]">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Other Variants (Storage / Size) */}
          {variants.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Option:
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id || v.name}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-flipkart-blue bg-flipkart-blue text-white shadow-glow-blue'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span>{v.name}</span>
                    {Number(v.price_modifier) > 0 && (
                      <span className="ml-1 text-[10px] opacity-85">
                        (+₹{Number(v.price_modifier).toLocaleString('en-IN')})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Trust Badges */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
              <Truck className="w-5 h-5 text-flipkart-blue shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#172B4D]">{selectedProduct.delivery_estimate || 'FREE Delivery'}</p>
                <p className="text-[10px] text-slate-500">Fast Express Shipping</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <RotateCcw className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#172B4D]">{selectedProduct.return_policy || '7 Days Return'}</p>
                <p className="text-[10px] text-slate-500">Replacement Guarantee</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Overview, Specs, Reviews */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 pb-2.5 text-xs font-extrabold border-b-2 transition-all ${
                  activeTab === 'overview'
                    ? 'border-flipkart-blue text-flipkart-blue'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`flex-1 pb-2.5 text-xs font-extrabold border-b-2 transition-all ${
                  activeTab === 'specs'
                    ? 'border-flipkart-blue text-flipkart-blue'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 pb-2.5 text-xs font-extrabold border-b-2 transition-all ${
                  activeTab === 'reviews'
                    ? 'border-flipkart-blue text-flipkart-blue'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-3.5">
              {activeTab === 'overview' && (
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {selectedProduct.description}
                </p>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-2">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">{key}:</span>
                      <span className="text-[#172B4D] font-bold text-right max-w-[60%]">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-400">No reviews yet for this model.</p>
                  ) : (
                    reviews.map((r, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#172B4D]">{r.author_name}</span>
                          <span className="flex items-center text-emerald-600 font-black">
                            {r.rating} ★
                          </span>
                        </div>
                        <h5 className="font-bold text-[#172B4D] mb-0.5">{r.title}</h5>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= FIXED BOTTOM ACTION BAR ================= */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <button
            onClick={() => toggleWishlist(selectedProduct)}
            className="p-3.5 rounded-2xl border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-rose-500 hover:bg-slate-50 transition-all"
            title="Add to Wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>

          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 border transition-all ${
              addedAnimation
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-white hover:bg-slate-50 text-[#172B4D] border-2 border-slate-300 hover:border-flipkart-blue shadow-sm'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-flipkart-blue" />
            <span>{addedAnimation ? 'ADDED TO CART ✓' : 'ADD TO CART'}</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide bg-gradient-to-r from-flipkart-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-glow-blue flex items-center justify-center gap-2 border border-blue-400/40"
          >
            <Zap className="w-4 h-4 text-flipkart-yellow" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
}
