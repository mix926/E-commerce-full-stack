import { getSession } from '@/lib/session';
import { getOrCreateCart } from '@/actions/cart';
import { redirect } from 'next/navigation';
import CartContent from '@/components/CartContent';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const session = await getSession();
  if (!session) redirect('/signin?redirect=/cart');

  const cart = await getOrCreateCart(session.userId);

  return <CartContent cart={cart} />;
}
