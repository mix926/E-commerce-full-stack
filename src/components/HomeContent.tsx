'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import {
  ArrowRight, Star, ShieldCheck, Truck, RefreshCw,
  Zap, TrendingUp, Sparkles, Tag,
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
  const statsReveal    = useReveal(0.3);

  // ── Product carousel state ──
  const showcaseProducts = products.slice(0, 6);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [animating, setAnimating]   = useState(false);
  const [direction, setDirection]   = useState<'next'|'prev'>('next');

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
    { icon: <Truck className="w-5 h-5 text-blue-500" />,      title: t('home.features.freeShipping'),   desc: t('home.features.freeShippingDesc'),   color: 'text-blue-500',    bg: 'bg-blue-50' },
    { icon: <RefreshCw className="w-5 h-5 text-emerald-500" />, title: t('home.features.easyReturns'),  desc: t('home.features.easyReturnsDesc'),    color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: <ShieldCheck className="w-5 h-5 text-violet-500" />, title: t('home.features.securePayment'), desc: t('home.features.securePaymentDesc'), color: 'text-violet-500',  bg: 'bg-violet-50' },
    { icon: <Star className="w-5 h-5 text-amber-500" />,      title: t('home.features.topQuality'),     desc: t('home.features.topQualityDesc'),     color: 'text-amber-500',   bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft    { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeRight   { from{opacity:0;transform:translateX(24px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes cardPop     { from{opacity:0;transform:translateY(16px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes floatUp     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes slideInNext { from{opacity:0;transform:translateX(48px) scale(.96)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes slideInPrev { from{opacity:0;transform:translateX(-48px) scale(.96)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes slideOutNext{ from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-48px)} }
        @keyframes progressBar { from{width:0%} to{width:100%} }
      `}</style>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      {!searchQuery && (
        <section className="relative overflow-hidden bg-white border-b border-gray-100" style={{ minHeight: 600 }}>
          {/* subtle dot grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(rgba(99,102,241,0.06) 1px,transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
          {/* soft colour orbs */}
          <div className="absolute pointer-events-none" style={{ top:-120,left:-100,width:520,height:520,background:'radial-gradient(circle,rgba(99,102,241,.07) 0%,transparent 65%)',borderRadius:'50%' }} />
          <div className="absolute pointer-events-none" style={{ bottom:-80,right:-80,width:400,height:400,background:'radial-gradient(circle,rgba(168,85,247,.06) 0%,transparent 65%)',borderRadius:'50%' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="flex flex-col lg:flex-row items-center gap-14">

              {/* ── Copy ── */}
              <div className="flex-1 text-center lg:text-left"
                style={{ animation: 'fadeLeft .65s cubic-bezier(.22,1,.36,1) both' }}>

                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6"
                  style={{ background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.2)', color: '#6366f1' }}>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  {t('home.hero.badge')}
                </span>

                <h1 className="font-black tracking-tight leading-[1.04] mb-5"
                  style={{ fontSize: 'clamp(2.4rem,5.5vw,4.2rem)' }}>
                  <span className="block text-gray-900">{t('home.hero.title1')}</span>
                  <span className="block" style={{
                    background: 'linear-gradient(95deg,#6366f1,#a855f7)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>{t('home.hero.title2')}</span>
                </h1>

                <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-9 max-w-md mx-auto lg:mx-0">
                  {t('home.hero.subtitle')}
                </p>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
                  <Link href="/products"
                    className="group inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-xl text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,.3)' }}>
                    {t('home.hero.shopNow')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link href="/products?category=Electronics"
                    className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200">
                    {t('home.hero.viewElectronics')}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
                  {[
                    { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />, label: 'Secure checkout' },
                    { icon: <Truck className="w-3.5 h-3.5 text-blue-500" />,          label: 'Free shipping $50+' },
                    { icon: <RefreshCw className="w-3.5 h-3.5 text-violet-500" />,    label: '30-day returns' },
                  ].map(b => (
                    <span key={b.label} className="flex items-center gap-1.5 text-gray-400 text-sm">{b.icon}{b.label}</span>
                  ))}
                </div>
              </div>

              {/* ── Product carousel showcase ── */}
              {activeProduct && (
                <div className="hidden lg:flex flex-col shrink-0 w-[320px]"
                  style={{ animation: 'fadeRight .7s cubic-bezier(.22,1,.36,1) .1s both' }}>

                  {/* Card */}
                  <Link href={`/products/${activeProduct.id}`}
                    className="group block rounded-3xl overflow-hidden relative"
                    style={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 20px 60px rgba(99,102,241,.12), 0 4px 16px rgba(0,0,0,.06)',
                    }}>

                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ height: 260 }}>
                      <img
                        key={activeProduct.id}
                        src={activeProduct.image}
                        alt={activeProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        style={{
                          animation: animating
                            ? undefined
                            : `${direction === 'next' ? 'slideInNext' : 'slideInPrev'} .4s cubic-bezier(.22,1,.36,1) both`,
                        }}
                      />
                      {/* shine */}
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.08) 0%,transparent 55%)' }} />
                      {/* category badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-indigo-600 shadow-sm">
                        {activeProduct.category}
                      </div>
                      {/* rating badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-gray-700 shadow-sm">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {activeProduct.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 bg-white"
                      style={animating
                        ? { opacity: 0 }
                        : { animation: `${direction === 'next' ? 'slideInNext' : 'slideInPrev'} .4s cubic-bezier(.22,1,.36,1) .05s both` }}>
                      <p className="text-gray-900 font-bold text-base leading-snug line-clamp-1 mb-1">
                        {activeProduct.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-indigo-600">
                          ${activeProduct.price.toFixed(2)}
                        </span>
                        <span className="text-xs font-bold px-3 py-1.5 rounded-xl text-white"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                          View →
                        </span>
                      </div>
                    </div>

                    {/* 4s progress bar */}
                    <div className="h-0.5 w-full bg-gray-100">
                      <div key={`${activeIdx}-bar`} className="h-full"
                        style={{
                          background: 'linear-gradient(90deg,#6366f1,#a855f7)',
                          animation: 'progressBar 4s linear both',
                        }} />
                    </div>
                  </Link>

                  {/* Dot indicators */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {showcaseProducts.map((_, i) => (
                      <button key={i} onClick={() => goTo(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width:  i === activeIdx ? 20 : 6,
                          height: 6,
                          background: i === activeIdx
                            ? 'linear-gradient(90deg,#6366f1,#a855f7)'
                            : '#e5e7eb',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }} />
                    ))}
                  </div>

                  {/* Prev / Next arrows */}
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <button onClick={() => goTo((activeIdx - 1 + showcaseProducts.length) % showcaseProducts.length)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200">
                      ‹
                    </button>
                    <span className="text-gray-400 text-xs font-medium">
                      {activeIdx + 1} / {showcaseProducts.length}
                    </span>
                    <button onClick={() => goTo((activeIdx + 1) % showcaseProducts.length)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200">
                      ›
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-12 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom,transparent,rgba(255,255,255,.8))' }} />
        </section>
      )}

      {/* ═══════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════ */}
      {!searchQuery && (
        <div ref={statsReveal.ref} className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {[
                { value: '500+', label: t('home.products'),   color: 'text-indigo-600' },
                { value: '10k+', label: t('home.customers'),  color: 'text-emerald-600' },
                { value: '4.9★', label: t('home.rating'),     color: 'text-amber-500' },
                { value: 'Free', label: 'Shipping on $50+',   color: 'text-blue-600' },
              ].map((s, i) => (
                <div key={s.label}
                  className="py-5 px-6 text-center"
                  style={statsReveal.visible ? { animation: `fadeUp .5s cubic-bezier(.22,1,.36,1) ${i * 70}ms both` } : { opacity: 0 }}>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          FEATURES STRIP
      ═══════════════════════════════════════════ */}
      {!searchQuery && (
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {features.map((f) => (
                <div key={f.title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 hover:shadow-sm transition-all duration-200 group cursor-default">
                  <div className={`${f.bg} p-2.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-200`}>{f.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{f.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          MAIN
      ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">

        {searchQuery && (
          <div className="mb-8 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
            <Tag className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <h2 className="font-bold text-gray-900 text-base">
                {t('home.searchResults')} <span className="text-indigo-600">&ldquo;{searchQuery}&rdquo;</span>
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">{products.length} {t('home.productsFound')}</p>
              <Link href="/" className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline">
                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> {t('home.clearSearch')}
              </Link>
            </div>
          </div>
        )}

        {/* Section header */}
        {!searchQuery && (
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900">{t('home.allProducts')}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{products.length} {t('home.productsAvailable')}</p>
            </div>
            <Link href="/products"
              className="group text-sm font-bold text-indigo-600 flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl transition-all duration-200">
              {t('home.viewAll')} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Star className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.noProductsFound')}</h3>
            <p className="text-gray-400 mb-6 text-sm">{t('home.noProductsDesc')}</p>
            <Link href="/" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-sm shadow-md shadow-indigo-500/25">
              {t('home.browseAll')}
            </Link>
          </div>
        ) : (
          <div ref={productsReveal.ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <div key={product.id} style={productsReveal.visible
                ? { animation: `cardPop .5s cubic-bezier(.22,1,.36,1) ${i * 45}ms both` }
                : { opacity: 0 }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Top Rated */}
        {!searchQuery && featuredProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                  {t('home.topRated')}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">{t('home.topRatedDesc')}</p>
              </div>
            </div>
            <div ref={featuredReveal.ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product, i) => (
                <div key={product.id} style={featuredReveal.visible
                  ? { animation: `cardPop .5s cubic-bezier(.22,1,.36,1) ${i * 55}ms both` }
                  : { opacity: 0 }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        {!searchQuery && (
          <div className="mt-20 rounded-3xl overflow-hidden relative text-center py-14 px-6 border border-gray-100 shadow-sm bg-white">
            {/* subtle dot grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(rgba(99,102,241,.05) 1px,transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
            {/* soft orbs */}
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(99,102,241,.08),transparent 70%)' }} />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(168,85,247,.07),transparent 70%)' }} />

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <Zap className="w-3.5 h-3.5 text-indigo-500" /> Limited time offer
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Ready to explore?</h3>
              <p className="text-gray-400 text-base mb-8 max-w-md mx-auto">
                Browse our full catalogue and discover thousands of products.
              </p>
              <Link href="/products"
                className="group inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl text-white transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {t('home.browseAll')} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
