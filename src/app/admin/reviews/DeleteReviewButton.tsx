'use client';

import { Trash2 } from 'lucide-react';
import { deleteReview } from '@/actions/admin';
import { useLanguage } from '@/context/LanguageContext';

export default function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const { t } = useLanguage();

  return (
    <form
      action={deleteReview.bind(null, reviewId)}
      onSubmit={(e) => {
        if (!confirm(t('admin.deleteReview'))) e.preventDefault();
      }}
      className="w-full"
    >
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border-2 border-red-200 transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
    </form>
  );
}
