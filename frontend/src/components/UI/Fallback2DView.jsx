import React from 'react';
import { useStore } from '../../store/useStore';
import { Star, Eye, ShoppingCart, Box, ArrowRight, Tag, X } from 'lucide-react';

export function Fallback2DView() {
  const is2DFallback = useStore((state) => state.is2DFallback);
  const toggle2DFallback = useStore((state) => state.toggle2DFallback);
  const selectedFloor = useStore((state) => state.selectedFloor);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const clearSelectedCategory = useStore((state) => state.clearSelectedCategory);
  const quickJumpToFloor = useStore((state) => state.quickJumpToFloor);
  const products = useStore((state) => state.products);
  const openProductInspect = useStore((state) => state.openProductInspect);
  const addToCart = useStore((state) => state.addToCart);

  if (!is2DFallback) return null;

  const floorProducts = products.filter((p) => {
    const floorMatch = (p.floor_number !== undefined ? p.floor_number : p.floor) === (selectedFloor || 1);
    if (!floorMatch) return false;
    if (!selectedCategory) return true;
    const catSlug = (selectedCategory.slug || selectedCategory.name || '').toLowerCase();
    const pCat = (p.category_slug || p.category?.slug || p.category_name || p.category?.name || p.category || '').toString().toLowerCase();
    return pCat.includes(catSlug) || catSlug.includes(pCat);
  });

  return (
    <div className="fixed inset-0 z-40 bg-brand-bg overflow-y-auto p-4 md:p-8 pt-24 text-navy-dark">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner with 3D Switch */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-blue-50 border border-blue-200 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-navy-dark">Accessibility & 2D Catalog Mode Active</h2>
            <p className="text-xs text-slate-600">
              Low-power alternative mode for older devices or high-speed browsing.
            </p>
          </div>
          <button
            onClick={toggle2DFallback}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-flipkart-blue text-white font-bold text-xs shadow-md hover:bg-blue-600 transition-all"
          >
            <Box className="w-4 h-4 text-flipkart-yellow" />
            <span>Switch Back to 3D Virtual Mall</span>
          </button>
        </div>

        {/* Floor Selection & Active Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { num: 1, label: 'Floor 1: Mobiles & Electronics' },
              { num: 2, label: 'Floor 2: Fashion & Shoes' },
              { num: 3, label: 'Floor 3: Home & Living' }
            ].map((f) => (
              <button
                key={f.num}
                onClick={() => quickJumpToFloor(f.num)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFloor === f.num
                    ? 'bg-flipkart-blue text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-navy-dark border border-slate-200 shadow-xs'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Category: {selectedCategory.name}</span>
              <button
                onClick={clearSelectedCategory}
                className="w-4 h-4 rounded-full bg-blue-200 hover:bg-rose-500 hover:text-white text-blue-700 flex items-center justify-center transition-colors ml-1"
                title="Clear category filter"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </div>

        {/* 2D Product Grid */}
        {floorProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-semibold text-sm">
              No products found matching the selected category on this floor.
            </p>
            {selectedCategory && (
              <button
                onClick={clearSelectedCategory}
                className="mt-3 px-4 py-2 rounded-xl bg-flipkart-blue text-white text-xs font-bold"
              >
                Clear Category Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {floorProducts.map((p) => (
              <div
                key={p.id || p.slug}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-full h-44 rounded-xl bg-blue-50/60 border border-slate-200 flex items-center justify-center text-3xl font-black text-flipkart-blue mb-4">
                    {p.name.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-flipkart-blue">{p.brand}</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                      {p.rating} ★
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-navy-dark line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-black text-flipkart-blue">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </span>
                    {p.original_price && (
                      <span className="text-xs line-through text-slate-400">
                        ₹{Number(p.original_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openProductInspect(p)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-dark font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-flipkart-blue" />
                    <span>Inspect 3D</span>
                  </button>
                  <button
                    onClick={() => addToCart(p, null, 1)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-flipkart-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-flipkart-yellow" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
