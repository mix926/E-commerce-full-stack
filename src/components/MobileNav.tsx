'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  Package,
  User,
  HelpCircle,
  Phone,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { logoutUser } from '@/actions/auth';

interface MobileNavProps {
  cartCount: number;
  user: { name?: string | null; email?: string | null } | null;
}

const CATEGORIES = [
  'Electronics',
  'Accessories',
  'Clothing',
  'Home',
  'Sports',
  'Books',
];

function subscribe() {
  return () => {};
}

export default function MobileNav({ cartCount, user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const { wishlistCount } = useWishlist();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const drawerContent = (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Slide-out drawer panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] h-full h-[100dvh] bg-white shadow-2xl flex flex-col z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              E
            </div>
            <span className="font-extrabold text-gray-900 text-base">E-Shop Menu</span>
          </div>
          <button
            onClick={close}
            aria-label="Close menu"
            className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status Section */}
        <div className="shrink-0 bg-white">
          {user ? (
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {user.name || 'Shopper'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-blue-50/70 border-b border-blue-100 flex gap-2.5">
              <Link
                href="/signin"
                onClick={close}
                className="flex-1 text-center py-2.5 px-3 text-xs font-bold bg-white text-blue-600 rounded-xl border border-blue-200 shadow-xs hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={close}
                className="flex-1 text-center py-2.5 px-3 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-xs hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Scrollable Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
          {/* Quick Shortcuts: Cart & Wishlist */}
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/cart"
              onClick={close}
              className="flex items-center gap-2.5 p-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-xl transition-colors group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-blue-600">
                Cart
              </span>
            </Link>

            <Link
              href="/wishlist"
              onClick={close}
              className="flex items-center gap-2.5 p-3 bg-gray-50 hover:bg-rose-50 border border-gray-100 rounded-xl transition-colors group"
            >
              <div className="relative">
                <Heart className="w-4 h-4 text-rose-500" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-rose-600">
                Wishlist
              </span>
            </Link>
          </div>

          {/* Shop Categories */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Shop by Category
            </p>
            <div className="space-y-1">
              <Link
                href="/products"
                onClick={close}
                className="flex items-center justify-between py-2 px-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <span>All Products</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${cat}`}
                  onClick={close}
                  className="flex items-center justify-between py-2 px-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  <span>{cat}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Account & Help */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Account & Support
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <Link
                href="/orders"
                onClick={close}
                className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <Package className="w-4 h-4 text-gray-400" />
                <span>My Orders</span>
              </Link>
              <Link
                href="/profile"
                onClick={close}
                className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span>Profile Settings</span>
              </Link>
              <Link
                href="/faq"
                onClick={close}
                className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>FAQ & Help Center</span>
              </Link>
              <Link
                href="/contact"
                onClick={close}
                className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4 text-gray-400" />
                <span>Contact Us</span>
              </Link>

              {user && (
                <form action={logoutUser} className="pt-2">
                  <button
                    type="submit"
                    onClick={close}
                    className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      {/* Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="p-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Render drawer via portal into document.body to escape header backdrop-blur and stacking contexts */}
      {isClient && isOpen && createPortal(drawerContent, document.body)}
    </div>
  );
}
