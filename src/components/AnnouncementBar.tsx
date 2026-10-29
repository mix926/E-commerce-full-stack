'use client';

import { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLanguage();

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 text-white text-xs sm:text-sm py-2 px-4 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center flex-wrap">
          <span className="inline-flex items-center gap-1 font-semibold bg-white/20 px-2 py-0.5 rounded-full text-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> {t('announcement.offer')}
          </span>
          <span>
            {t('announcement.text')}{' '}
            <span className="bg-yellow-400 text-gray-900 font-mono font-bold px-1.5 py-0.5 rounded text-xs select-all">
              WELCOME10
            </span>
          </span>
          <span className="hidden md:inline">• {t('announcement.freeDelivery')}</span>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-yellow-200 transition-colors ml-1"
          >
            {t('announcement.shopNow')} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
