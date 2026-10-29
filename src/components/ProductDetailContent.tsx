'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import { Star, ShieldCheck, Truck, RefreshCw, Package } from 'lucide-react';
import QuantitySelector from '@/components/QuantitySelector';
import WishlistButton from '@/components/WishlistButton';
import { submitReview } from '@/actions/orders';
import { useLanguage } from '@/context/LanguageContext';

interface ReviewUser {
  name: string | null;
  email: string;
}

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  user: ReviewUser;
}

interface ProductWithReviews extends Product {
  reviews: Review[];
}

interface ProductDetailContentProps {
  product: ProductWithReviews;
  relatedProducts: Product[];
  userHasReviewed: boolean;
  isSignedIn: boolean;
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sz} ${
            star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductDetailContent({
  product,
  relatedProducts,
  userHasReviewed,
  isSignedIn,
}: ProductDetailContentProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href={`/?category=${product.category}`} className="hover:text-blue-600">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="relative h-96 md:h-[500px] w-full bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-red-600 font-bold text-lg px-6 py-2 rounded-xl">
                {t('product.outOfStock')}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} size="lg" />
            <span className="text-lg font-bold text-gray-700">{product.rating.toFixed(1)}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">{product.reviews.length} {t('product.reviews')}</span>
          </div>

          <p className="text-3xl font-bold text-gray-900 mb-4">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-4 h-4 text-gray-400" />
            {product.stock > 0 ? (
              <span className={`text-sm font-medium ${product.stock <= 10 ? 'text-orange-600' : 'text-green-600'}`}>
                {product.stock <= 10
                  ? `${t('product.only')} ${product.stock} ${t('product.leftInStock')}`
                  : `${t('product.inStockAvailable')} (${product.stock} ${t('product.available')})`}
              </span>
            ) : (
              <span className="text-sm font-medium text-red-600">{t('product.outOfStock')}</span>
            )}
          </div>

          {/* Quantity + Add to Cart + Wishlist */}
          <div className="space-y-3">
            {product.stock > 0 && (
              <QuantitySelector
                productId={product.id}
                maxStock={product.stock}
                productName={product.name}
              />
            )}
            <div className="pt-1">
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
                showLabel={true}
                size="lg"
                className="w-full justify-center border-gray-300 py-3"
              />
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-gray-600">
            <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-3">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>{t('product.freeShipping')}</span>
              <span className="text-gray-400">{t('product.over')}</span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-3">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <span>{t('product.easyReturns')}</span>
              <span className="text-gray-400">{t('product.days')}</span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-3">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>{t('product.securePay')}</span>
              <span className="text-gray-400">{t('product.safe')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
          {t('product.customerReviews')} ({product.reviews.length})
        </h2>

        {/* Write a Review */}
        {isSignedIn && !userHasReviewed && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('product.writeReview')}</h3>
            <form action={submitReview}>
              <input type="hidden" name="productId" value={product.id} />
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('product.yourRating')}</label>
                <select
                  name="rating"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('product.selectRating')}</option>
                  <option value="5">5 stars — Excellent</option>
                  <option value="4">4 stars — Good</option>
                  <option value="3">3 stars — Average</option>
                  <option value="2">2 stars — Poor</option>
                  <option value="1">1 star — Terrible</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('product.yourComment')}</label>
                <textarea
                  name="comment"
                  required
                  rows={4}
                  placeholder={t('product.commentPlaceholder')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {t('product.submitReview')}
              </button>
            </form>
          </div>
        )}

        {!isSignedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <p className="text-blue-700 text-sm">
              <Link href="/signin" className="font-bold hover:underline">{t('product.signInToReview')}</Link>{' '}
              {t('product.toWriteReview')}
            </p>
          </div>
        )}

        {/* Reviews List */}
        {product.reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="flex justify-center mb-3">
              <div className="bg-gray-200 rounded-full p-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">{t('product.noReviews')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">
                      {review.user.name || review.user.email.split('@')[0]}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{t('product.relatedProducts')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={`/products/${related.id}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <div className="h-36 bg-gray-100 overflow-hidden">
                  <img
                    src={related.image}
                    alt={related.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">{related.name}</p>
                  <p className="text-blue-600 font-bold mt-1">${related.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
