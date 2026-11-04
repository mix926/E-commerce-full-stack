'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, Star, FolderOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSidebarNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: t('admin.products'), icon: Package, exact: false },
    { href: '/admin/categories', label: 'Categories', icon: FolderOpen, exact: false },
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
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{label}</span>
          </Link>
        );
      })}
    </>
  );
}
