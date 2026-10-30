import { prisma } from '@/lib/prisma';
import AdminUsersContent from './AdminUsersContent';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  });

  const usersPlain = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    ordersCount: u._count.orders,
    createdAt: u.createdAt.toISOString(),
  }));

  return <AdminUsersContent users={usersPlain} />;
}
