'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Users, Mail, Calendar, ShoppingBag } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  ordersCount: number;
  createdAt: string;
}

export default function AdminUsersContent({ users }: { users: User[] }) {
  const { t } = useLanguage();

  const columns = [
    {
      key: 'name' as const,
      label: 'Full Name',
      sortable: true,
      render: (value: string | null) => (
        <span className="font-semibold text-gray-900">{value || '—'}</span>
      ),
    },
    {
      key: 'email' as const,
      label: 'Email Address',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{value}</span>
        </div>
      ),
    },
    {
      key: 'role' as const,
      label: 'Role',
      sortable: true,
      render: (value: string) => (
        <StatusBadge status={value} variant={value === 'admin' ? 'info' : 'default'} />
      ),
    },
    {
      key: 'ordersCount' as const,
      label: 'Orders',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'createdAt' as const,
      label: 'Joined',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        title={t('admin.usersTitle')}
        subtitle={`Manage ${users.length} customers and their accounts`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Users' }]}
      />

      <div className="p-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Admins</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <Users className="w-8 h-8 text-violet-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.reduce((acc, u) => acc + u.ordersCount, 0)}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={users}
          searchableColumns={['name', 'email']}
          emptyState={{
            title: 'No Users',
            description: 'No customers have registered yet',
            icon: <Users className="w-12 h-12 text-gray-300" />,
          }}
        />
      </div>
    </div>
  );
}
