import { getSession } from '@/lib/session';
import { getOrCreateCart } from '@/actions/cart';
import { redirect } from 'next/navigation';
import CartContent from '@/components/CartContent';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const session = await getSession();
  if (!session) redirect('/signin?redirect=/cart');

  let cart;
  try {
    cart = await getOrCreateCart(session.userId);
  } catch (error) {
    // If cart initialization fails, redirect to sign in
    redirect('/signin?redirect=/cart&error=session_expired');
  }
  
  return <CartContent cart={cart} />;
}
