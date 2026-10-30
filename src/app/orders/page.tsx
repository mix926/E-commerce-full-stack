import { getSession } from '@/lib/session';
import { getUserOrders } from '@/actions/orders';
import { redirect } from 'next/navigation';
import OrdersContent from './OrdersContent';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect('/signin?redirect=/orders');

  const orders = await getUserOrders();

  const mapped = orders.map((o) => ({
    id: o.id,
    status: o.status,
    total: o.total,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      product: { id: i.product.id, name: i.product.name, image: i.product.image },
    })),
  }));

  return <OrdersContent orders={mapped} />;
}
