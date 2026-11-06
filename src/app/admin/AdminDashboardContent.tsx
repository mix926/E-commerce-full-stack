'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Package, ShoppingBag, Users, DollarSign, Star, TrendingUp, ArrowUpRight } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';

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

export default function AdminDashboardContent({
  productCount, orderCount, userCount, revenue, reviewCount, avgRating, recentOrders,
}: Props) {
  const { t } = useLanguage();

  const stats = [
    {
      label: t('admin.totalProducts'),
      value: productCount,
      icon: <Package className="w-6 h-6" />,
      color: 'blue' as const,
      trend: { direction: 'up' as const, percentage: 12 },
    },
    {
      label: t('admin.totalOrders'),
      value: orderCount,
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'green' as const,
      trend: { direction: 'up' as const, percentage: 8 },
    },
    {
      label: t('admin.totalUsers'),
      value: userCount,
      icon: <Users className="w-6 h-6" />,
      color: 'violet' as const,
      trend: { direction: 'up' as const, percentage: 5 },
    },
    {
      label: t('admin.totalRevenue'),
      value: `$${revenue.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'amber' as const,
      trend: { direction: 'up' as const, percentage: 15 },
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <AdminHeader
        title={t('admin.dashboard')}
        subtitle="Welcome back! Here's an overview of your store performance."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={String(stat.label)}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/products/new"
            className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Add Product</h3>
            <p className="text-sm text-gray-500">Create a new product in your catalog</p>
          </Link>

          <Link
            href="/admin/orders"
            className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">View Orders</h3>
            <p className="text-sm text-gray-500">Manage and fulfill customer orders</p>
          </Link>

          <Link
            href="/admin/users"
            className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-violet-300 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
            <p className="text-sm text-gray-500">View and manage customer accounts</p>
          </Link>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t('admin.recentOrders')}</h2>
              <p className="text-xs text-gray-500 mt-1">Latest orders from your customers</p>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              {t('home.viewAll')} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No orders yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{t('admin.orderId')}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{t('admin.customer')}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{t('admin.total')}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{t('admin.status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{t('admin.date')}</th>
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
                      <td className="px-6 py-4 text-gray-700 text-sm">{order.userEmail}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Statistics Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reviews Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Customer Reviews</h3>
              </div>
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">out of 5 stars</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{reviewCount} total reviews</p>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Store Performance</h3>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">98%</span>
              <span className="text-sm text-gray-500">uptime</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">All systems operating normally</p>
          </div>
        </div>
      </div>
    </div>
  );
}
