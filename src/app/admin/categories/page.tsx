import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import AdminCategoriesContent from './AdminCategoriesContent';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  // Check admin authorization
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/signin');
  }

  try {
    // Get all categories with product counts
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    // Get all counts in one query
    const counts = await prisma.product.groupBy({
      by: ['category'],
      _count: true,
    });

    const countMap = new Map(counts.map((c) => [c.category, c._count]));

    // Get all Khmer translations for categories
    const translations = await prisma.categoryTranslation.findMany({
      where: { lang: 'km' },
      select: { categoryName: true, translation: true },
    });
    const translationMap = new Map(translations.map((t) => [t.categoryName, t.translation]));

    const categoriesWithCounts = categories.map((c) => ({
      name: c.category,
      productCount: countMap.get(c.category) || 0,
      nameKm: translationMap.get(c.category) || '',
    }));

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <AdminCategoriesContent categories={categoriesWithCounts} />
      </div>
    );
  } catch (error) {
    console.error('Failed to load categories:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-red-900 mb-2">Error Loading Categories</h1>
          <p className="text-red-700">Failed to load categories. Please try again later.</p>
        </div>
      </div>
    );
  }
}
