import Link from 'next/link';
import { getSession } from '@/lib/session';
import { getCartCount } from '@/actions/cart';
import { getCategories, getCategoryTranslations } from '@/lib/categories';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import UserMenu from './UserMenu';
import WishlistNavButton from './WishlistNavButton';
import MobileNav from './MobileNav';
import LanguageSwitcher from './LanguageSwitcher';
import NavAuthButtons from './NavAuthButtons';
import NavCategoryBar from './NavCategoryBar';
import NavSearchBar from './NavSearchBar';

export default async function Navbar() {
  const [session, categories, categoryTranslations] = await Promise.all([
    getSession(),
    getCategories(),
    getCategoryTranslations(),
  ]);
  const cartCount = session ? await getCartCount() : 0;

  const translationsObj: Record<string, string> = {};
  categoryTranslations.forEach((value, key) => {
    translationsObj[key] = value;
  });

  return (
    <header className="sticky top-0 z-40 bg-white/98 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center shadow-md group-hover:bg-black dark:group-hover:bg-gray-600 transition-colors touch-target">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-gray-900 dark:text-white text-base sm:text-lg font-extrabold tracking-tight">
                E<span className="text-blue-600 dark:text-blue-400">-Shop</span>
              </span>
              <span className="text-[8px] sm:text-[9px] text-gray-400 dark:text-gray-500 font-semibold tracking-[0.15em] uppercase mt-0.5 hidden sm:block">
                Premium Store
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <NavSearchBar />

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <LanguageSwitcher />

            <WishlistNavButton />

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 sm:p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 touch-target"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-full min-w-[1.1rem] min-h-[1.1rem] flex items-center justify-center leading-none px-1">
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

        <NavCategoryBar categories={categories} categoryTranslations={translationsObj} />
      </div>
    </header>
  );
}
