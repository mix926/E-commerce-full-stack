'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '@/actions/admin';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2, Edit2, Package, Search, Star } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@prisma/client';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useState, useMemo } from 'react';

export default function AdminProductsContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const router = useRouter();
  const toast = useToast();
  const [localProducts, setLocalProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  const handleDelete = async (id: string) => {
    const product = localProducts.find(p => p.id === id);
    try {
      await deleteProduct(id);
      setLocalProducts(localProducts.filter(p => p.id !== id));
      toast.success(`Product "${product?.name}" has been deleted successfully`);
      router.refresh();
    } catch (error) {
      setLocalProducts(products);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      toast.error(`Could not delete product: ${errorMessage}`);
      console.error('Delete failed:', error);
    }
  };

  // Get unique categories
  const categories = useMemo(() => 
    Array.from(new Set(localProducts.map(p => p.category))).sort(),
    [localProducts]
  );

  // Filter products
  const filteredProducts = useMemo(() => {
    return localProducts.filter(product => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!product.name.toLowerCase().includes(searchLower) &&
            !product.category.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && product.category !== categoryFilter) {
        return false;
      }

      // Stock filter
      if (stockFilter !== 'all') {
        if (stockFilter === 'out_of_stock' && product.stock !== 0) return false;
        if (stockFilter === 'low_stock' && (product.stock === 0 || product.stock > 10)) return false;
        if (stockFilter === 'in_stock' && product.stock <= 10) return false;
      }

      return true;
    });
  }, [localProducts, searchTerm, categoryFilter, stockFilter]);

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'bg-red-50 text-red-700 border-red-200';
    if (stock <= 10) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getStockLabel = (stock: number) => {
    if (stock === 0) return '❌ Out of Stock';
    if (stock <= 10) return `⚠️ ${stock} left`;
    return `✓ ${stock} in stock`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <AdminHeader
        title={t('admin.products')}
        subtitle={`Manage ${localProducts.length} products in your catalog`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Products' }]}
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            {t('admin.addProduct')}
          </Link>
        }
      />

      <div className="p-8 max-w-7xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                🔍 Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                📂 Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                📦 Stock Status
              </label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Products</option>
                <option value="in_stock">✓ In Stock (10+)</option>
                <option value="low_stock">⚠️ Low Stock (1-10)</option>
                <option value="out_of_stock">❌ Out of Stock</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm font-bold text-slate-700">
                Showing <span className="text-blue-600">{filteredProducts.length}</span> of <span className="text-slate-600">{localProducts.length}</span> products
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Name and Category */}
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 text-lg line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      {product.category}
                    </span>
                  </div>

                  {/* Price and Rating */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-slate-100">
                    <span className="text-2xl font-black text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-700">{product.rating.toFixed(1)}</span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className={`px-4 py-2.5 rounded-xl text-sm font-bold mb-4 border-2 text-center ${getStockColor(product.stock)}`}>
                    {getStockLabel(product.stock)}
                  </div>

                  {/* Description Preview */}
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Link>
                    <ConfirmDialog
                      title="Delete Product"
                      description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
                      isDangerous
                      confirmText="Delete"
                      onConfirm={() => handleDelete(product.id)}
                    >
                      {(onOpen) => (
                        <button
                          onClick={onOpen}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border-2 border-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </ConfirmDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-200">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-700 font-bold text-lg mb-2">No Products Found</p>
            <p className="text-slate-600 text-sm mb-6">
              {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by creating your first product'}
            </p>
            {(searchTerm || categoryFilter !== 'all' || stockFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setStockFilter('all');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
