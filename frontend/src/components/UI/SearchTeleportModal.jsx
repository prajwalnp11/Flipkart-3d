import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Search, X, Compass, ArrowRight, Sparkles, Star } from 'lucide-react';

export function SearchTeleportModal() {
  const searchOpen = useStore((state) => state.searchOpen);
  const setSearchOpen = (open) => useStore.setState({ searchOpen: open });
  const searchQuery = useStore((state) => state.searchQuery);
  const searchResults = useStore((state) => state.searchResults);
  const searchProducts = useStore((state) => state.searchProducts);
  const teleportToProduct = useStore((state) => state.teleportToProduct);

  const [inputVal, setInputVal] = useState(searchQuery || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(inputVal);
    }, 250);
    return () => clearTimeout(timer);
  }, [inputVal]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        onClick={() => setSearchOpen(false)}
        className="fixed inset-0"
      />

      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl z-10 border border-slate-200 overflow-hidden text-navy-dark"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <Search className="w-5 h-5 text-flipkart-blue" />
          <input
            type="text"
            placeholder="Search products across all 4 floors (e.g. 'iPhone 16 Pro', 'MacBook', 'Sofa')..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-navy-dark placeholder-slate-400 text-sm focus:outline-none font-semibold"
          />
          {inputVal && (
            <button
              onClick={() => setInputVal('')}
              className="text-slate-400 hover:text-navy-dark p-1 text-xs font-semibold"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-navy-dark hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="mt-4 max-h-96 overflow-y-auto space-y-2.5">
          {searchResults.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              {inputVal.trim() ? (
                <p>No products found matching "{inputVal}". Try searching for iPhone, Sony, Watch, Sofa, TV, etc.</p>
              ) : (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-700">Quick Department Suggestions:</p>
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    {['iPhone 16 Pro Max', 'MacBook Pro', 'Sony Headphones', 'Ultra 2 Watch', 'Nordic Sofa', '8K Neo QLED TV'].map((item) => (
                      <button
                        key={item}
                        onClick={() => setInputVal(item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-flipkart-blue text-slate-700 hover:text-flipkart-blue text-xs font-medium transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            searchResults.map((prod) => {
              const floorNum = prod.floor_number !== undefined ? prod.floor_number : 1;
              const floorLabel = floorNum === 0 ? 'Ground Floor (Lobby)' : floorNum === 1 ? 'Floor 1 (Mobiles & Electronics)' : floorNum === 2 ? 'Floor 2 (Fashion & Lifestyle)' : 'Floor 3 (Home & Living)';

              return (
                <div
                  key={prod.id || prod.slug}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-xs text-flipkart-blue shrink-0">
                      {prod.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-flipkart-blue border border-blue-200">
                          {floorLabel}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
                          {prod.rating} ★
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-navy-dark truncate">
                        {prod.name}
                      </h5>
                      <p className="text-xs font-black text-flipkart-blue mt-0.5">
                        ₹{Number(prod.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Teleport Button */}
                  <button
                    onClick={() => teleportToProduct(prod)}
                    className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-flipkart-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Compass className="w-4 h-4 text-flipkart-yellow animate-spin" />
                    <span>TELEPORT & INSPECT</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
