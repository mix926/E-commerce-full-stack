'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Mail, Phone, MapPin,
  Send, ShieldCheck, CheckCircle2, Heart,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const [email, setEmail]         = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useLanguage();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-white border-t border-gray-100">

      {/* ── Top bar ── */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

            {/* Brand */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-flex items-center gap-2.5 text-gray-900 font-black text-xl tracking-tight">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                E<span className="text-indigo-600">-Shop</span>
              </Link>

              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                {t('footer.tagline')}
              </p>

              <div className="space-y-2 text-xs text-gray-400 pt-1">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Monivong Blvd, Phnom Penh, Cambodia</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>+855 (0) 23 888 999</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>support@eshop-demo.com</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-gray-900 text-xs font-black uppercase tracking-widest mb-4">
                {t('footer.categories')}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { value: 'Electronics', key: 'category.electronics' },
                  { value: 'Accessories', key: 'category.accessories' },
                  { value: 'Clothing',    key: 'category.clothing' },
                  { value: 'Home',        key: 'category.home' },
                  { value: 'Sports',      key: 'category.sports' },
                  { value: 'Books',       key: 'category.books' },
                ].map((cat) => (
                  <li key={cat.value}>
                    <Link href={`/products?category=${cat.value}`}
                      className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">
                      {t(cat.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="text-gray-900 text-xs font-black uppercase tracking-widest mb-4">
                {t('footer.customerCare')}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: '/faq',     label: t('footer.helpFaq') },
                  { href: '/orders',  label: t('footer.trackOrder') },
                  { href: '/wishlist',label: t('footer.myWishlist') },
                  { href: '/contact', label: t('footer.shipping') },
                  { href: '/contact', label: t('footer.returns') },
                  { href: '/contact', label: t('footer.contactSupport') },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}
                      className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-gray-900 text-xs font-black uppercase tracking-widest mb-4">
                {t('footer.newsletter')}
              </h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                {t('footer.newsletterDesc')}
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('footer.emailPlaceholder')} required
                    className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 text-xs rounded-xl px-3.5 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button type="submit" aria-label="Subscribe"
                    className="absolute right-1 top-1 bottom-1 px-3 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white' }}>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {subscribed && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    {t('footer.subscribed')}
                  </div>
                )}
              </form>

              <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {t('footer.privacy')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom strip ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Payment badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">{t('footer.securePayments')}</span>
            {['VISA', 'Mastercard', 'KHQR / ABA', 'PayPal', 'Cash on Delivery'].map((m) => (
              <span key={m}
                className="bg-gray-100 border border-gray-200 text-gray-500 text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                {m}
              </span>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-400 text-center md:text-right">
            <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
            <p className="mt-0.5 flex items-center justify-center md:justify-end gap-1 text-gray-300">
              {t('footer.crafted')} <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> {t('footer.forShoppers')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
