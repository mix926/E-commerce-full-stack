import { getSession } from '@/lib/session';
import { getOrCreateCart } from '@/actions/cart';
import { redirect } from 'next/navigation';
import CheckoutForm from './CheckoutForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/cart"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Shopping Cart
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
          Secure Checkout
        </h1>
        <p className="text-sm text-gray-500">
          Complete your order with encrypted, risk-free payment
        </p>
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
  );
}
