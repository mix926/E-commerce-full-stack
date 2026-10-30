'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Phone } from 'lucide-react';
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
  const { t } = useLanguage();

  const categories = ['All', 'Shipping', 'Payments', 'Returns', 'Orders', 'Warranty'];

  const filteredFaqs =
    activeCategory === 'All'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          {t('faq.title')}
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
          {t('faq.subtitle')}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setOpenIndex(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('faq.' + cat.toLowerCase())}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="space-y-3 mb-12">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.qKey}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors"
              >
                <span>{t(faq.qKey)}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50 animate-in fade-in duration-200">
                  {t(faq.aKey)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div>
          <h2 className="text-xl font-bold mb-1">{t('faq.stillQuestions')}</h2>
          <p className="text-blue-100 text-sm">
            {t('faq.supportDesc')}
          </p>
        </div>
        <Link
          href="/contact"
          className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shrink-0 text-sm flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          {t('faq.contactSupport')}
        </Link>
      </div>
    </div>
  );
}
