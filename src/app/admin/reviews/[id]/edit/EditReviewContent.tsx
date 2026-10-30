'use client';

import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { updateReview } from '@/actions/admin';

interface Props {
  review: {
    id: string;
    rating: number;
    comment: string;
    user: { name: string | null; email: string };
    product: { name: string; image: string };
  };
}

export default function EditReviewContent({ review }: Props) {
  const { t } = useLanguage();

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/admin/reviews"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {t('admin.backToReviews')}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.editReview')}</h1>

      {/* Product info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-sm">
        <img
          src={review.product.image}
          alt={review.product.name}
          className="w-14 h-14 rounded-xl object-cover border border-gray-100"
        />
        <div>
          <p className="font-semibold text-gray-900">{review.product.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            by {review.user.name ?? review.user.email}
          </p>
        </div>
      </div>

      {/* Edit form */}
      <form
        action={updateReview.bind(null, review.id)}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5"
      >
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400" /> {t('admin.rating')}
          </label>
          <select
            name="rating"
            defaultValue={review.rating}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          >
            <option value="5">{t('product.star5')}</option>
            <option value="4">{t('product.star4')}</option>
            <option value="3">{t('product.star3')}</option>
            <option value="2">{t('product.star2')}</option>
            <option value="1">{t('product.star1')}</option>
          </select>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('admin.comment')}
          </label>
          <textarea
            name="comment"
            required
            rows={5}
            defaultValue={review.comment}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/25 active:scale-95"
          >
            {t('admin.saveReview')}
          </button>
          <Link
            href="/admin/reviews"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {t('admin.cancelReview')}
          </Link>
        </div>
      </form>
    </div>
  );
}
