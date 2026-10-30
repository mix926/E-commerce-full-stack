'use client';

import { useLanguage } from '@/context/LanguageContext';

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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.usersTitle')}</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">{t('admin.name')}</th>
                <th className="px-6 py-3 text-left">{t('admin.email')}</th>
                <th className="px-6 py-3 text-left">{t('admin.role')}</th>
                <th className="px-6 py-3 text-left">{t('admin.ordersCount')}</th>
                <th className="px-6 py-3 text-left">{t('admin.joined')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-semibold">{user.ordersCount}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
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
