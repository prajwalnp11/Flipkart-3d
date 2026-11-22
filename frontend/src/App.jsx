import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { MallScene } from './scenes/MallScene';
import { WelcomeOverlay } from './components/UI/WelcomeOverlay';
import { NavigationHUD } from './components/UI/NavigationHUD';
import { ElevatorHUD } from './components/UI/ElevatorHUD';
import { ProductDetailPanel } from './components/UI/ProductDetailPanel';
import { CartDrawer } from './components/UI/CartDrawer';
import { CheckoutModal } from './components/UI/CheckoutModal';
import { OrderSuccessModal } from './components/UI/OrderSuccessModal';
import { SearchTeleportModal } from './components/UI/SearchTeleportModal';
import { Fallback2DView } from './components/UI/Fallback2DView';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function ToastContainer() {
  const toasts = useStore((state) => state.toasts || []);
  const removeToast = useStore((state) => state.removeToast);

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl text-[#172B4D]"
          >
            <div className="p-1 rounded-lg">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {toast.type === 'warn' && <AlertCircle className="w-5 h-5 text-amber-500" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-flipkart-blue" />}
            </div>
            <div className="flex-1">
              <h5 className="font-extrabold text-xs text-[#172B4D]">{toast.title}</h5>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function App() {
  const initData = useStore((state) => state.initData);
  const quickJumpToFloor = useStore((state) => state.quickJumpToFloor);
  const instantJumpToFloor = useStore((state) => state.instantJumpToFloor);
  const closeProductInspect = useStore((state) => state.closeProductInspect);
  const selectedProduct = useStore((state) => state.selectedProduct);
  const toggleMute = useStore((state) => state.toggleMute);
  const toggleClassicView = useStore((state) => state.toggleClassicView);
  const setSearchOpen = (open) => useStore.setState({ searchOpen: open });
  const toggleCart = useStore((state) => state.toggleCart);

  useEffect(() => {
    initData();
  }, [initData]);

  // Global Keyboard Shortcuts (Phase 9 & A11y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing into an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case '0':
        case '`':
          instantJumpToFloor(0);
          break;
        case '1':
          instantJumpToFloor(1);
          break;
        case '2':
          instantJumpToFloor(2);
          break;
        case '3':
          instantJumpToFloor(3);
          break;
        case 'Escape':
          if (selectedProduct) closeProductInspect();
          useStore.setState({
            searchOpen: false,
            cartOpen: false,
            checkoutOpen: false,
            orderSuccessOpen: false
          });
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'f':
        case 'F':
          toggleClassicView();
          break;
        case '/':
          e.preventDefault();
          setSearchOpen(true);
          break;
        case 'c':
        case 'C':
          toggleCart();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct, quickJumpToFloor, instantJumpToFloor, closeProductInspect, toggleMute, toggleClassicView, toggleCart]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070B14] text-white select-none">
      {/* Persistent Single 3D Shopping Mall Canvas */}
      <MallScene />

      {/* 2D UI Glassmorphic HUD Overlays */}
      <WelcomeOverlay />
      <NavigationHUD />
      <ElevatorHUD />
      <ProductDetailPanel />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <SearchTeleportModal />
      <Fallback2DView />
      <ToastContainer />
    </div>
  );
}

export default App;
