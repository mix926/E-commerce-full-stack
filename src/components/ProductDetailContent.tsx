'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import { Star, ShieldCheck, Truck, RefreshCw, Package, CheckCircle2, ZoomIn } from 'lucide-react';
import QuantitySelector from '@/components/QuantitySelector';
import WishlistButton from '@/components/WishlistButton';
import { submitReview } from '@/actions/orders';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

const COLOR_MAP: Record<string, string> = {
  Black: '#1f2937', White: '#f9fafb', Red: '#ef4444', Blue: '#3b82f6',
  Green: '#22c55e', Yellow: '#eab308', Purple: '#a855f7', Pink: '#ec4899',
  Gray: '#9ca3af', Brown: '#92400e',
};

function SizePicker({ sizes }: { sizes: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="mb-6">
      <p className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3">
        Size {selected && <span className="text-blue-600 normal-case font-bold tracking-normal ml-2">— {selected}</span>}
      </p>
      <div className="flex flex-wrap gap-3">
        {sizes.map(s => (
          <button key={s} type="button" onClick={() => setSelected(s === selected ? null : s)}
            className={`min-w-[48px] px-4 py-2.5 rounded-lg text-sm font-bold border-2 transition-all hover:scale-105 active:scale-95 ${
              selected === s
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30'
                : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorPicker({ colors }: { colors: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="mb-6">
      <p className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3">
        Color {selected && <span className="text-blue-600 normal-case font-bold tracking-normal ml-2">— {selected}</span>}
      </p>
      <div className="flex flex-wrap gap-3">
        {colors.map(c => {
          const hex = COLOR_MAP[c] ?? '#9ca3af';
          return (
            <button key={c} type="button" title={c} onClick={() => setSelected(c === selected ? null : c)}
              className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-120 active:scale-95 shadow-sm ${
                selected === c ? 'border-blue-600 scale-110 shadow-lg shadow-blue-600/40 ring-2 ring-blue-600/20' : 'border-slate-300 hover:border-slate-400'
              }`}
              style={{ background: hex }}>
              {selected === c && (
                <span className="flex items-center justify-center w-full h-full text-white text-base font-black" style={{ textShadow: '0 2px 4px rgba(0,0,0,.3)' }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
  categoryTranslations?: Record<string, string>;
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sz} ${
            star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-300 text-slate-300'
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
  categoryTranslations = {},
}: ProductDetailContentProps) {
  const { t, lang } = useLanguage();
  const [showZoom, setShowZoom] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm font-medium mb-8 flex items-center gap-2">
          <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">{t('home.breadcrumbHome') || 'Home'}</Link>
          <span className="text-slate-400">/</span>
          <Link href={`/products?category=${product.category}`} className="text-slate-600 hover:text-blue-600 transition-colors">
            {getCategoryLabel(product.category)}
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-bold truncate max-w-[300px]">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20" style={{ animation: 'slideUp .5s cubic-bezier(.22,1,.36,1) both' }}>
          {/* Product Image */}
          <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200"
            style={{ aspectRatio: '1' }}>
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full hover:scale-110 transition-transform duration-700 cursor-zoom-in"
              onClick={() => setShowZoom(true)}
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <span className="bg-red-600 text-white font-black text-lg px-8 py-3 rounded-2xl shadow-2xl">
                  {t('product.outOfStock')}
                </span>
              </div>
            )}
            {/* Zoom hint */}
            {product.stock > 0 && (
              <button onClick={() => setShowZoom(true)} className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95">
                <ZoomIn className="w-5 h-5 text-slate-700" />
              </button>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-xs font-black text-blue-600 uppercase tracking-wider mb-3">
              {getCategoryLabel(product.category)}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-slate-200">
              <StarRating rating={product.rating} size="lg" />
              <span className="text-2xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
              <span className="text-slate-600 font-medium">({product.reviews.length} {t('product.reviews')})</span>
            </div>

            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-slate-700 text-base leading-relaxed mb-8 font-medium">
              {product.description}
            </p>

            {/* Sizes */}
            {product.sizes && product.sizes.trim() && (() => {
              const sizeList = product.sizes.split(',').map(s => s.trim()).filter(Boolean);
              return sizeList.length > 0 ? <SizePicker sizes={sizeList} /> : null;
            })()}

            {/* Colors */}
            {product.colors && product.colors.trim() && (() => {
              const colorList = product.colors.split(',').map(c => c.trim()).filter(Boolean);
              return colorList.length > 0 ? <ColorPicker colors={colorList} /> : null;
            })()}

            {/* Stock */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
              <Package className="w-5 h-5 text-slate-600 flex-shrink-0" />
              {product.stock > 0 ? (
                <span className={`text-sm font-bold ${product.stock <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {product.stock <= 10
                    ? `⚡ Only ${product.stock} left in stock`
                    : `✓ In stock with ${product.stock} available`}
                </span>
              ) : (
                <span className="text-sm font-bold text-red-600">✕ Out of stock</span>
              )}
            </div>

            {/* Quantity + Add to Cart + Wishlist */}
            <div className="space-y-3 mb-8">
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
                  className="w-full justify-center border-slate-300 py-4 bg-slate-50 text-slate-700 hover:bg-slate-100 border-2"
                />
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t-2 border-slate-200">
              <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <Truck className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-bold text-blue-900 text-center">{t('product.freeShipping')}</span>
                <span className="text-xs text-blue-700 text-center font-medium">{t('product.over')}</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                <RefreshCw className="w-6 h-6 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900 text-center">{t('product.easyReturns')}</span>
                <span className="text-xs text-emerald-700 text-center font-medium">{t('product.days')}</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-violet-50 rounded-xl border-2 border-violet-200">
                <ShieldCheck className="w-6 h-6 text-violet-600" />
                <span className="text-xs font-bold text-violet-900 text-center">{t('product.securePay')}</span>
                <span className="text-xs text-violet-700 text-center font-medium">{t('product.safe')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-black text-slate-900 mb-10">
            Customer Reviews <span className="text-slate-400 font-bold">({product.reviews.length})</span>
          </h2>

          {/* Write a Review */}
          {isSignedIn && !userHasReviewed && (
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 mb-10 shadow-lg">
              <h3 className="text-lg font-black text-slate-900 mb-6">{t('product.writeReview')}</h3>
              <form action={submitReview} className="space-y-6">
                <input type="hidden" name="productId" value={product.id} />
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-3 block">{t('product.yourRating')}</label>
                  <select
                    name="rating"
                    required
                    className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
                  >
                    <option value="">{t('product.selectRating')}</option>
                    <option value="5">⭐⭐⭐⭐⭐ {t('product.star5')}</option>
                    <option value="4">⭐⭐⭐⭐ {t('product.star4')}</option>
                    <option value="3">⭐⭐⭐ {t('product.star3')}</option>
                    <option value="2">⭐⭐ {t('product.star2')}</option>
                    <option value="1">⭐ {t('product.star1')}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-3 block">{t('product.yourComment')}</label>
                  <textarea
                    name="comment"
                    required
                    rows={5}
                    placeholder={t('product.commentPlaceholder')}
                    className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/30 hover:-translate-y-1 active:scale-95"
                >
                  {t('product.submitReview')}
                </button>
              </form>
            </div>
          )}

          {!isSignedIn && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-10">
              <p className="text-blue-900 text-base font-medium">
                <Link href="/signin" className="font-black hover:underline">{t('product.signInToReview')}</Link> {t('product.toWriteReview')}
              </p>
            </div>
          )}

          {/* Reviews List */}
          {product.reviews.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-slate-200">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-slate-500" />
                </div>
              </div>
              <p className="text-slate-700 font-bold text-lg">{t('product.noReviews')}</p>
              <p className="text-slate-600 text-sm mt-2">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((review, idx) => (
                <div key={review.id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all" style={{ animation: `fadeIn .4s cubic-bezier(.22,1,.36,1) ${idx * 80}ms both` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-black text-slate-900 text-base">
                        {review.user.name || review.user.email.split('@')[0]}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-medium">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-10">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((related, idx) => (
                <Link
                  key={related.id}
                  href={`/products/${related.id}`}
                  className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                  style={{ animation: `slideUp .5s cubic-bezier(.22,1,.36,1) ${idx * 100}ms both` }}
                >
                  <div className="h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-slate-900 line-clamp-2 mb-2">{related.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black text-blue-600">${related.price.toFixed(2)}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-700">{related.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Zoom Modal */}
      {showZoom && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowZoom(false)}>
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-4 right-4 text-white text-3xl font-black hover:scale-110 transition-transform bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
          >
            ×
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
