'use client';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5 border border-gray-200">
      <Globe className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
      <button
        onClick={() => setLang('en')}
        className={`text-xs font-bold px-2 py-1 rounded-md transition-all ${
          lang === 'en'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="English"
      >
        EN
      </button>
      <button
        onClick={() => setLang('km')}
        className={`text-xs font-bold px-2 py-1 rounded-md transition-all ${
          lang === 'km'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Khmer"
      >
        ខ្មែរ
      </button>
    </div>
  );
}
