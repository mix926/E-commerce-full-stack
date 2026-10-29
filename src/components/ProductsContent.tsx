'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import { Search } from 'lucide-react';
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {category || t('products.title')}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalCount} {t('products.found')}
            {search && ` ${t('products.for')} "${search}"`}
          </p>
        </div>

        {/* Sort + Search */}
        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <form method="GET" action="/products" className="flex">
            {category && <input type="hidden" name="category" value={category} />}
            {sort !== 'newest' && <input type="hidden" name="sort" value={sort} />}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                name="search"
                type="text"
                defaultValue={search}
                placeholder={t('products.search')}
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              />
            </div>
          </form>

          {/* Sort */}
          <Suspense fallback={<div className="w-40 h-9 bg-gray-100 rounded-lg animate-pulse" />}>
            <SortSelect defaultValue={sort} />
          </Suspense>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 rounded-full p-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('products.noFound')}</h3>
          <p className="text-gray-500 mb-6">{t('products.noFoundDesc')}</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            {t('products.clearFilters')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
