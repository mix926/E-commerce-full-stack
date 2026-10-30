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
    >
      <button
        type="submit"
        className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        <Trash2 className="w-3 h-3" /> {t('admin.delete')}
      </button>
    </form>
  );
}
