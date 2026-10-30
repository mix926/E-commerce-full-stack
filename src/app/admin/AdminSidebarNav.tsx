'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: t('admin.products'), icon: Package, exact: false },
    { href: '/admin/orders', label: t('admin.orders'), icon: ShoppingBag, exact: false },
    { href: '/admin/reviews', label: t('admin.reviews'), icon: Star, exact: false },
    { href: '/admin/users', label: t('admin.users'), icon: Users, exact: false },
  ];

  return (
    <>
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </>
  );
}
