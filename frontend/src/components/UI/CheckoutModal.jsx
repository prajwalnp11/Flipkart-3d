import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import {
  X,
  CreditCard,
  QrCode,
  Landmark,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export function CheckoutModal() {
  const checkoutOpen = useStore((state) => state.checkoutOpen);
  const setCheckoutOpen = useStore((state) => state.setCheckoutOpen);
  const cart = useStore((state) => state.cart);
  const processCheckout = useStore((state) => state.processCheckout);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 99887 76655',
    shipping_address: 'Flat 402, Skyline Towers, Koramangala 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560034',
    payment_method: 'UPI'
  });

  if (!checkoutOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await processCheckout(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    { id: 'UPI', label: 'UPI / GooglePay / PhonePe', icon: QrCode, desc: 'Instant 0% fee transaction' },
    { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
    { id: 'NETBANKING', label: 'Net Banking', icon: Landmark, desc: 'All Major Indian Banks' },
    { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when package arrives' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setCheckoutOpen(false)}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 border border-slate-200 overflow-hidden my-8 text-navy-dark"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-navy-dark">Flipkart</span>
              <span className="text-xl font-black text-flipkart-blue">3D</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-flipkart-blue font-bold border border-blue-200">
                Secure Express Checkout
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Complete your virtual shopping order
            </p>
          </div>
          <button
            onClick={() => setCheckoutOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-navy-dark hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Shipping Address Inputs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-flipkart-blue mb-3 flex items-center gap-1.5">
              <span>1. Delivery Address</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-navy-dark font-medium focus:outline-none focus:border-flipkart-blue focus:bg-white shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-navy-dark font-medium focus:outline-none focus:border-flipkart-blue focus:bg-white shadow-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-600 mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-navy-dark font-medium focus:outline-none focus:border-flipkart-blue focus:bg-white shadow-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-600 mb-1 font-semibold">Street Address / House / Flat</label>
                <input
                  type="text"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-navy-dark font-medium focus:outline-none focus:border-flipkart-blue focus:bg-white shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-navy-dark font-medium focus:outline-none focus:border-flipkart-blue focus:bg-white shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-navy-dark font-medium focus:outline-none focus:border-flipkart-blue focus:bg-white shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">PIN Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-navy-dark font-medium focus:outline-none focus:border-flipkart-blue focus:bg-white shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-flipkart-blue mb-3 flex items-center gap-1.5">
              <span>2. Payment Option</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {paymentOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = formData.payment_method === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setFormData({ ...formData, payment_method: opt.id })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-flipkart-blue bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                    }`}
                  >
                    <span className={`p-2 rounded-xl ${isSelected ? 'bg-flipkart-blue text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <IconComponent className="w-4 h-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-navy-dark">{opt.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Amount to Pay & Submit */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Payable Amount:</p>
              <p className="text-2xl font-black text-flipkart-blue">
                ₹{Number(cart.total_amount).toLocaleString('en-IN')}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-flipkart-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-sm tracking-wide shadow-md flex items-center gap-2 border border-blue-400 hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <Lock className="w-4 h-4 text-flipkart-yellow" />
              <span>{loading ? 'PROCESSING...' : 'PLACE ORDER & PAY'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
