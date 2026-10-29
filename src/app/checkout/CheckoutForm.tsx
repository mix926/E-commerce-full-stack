'use client';

import React, { useState } from 'react';
import { placeOrder } from '@/actions/orders';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Sparkles,
  Lock,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck,
  Loader2,
} from 'lucide-react';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image: string;
  };
}

interface CheckoutFormProps {
  userName: string;
  userEmail: string;
  cartItems: CartItem[];
  subtotal: number;
}

export default function CheckoutForm({
  userName,
  userEmail,
  cartItems,
  subtotal,
}: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'khqr' | 'cod' | 'paypal'>('card');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState(userName || '');

  // Promo calculations
  let discount = 0;
  let shipping = subtotal > 50 ? 0 : 9.99;

  if (appliedPromo === 'WELCOME10') {
    discount = subtotal * 0.1;
  } else if (appliedPromo === 'SAVE20' && subtotal >= 100) {
    discount = 20;
  } else if (appliedPromo === 'FREESHIP') {
    shipping = 0;
  }

  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();

    if (code === 'WELCOME10') {
      setAppliedPromo('WELCOME10');
      setPromoCodeInput('');
    } else if (code === 'FREESHIP') {
      setAppliedPromo('FREESHIP');
      setPromoCodeInput('');
    } else if (code === 'SAVE20') {
      if (subtotal < 100) {
        setPromoError('SAVE20 requires a minimum order of $100');
        return;
      }
      setAppliedPromo('SAVE20');
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid coupon code. Try "WELCOME10" or "FREESHIP"');
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Checkout Forms Column (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <form
          action={placeOrder}
          onSubmit={() => setLoading(true)}
          className="space-y-6"
        >
          {/* Hidden inputs to pass computed state to Server Action */}
          <input
            type="hidden"
            name="paymentMethod"
            value={
              paymentMethod === 'card'
                ? 'Credit / Debit Card'
                : paymentMethod === 'khqr'
                ? 'KHQR / ABA Bank Pay'
                : paymentMethod === 'paypal'
                ? 'PayPal'
                : 'Cash on Delivery (COD)'
            }
          />
          <input type="hidden" name="promoCode" value={appliedPromo || ''} />

          {/* Section 1: Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              1. Delivery Information
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={userName}
                    required
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={userEmail}
                    required
                    readOnly
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Street Address *
                </label>
                <input
                  name="address"
                  type="text"
                  required
                  placeholder="Street 2004, Sen Sok or 123 Main St"
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    City / Province *
                  </label>
                  <input
                    name="city"
                    type="text"
                    required
                    placeholder="Phnom Penh"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Postal Code / ZIP *
                  </label>
                  <input
                    name="zip"
                    type="text"
                    required
                    placeholder="12000"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Country *
                  </label>
                  <select
                    name="country"
                    required
                    defaultValue="Cambodia"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Cambodia">Cambodia</option>
                    <option value="United States">United States</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Australia">Australia</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Delivery Notes (Optional)
                </label>
                <input
                  name="notes"
                  type="text"
                  placeholder="e.g. Leave at front desk or call before arrival"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                2. Payment Method
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1 font-normal">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                256-bit SSL Secure
              </span>
            </h2>

            {/* Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {[
                { id: 'card', label: 'Credit Card', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'khqr', label: 'KHQR / ABA', icon: <QrCode className="w-4 h-4" /> },
                { id: 'cod', label: 'Cash on Del.', icon: <Banknote className="w-4 h-4" /> },
                { id: 'paypal', label: 'PayPal', icon: <span className="font-bold text-xs italic">PP</span> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as typeof paymentMethod)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                    paymentMethod === m.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-600'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Payment Details Container */}
            {paymentMethod === 'card' && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Card Information
                  </span>
                  <div className="flex gap-1.5">
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-blue-700">
                      VISA
                    </span>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-red-600">
                      Mastercard
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    required={paymentMethod === 'card'}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleCardExpiryChange}
                      placeholder="12/28"
                      maxLength={5}
                      required={paymentMethod === 'card'}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={handleCardCvcChange}
                      placeholder="•••"
                      maxLength={4}
                      required={paymentMethod === 'card'}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="JOHN DOE"
                    required={paymentMethod === 'card'}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'khqr' && (
              <div className="bg-red-50/50 border border-red-200 rounded-xl p-5 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  <QrCode className="w-3.5 h-3.5" />
                  KHQR / Bakong Pay
                </div>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Scan this QR code with ABA Mobile, ACLEDA, Sathapana, Wing, or any Bakong-enabled banking app.
                </p>

                {/* QR Code graphic mockup */}
                <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border-2 border-red-500/20 shadow-md flex flex-col items-center justify-center relative">
                  <div className="w-full h-full border-4 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50/60 p-2 text-center">
                    <QrCode className="w-20 h-20 text-gray-800 mb-1" />
                    <span className="text-[10px] font-bold text-red-600 tracking-wider">
                      BAKONG KHQR
                    </span>
                    <span className="text-[11px] font-extrabold text-gray-900 mt-0.5">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500">
                  Instant confirmation upon completing the transfer.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  Cash on Delivery (COD)
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Pay directly in cash to the delivery driver when your package arrives at your delivery address. No advance payment required.
                </p>
                <div className="text-[11px] text-emerald-700 bg-white/80 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Please prepare <strong>${grandTotal.toFixed(2)}</strong> in cash for the courier.</span>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-5 text-center space-y-3">
                <div className="text-blue-900 font-bold text-sm">
                  Pay with PayPal Express
                </div>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  You will be securely routed through PayPal protection to finalize your payment of <strong>${grandTotal.toFixed(2)}</strong>.
                </p>
                <div className="inline-flex items-center gap-2 bg-[#ffc439] hover:bg-[#f4bb34] text-gray-900 font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs cursor-pointer">
                  <span className="italic font-black text-blue-900">PayPal</span> Checkout
                </div>
              </div>
            )}
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl font-extrabold text-base transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
            {loading ? 'Processing Order...' : `Place Order • $${grandTotal.toFixed(2)}`}
          </button>
        </form>
      </div>

      {/* Order Summary Column (5 cols) */}
      <div className="lg:col-span-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-xs text-gray-500 font-normal">
              {cartItems.reduce((s, i) => s + i.quantity, 0)} item(s)
            </span>
          </h2>

          {/* Cart Items List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-900 shrink-0">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon / Promo Input */}
          <div className="border-t border-gray-100 pt-4">
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                Promo / Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="e.g. WELCOME10"
                  className="flex-1 bg-gray-50 uppercase text-xs border border-gray-300 rounded-xl px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>

              {promoError && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {promoError}
                </p>
              )}

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-xl">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-green-600" />
                    Coupon &ldquo;{appliedPromo}&rdquo; active!
                  </span>
                  <button
                    type="button"
                    onClick={() => setAppliedPromo(null)}
                    className="text-gray-400 hover:text-red-500 text-xs font-bold ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount ({appliedPromo})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold text-gray-900'}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-blue-600">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-gray-50 rounded-xl p-3.5 text-xs text-gray-500 space-y-1.5 border border-gray-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tracked delivery with SMS & Email updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
