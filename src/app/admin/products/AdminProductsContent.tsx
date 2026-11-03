'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '@/actions/admin';
import { Plus, Trash2, Edit2, Package } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@prisma/client';
import AdminHeader from '@/components/admin/AdminHeader';
import ActionButton from '@/components/admin/ActionButton';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatusBadge from '@/components/admin/StatusBadge';
import DataTable from '@/components/admin/DataTable';
import { useState } from 'react';

export default function AdminProductsContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [localProducts, setLocalProducts] = useState(products);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setLocalProducts(localProducts.filter(p => p.id !== id));
      router.refresh();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const columns = [
    {
      key: 'image' as const,
      label: 'Image',
      width: '60px',
      render: (value: string) => (
        <img src={value} alt="Product" className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
      ),
    },
    {
      key: 'name' as const,
      label: 'Product Name',
      sortable: true,
      render: (value: string) => <span className="font-semibold text-gray-900">{value}</span>,
    },
    {
      key: 'category' as const,
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
          {value}
        </span>
      ),
    },
    {
      key: 'price' as const,
      label: 'Price',
      sortable: true,
      render: (value: number) => <span className="font-semibold text-gray-900">${value.toFixed(2)}</span>,
    },
    {
      key: 'stock' as const,
      label: 'Stock',
      sortable: true,
      render: (value: number) => {
        let variant: 'default' | 'success' | 'warning' | 'error' = 'default';
        if (value === 0) variant = 'error';
        else if (value <= 10) variant = 'warning';
        else variant = 'success';
        
        return <StatusBadge status={value === 0 ? 'out_of_stock' : value <= 10 ? 'low_stock' : 'in_stock'} variant={variant} />;
      },
    },
    {
      key: 'rating' as const,
      label: 'Rating',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">{value.toFixed(1)}</span>
          <span className="text-amber-500">★</span>
        </div>
      ),
    },
    {
      key: 'featured' as const,
      label: 'Featured',
      render: (value: boolean) =>
        value ? (
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            ⭐ Featured
          </span>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        title={t('admin.products')}
        subtitle={`Manage ${localProducts.length} products in your catalog`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Products' }]}
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            {t('admin.addProduct')}
          </Link>
        }
      />

      <div className="p-8">
        {/* Data Table */}
        <DataTable
          columns={columns}
          data={localProducts.map(p => ({
            id: p.id,
            image: p.image,
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock,
            rating: p.rating,
            featured: p.featured,
          }))}
          searchableColumns={['name', 'category']}
          actions={(row) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/products/${(row as any).id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </Link>
              <ConfirmDialog
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                isDangerous
                confirmText="Delete"
                onConfirm={() => handleDelete((row as any).id)}
              >
                {(onOpen) => (
                  <button
                    onClick={onOpen}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
              </ConfirmDialog>
            </div>
          )}
          emptyState={{
            title: 'No Products',
            description: 'Start by creating your first product',
            icon: <Package className="w-12 h-12 text-gray-300" />,
          }}
        />
      </div>
    </div>
  );
}
