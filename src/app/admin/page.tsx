import { prisma } from '@/lib/prisma';
import AdminDashboardContent from './AdminDashboardContent';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [productCount, orderCount, userCount, revenueAgg, recentOrders, reviewCount, avgRating] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } },
      }),
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } }),
    ]);

  const revenue = revenueAgg._sum.total ?? 0;

  const recentOrdersPlain = recentOrders.map((o) => ({
    id: o.id,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    userEmail: o.user.email,
  }));

  return (
    <AdminDashboardContent
      productCount={productCount}
      orderCount={orderCount}
      userCount={userCount}
      revenue={revenue}
      reviewCount={reviewCount}
      avgRating={avgRating._avg.rating ?? 0}
      recentOrders={recentOrdersPlain}
    />
  );
}
