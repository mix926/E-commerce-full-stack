import { getSession } from '@/lib/session';
import { getOrCreateCart } from '@/actions/cart';
import { redirect } from 'next/navigation';
import CheckoutForm from './CheckoutForm';
import Link from 'next/link';
import { ArrowLeft, Lock, Truck, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect('/signin?redirect=/checkout');

  const cart = await getOrCreateCart(session.userId);

  if (!cart.items || cart.items.length === 0) {
    redirect('/cart');
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Link
            href="/cart"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-2 transition-colors mb-3 sm:mb-4 group touch-target"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            Back to Shopping Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Secure Checkout
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">
            Complete your order with our encrypted, risk-free payment system
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Trust indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 shadow-sm">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900">SSL Secure</p>
              <p className="text-[11px] sm:text-xs text-slate-600">256-bit encrypted</p>
            </div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 shadow-sm">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900">Protected</p>
              <p className="text-[11px] sm:text-xs text-slate-600">30-day guarantee</p>
            </div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 shadow-sm">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900">Fast Delivery</p>
              <p className="text-[11px] sm:text-xs text-slate-600">2-5 business days</p>
            </div>
          </div>
        </div>

        <CheckoutForm
          userName={session.name || ''}
          userEmail={session.email || ''}
          cartItems={cart.items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            product: {
              name: i.product.name,
              price: i.product.price,
              image: i.product.image,
            },
          }))}
          subtotal={subtotal}
        />
      </div>
    </div>
  );
}
