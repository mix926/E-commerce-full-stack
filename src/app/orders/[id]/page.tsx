import { getOrderById } from '@/actions/orders';
import { getSession } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import OrderDetailContent from './OrderDetailContent';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect('/signin');

  const order = await getOrderById(id);
  if (!order) notFound();

  const mapped = {
    id: order.id,
    status: order.status,
    total: order.total,
    address: order.address,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      price: i.price,
      product: { id: i.product.id, name: i.product.name, image: i.product.image },
    })),
  };

  return <OrderDetailContent order={mapped} customerName={session.name} customerEmail={session.email} />;
}
