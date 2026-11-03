'use client';

import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight, Star, Share2 } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import { useLanguage } from '@/context/LanguageContext';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { t } = useLanguage();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wishlist',
          text: `I have ${items.length} items in my wishlist on E-Shop!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 animate-in fade-in duration-500">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                {t('wishlist.title')}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {items.length} {items.length !== 1 ? t('wishlist.items') : 'item'} {t('wishlist.saved')}
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all font-semibold text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={clearWishlist}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-semibold text-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-20 px-8 bg-white border border-gray-200 rounded-3xl shadow-sm text-center max-w-2xl mx-auto animate-in fade-in duration-500">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full ring-4 ring-rose-50/50">
              <Heart className="w-12 h-12 text-rose-300" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            {t('wishlist.empty')}
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">
            {t('wishlist.emptyDesc')}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
          >
            {t('wishlist.explore')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Product Image */}
              <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                <Link href={`/products/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-3 bg-white rounded-full hover:bg-red-50 transition-colors shadow-lg hover:shadow-xl"
                      aria-label="Remove from Wishlist"
                    >
                      <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Stock Badge */}
                {item.stock === 0 && (
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">
                  {item.category}
                </span>

                <Link href={`/products/${item.id}`} className="group/title">
                  <h3 className="text-sm font-bold text-gray-900 group-hover/title:text-blue-600 transition-colors line-clamp-2 mb-1">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{item.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className={item.stock > 0 ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ${item.price.toFixed(2)}
                  </span>
                  <AddToCartButton
                    productId={item.id}
                    productName={item.name}
                    disabled={item.stock === 0}
                    className="py-2 px-3 text-xs"
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
