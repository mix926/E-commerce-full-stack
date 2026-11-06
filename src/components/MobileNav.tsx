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
  Globe,
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { logoutUser } from '@/actions/auth';
import LanguageSwitcher from './LanguageSwitcher';

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
        <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs text-xs sm:text-sm">
              E
            </div>
            <span className="font-extrabold text-gray-900 text-sm sm:text-base">E-Shop Menu</span>
          </div>
          <button
            onClick={close}
            aria-label="Close menu"
            className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors touch-target flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* User Status Section */}
        <div className="shrink-0 bg-white">
          {user ? (
            <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                    {user.name || 'Shopper'}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-4 bg-blue-50/70 border-b border-blue-100 flex gap-2 sm:gap-2.5">
              <Link
                href="/signin"
                onClick={close}
                className="flex-1 text-center py-2.5 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold bg-white text-blue-600 rounded-xl border border-blue-200 shadow-xs hover:bg-blue-50 transition-colors touch-target"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={close}
                className="flex-1 text-center py-2.5 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold bg-blue-600 text-white rounded-xl shadow-xs hover:bg-blue-700 transition-colors touch-target"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Scrollable Links */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 bg-white">
          {/* Quick Shortcuts: Cart & Wishlist */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/cart"
              onClick={close}
              className="flex items-center gap-2 p-2.5 sm:p-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-xl transition-colors group touch-target"
            >
              <div className="relative shrink-0">
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
              className="flex items-center gap-2 p-2.5 sm:p-3 bg-gray-50 hover:bg-rose-50 border border-gray-100 rounded-xl transition-colors group touch-target"
            >
              <div className="relative shrink-0">
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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Shop by Category
            </p>
            <div className="space-y-1">
              <Link
                href="/products"
                onClick={close}
                className="flex items-center justify-between py-2 px-2.5 rounded-lg text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-blue-600 transition-colors touch-target"
              >
                <span>All Products</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${cat}`}
                  onClick={close}
                  className="flex items-center justify-between py-2 px-2.5 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors touch-target"
                >
                  <span>{cat}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Account & Help */}
          <div className="border-t border-gray-100 pt-3 sm:pt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Account & Support
            </p>
            <div className="space-y-1 text-xs sm:text-sm text-gray-600">
              <Link
                href="/orders"
                onClick={close}
                className="flex items-center gap-2 py-2 px-2.5 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors touch-target"
              >
                <Package className="w-4 h-4 text-gray-400 shrink-0" />
                <span>My Orders</span>
              </Link>
              <Link
                href="/profile"
                onClick={close}
                className="flex items-center gap-2 py-2 px-2.5 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors touch-target"
              >
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Profile Settings</span>
              </Link>
              <Link
                href="/faq"
                onClick={close}
                className="flex items-center gap-2 py-2 px-2.5 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors touch-target"
              >
                <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
                <span>FAQ & Help Center</span>
              </Link>
              <Link
                href="/contact"
                onClick={close}
                className="flex items-center gap-2 py-2 px-2.5 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors touch-target"
              >
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Contact Us</span>
              </Link>

              {/* Language Switcher */}
              <div className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-gray-50 transition-colors touch-target">
                <span className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Language</span>
                </span>
                <LanguageSwitcher />
              </div>

              {user && (
                <form action={logoutUser} className="pt-2">
                  <button
                    type="submit"
                    onClick={close}
                    className="flex items-center gap-2 w-full text-left py-2 px-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors touch-target"
                  >
                    <LogOut className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">Sign Out</span>
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
        className="p-2 sm:p-2.5 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors touch-target"
      >
        <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Render drawer via portal into document.body to escape header backdrop-blur and stacking contexts */}
      {isClient && isOpen && createPortal(drawerContent, document.body)}
    </div>
  );
}
