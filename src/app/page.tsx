import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface HomePageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Clothing', 'Home', 'Sports', 'Books'];

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || 'All';
  const searchQuery = params.search || '';

  const where: Record<string, unknown> = {};
  if (selectedCategory !== 'All') where.category = selectedCategory;
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery } },
      { description: { contains: searchQuery } },
    ];
  }

  const [products, featuredProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
    prisma.product.findMany({
      orderBy: { rating: 'desc' },
      take: 4,
    }),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      {!searchQuery && selectedCategory === 'All' && (
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                <Zap className="w-3.5 h-3.5" />
                New Arrivals
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
                Shop the Latest <br />
                <span className="text-yellow-300">Top Deals</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 max-w-md">
                Discover thousands of products at unbeatable prices. Free shipping on orders over $50.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/products"
                  className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=Electronics"
                  className="border-2 border-white/60 text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
                >
                  View Electronics
                </Link>
              </div>
            </div>
            <div className="hidden md:flex flex-1 justify-center gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-blue-200 text-sm mt-1">Products</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-blue-200 text-sm mt-1">Customers</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <div className="text-2xl font-bold">4.9</div>
                <div className="flex justify-center mt-1">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                </div>
                <div className="text-blue-200 text-sm mt-0.5">Rating</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Strip */}
      {!searchQuery && selectedCategory === 'All' && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Truck className="w-5 h-5 text-blue-600" />, title: 'Free Shipping', desc: 'On orders over $50' },
                { icon: <RefreshCw className="w-5 h-5 text-blue-600" />, title: 'Easy Returns', desc: '30-day return policy' },
                { icon: <ShieldCheck className="w-5 h-5 text-blue-600" />, title: 'Secure Payment', desc: '100% secure checkout' },
                { icon: <Star className="w-5 h-5 text-blue-600" />, title: 'Top Quality', desc: 'Verified products' },
              ].map((feat) => (
                <div key={feat.title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                  <div className="bg-blue-50 p-2 rounded-lg">{feat.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{feat.title}</div>
                    <div className="text-xs text-gray-500">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === 'All' ? '/' : `/?category=${cat}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Search Info */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Search results for &ldquo;{searchQuery}&rdquo;
            </h2>
            <p className="text-gray-500 text-sm mt-1">{products.length} products found</p>
            <Link href="/" className="text-sm text-blue-600 hover:underline mt-1 inline-flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Clear search
            </Link>
          </div>
        )}

        {/* Section Title */}
        {!searchQuery && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{products.length} products available</p>
            </div>
            {selectedCategory === 'All' && (
              <Link
                href="/products"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 rounded-full p-6">
                <Star className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try a different search or category</p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Top Rated Section */}
        {!searchQuery && selectedCategory === 'All' && featuredProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  Top Rated
                </h2>
                <p className="text-gray-500 text-sm mt-1">Our highest-rated products</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
