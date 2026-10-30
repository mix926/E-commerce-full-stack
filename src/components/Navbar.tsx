import Link from 'next/link';
import { getSession } from '@/lib/session';
import { getCartCount } from '@/actions/cart';
import { ShoppingBag } from 'lucide-react';
import UserMenu from './UserMenu';
import WishlistNavButton from './WishlistNavButton';
import MobileNav from './MobileNav';
import LanguageSwitcher from './LanguageSwitcher';
import NavAuthButtons from './NavAuthButtons';
import NavCategoryBar from './NavCategoryBar';
import NavSearchBar from './NavSearchBar';

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
          <NavSearchBar />

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
              <UserMenu name={session.name} email={session.email} role={session.role} />
            ) : (
              <NavAuthButtons />
            )}

            {/* Mobile Nav Drawer Button */}
            <MobileNav
              cartCount={cartCount}
              user={session ? { name: session.name, email: session.email } : null}
            />
          </div>
        </div>

        {/* Quick Categories Bar + Mobile Search */}
        <NavCategoryBar />
      </div>
    </header>
  );
}
