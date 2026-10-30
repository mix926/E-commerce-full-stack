'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Package, ShoppingBag, Users, DollarSign, Star } from 'lucide-react';

interface RecentOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  userEmail: string;
}

interface Props {
  productCount: number;
  orderCount: number;
  userCount: number;
  revenue: number;
  reviewCount: number;
  avgRating: number;
  recentOrders: RecentOrder[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboardContent({
  productCount, orderCount, userCount, revenue, reviewCount, avgRating, recentOrders,
}: Props) {
  const { t } = useLanguage();

  const stats = [
    { label: t('admin.totalProducts'), value: productCount, icon: <Package className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: t('admin.totalOrders'), value: orderCount, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
    { label: t('admin.totalUsers'), value: userCount, icon: <Users className="w-5 h-5" />, color: 'bg-violet-50 text-violet-600' },
    { label: t('admin.totalRevenue'), value: `$${revenue.toFixed(2)}`, icon: <DollarSign className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600' },
    { label: t('admin.reviews_stat'), value: `${reviewCount} (${avgRating.toFixed(1)}★)`, icon: <Star className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.dashboard')}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{t('admin.recentOrders')}</h2>
          <Link href="/admin/orders" className="text-xs text-blue-600 hover:underline font-medium">
            {t('home.viewAll')} →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">{t('admin.orderId')}</th>
                <th className="px-6 py-3 text-left">{t('admin.customer')}</th>
                <th className="px-6 py-3 text-left">{t('admin.total')}</th>
                <th className="px-6 py-3 text-left">{t('admin.status')}</th>
                <th className="px-6 py-3 text-left">{t('admin.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-blue-600 hover:text-blue-700 font-semibold text-xs">
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{order.userEmail}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {t(`status.${order.status}`) !== `status.${order.status}` ? t(`status.${order.status}`) : order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
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
