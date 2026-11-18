import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStore } from '../../store/useStore';
import { CheckCircle, Package, Truck, ArrowRight, ShoppingBag } from 'lucide-react';

export function OrderSuccessModal() {
  const orderSuccessOpen = useStore((state) => state.orderSuccessOpen);
  const closeOrderSuccess = useStore((state) => state.closeOrderSuccess);
  const lastOrder = useStore((state) => state.lastOrder);

  useEffect(() => {
    if (orderSuccessOpen) {
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [orderSuccessOpen]);

  if (!orderSuccessOpen || !lastOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-slate-200 text-center text-navy-dark"
      >
        {/* Animated Celebration Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle className="w-9 h-9" />
        </div>

        <h3 className="text-2xl font-black text-navy-dark mb-1">
          Order Placed Successfully!
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Thank you for shopping at Flipkart 3D Virtual Mall. Your package is being packed for express transit.
        </p>

        {/* Order Details Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2.5 text-xs mb-6">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Order Number:</span>
            <span className="font-extrabold text-flipkart-blue font-mono">{lastOrder.order_number}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Tracking Code:</span>
            <span className="font-semibold text-slate-700 font-mono">{lastOrder.tracking_number}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Delivery To:</span>
            <span className="font-semibold text-navy-dark text-right">{lastOrder.full_name}, {lastOrder.city}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Payment:</span>
            <span className="font-bold text-emerald-600 uppercase">{lastOrder.payment_method} ({lastOrder.payment_status})</span>
          </div>

          <div className="flex justify-between pt-1 text-sm font-black text-navy-dark">
            <span>Total Paid:</span>
            <span className="text-flipkart-blue text-base font-black">₹{Number(lastOrder.total_amount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button
          onClick={closeOrderSuccess}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-flipkart-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 border border-blue-400 hover:shadow-lg transition-all"
        >
          <ShoppingBag className="w-4 h-4 text-flipkart-yellow" />
          <span>CONTINUE 3D SHOPPING</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
