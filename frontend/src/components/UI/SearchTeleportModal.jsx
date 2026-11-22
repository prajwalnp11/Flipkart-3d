import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import {
  Search,
  X,
  Compass,
  ArrowRight,
  Sparkles,
  Star,
  Globe,
  PlusCircle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Loader2
} from 'lucide-react';

export function SearchTeleportModal() {
  const searchOpen = useStore((state) => state.searchOpen);
  const setSearchOpen = (open) => useStore.setState({ searchOpen: open });
  const searchQuery = useStore((state) => state.searchQuery);
  const searchResults = useStore((state) => state.searchResults);
  const searchProducts = useStore((state) => state.searchProducts);
  const teleportToProduct = useStore((state) => state.teleportToProduct);

  // Live Flipkart API state
  const flipkartLiveResults = useStore((state) => state.flipkartLiveResults || []);
  const flipkartLiveLoading = useStore((state) => state.flipkartLiveLoading);
  const flipkartLiveHasApiKey = useStore((state) => state.flipkartLiveHasApiKey);
  const fetchFlipkartLive = useStore((state) => state.fetchFlipkartLive);
  const importAndInspectFlipkartProduct = useStore((state) => state.importAndInspectFlipkartProduct);

  const [activeTab, setActiveTab] = useState('mall'); // 'mall' | 'flipkart'
  const [inputVal, setInputVal] = useState(searchQuery || '');
  const [importingSlug, setImportingSlug] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'mall') {
        searchProducts(inputVal);
      } else {
        fetchFlipkartLive(inputVal);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputVal, activeTab]);

  if (!searchOpen) return null;

  const handleImportTo3D = async (item) => {
    setImportingSlug(item.title);
    try {
      await importAndInspectFlipkartProduct(item);
    } finally {
      setImportingSlug(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-20 p-4 bg-black/75 backdrop-blur-md">
      <div
        onClick={() => setSearchOpen(false)}
        className="fixed inset-0"
      />

      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-[#0F172A] border border-cyan-500/40 rounded-3xl p-5 md:p-6 shadow-2xl z-10 overflow-hidden text-white shadow-glow-blue"
      >
        {/* Top Tab Bar: In-Mall vs Live Flipkart RapidAPI */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('mall')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'mall'
                  ? 'bg-gradient-to-r from-[#2874F0] to-[#00F0FF] text-white shadow-glow-blue'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>In-Mall 3D Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('flipkart')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'flipkart'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Flipkart API (RapidAPI)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-900/60 text-amber-300 font-mono">
                Option 3
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'flipkart' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                {flipkartLiveHasApiKey ? 'RapidAPI Connected' : 'Live Gateway Active'}
              </span>
            )}
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Header Input */}
        <div className="flex items-center gap-3 bg-[#070B14] border border-slate-700/80 rounded-2xl px-4 py-3 mb-4">
          <Search className="w-5 h-5 text-[#00F0FF]" />
          <input
            type="text"
            placeholder={
              activeTab === 'mall'
                ? "Search across 4 floors (e.g. 'iPhone 16', 'MacBook', 'Sofa', 'Nike', 'Watch')..."
                : "Search live Flipkart products (e.g. 'AirPods Max', 'Samsung S24 Ultra', 'Jordan shoes')..."
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none font-semibold"
          />
          {inputVal && (
            <button
              onClick={() => setInputVal('')}
              className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tab 1: In-Mall Products List */}
        {activeTab === 'mall' && (
          <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
            {searchResults.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                {inputVal.trim() ? (
                  <p>No products found in the mall matching "{inputVal}". Try switching to the <span className="text-amber-400 font-bold">Live Flipkart API</span> tab to search the broader web!</p>
                ) : (
                  <div className="space-y-3">
                    <p className="font-bold text-slate-300">Quick Department Suggestions:</p>
                    <div className="flex flex-wrap justify-center gap-2 pt-1">
                      {['iPhone 16 Pro Max', 'Samsung Galaxy S24', 'MacBook Pro', 'Sony Headphones', 'Air Jordan', 'Neo QLED TV'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setInputVal(item)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-cyan-400 text-xs font-medium transition-all"
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
                const floorLabel = floorNum === 0 ? 'Lobby' : floorNum === 1 ? '1F Tech' : floorNum === 2 ? '2F Fashion' : '3F Home';

                return (
                  <div
                    key={prod.id || prod.slug}
                    className="p-3.5 rounded-2xl bg-[#070B14]/80 hover:bg-[#1E293B] border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2874F0]/30 to-[#00F0FF]/30 border border-cyan-500/30 flex items-center justify-center font-bold text-xs text-[#00F0FF] shrink-0">
                        {prod.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                            {floorLabel}
                          </span>
                          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-0.5">
                            {prod.rating} ★
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-white truncate">
                          {prod.name}
                        </h5>
                        <p className="text-xs font-black text-[#00F0FF] mt-0.5">
                          ₹{Number(prod.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => teleportToProduct(prod)}
                      className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2874F0] to-[#00B4D8] hover:from-[#1D4ED8] hover:to-[#00F0FF] text-white font-bold text-xs shadow-glow-blue transition-all"
                    >
                      <Compass className="w-3.5 h-3.5 text-yellow-300" />
                      <span>TELEPORT & INSPECT</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Live Flipkart API (RapidAPI) Search & Instant 3D Import */}
        {activeTab === 'flipkart' && (
          <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
            {flipkartLiveLoading ? (
              <div className="py-14 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-7 h-7 text-[#00F0FF] animate-spin" />
                <span className="text-xs font-mono">Querying real-time Flipkart RapidAPI catalog...</span>
              </div>
            ) : flipkartLiveResults.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <p>No products returned. Try searching for "iPhone", "Samsung", "MacBook", "Sony", "Nike", "Dior".</p>
              </div>
            ) : (
              flipkartLiveResults.map((item, idx) => {
                const isImporting = importingSlug === item.title;

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#070B14]/80 hover:bg-[#1E293B] border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Product Thumbnail from Flipkart CDN */}
                      <div className="w-14 h-14 rounded-xl bg-white/5 border border-slate-700/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-slate-500" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40">
                            Flipkart Assured
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 uppercase">
                            Floor {item.floor_number} • {item.model_3d_type}
                          </span>
                          <span className="text-[11px] text-amber-400 font-bold flex items-center gap-0.5">
                            {item.rating} ★ ({item.review_count})
                          </span>
                        </div>

                        <h5 className="font-bold text-xs text-white truncate max-w-md" title={item.title}>
                          {item.title}
                        </h5>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-white">
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </span>
                          {item.original_price > item.price && (
                            <>
                              <span className="text-[11px] line-through text-slate-500">
                                ₹{Number(item.original_price).toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] font-extrabold text-emerald-400">
                                {item.discount_percentage}% off
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Import to 3D Mall Button */}
                    <button
                      disabled={isImporting}
                      onClick={() => handleImportTo3D(item)}
                      className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 hover:scale-105"
                      title="Import this product from Flipkart and view in 3D"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating 3D...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                          <span>BIND 3D & INSPECT</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Modal Footer Notes */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Press [Esc] to exit search</span>
          <span className="text-cyan-400">Instant 3D Archetype Mapping Active</span>
        </div>
      </motion.div>
    </div>
  );
}

export default SearchTeleportModal;
