'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { deleteProduct } from '@/actions/admin';
import { Plus } from 'lucide-react';
import type { Product } from '@prisma/client';

export default function AdminProductsContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.products')}</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> {t('admin.addProduct')}
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left">{t('admin.image')}</th>
                <th className="px-5 py-3 text-left">{t('admin.name')}</th>
                <th className="px-5 py-3 text-left">{t('admin.category')}</th>
                <th className="px-5 py-3 text-left">Sizes / Colors</th>
                <th className="px-5 py-3 text-left">{t('admin.price')}</th>
                <th className="px-5 py-3 text-left">{t('admin.stock')}</th>
                <th className="px-5 py-3 text-left">Featured</th>
                <th className="px-5 py-3 text-left">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <img src={product.image} alt={product.name}
                      className="w-11 h-11 object-cover rounded-xl border border-gray-100" />
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-900 max-w-[180px]">
                    <p className="line-clamp-1">{product.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      {product.sizes ? (
                        <p className="text-[11px] text-gray-500">
                          <span className="font-semibold text-gray-700">Sizes:</span> {product.sizes}
                        </p>
                      ) : <p className="text-[11px] text-gray-300">No sizes</p>}
                      {product.colors ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[11px] font-semibold text-gray-700 mr-0.5">Colors:</span>
                          {product.colors.split(',').map(c => c.trim()).filter(Boolean).map(c => (
                            <span key={c} className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{c}</span>
                          ))}
                        </div>
                      ) : <p className="text-[11px] text-gray-300">No colors</p>}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      product.stock === 0 ? 'bg-red-100 text-red-700' :
                      product.stock <= 10 ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {product.featured ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">⭐ Featured</span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors">
                        {t('admin.edit')}
                      </Link>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <button type="submit"
                          className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors">
                          {t('admin.delete')}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
