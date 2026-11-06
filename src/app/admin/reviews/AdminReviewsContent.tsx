'use client';

import Link from 'next/link';
import { Star, Pencil, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useMemo } from 'react';
import DeleteReviewButton from './DeleteReviewButton';
import AdminHeader from '@/components/admin/AdminHeader';

const CATEGORIES = ['Electronics', 'Accessories', 'Clothing', 'Home', 'Sports', 'Books'];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${
            s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-bold text-gray-900">{rating}</span>
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

interface Props {
  reviews: Review[];
  totalReviews: number;
  avgRating: number | null;
  ratingFilter?: string;
  productFilter?: string;
  categoryFilter?: string;
}

export default function AdminReviewsContent({
  reviews,
  totalReviews,
  avgRating,
  ratingFilter: initialRatingFilter,
  productFilter: initialProductFilter,
  categoryFilter: initialCategoryFilter,
}: Props) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState(initialProductFilter ?? '');
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter ?? 'all');
  const [ratingFilter, setRatingFilter] = useState(initialRatingFilter ? parseInt(initialRatingFilter) : 0);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!review.product.name.toLowerCase().includes(searchLower) &&
            !review.user.email.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && review.product.category !== categoryFilter) {
        return false;
      }

      // Rating filter
      if (ratingFilter > 0 && review.rating !== ratingFilter) {
        return false;
      }

      return true;
    });
  }, [reviews, searchTerm, categoryFilter, ratingFilter]);

  const hasFilters = !!(searchTerm || categoryFilter !== 'all' || ratingFilter > 0);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <AdminHeader
        title={t('admin.reviewsManagement')}
        subtitle="Monitor and manage customer reviews across all products"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Reviews' }]}
        actions={
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">Total:</span>
              <span className="text-xl font-black text-blue-600">{totalReviews}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">Avg:</span>
              <span className="text-xl font-black text-amber-500">
                {avgRating?.toFixed(1) ?? '—'}
              </span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        }
      />

      {/* Mobile stats bar */}
      <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-around">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Total</span>
          <span className="text-lg font-black text-blue-600">{totalReviews}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Avg</span>
          <span className="text-lg font-black text-amber-500">{avgRating?.toFixed(1) ?? '—'}</span>
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                🔍 Search Product
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                📂 Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                ⭐ Rating
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="0">All Ratings</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                <option value="3">⭐⭐⭐ 3 Stars</option>
                <option value="2">⭐⭐ 2 Stars</option>
                <option value="1">⭐ 1 Star</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm font-bold text-slate-700">
                Showing <span className="text-blue-600">{filteredReviews.length}</span> of <span className="text-slate-600">{totalReviews}</span> reviews
              </div>
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 pt-4 border-t-2 border-slate-200">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setRatingFilter(0);
                }}
                className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                ✕ Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-40 bg-slate-100 overflow-hidden group">
                  <img
                    src={review.product.image}
                    alt={review.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Review Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Product Name and Category */}
                  <div className="mb-3">
                    <Link
                      href={`/products/${review.product.id}`}
                      target="_blank"
                      className="font-bold text-slate-900 hover:text-blue-600 line-clamp-1 mb-2 block"
                    >
                      {review.product.name}
                    </Link>
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      {review.product.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mb-3 pb-3 border-b-2 border-slate-100">
                    <StarDisplay rating={review.rating} />
                  </div>

                  {/* Customer Info */}
                  <div className="mb-3 pb-3 border-b-2 border-slate-100">
                    <p className="text-xs font-bold text-slate-700 mb-1">
                      {review.user.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {review.user.email}
                    </p>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-slate-700 line-clamp-3 mb-3 flex-1">
                    {review.comment}
                  </p>

                  {/* Date */}
                  <p className="text-xs text-slate-500 mb-4">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/reviews/${review.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Link>
                    <div className="flex-1">
                      <DeleteReviewButton reviewId={review.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-200">
            <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-700 font-bold text-lg mb-2">No Reviews Found</p>
            <p className="text-slate-600 text-sm mb-6">
              {hasFilters ? 'Try adjusting your filters' : 'No reviews have been submitted yet'}
            </p>
            {hasFilters && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setRatingFilter(0);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
