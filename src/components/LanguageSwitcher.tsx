'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
      <button
        onClick={() => setLang('en')}
        className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all ${
          lang === 'en'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLang('km')}
        className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all ${
          lang === 'km'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Switch to Khmer"
      >
        ខ្មែរ
      </button>
    </div>
  );
}
