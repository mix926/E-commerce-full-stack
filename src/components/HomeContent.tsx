'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import {
  ArrowRight, Star, ShieldCheck, Truck, RefreshCw,
  Zap, TrendingUp, Sparkles, Tag, CheckCircle2,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useRef, useState } from 'react';

interface HomeContentProps {
  products: Product[];
  featuredProducts: Product[];
  searchQuery: string;
}

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function HomeContent({ products, featuredProducts, searchQuery }: HomeContentProps) {
  const { t } = useLanguage();
  const productsReveal = useReveal();
  const featuredReveal = useReveal();
  const statsReveal = useReveal(0.3);

  // ── Product carousel state ──
  const showcaseProducts = products.slice(0, 6);
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  useEffect(() => {
    if (showcaseProducts.length < 2) return;
    const id = setInterval(() => {
      setDirection('next');
      setAnimating(true);
      setTimeout(() => {
        setActiveIdx(i => (i + 1) % showcaseProducts.length);
        setAnimating(false);
      }, 350);
    }, 4000);
    return () => clearInterval(id);
  }, [showcaseProducts.length]);

  const goTo = (idx: number) => {
    if (idx === activeIdx || animating) return;
    setDirection(idx > activeIdx ? 'next' : 'prev');
    setAnimating(true);
    setTimeout(() => { setActiveIdx(idx); setAnimating(false); }, 350);
  };

  const activeProduct = showcaseProducts[activeIdx];

  const features = [
    { icon: <Truck className="w-6 h-6 text-blue-600" />, title: t('home.features.freeShipping'), desc: t('home.features.freeShippingDesc'), color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: <RefreshCw className="w-6 h-6 text-emerald-600" />, title: t('home.features.easyReturns'), desc: t('home.features.easyReturnsDesc'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: <ShieldCheck className="w-6 h-6 text-violet-600" />, title: t('home.features.securePayment'), desc: t('home.features.securePaymentDesc'), color: 'text-violet-600', bg: 'bg-violet-50' },
    { icon: <Star className="w-6 h-6 text-amber-600" />, title: t('home.features.topQuality'), desc: t('home.features.topQualityDesc'), color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style>{`
        @keyframes fadeUp      { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft    { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeRight   { from{opacity:0;transform:translateX(24px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes cardPop     { from{opacity:0;transform:translateY(12px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideInNext { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInPrev { from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes progressBar { from{width:0%} to{width:100%} }
        @keyframes pulse-soft  { 0%, 100% { opacity: 1 } 50% { opacity: 0.7 } }
      `}</style>

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      {!searchQuery && (
        <section className="relative overflow-hidden border-b border-slate-200" style={{ minHeight: 650 }}>
          {/* Background gradients */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* ── Copy ── */}
              <div className="text-center lg:text-left" style={{ animation: 'fadeLeft .65s cubic-bezier(.22,1,.36,1) both' }}>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 bg-blue-50 text-blue-700 border border-blue-200 ring-2 ring-blue-100/50">
                  <Sparkles className="w-4 h-4" />
                  {t('home.hero.badge')}
                </div>

                <h1 className="font-black tracking-tight leading-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
                  <span className="block text-slate-900">{t('home.hero.title1')}</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">{t('home.hero.title2')}</span>
                </h1>

                <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0 font-medium">
                  {t('home.hero.subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Link href="/products"
                    className="group inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl text-white transition-all duration-200 hover:-translate-y-1 active:scale-95 shadow-lg shadow-blue-600/30 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    {t('home.hero.shopNow')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/products?category=Electronics"
                    className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 active:scale-95 text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 shadow-sm">
                    {t('home.hero.viewElectronics')}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                  {[
                    { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Secure checkout' },
                    { icon: <Truck className="w-4 h-4" />, label: 'Free shipping $50+' },
                    { icon: <RefreshCw className="w-4 h-4" />, label: '30-day returns' },
                  ].map(b => (
                    <span key={b.label} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                      <span className="text-blue-600">{b.icon}</span>{b.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Product carousel showcase ── */}
              {activeProduct && (
                <div className="hidden lg:flex flex-col shrink-0 w-full" style={{ animation: 'fadeRight .7s cubic-bezier(.22,1,.36,1) .1s both' }}>
                  <Link href={`/products/${activeProduct.id}`}
                    className="group block rounded-3xl overflow-hidden relative shadow-2xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 transition-all duration-300">

                    {/* Image */}
                    <div className="relative overflow-hidden bg-slate-100" style={{ aspectRatio: '1' }}>
                      <img
                        key={activeProduct.id}
                        src={activeProduct.image}
                        alt={activeProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        style={{
                          animation: animating ? undefined : `${direction === 'next' ? 'slideInNext' : 'slideInPrev'} .5s cubic-bezier(.22,1,.36,1) both`,
                        }}
                      />
                      {/* Shine overlay */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                      {/* Badges */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-blue-600 shadow-lg backdrop-blur">
                        {activeProduct.category}
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 text-slate-700 shadow-lg backdrop-blur">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {activeProduct.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6 bg-white border-t-2 border-slate-100"
                      style={animating ? { opacity: 0 } : { animation: `${direction === 'next' ? 'slideInNext' : 'slideInPrev'} .5s cubic-bezier(.22,1,.36,1) .05s both` }}>
                      <p className="text-slate-900 font-bold text-lg leading-snug line-clamp-2 mb-2">
                        {activeProduct.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-blue-600">
                          ${activeProduct.price.toFixed(2)}
                        </span>
                        <span className="text-xs font-bold px-3 py-2 rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700">
                          View →
                        </span>
                      </div>
                    </div>

                    {/* Auto-progress bar */}
                    <div className="h-1 w-full bg-slate-200">
                      <div key={`${activeIdx}-bar`} className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                        style={{ animation: 'progressBar 4s linear both' }} />
                    </div>
                  </Link>

                  {/* Navigation */}
                  <div className="flex items-center justify-center gap-3 mt-6">
                    {showcaseProducts.map((_, i) => (
                      <button key={i} onClick={() => goTo(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width: i === activeIdx ? 28 : 8,
                          height: 8,
                          background: i === activeIdx ? 'linear-gradient(90deg, #2563eb, #7c3aed)' : '#e2e8f0',
                          cursor: 'pointer',
                          border: 'none',
                          padding: 0,
                        }} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════ */}
      {!searchQuery && (
        <div ref={statsReveal.ref} className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
              {[
                { value: '500+', label: t('home.products'), color: 'text-blue-600' },
                { value: '10k+', label: t('home.customers'), color: 'text-emerald-600' },
                { value: '4.9★', label: t('home.rating'), color: 'text-amber-500' },
                { value: 'Free', label: 'Shipping on $50+', color: 'text-violet-600' },
              ].map((s, i) => (
                <div key={s.label} className="py-8 px-6 text-center"
                  style={statsReveal.visible ? { animation: `fadeUp .5s cubic-bezier(.22,1,.36,1) ${i * 60}ms both` } : { opacity: 0 }}>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1.5 font-semibold uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════ */}
      {!searchQuery && (
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className={`${f.bg} border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-default`}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      {f.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-base leading-tight">{f.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">

        {searchQuery && (
          <div className="mb-10 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200 flex items-start gap-4">
            <Tag className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h2 className="font-bold text-slate-900 text-lg">
                {t('home.searchResults')} <span className="text-blue-600">&ldquo;{searchQuery}&rdquo;</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1">{products.length} {t('home.productsFound')}</p>
              <Link href="/" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" /> {t('home.clearSearch')}
              </Link>
            </div>
          </div>
        )}

        {/* Section header */}
        {!searchQuery && (
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">{t('home.allProducts')}</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">{products.length} {t('home.productsAvailable')}</p>
            </div>
            <Link href="/products"
              className="group text-sm font-bold text-white flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-blue-600/20">
              {t('home.viewAll')} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-slate-200">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Star className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">{t('home.noProductsFound')}</h3>
            <p className="text-slate-600 mb-8 text-base max-w-md mx-auto">{t('home.noProductsDesc')}</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20 hover:-translate-y-0.5">
              {t('home.browseAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div ref={productsReveal.ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <div key={product.id} style={productsReveal.visible ? { animation: `cardPop .5s cubic-bezier(.22,1,.36,1) ${i * 40}ms both` } : { opacity: 0 }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Top Rated Section */}
        {!searchQuery && featuredProducts.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  {t('home.topRated')}
                </h2>
                <p className="text-sm text-slate-500 mt-2 font-medium">{t('home.topRatedDesc')}</p>
              </div>
            </div>
            <div ref={featuredReveal.ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <div key={product.id} style={featuredReveal.visible ? { animation: `cardPop .5s cubic-bezier(.22,1,.36,1) ${i * 50}ms both` } : { opacity: 0 }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        {!searchQuery && (
          <div className="mt-24 rounded-3xl overflow-hidden relative text-center py-16 px-6 border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-lg">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-5 shadow-sm">
                <Zap className="w-4 h-4 text-blue-600" /> Limited time offer
              </div>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">Ready to explore?</h3>
              <p className="text-slate-600 text-lg mb-10 max-w-md mx-auto">
                Browse our full catalogue and discover thousands of amazing products.
              </p>
              <Link href="/products"
                className="group inline-flex items-center justify-center gap-2 font-bold px-10 py-4 rounded-2xl text-white transition-all duration-200 shadow-lg shadow-blue-600/30 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1 active:scale-95">
                {t('home.browseAll')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
