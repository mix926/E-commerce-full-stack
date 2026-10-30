import Link from 'next/link';
import { getSession } from '@/lib/session';
import { getCartCount } from '@/actions/cart';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-gray-900 text-lg font-extrabold tracking-tight">
                E<span className="text-blue-600">-Shop</span>
              </span>
              <span className="text-[9px] text-gray-400 font-semibold tracking-[0.15em] uppercase mt-0.5">
                Premium Store
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <NavSearchBar />

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <LanguageSwitcher />

            <WishlistNavButton />

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex items-center text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-blue-50"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-full w-4.5 h-4.5 min-w-[1.1rem] min-h-[1.1rem] flex items-center justify-center leading-none px-1">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {session ? (
              <UserMenu name={session.name} email={session.email} role={session.role} />
            ) : (
              <NavAuthButtons />
            )}

            <MobileNav
              cartCount={cartCount}
              user={session ? { name: session.name, email: session.email } : null}
            />
          </div>
        </div>

        <NavCategoryBar />
      </div>
    </header>
  );
}
