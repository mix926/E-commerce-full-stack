'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Zap, TrendingUp } from 'lucide-react';
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
      {/* Hero */}
      {!searchQuery && (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
          {/* decorative blobs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5 border border-white/20">
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                {t('home.hero.badge')}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-5">
                {t('home.hero.title1')}<br />
                <span className="text-yellow-300">{t('home.hero.title2')}</span>
              </h1>
              <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/products"
                  className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 justify-center shadow-lg shadow-black/10"
                >
                  {t('home.hero.shopNow')} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=Electronics"
                  className="border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 justify-center backdrop-blur"
                >
                  {t('home.hero.viewElectronics')}
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden md:grid grid-cols-1 gap-3 shrink-0">
              {[
                { value: '500+', label: t('home.products') },
                { value: '10k+', label: t('home.customers') },
                { value: '4.9★', label: t('home.rating') },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-4 text-center min-w-[130px]">
                  <div className="text-2xl font-extrabold">{stat.value}</div>
                  <div className="text-blue-200 text-xs mt-0.5 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features strip */}
      {!searchQuery && (
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {features.map((feat) => (
                <div key={feat.title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`${feat.bg} p-2.5 rounded-xl shrink-0`}>{feat.icon}</div>
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
