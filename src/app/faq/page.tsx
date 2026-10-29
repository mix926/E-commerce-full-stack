'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Phone } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Shipping',
    question: 'How long does shipping take?',
    answer: 'Standard delivery typically takes 2-4 business days for domestic orders, and 5-10 business days for international orders. You will receive an SMS and tracking number as soon as your parcel is dispatched.',
  },
  {
    category: 'Shipping',
    question: 'Do you offer free shipping?',
    answer: 'Yes! All orders over $50 qualify for complimentary free shipping automatically. You can also use promo code FREESHIP at checkout during select promotions.',
  },
  {
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major Credit and Debit Cards (Visa, Mastercard), KHQR / Bakong / ABA Bank transfers in Cambodia, PayPal, and Cash on Delivery (COD) for eligible regions.',
  },
  {
    category: 'Payments',
    question: 'Is my payment information secure?',
    answer: 'Yes, 100%. All transactions are processed through encrypted 256-bit SSL connections. We never store your full card numbers or sensitive security codes on our servers.',
  },
  {
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We offer a hassle-free 30-day money-back guarantee. If you are not completely satisfied with your purchase, you can initiate a return or exchange within 30 days of receiving your item.',
  },
  {
    category: 'Returns',
    question: 'How do I cancel or modify an order?',
    answer: 'You can cancel an order directly from your "My Orders" page as long as the status is still "pending" or "processing". Once shipped, simply initiate a return upon receipt.',
  },
  {
    category: 'Orders',
    question: 'How can I track my order?',
    answer: 'Visit the "My Orders" tab from your user menu and click "View Details" on any order to see real-time status progression from processing to delivery.',
  },
  {
    category: 'Warranty',
    question: 'Do electronics come with a warranty?',
    answer: 'All electronics and gadgets come with a minimum 1-year manufacturer warranty covering factory defects and hardware malfunctions.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

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
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
          Find fast answers to common questions about shipping, returns, payment security, and our products.
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
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="space-y-3 mb-12">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div>
          <h2 className="text-xl font-bold mb-1">Still have questions?</h2>
          <p className="text-blue-100 text-sm">
            Our friendly customer support team is available 24/7 to assist you.
          </p>
        </div>
        <Link
          href="/contact"
          className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shrink-0 text-sm flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Contact Support
        </Link>
      </div>
    </div>
  );
}
