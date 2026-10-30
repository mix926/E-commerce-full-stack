'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, LogOut, ChevronDown, Heart, LayoutDashboard } from 'lucide-react';
import { logoutUser } from '@/actions/auth';

interface UserMenuProps {
  name: string | null;
  email: string;
  role?: string;
}

export default function UserMenu({ name, email, role }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = name || email.split('@')[0];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
      >
        <User className="w-5 h-5" />
        <span className="hidden md:block max-w-[100px] truncate">{displayName}</span>
        <ChevronDown className={`w-3.5 h-3.5 hidden md:block transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="py-1">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-bold text-gray-800 truncate">{email}</p>
            </div>
            {role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              <Package className="w-4 h-4" />
              My Orders
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-rose-600"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              My Wishlist
            </Link>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <hr className="my-1" />
            <form action={logoutUser}>
              <button
                type="submit"
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
