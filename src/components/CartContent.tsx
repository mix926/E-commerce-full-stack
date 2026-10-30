'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight, Truck, Tag } from 'lucide-react';
import CartItemRow from '@/components/CartItemRow';
import { useLanguage } from '@/context/LanguageContext';

interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
}

interface Cart {
  items: CartItem[];
}

interface CartContentProps {
  cart: Cart;
}

export default function CartContent({ cart }: CartContentProps) {
  const { t } = useLanguage();

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;
  const freeShippingAt = 50;
  const progress = Math.min((subtotal / freeShippingAt) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-blue-600" />
            {t('cart.title')}
            {cart.items.length > 0 && (
              <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {cart.items.reduce((s, i) => s + i.quantity, 0)} {t('cart.itemCount')}
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h2>
            <p className="text-gray-400 mb-8 text-sm">{t('cart.emptyDesc')}</p>
            <Link href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-md shadow-blue-500/25">
              {t('cart.startShopping')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {/* Free shipping progress */}
              {subtotal < freeShippingAt && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <p className="text-xs font-semibold text-gray-700">
                      {t('cart.add')}{(freeShippingAt - subtotal).toFixed(2)} {t('cart.addMoreForFreeShipping')}
                    </p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              {subtotal >= freeShippingAt && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-xs font-semibold text-green-700">🎉 You qualify for free shipping!</p>
                </div>
              )}

              {cart.items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  {t('cart.orderSummary')}
                </h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('cart.shipping')}</span>
                    <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-semibold text-gray-900'}>
                      {shipping === 0 ? `✓ ${t('cart.free')}` : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between text-base font-extrabold text-gray-900">
                    <span>{t('cart.total')}</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-xl font-bold hover:bg-blue-700 transition-all text-center flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 active:scale-95"
                >
                  {t('cart.checkout')} <ArrowRight className="w-4 h-4" />
                </Link>

                <Link href="/products"
                  className="w-full mt-3 text-center text-sm text-gray-500 hover:text-blue-600 transition-colors block">
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
