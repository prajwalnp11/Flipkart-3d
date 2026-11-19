import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  Star,
  ShieldCheck,
  RotateCcw,
  Truck,
  Heart,
  ShoppingCart,
  Zap,
  CheckCircle2,
  GitCompare,
  Check,
  Info
} from 'lucide-react';

export function ProductInformationPanel({ product: propProduct }) {
  const storeProduct = useStore((state) => state.selectedProduct);
  const inspectionColor = useStore((state) => state.inspectionColor);
  const setInspectionColor = useStore((state) => state.setInspectionColor);
  const selectedVariant = useStore((state) => state.selectedVariant);
  const setSelectedVariant = useStore((state) => state.setSelectedVariant);
  const addToCart = useStore((state) => state.addToCart);
  const wishlist = useStore((state) => state.wishlist || []);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const setCheckoutOpen = useStore((state) => state.setCheckoutOpen);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'reviews'
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [compared, setCompared] = useState(false);

  const selectedProduct = propProduct || storeProduct;
  if (!selectedProduct) return null;

  const colorOptions = selectedProduct.model_3d?.color_options || [
    { name: 'Standard Color', hex: '#2874F0' }
  ];

  const variants = selectedProduct.variants || [];
  const specs = selectedProduct.specifications || {};
  const reviews = selectedProduct.reviews || [];
  const isWishlisted = wishlist.some((item) => item.id === selectedProduct.id);

  const handleAddToCart = async () => {
    await addToCart(selectedProduct, selectedVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = async () => {
    await addToCart(selectedProduct, selectedVariant, 1);
    setCheckoutOpen(true);
  };

  const handleCompare = () => {
    setCompared(!compared);
  };

  const finalPrice =
    Number(selectedProduct.price) +
    (selectedVariant ? Number(selectedVariant.price_modifier || 0) : 0);

  return (
    <div className="w-full h-full flex flex-col bg-white/95 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-slate-200 shadow-2xl text-[#172B4D]">
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
              <span>{selectedProduct.rating || 4.8}</span>
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {Number(selectedProduct.review_count || 12480).toLocaleString()} Ratings & Verified Reviews
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
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Inclusive of all taxes & free brand warranty
          </p>
        </div>

        {/* Color Variants Switcher (Real-time 3D model material change) */}
        {colorOptions.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Available Colors:{' '}
              <span className="text-[#172B4D] font-black">
                {colorOptions.find((c) => c.hex === inspectionColor)?.name || colorOptions[0]?.name || 'Standard'}
              </span>
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
              Select Configuration:
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
              <p className="text-xs font-bold text-[#172B4D]">
                {selectedProduct.delivery_estimate || 'FREE Express Delivery'}
              </p>
              <p className="text-[10px] text-slate-500">Delivered in 24-48 Hours</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <RotateCcw className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#172B4D]">
                {selectedProduct.return_policy || '7 Days Replacement'}
              </p>
              <p className="text-[10px] text-slate-500">Hassle-Free Return Guarantee</p>
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
                {Object.entries(specs).length === 0 ? (
                  <p className="text-xs text-slate-400">Standard specifications apply.</p>
                ) : (
                  Object.entries(specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex justify-between py-1.5 border-b border-slate-100 text-xs"
                    >
                      <span className="text-slate-500 font-medium">{key}:</span>
                      <span className="text-[#172B4D] font-bold text-right max-w-[60%]">
                        {val}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    No customer reviews yet. Be the first to review!
                  </p>
                ) : (
                  reviews.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#172B4D]">
                          {r.author_name}
                        </span>
                        <span className="flex items-center text-emerald-600 font-black">
                          {r.rating} ★
                        </span>
                      </div>
                      <h5 className="font-bold text-[#172B4D] mb-0.5">
                        {r.title}
                      </h5>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {r.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= FIXED BOTTOM ACTION BAR ================= */}
      {/* 4 Action Buttons: ADD TO CART, BUY NOW, ADD TO WISHLIST, COMPARE */}
      <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          {/* 1. ADD TO WISHLIST Button */}
          <button
            onClick={() => toggleWishlist(selectedProduct)}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${
              isWishlisted
                ? 'border-rose-400 bg-rose-50 text-rose-600'
                : 'border-slate-300 hover:border-slate-400 text-slate-600 hover:text-rose-500 hover:bg-slate-50'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">Wishlist</span>
          </button>

          {/* 2. COMPARE Button */}
          <button
            onClick={handleCompare}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${
              compared
                ? 'border-blue-400 bg-blue-50 text-flipkart-blue'
                : 'border-slate-300 hover:border-slate-400 text-slate-600 hover:text-flipkart-blue hover:bg-slate-50'
            }`}
            title="Compare with similar products"
          >
            <GitCompare className="w-4 h-4" />
            <span>{compared ? 'Comparing ✓' : 'Compare'}</span>
          </button>

          {/* 3. ADD TO CART Button */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-3.5 rounded-2xl font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 border transition-all ${
              addedAnimation
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                : 'bg-white hover:bg-slate-50 text-[#172B4D] border-2 border-slate-300 hover:border-flipkart-blue shadow-sm'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-flipkart-blue" />
            <span>{addedAnimation ? 'ADDED TO CART ✓' : 'ADD TO CART'}</span>
          </button>
        </div>

        {/* 4. BUY NOW Button */}
        <button
          onClick={handleBuyNow}
          className="w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wider uppercase bg-gradient-to-r from-flipkart-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-glow-blue flex items-center justify-center gap-2 border border-blue-400/40 transition-all hover:scale-[1.01]"
        >
          <Zap className="w-4 h-4 text-flipkart-yellow fill-current" />
          <span>BUY NOW</span>
        </button>
      </div>
    </div>
  );
}
