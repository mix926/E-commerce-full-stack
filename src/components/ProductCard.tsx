'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative">
      {/* Product Image & Badges */}
      <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Stock Badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
            {t('product.only')} {product.stock} {t('product.leftInStock')}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-rose-600/95 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
            {t('product.outOfStock')}
          </span>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
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

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
            {t(`category.${product.category.toLowerCase()}`) || product.category}
          </span>
          <StarRating rating={product.rating} />
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400 block -mb-0.5">{t('product.price')}</span>
            <span className="text-xl font-extrabold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            disabled={product.stock === 0}
          />
        </div>
      </div>
    </div>
  );
}
