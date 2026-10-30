import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AdminOrderDetailContent from './AdminOrderDetailContent';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } },
    },
  });

  if (!order) notFound();

  return <AdminOrderDetailContent order={order} />;
}
