'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight, Truck, Tag, Package } from 'lucide-react';
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

  const subtotal    = cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping    = subtotal > 50 ? 0 : 9.99;
  const total       = subtotal + shipping;
  const progress    = Math.min((subtotal / 50) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/30">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            {t('cart.title')}
            {cart.items.length > 0 && (
              <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {cart.items.reduce((s, i) => s + i.quantity, 0)} {t('cart.itemCount')}
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Empty state ── */}
        {cart.items.length === 0 ? (
          <div className="text-center py-28 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-indigo-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h2>
            <p className="text-gray-400 mb-8 text-sm max-w-xs mx-auto">{t('cart.emptyDesc')}</p>
            <Link href="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/25 hover:-translate-y-0.5 active:scale-95">
              {t('cart.startShopping')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Items ── */}
            <div className="lg:col-span-2 space-y-3">

              {/* Free shipping progress */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Truck className={`w-4 h-4 ${subtotal >= 50 ? 'text-emerald-500' : 'text-indigo-500'}`} />
                    <p className="text-xs font-semibold text-gray-700">
                      {subtotal >= 50
                        ? '🎉 You qualify for free shipping!'
                        : `${t('cart.add')}${(50 - subtotal).toFixed(2)} ${t('cart.addMoreForFreeShipping')}`}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      background: subtotal >= 50
                        ? 'linear-gradient(90deg,#10b981,#34d399)'
                        : 'linear-gradient(90deg,#6366f1,#818cf8)',
                    }} />
                </div>
              </div>

              {cart.items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-500" />
                  {t('cart.orderSummary')}
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{t('cart.shipping')}</span>
                    <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-gray-900'}>
                      {shipping === 0 ? `✓ ${t('cart.free')}` : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between text-lg font-black text-gray-900">
                    <span>{t('cart.total')}</span>
                    <span className="text-indigo-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-500/25 hover:-translate-y-0.5 active:scale-95">
                  {t('cart.checkout')} <ArrowRight className="w-4 h-4" />
                </Link>

                <Link href="/products"
                  className="w-full mt-3 text-center text-sm text-gray-400 hover:text-indigo-600 transition-colors block">
                  {t('cart.continueShopping')}
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
