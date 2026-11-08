'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import AdminSidebarNav from '@/app/admin/AdminSidebarNav';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-800 shrink-0">
        <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-lg bg-gray-700 dark:bg-gray-600 flex items-center justify-center group-hover:bg-gray-600 dark:group-hover:bg-gray-500 transition-all shrink-0">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base leading-none">E-Shop</span>
            <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-semibold">Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto">
        <AdminSidebarNav onNavigate={() => setIsOpen(false)} />
      </nav>

      {/* Language Switcher */}
      <div className="p-4 border-t border-gray-800 shrink-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-semibold">Language</p>
        <LanguageSwitcher />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center justify-between px-4 z-40 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-base">E-Shop</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold ml-1">Admin</span>
        </div>
        <button onClick={() => setIsOpen(true)} aria-label="Open menu"
          className="p-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors touch-target">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex-col border-r border-gray-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-64 max-w-[80vw] h-[100dvh] bg-gray-900 text-white flex flex-col shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Admin Navigation Menu"
      >
        <button onClick={() => setIsOpen(false)} aria-label="Close menu"
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors touch-target">
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
