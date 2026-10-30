import { prisma } from '@/lib/prisma';
import AdminOrdersContent from './AdminOrdersContent';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;

  const orders = await prisma.order.findMany({
    where: statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {},
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return <AdminOrdersContent orders={orders} statusFilter={statusFilter} />;
}
