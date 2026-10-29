import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import SortSelect from '@/components/SortSelect';
import Link from 'next/link';
import { Filter, Search } from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

const CATEGORIES = [
  { name: 'All Categories', value: '' },
  { name: 'Electronics', value: 'Electronics' },
  { name: 'Accessories', value: 'Accessories' },
  { name: 'Clothing', value: 'Clothing' },
  { name: 'Home', value: 'Home' },
  { name: 'Sports', value: 'Sports' },
  { name: 'Books', value: 'Books' },
];

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const category = params.category || '';
  const minPrice = parseFloat(params.minPrice || '0') || 0;
  const maxPrice = parseFloat(params.maxPrice || '99999') || 99999;
  const sort = params.sort || 'newest';

  // Build order
  type OrderBy = { createdAt?: 'asc' | 'desc'; price?: 'asc' | 'desc'; rating?: 'asc' | 'desc' };
  const orderBy: OrderBy =
    sort === 'price_asc' ? { price: 'asc' }
    : sort === 'price_desc' ? { price: 'desc' }
    : sort === 'rating' ? { rating: 'desc' }
    : { createdAt: 'desc' };

  const where: Record<string, unknown> = {
    price: { gte: minPrice, lte: maxPrice },
  };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { category: { contains: search } },
    ];
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({ where, orderBy, take: 24 }),
    prisma.product.count({ where }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Filters
            </h2>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/products?${new URLSearchParams({
                      ...(search && { search }),
                      ...(cat.value && { category: cat.value }),
                      ...(sort !== 'newest' && { sort }),
                    }).toString()}`}
                    className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                      category === cat.value
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h3>
              <form method="GET" action="/products">
                {search && <input type="hidden" name="search" value={search} />}
                {category && <input type="hidden" name="category" value={category} />}
                {sort !== 'newest' && <input type="hidden" name="sort" value={sort} />}
                <div className="flex gap-2 mb-3">
                  <input
                    name="minPrice"
                    type="number"
                    placeholder="Min"
                    defaultValue={minPrice || ''}
                    min={0}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="maxPrice"
                    type="number"
                    placeholder="Max"
                    defaultValue={maxPrice < 99999 ? maxPrice : ''}
                    min={0}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Apply
                </button>
              </form>
            </div>

            {/* Clear Filters */}
            {(search || category || minPrice > 0 || maxPrice < 99999) && (
              <Link
                href="/products"
                className="w-full text-center text-sm text-red-600 hover:underline block"
              >
                Clear All Filters
              </Link>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                {category || 'All Products'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {totalCount} product{totalCount !== 1 ? 's' : ''} found
                {search && ` for "${search}"`}
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
                    placeholder="Search..."
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
              <Link
                href="/products"
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
