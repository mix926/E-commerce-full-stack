'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
  product: Product;
  categoryTranslations?: Record<string, string>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product, categoryTranslations = {} }: ProductCardProps) {
  const { t, lang } = useLanguage();

  function getCategoryLabel(cat: string): string {
    if (lang === 'km') {
      if (categoryTranslations[cat]) return categoryTranslations[cat];
      const key = `category.${cat.toLowerCase()}`;
      const translated = t(key);
      if (translated !== key) return translated;
    }
    return cat;
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full">
      {/* Image */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden flex-shrink-0">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Stock Badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 bg-amber-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow">
            {t('product.only')} {product.stock} {t('product.leftInStock')}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow">
            {t('product.outOfStock')}
          </span>
        )}

        {/* Wishlist */}
        <div className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category,
              rating: product.rating,
              stock: product.stock,
            }}
            size="sm"
          />
        </div>
      </div>

      {/* Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Category + Rating row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full truncate">
            {getCategoryLabel(product.category)}
          </span>
          <StarRating rating={product.rating} />
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-2 mb-3 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Price + Cart */}
        <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider">{t('product.price')}</p>
              <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-none">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              disabled={product.stock === 0}
              className="text-[10px] sm:text-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg touch-target"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
