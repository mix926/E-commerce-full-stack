import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import AdminSidebarNav from './AdminSidebarNav';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-700/50">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base leading-none">E-Shop</span>
              <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest">Admin</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <AdminSidebarNav />
        </nav>

        {/* Language Switcher at bottom of sidebar */}
        <div className="p-4 border-t border-gray-700/50">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Language</p>
          <LanguageSwitcher />
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
