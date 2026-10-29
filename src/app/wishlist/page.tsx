'use client';

import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight, Star } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            My Wishlist
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {items.length} item{items.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Wishlist
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-rose-50 rounded-full p-6 ring-8 ring-rose-50/50">
              <Heart className="w-12 h-12 text-rose-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">
            Save items you like by clicking the heart icon on any product, so you can easily find them later.
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            Explore Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
            >
              {/* Product Image */}
              <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                <Link href={`/products/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  aria-label="Remove from Wishlist"
                  className="absolute top-3 right-3 p-2 bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full shadow-sm backdrop-blur-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                  {item.category}
                </span>

                <Link href={`/products/${item.id}`}>
                  <h3 className="text-sm font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span>{item.rating.toFixed(1)}</span>
                  <span>•</span>
                  <span className={item.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                    {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <span className="text-lg font-extrabold text-gray-900">
                    ${item.price.toFixed(2)}
                  </span>
                  <AddToCartButton
                    productId={item.id}
                    productName={item.name}
                    disabled={item.stock === 0}
                    className="py-1.5 px-3 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
