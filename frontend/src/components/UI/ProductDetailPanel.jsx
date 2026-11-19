import React from 'react';
import { useStore } from '../../store/useStore';
import { Product3DViewer } from '../ProductViewer/Product3DViewer';
import { ProductInformationPanel } from './ProductInformationPanel';
import { X, ArrowLeft } from 'lucide-react';

export function ProductDetailPanel() {
  const currentView = useStore((state) => state.currentView);
  const selectedProduct = useStore((state) => state.selectedProduct);
  const closeProductInspect = useStore((state) => state.closeProductInspect);

  if (currentView !== 'PRODUCT_INSPECT' || !selectedProduct) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col md:flex-row bg-[#F5F8FE]/98 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
      {/* ================= LEFT / TOP: 3D INTERACTIVE VIEWER ================= */}
      <div className="relative flex-1 h-[50vh] md:h-full w-full">
        {/* Top Back / Close Button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={closeProductInspect}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 text-[#172B4D] hover:bg-white hover:text-flipkart-blue transition-all font-bold text-xs shadow-glass-light hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Showroom</span>
          </button>
        </div>

        {/* 3D Product Viewer with OrbitControls, Presets, Auto-Rotate & Hotspots */}
        <Product3DViewer product={selectedProduct} />
      </div>

      {/* ================= RIGHT / BOTTOM: SPECIFICATIONS & PURCHASE PANEL ================= */}
      <div className="w-full md:w-[480px] lg:w-[520px] h-[50vh] md:h-full">
        <ProductInformationPanel product={selectedProduct} />
      </div>
    </div>
  );
}
