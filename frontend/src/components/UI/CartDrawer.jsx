import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';

export function CartDrawer() {
  const cartOpen = useStore((state) => state.cartOpen);
  const toggleCart = useStore((state) => state.toggleCart);
  const cart = useStore((state) => state.cart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const removeCartItem = useStore((state) => state.removeCartItem);
  const clearCart = useStore((state) => state.clearCart);
  const setCheckoutOpen = useStore((state) => state.setCheckoutOpen);

  if (!cartOpen) return null;

  const items = cart.items || [];

  const handleProceedToCheckout = () => {
    toggleCart();
    setCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleCart}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-md h-full bg-white/95 backdrop-blur-2xl border-l border-slate-200 shadow-2xl flex flex-col z-10 text-navy-dark"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-flipkart-blue flex items-center justify-center text-white shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-navy-dark">My Shopping Cart</h3>
              <p className="text-xs text-slate-500">
                {cart.total_items} {cart.total_items === 1 ? 'item' : 'items'} in your virtual bag
              </p>
            </div>
          </div>
          <button
            onClick={toggleCart}
            className="p-2 rounded-xl text-slate-500 hover:text-navy-dark hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-flipkart-blue" />
              </div>
              <h4 className="font-bold text-navy-dark text-lg mb-1">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore the 3D mall departments, inspect 3D products, and add your favorite items to cart!
              </p>
              <button
                onClick={toggleCart}
                className="px-5 py-2.5 rounded-xl bg-flipkart-blue text-white font-bold text-xs shadow-md hover:bg-blue-600 transition-all"
              >
                Explore Showrooms
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 hover:border-blue-300 transition-all flex gap-3.5 shadow-xs"
              >
                {/* Product Icon Box */}
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-flipkart-blue shrink-0 shadow-xs">
                  {item.product?.name ? item.product.name.slice(0, 3).toUpperCase() : '3D'}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h5 className="font-bold text-sm text-navy-dark truncate">
                      {item.product?.name || '3D Product'}
                    </h5>
                    <button
                      onClick={() => removeCartItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.variant && (
                    <p className="text-[11px] text-flipkart-blue font-semibold">
                      {item.variant.variant_type}: {item.variant.name}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <span className="font-black text-sm text-navy-dark">
                      ₹{Number(item.total_price || item.unit_price).toLocaleString('en-IN')}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="text-slate-500 hover:text-flipkart-blue p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-navy-dark px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="text-slate-500 hover:text-flipkart-blue p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill Summary & Checkout (if items exist) */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/95 space-y-3.5">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="text-navy-dark font-semibold">
                  ₹{Number(cart.subtotal).toLocaleString('en-IN')}
                </span>
              </div>

              {Number(cart.discount) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1 font-semibold">
                    <Tag className="w-3 h-3" /> 3D Mall Special Discount:
                  </span>
                  <span className="font-bold">
                    -₹{Number(cart.discount).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges:</span>
                <span className={Number(cart.delivery_fee) === 0 ? 'text-emerald-600 font-bold' : 'text-navy-dark'}>
                  {Number(cart.delivery_fee) === 0 ? 'FREE' : `₹${cart.delivery_fee}`}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-navy-dark">
                <span>Total Amount:</span>
                <span className="text-base font-black text-flipkart-blue">
                  ₹{Number(cart.total_amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-flipkart-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 border border-blue-400 hover:shadow-lg transition-all"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Safe & Secure Payments
              </span>
              <button
                onClick={clearCart}
                className="text-slate-500 hover:text-rose-600 underline font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
