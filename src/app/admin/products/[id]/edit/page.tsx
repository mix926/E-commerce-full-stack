import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/categories';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <EditProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
