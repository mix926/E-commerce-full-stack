'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Zap, TrendingUp, Sparkles, Package, Users } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/context/LanguageContext';

interface HomeContentProps {
  products: Product[];
  featuredProducts: Product[];
  searchQuery: string;
}

export default function HomeContent({ products, featuredProducts, searchQuery }: HomeContentProps) {
  const { t } = useLanguage();

  const features = [
    { icon: <Truck className="w-5 h-5 text-blue-600" />, title: t('home.features.freeShipping'), desc: t('home.features.freeShippingDesc'), bg: 'bg-blue-50' },
    { icon: <RefreshCw className="w-5 h-5 text-emerald-600" />, title: t('home.features.easyReturns'), desc: t('home.features.easyReturnsDesc'), bg: 'bg-emerald-50' },
    { icon: <ShieldCheck className="w-5 h-5 text-violet-600" />, title: t('home.features.securePayment'), desc: t('home.features.securePaymentDesc'), bg: 'bg-violet-50' },
    { icon: <Star className="w-5 h-5 text-amber-500" />, title: t('home.features.topQuality'), desc: t('home.features.topQualityDesc'), bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      {!searchQuery && (
        <section className="relative overflow-hidden bg-[#0a0f1e] text-white min-h-[580px] flex items-center">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#0d1a3a] to-[#0a1628]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Glow blobs */}
          <div className="absolute top-0 left-1/3 w-[480px] h-[480px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[320px] h-[320px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/4 right-10 w-[200px] h-[200px] bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-16">

              {/* LEFT — copy */}
              <div className="flex-1 text-center lg:text-left">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold px-4 py-2 rounded-full mb-6 backdrop-blur">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  {t('home.hero.badge')}
                </span>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6">
                  <span className="text-white">{t('home.hero.title1')}</span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
                    {t('home.hero.title2')}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-[440px] mx-auto lg:mx-0 leading-relaxed">
                  {t('home.hero.subtitle')}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
                  <Link
                    href="/products"
                    className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    {t('home.hero.shopNow')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/products?category=Electronics"
                    className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 border border-white/15 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 backdrop-blur hover:-translate-y-0.5"
                  >
                    {t('home.hero.viewElectronics')}
                  </Link>
                </div>

                {/* Trust row */}
                <div className="flex items-center gap-6 justify-center lg:justify-start flex-wrap">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Truck className="w-4 h-4 text-blue-400" />
                    <span>Free shipping $50+</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <RefreshCw className="w-4 h-4 text-violet-400" />
                    <span>30-day returns</span>
                  </div>
                </div>
              </div>

              {/* RIGHT — stats + floating cards */}
              <div className="hidden lg:flex flex-col gap-4 shrink-0 w-72">
                {/* Big stat card */}
                <div className="relative bg-white/6 border border-white/10 rounded-2xl p-5 backdrop-blur overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-2.5">
                      <Package className="w-5 h-5 text-blue-300" />
                    </div>
                    <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">+12%</span>
                  </div>
                  <p className="text-3xl font-extrabold text-white mb-0.5">500+</p>
                  <p className="text-slate-400 text-sm">{t('home.products')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Customers */}
                  <div className="bg-white/6 border border-white/10 rounded-2xl p-4 backdrop-blur">
                    <div className="bg-violet-500/20 border border-violet-500/30 rounded-xl p-2 mb-3 w-fit">
                      <Users className="w-4 h-4 text-violet-300" />
                    </div>
                    <p className="text-xl font-extrabold text-white">10k+</p>
                    <p className="text-slate-400 text-xs mt-0.5">{t('home.customers')}</p>
                  </div>
                  {/* Rating */}
                  <div className="bg-white/6 border border-white/10 rounded-2xl p-4 backdrop-blur">
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-2 mb-3 w-fit">
                      <Star className="w-4 h-4 text-amber-300" />
                    </div>
                    <p className="text-xl font-extrabold text-white">4.9★</p>
                    <p className="text-slate-400 text-xs mt-0.5">{t('home.rating')}</p>
                  </div>
                </div>

                {/* Promo pill */}
                <div className="bg-gradient-to-r from-blue-600/40 to-violet-600/40 border border-white/10 rounded-2xl p-4 backdrop-blur flex items-center gap-3">
                  <div className="bg-yellow-400/20 rounded-xl p-2 shrink-0">
                    <Zap className="w-4 h-4 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">Flash deals live now</p>
                    <p className="text-slate-400 text-xs mt-0.5">Up to 40% off selected items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES STRIP ── */}
      {!searchQuery && (
        <section className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {features.map((feat) => (
                <div key={feat.title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={`${feat.bg} p-2.5 rounded-xl shrink-0 group-hover:scale-105 transition-transform`}>{feat.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{feat.title}</p>
                    <p className="text-xs text-gray-500">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search results info */}
        {searchQuery && (
          <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <h2 className="text-lg font-bold text-gray-900">
              {t('home.searchResults')} &ldquo;{searchQuery}&rdquo;
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">{products.length} {t('home.productsFound')}</p>
            <Link href="/" className="text-sm text-blue-600 hover:underline mt-1 inline-flex items-center gap-1 font-medium">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> {t('home.clearSearch')}
            </Link>
          </div>
        )}

        {/* Section header */}
        {!searchQuery && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full" />
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">{t('home.allProducts')}</h2>
                <p className="text-sm text-gray-400">{products.length} {t('home.productsAvailable')}</p>
              </div>
            </div>
            <Link
              href="/products"
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
            >
              {t('home.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Products */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.noProductsFound')}</h3>
            <p className="text-gray-500 mb-6">{t('home.noProductsDesc')}</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm">
              {t('home.browseAll')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Top Rated */}
        {!searchQuery && featuredProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-amber-400 rounded-full" />
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                  {t('home.topRated')}
                </h2>
                <p className="text-sm text-gray-400">{t('home.topRatedDesc')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
