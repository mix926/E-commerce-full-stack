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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col overflow-y-auto border-r border-gray-800">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-700 transition-all">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base leading-none">E-Shop</span>
              <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-semibold">Admin</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 mt-2">
          <AdminSidebarNav />
        </nav>

        {/* Language Switcher */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-semibold">Language</p>
          <LanguageSwitcher />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-auto">
        {children}
      </main>
    </div>
  );
}
