import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-2xl">
        <EditProductForm product={product} />
      </div>
    </div>
  );
}
