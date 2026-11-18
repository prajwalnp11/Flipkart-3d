import React, { useEffect } from 'react';
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

export function App() {
  const initData = useStore((state) => state.initData);

  useEffect(() => {
    initData();
  }, [initData]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-brand-bg text-navy-dark">
      {/* 3D Shopping Mall Scene */}
      <MallScene />

      {/* 2D UI Overlays */}
      <WelcomeOverlay />
      <NavigationHUD />
      <ElevatorHUD />
      <ProductDetailPanel />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <SearchTeleportModal />
      <Fallback2DView />
    </div>
  );
}

export default App;
