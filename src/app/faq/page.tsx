'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Phone, Search, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface FAQEntry {
  category: string;
  qKey: string;
  aKey: string;
}

const FAQS: FAQEntry[] = [
  { category: 'Shipping', qKey: 'faq.q1', aKey: 'faq.a1' },
  { category: 'Shipping', qKey: 'faq.q2', aKey: 'faq.a2' },
  { category: 'Payments', qKey: 'faq.q3', aKey: 'faq.a3' },
  { category: 'Payments', qKey: 'faq.q4', aKey: 'faq.a4' },
  { category: 'Returns', qKey: 'faq.q5', aKey: 'faq.a5' },
  { category: 'Returns', qKey: 'faq.q6', aKey: 'faq.a6' },
  { category: 'Orders', qKey: 'faq.q7', aKey: 'faq.a7' },
  { category: 'Warranty', qKey: 'faq.q8', aKey: 'faq.a8' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const categories = ['All', 'Shipping', 'Payments', 'Returns', 'Orders', 'Warranty'];

  let filteredFaqs =
    activeCategory === 'All'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  if (searchQuery.trim()) {
    filteredFaqs = filteredFaqs.filter(f =>
      t(f.qKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(f.aKey).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 mb-4 shadow-lg">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
          {t('faq.title')}
        </h1>
        <p className="text-gray-500 text-base mt-2 max-w-md mx-auto">
          {t('faq.subtitle')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '50ms' }}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
        {categories.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setOpenIndex(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-md ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
            style={{
              animation: 'fadeInScale 0.3s ease-out forwards',
              animationDelay: `${150 + idx * 50}ms`,
              opacity: 0,
            }}
          >
            {t('faq.' + cat.toLowerCase())}
          </button>
        ))}
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="py-16 px-8 bg-white border border-gray-200 rounded-2xl text-center animate-in fade-in duration-500">
          <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 text-sm">Try searching with different keywords or browse categories</p>
        </div>
      ) : (
        <div className="space-y-3 mb-12">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.qKey}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors group"
                >
                  <span className="group-hover:text-blue-600 transition-colors line-clamp-2">{t(faq.qKey)}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-all duration-300 group-hover:text-blue-600 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    {t(faq.aKey)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Help Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-lg animate-in fade-in scale-95 duration-500" style={{ animationDelay: '200ms', background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 bg-white pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{t('faq.stillQuestions')}</h2>
          <p className="text-blue-100 text-sm">
            {t('faq.supportDesc')}
          </p>
        </div>

        <Link
          href="/contact"
          className="relative z-10 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all active:scale-95 shrink-0 text-sm flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Phone className="w-4 h-4" />
          {t('faq.contactSupport')}
        </Link>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
