'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-blue-600" />
        {t('cart.title')}
        {cart.items.length > 0 && (
          <span className="text-base font-normal text-gray-500">
            ({cart.items.reduce((s, i) => s + i.quantity, 0)} {t('cart.itemCount')})
          </span>
        )}
      </h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 rounded-full p-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h2>
          <p className="text-gray-500 mb-8">{t('cart.emptyDesc')}</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            {t('cart.startShopping')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('cart.orderSummary')}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('cart.subtotal')}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('cart.shipping')}</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? t('cart.free') : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                    {t('cart.add')}{(50 - subtotal).toFixed(2)} {t('cart.addMoreForFreeShipping')}
                  </p>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>{t('cart.total')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-2"
              >
                {t('cart.checkout')} <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/products"
                className="w-full mt-3 text-center text-sm text-blue-600 hover:underline block"
              >
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
