'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {category || t('products.title')}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {totalCount} {t('products.found')}
                {search && (
                  <span className="text-indigo-600 font-medium"> {t('products.for')} &ldquo;{search}&rdquo;</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <form method="GET" action="/products" className="flex items-center">
                {category && <input type="hidden" name="category" value={category} />}
                {sort !== 'newest' && <input type="hidden" name="sort" value={sort} />}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="search" type="text" defaultValue={search}
                    placeholder={t('products.search')}
                    className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-48 shadow-sm transition-shadow"
                  />
                </div>
              </form>
              {/* Sort */}
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
                <Suspense fallback={<div className="w-28 h-5 bg-gray-100 rounded animate-pulse" />}>
                  <SortSelect defaultValue={sort} />
                </Suspense>
              </div>
            </div>

          </div>

          {/* Active filter chips */}
          {(search || category) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {category && (
                <Link href={`/products${search ? `?search=${search}` : ''}`}
                  className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors">
                  {category} ✕
                </Link>
              )}
              {search && (
                <Link href={`/products${category ? `?category=${category}` : ''}`}
                  className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors">
                  &ldquo;{search}&rdquo; ✕
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {products.length === 0 ? (
          <div className="text-center py-28 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('products.noFound')}</h3>
            <p className="text-gray-400 mb-6 text-sm">{t('products.noFoundDesc')}</p>
            <Link href="/products"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-sm shadow-md shadow-indigo-500/25">
              {t('products.clearFilters')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
