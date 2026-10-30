'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusTabs = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  user: { email: string };
}

interface Props {
  orders: Order[];
  statusFilter?: string;
}

export default function AdminOrdersContent({ orders, statusFilter }: Props) {
  const { t } = useLanguage();
  const activeTab = statusFilter || 'all';

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.ordersTitle')}</h1>

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
            {tab === 'all' ? t('admin.all') : t(`status.${tab}`)}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">{t('admin.orderId')}</th>
                <th className="px-6 py-3 text-left">{t('admin.customer')}</th>
                <th className="px-6 py-3 text-left">{t('admin.total')}</th>
                <th className="px-6 py-3 text-left">{t('admin.status')}</th>
                <th className="px-6 py-3 text-left">{t('admin.date')}</th>
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
                      {t(`status.${order.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
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
