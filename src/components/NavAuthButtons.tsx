'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NavAuthButtons() {
  const { t } = useLanguage();

  return (
    <div className="hidden sm:flex items-center gap-2">
      <Link
        href="/signin"
        className="text-xs font-semibold text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
      >
        {t('nav.signIn')}
      </Link>
      <Link
        href="/signup"
        className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2 rounded-lg shadow-sm hover:shadow active:scale-95"
      >
        {t('nav.signUp')}
      </Link>
    </div>
  );
}
