'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistNavButton() {
  const { wishlistCount } = useWishlist();

  return (
    <Link
      href="/wishlist"
      aria-label="Wishlist"
      className="relative flex items-center text-gray-700 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
    >
      <Heart className="w-5 h-5" />
      {wishlistCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in-50">
          {wishlistCount > 9 ? '9+' : wishlistCount}
        </span>
      )}
    </Link>
  );
}
