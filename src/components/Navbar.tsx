import Link from 'next/link';
import { getSession } from '@/lib/session';
import { getCartCount } from '@/actions/cart';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';
import UserMenu from './UserMenu';
import WishlistNavButton from './WishlistNavButton';
import MobileNav from './MobileNav';
import LanguageSwitcher from './LanguageSwitcher';

const QUICK_CATEGORIES = [
  'Electronics',
  'Accessories',
  'Clothing',
  'Home',
  'Sports',
  'Books',
];

export default async function Navbar() {
  const session = await getSession();
  const cartCount = session ? await getCartCount() : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-blue-600 hover:text-blue-700 transition-colors shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-gray-900 text-lg">
                E<span className="text-blue-600">-Shop</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                Premium Store
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form
            action="/products"
            method="GET"
            className="flex-1 max-w-lg hidden md:flex items-center"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                name="search"
                type="text"
                placeholder="Search across 500+ premium products..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-gray-50/80 hover:bg-gray-50 transition-colors placeholder:text-gray-400"
              />
            </div>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Wishlist Icon */}
            <WishlistNavButton />

            {/* Cart Icon */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex items-center text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in-50">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Profile or Auth Buttons */}
            {session ? (
              <UserMenu name={session.name} email={session.email} />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/signin"
                  className="text-xs font-semibold text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2 rounded-lg shadow-sm hover:shadow active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Nav Drawer Button */}
            <MobileNav
              cartCount={cartCount}
              user={session ? { name: session.name, email: session.email } : null}
            />
          </div>
        </div>

        {/* Quick Categories Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-6 py-2 border-t border-gray-100 text-xs font-medium text-gray-600 overflow-x-auto">
          <Link
            href="/products"
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            All Products
          </Link>
          {QUICK_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat}`}
              className="hover:text-blue-600 transition-colors shrink-0"
            >
              {cat}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-4 text-gray-400">
            <Link href="/faq" className="hover:text-gray-600 transition-colors">
              Help & FAQ
            </Link>
            <Link href="/contact" className="hover:text-gray-600 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form action="/products" method="GET">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              name="search"
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-gray-50"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
