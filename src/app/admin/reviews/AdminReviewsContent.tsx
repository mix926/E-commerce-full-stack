'use client';

import Link from 'next/link';
import { Star, Pencil, Filter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import DeleteReviewButton from './DeleteReviewButton';

const CATEGORIES = ['Electronics', 'Accessories', 'Clothing', 'Home', 'Sports', 'Books'];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-bold text-gray-700">{rating}.0</span>
    </div>
  );
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: { name: string | null; email: string };
  product: { id: string; name: string; image: string; category: string };
}

interface CategoryCount {
  category: string;
  count: number;
}

interface Props {
  reviews: Review[];
  totalReviews: number;
  avgRating: number | null;
  categoryCounts: CategoryCount[];
  ratingFilter?: string;
  productFilter?: string;
  categoryFilter?: string;
}

export default function AdminReviewsContent({
  reviews,
  totalReviews,
  avgRating,
  categoryCounts,
  ratingFilter,
  productFilter,
  categoryFilter,
}: Props) {
  const { t } = useLanguage();

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = {
      ...(ratingFilter ? { rating: ratingFilter } : {}),
      ...(productFilter ? { product: productFilter } : {}),
      ...(categoryFilter ? { category: categoryFilter } : {}),
      ...overrides,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== 'all') params.set(k, v);
    });
    const qs = params.toString();
    return `/admin/reviews${qs ? `?${qs}` : ''}`;
  }

  const hasFilters = !!(ratingFilter || productFilter || (categoryFilter && categoryFilter !== 'all'));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.reviewsManagement')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalReviews} {t('admin.totalReviews')} · {t('admin.avgRating')}:{' '}
            <span className="text-amber-500 font-semibold">
              {avgRating?.toFixed(1) ?? '—'}★
            </span>
          </p>
        </div>
        {hasFilters && (
          <Link
            href="/admin/reviews"
            className="text-xs font-semibold text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            {t('admin.clearAll')}
          </Link>
        )}
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> {t('admin.filterCategory')}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildUrl({ category: undefined })}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              !categoryFilter || categoryFilter === 'all'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {t('admin.all')} ({totalReviews})
          </Link>

          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={buildUrl({ category: cat })}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                categoryFilter === cat
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {categoryCounts.find((c) => c.category === cat)?.count ?? 0}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── STAR FILTER ── */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {t('admin.filterRating')}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildUrl({ rating: undefined })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              !ratingFilter || ratingFilter === 'all'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
            }`}
          >
            {t('admin.allStars')}
          </Link>
          {[5, 4, 3, 2, 1].map((star) => (
            <Link
              key={star}
              href={buildUrl({ rating: String(star) })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                ratingFilter === String(star)
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600'
              }`}
            >
              {'★'.repeat(star)} {star}
            </Link>
          ))}
        </div>
      </div>

      {/* ── SEARCH ── */}
      <form method="GET" action="/admin/reviews" className="mb-6 flex gap-2 flex-wrap">
        {ratingFilter && <input type="hidden" name="rating" value={ratingFilter} />}
        {categoryFilter && categoryFilter !== 'all' && (
          <input type="hidden" name="category" value={categoryFilter} />
        )}
        <input
          name="product"
          type="text"
          defaultValue={productFilter ?? ''}
          placeholder={t('admin.searchProduct')}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white shadow-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {t('admin.search')}
        </button>
      </form>

      {/* ── ACTIVE FILTERS SUMMARY ── */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {categoryFilter && categoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
              {t('admin.category')}: {categoryFilter}
              <Link href={buildUrl({ category: undefined })} className="hover:text-red-500 font-bold">✕</Link>
            </span>
          )}
          {ratingFilter && ratingFilter !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
              {'★'.repeat(parseInt(ratingFilter))} {ratingFilter} {t('admin.filterRating').toLowerCase()}
              <Link href={buildUrl({ rating: undefined })} className="hover:text-red-500 font-bold">✕</Link>
            </span>
          )}
          {productFilter && (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200">
              {t('admin.productName')}: &ldquo;{productFilter}&rdquo;
              <Link href={buildUrl({ product: undefined })} className="hover:text-red-500 font-bold">✕</Link>
            </span>
          )}
        </div>
      )}

      {/* ── REVIEWS TABLE ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Star className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p className="font-semibold text-gray-500">{t('admin.noReviews')}</p>
            <p className="text-xs mt-1">{t('products.noFoundDesc')}</p>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">
                {t('admin.showing')} <span className="font-bold text-gray-900">{reviews.length}</span> {t('admin.reviews').toLowerCase()}
                {categoryFilter && categoryFilter !== 'all' && (
                  <span> {t('admin.in')} <span className="text-blue-600 font-bold">{categoryFilter}</span></span>
                )}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">{t('admin.productName')}</th>
                    <th className="px-5 py-3 text-left">{t('admin.category')}</th>
                    <th className="px-5 py-3 text-left">{t('admin.customer')}</th>
                    <th className="px-5 py-3 text-left">{t('admin.rating')}</th>
                    <th className="px-5 py-3 text-left">{t('admin.comment')}</th>
                    <th className="px-5 py-3 text-left">{t('admin.date')}</th>
                    <th className="px-5 py-3 text-left">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.product.image}
                            alt={review.product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                          />
                          <Link
                            href={`/products/${review.product.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1 max-w-[130px]"
                            target="_blank"
                          >
                            {review.product.name}
                          </Link>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <Link
                          href={buildUrl({ category: review.product.category })}
                          className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap"
                        >
                          {review.product.category}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900 text-xs">{review.user.name ?? '—'}</p>
                        <p className="text-xs text-gray-400">{review.user.email}</p>
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        <StarDisplay rating={review.rating} />
                      </td>

                      {/* Comment */}
                      <td className="px-5 py-4 max-w-[200px]">
                        <p className="text-gray-600 line-clamp-2 text-xs leading-relaxed">
                          {review.comment}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/reviews/${review.id}/edit`}
                            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <Pencil className="w-3 h-3" /> {t('admin.edit')}
                          </Link>
                          <DeleteReviewButton reviewId={review.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
