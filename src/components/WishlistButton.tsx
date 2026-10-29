'use client';

import { useWishlist, WishlistItem } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface WishlistButtonProps {
  product: WishlistItem;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WishlistButton({
  product,
  className = '',
  size = 'md',
  showLabel = false,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [animating, setAnimating] = useState(false);
  const active = isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    toggleWishlist(product);
    setTimeout(() => setAnimating(false), 300);
  };

  const iconSize = size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-4 h-4' : 'w-4 h-4';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from Wishlist' : 'Add to Wishlist'}
      className={`rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
        active
          ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm'
          : 'bg-white/90 text-gray-500 hover:text-rose-600 hover:bg-white shadow-sm border border-gray-200/80 backdrop-blur-sm'
      } ${animating ? 'scale-125' : 'scale-100'} ${
        showLabel ? 'px-4 py-2 gap-2 text-sm font-medium' : size === 'lg' ? 'p-2.5' : 'p-2'
      } ${className}`}
    >
      <Heart
        className={`${iconSize} transition-transform ${
          active ? 'fill-rose-500 text-rose-500' : ''
        }`}
      />
      {showLabel && (
        <span>{active ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
      )}
    </button>
  );
}
