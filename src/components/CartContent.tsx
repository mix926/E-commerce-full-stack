'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight, Truck, Tag, Package, Zap } from 'lucide-react';
import CartItemRow from '@/components/CartItemRow';
import { useLanguage } from '@/context/LanguageContext';

interface CartProduct {
  id: string; name: string; price: number;
  image: string; category: string; stock: number;
}
interface CartItem { id: string; quantity: number; product: CartProduct; }
interface Cart { items: CartItem[]; }
interface CartContentProps { cart: Cart; }

export default function CartContent({ cart }: CartContentProps) {
  const { t } = useLanguage();

  const subtotal = cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;
  const progress = Math.min((subtotal / 50) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 flex-shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            {t('cart.title')}
            {cart.items.length > 0 && (
              <span className="text-xs sm:text-sm font-bold text-white bg-blue-600 px-2.5 sm:px-3.5 py-1 rounded-full">
                {cart.items.reduce((s, i) => s + i.quantity, 0)} {t('cart.itemCount')}
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Empty state ── */}
        {cart.items.length === 0 ? (
          <div className="text-center py-24 sm:py-32 bg-white rounded-3xl border-2 border-slate-200 shadow-lg">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg flex-shrink-0">
              <Package className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 sm:mb-3">{t('cart.empty')}</h2>
            <p className="text-slate-600 mb-6 sm:mb-10 text-sm sm:text-base max-w-md mx-auto px-4">{t('cart.emptyDesc')}</p>
            <Link href="/products"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-1 active:scale-95 touch-target">
              {t('cart.startShopping')} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

            {/* ── Items ── */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">

              {/* Free shipping progress */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 shadow-sm p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${subtotal >= 50 ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                      <Truck className={`w-5 h-5 sm:w-6 sm:h-6 ${subtotal >= 50 ? 'text-emerald-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {subtotal >= 50
                          ? '🎉 Free shipping qualified!'
                          : `Add $${(50 - subtotal).toFixed(2)} for free shipping`}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">On orders over $50</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-blue-600 bg-white px-2.5 sm:px-3 py-1 rounded-lg flex-shrink-0">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r"
                    style={{
                      width: `${progress}%`,
                      backgroundImage: subtotal >= 50
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                    }} />
                </div>
              </div>

              {/* Cart items */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 divide-y divide-slate-200 overflow-hidden shadow-sm">
                {cart.items.map((item, idx) => (
                  <div key={item.id} style={{ animation: `slideIn .4s cubic-bezier(.22,1,.36,1) ${idx * 50}ms both` }}>
                    <CartItemRow item={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-6 shadow-lg sticky top-24">
                <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  {t('cart.orderSummary')}
                </h2>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-slate-200">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-600 font-medium">{t('cart.subtotal')}</span>
                    <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-600 font-medium">{t('cart.shipping')}</span>
                    <span className={`font-bold ${shipping === 0 ? 'text-emerald-600 text-sm sm:text-base' : 'text-slate-900'}`}>
                      {shipping === 0 ? `✓ ${t('cart.free')}` : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-lg">
                    <span className="font-black text-slate-900">{t('cart.total')}</span>
                    <span className="font-black text-xl sm:text-2xl text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 sm:py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:-translate-y-1 active:scale-95 mb-2 sm:mb-3 touch-target">
                  {t('cart.checkout')} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>

                <Link href="/products"
                  className="w-full text-center text-xs sm:text-sm text-slate-600 hover:text-blue-600 transition-colors font-semibold py-2 sm:py-2.5 hover:bg-slate-50 rounded-lg">
                  {t('cart.continueShopping')}
                </Link>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-slate-200 space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-blue-600 font-black mt-0.5 flex-shrink-0">✓</span>
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-blue-600 font-black mt-0.5 flex-shrink-0">✓</span>
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-blue-600 font-black mt-0.5 flex-shrink-0">✓</span>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
