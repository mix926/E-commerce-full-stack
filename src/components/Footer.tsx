'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const [email, setEmail] = useState('');
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
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info (2 cols on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span>
                E<span className="text-blue-500">-Shop</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {t('footer.tagline')}
            </p>

            <div className="space-y-2 text-xs text-gray-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Monivong Blvd, Phnom Penh, Cambodia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+855 (0) 23 888 999 / +1 (800) 555-0199</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@eshop-demo.com</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
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
                  <Link
                    href={`/products?category=${cat.value}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {t(cat.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              {t('footer.customerCare')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/faq" className="hover:text-blue-400 transition-colors">
                  {t('footer.helpFaq')}
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-blue-400 transition-colors">
                  {t('footer.trackOrder')}
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-blue-400 transition-colors">
                  {t('footer.myWishlist')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  {t('footer.contactSupport')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              {t('footer.newsletter')}
            </h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              {t('footer.newsletterDesc')}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  required
                  className="w-full bg-gray-800 text-white placeholder-gray-500 text-xs rounded-xl px-3.5 py-2.5 border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-950/50 p-2 rounded-lg border border-green-800">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('footer.subscribed')}</span>
                </div>
              )}
            </form>

            <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t('footer.privacy')}</span>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Payment Badges & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Payment Methods */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 mr-2">{t('footer.securePayments')}</span>
            {['VISA', 'Mastercard', 'KHQR / ABA', 'PayPal', 'Apple Pay', 'Cash on Delivery'].map((method) => (
              <span
                key={method}
                className="bg-gray-800 border border-gray-700 text-gray-300 text-[11px] font-semibold px-2.5 py-1 rounded-md"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500 text-center md:text-right">
            <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
            <p className="mt-0.5 text-gray-600 flex items-center justify-center md:justify-end gap-1">
              {t('footer.crafted')} <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> {t('footer.forShoppers')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
