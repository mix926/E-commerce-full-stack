'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import { Search, SlidersHorizontal, Package, ArrowRight, X } from 'lucide-react';
import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import SortSelect from '@/components/SortSelect';
import { useLanguage } from '@/context/LanguageContext';

interface ProductsContentProps {
  products: Product[];
  totalCount: number;
  search: string;
  category: string;
  sort: string;
}

export default function ProductsContent({ products, totalCount, search, category, sort }: ProductsContentProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cardPop { from { opacity: 0; transform: translateY(12px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      {/* ── Page header ── */}
      <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">

            <div>
              <h1 className="text-3xl font-black text-slate-900">
                {category || t('products.title')}
              </h1>
              <p className="text-sm text-slate-600 mt-2 font-medium">
                {totalCount} {t('products.found')}
                {search && (
                  <span className="text-blue-600"> {t('products.for')} &ldquo;{search}&rdquo;</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <form method="GET" action="/products" className="flex items-center">
                {category && <input type="hidden" name="category" value={category} />}
                {sort !== 'newest' && <input type="hidden" name="sort" value={sort} />}
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    name="search" type="text" defaultValue={search}
                    placeholder={t('products.search')}
                    className="pl-10 pr-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-full sm:w-56 shadow-sm transition-all hover:border-slate-300"
                  />
                </div>
              </form>
              {/* Sort */}
              <div className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 shadow-sm hover:border-slate-300 transition-colors">
                <SlidersHorizontal className="w-5 h-5 text-slate-600 shrink-0" />
                <Suspense fallback={<div className="w-32 h-5 bg-slate-200 rounded animate-pulse" />}>
                  <SortSelect defaultValue={sort} />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Active filter chips */}
          {(search || category) && (
            <div className="flex flex-wrap gap-2">
              {category && (
                <Link href={`/products${search ? `?search=${search}` : ''}`}
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-3.5 py-2 rounded-full border-2 border-blue-200 hover:bg-blue-100 transition-all group">
                  {category}
                  <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </Link>
              )}
              {search && (
                <Link href={`/products${category ? `?category=${category}` : ''}`}
                  className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-full border-2 border-slate-300 hover:bg-slate-200 transition-all group">
                  &ldquo;{search}&rdquo;
                  <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-slate-200 shadow-lg">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Package className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">{t('products.noFound')}</h3>
            <p className="text-slate-600 mb-8 text-base max-w-md mx-auto">{t('products.noFoundDesc')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20 hover:-translate-y-0.5">
                {t('products.clearFilters')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all font-bold">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <div key={product.id} style={{ animation: `cardPop .5s cubic-bezier(.22,1,.36,1) ${i * 40}ms both` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
