'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';

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

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const columns = [
    {
      key: 'id' as const,
      label: 'Order ID',
      sortable: true,
      width: '120px',
      render: (value: string) => (
        <Link href={`/admin/orders/${value}`} className="font-mono text-blue-600 hover:text-blue-700 font-semibold text-xs">
          #{value.slice(-8).toUpperCase()}
        </Link>
      ),
    },
    {
      key: 'user' as const,
      label: 'Customer',
      sortable: true,
      render: (value: { email: string }) => (
        <span className="text-gray-700">{value.email}</span>
      ),
    },
    {
      key: 'total' as const,
      label: 'Amount',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-gray-900">${value.toFixed(2)}</span>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'createdAt' as const,
      label: 'Order Date',
      sortable: true,
      render: (value: Date) => (
        <span className="text-gray-500 text-sm">{new Date(value).toLocaleDateString()}</span>
      ),
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <AdminHeader
        title={t('admin.ordersTitle')}
        subtitle={`Monitor ${orders.length} orders from your customers`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Orders' }]}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statusTabs.map((tab) => (
            <Link
              key={tab}
              href={tab === 'all' ? '/admin/orders' : `/admin/orders?status=${tab}`}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                activeTab === tab
                  ? 'bg-blue-50 border-blue-300 shadow-md'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
                {tab === 'all' ? 'All Orders' : t(`status.${tab}`)}
              </p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts[tab as keyof typeof statusCounts]}</p>
            </Link>
          ))}
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={orders.map(o => ({
            id: o.id,
            user: o.user,
            total: o.total,
            status: o.status,
            createdAt: o.createdAt,
          }))}
          searchableColumns={['id', 'user']}
          actions={(row) => (
            <Link
              href={`/admin/orders/${row.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              View <ArrowRight className="w-3 h-3" />
            </Link>
          )}
          emptyState={{
            title: 'No Orders',
            description: `No ${activeTab !== 'all' ? activeTab : ''} orders yet`.trim(),
            icon: <ShoppingBag className="w-12 h-12 text-gray-300" />,
          }}
        />
      </div>
    </div>
  );
}
