import React from 'react';
import { useStore } from '../../store/useStore';
import { Product3DViewer } from '../ProductViewer/Product3DViewer';
import { ProductInformationPanel } from './ProductInformationPanel';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function ProductDetailPanel() {
  const currentView = useStore((state) => state.currentView);
  const phase = useStore((state) => state.phase);
  const selectedProduct = useStore((state) => state.selectedProduct);
  const closeProductInspect = useStore((state) => state.closeProductInspect);

  const isInspecting =
    (currentView === 'PRODUCT_INSPECT' || phase === 'inspecting') && selectedProduct;

  if (!isInspecting) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col md:flex-row bg-[#F5F8FE] overflow-hidden animate-in fade-in duration-300">
      {/* ================= LEFT / TOP: 3D INTERACTIVE VIEWER (65% width desktop / 45vh mobile) ================= */}
      <div className="relative flex-1 h-[45vh] md:h-full w-full overflow-hidden">
        {/* Top-Left Back to Showroom Breadcrumb Button */}
        <div className="absolute top-4 left-4 z-20 pointer-events-auto">
          <button
            onClick={closeProductInspect}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-[#172B4D] hover:bg-white hover:text-flipkart-blue transition-all font-bold text-xs shadow-md hover:scale-105"
            title="Return to Showroom"
          >
            <ArrowLeft className="w-4 h-4 text-flipkart-blue" />
            <span>Return to Showroom</span>
          </button>
        </div>

        {/* 3D Product Interactive Canvas (OrbitControls, 360 Presets, 7 Hotspots) */}
        <Product3DViewer product={selectedProduct} />
      </div>

      {/* ================= RIGHT / BOTTOM: DOCKED SPECIFICATIONS & PURCHASE PANEL (max 35% width desktop / bottom sheet mobile) ================= */}
      <div className="w-full md:w-[35%] max-w-[460px] md:min-w-[360px] h-[55vh] md:h-full z-20 shadow-2xl overflow-hidden border-t md:border-t-0 md:border-l border-slate-200">
        <ProductInformationPanel product={selectedProduct} />
      </div>
    </div>
  );
}

export default ProductDetailPanel;
