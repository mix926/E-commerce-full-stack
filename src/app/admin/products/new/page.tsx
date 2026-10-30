import { getCategories } from '@/lib/categories';
import NewProductForm from './NewProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Product</h1>
      <p className="text-sm text-gray-500 mb-6">Fill in the details below to add a new product to the store.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <NewProductForm categories={categories} />
      </div>
    </div>
  );
}
