import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusTabs = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

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

  const activeTab = statusFilter || 'all';

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusTabs.map((tab) => (
          <Link
            key={tab}
            href={tab === 'all' ? '/admin/orders' : `/admin/orders?status=${tab}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-blue-600 hover:text-blue-700"
                    >
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{order.user.email}</td>
                  <td className="px-6 py-4 text-gray-700">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        statusColors[order.status] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
