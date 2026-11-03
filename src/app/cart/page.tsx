import { getSession } from '@/lib/session';
import { getOrCreateCart } from '@/actions/cart';
import { redirect } from 'next/navigation';
import CartContent from '@/components/CartContent';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const session = await getSession();
  if (!session) redirect('/signin?redirect=/cart');

  try {
    const cart = await getOrCreateCart(session.userId);
    return <CartContent cart={cart} />;
  } catch (error) {
    // If cart initialization fails, redirect to sign in
    redirect('/signin?redirect=/cart&error=session_expired');
  }
}
