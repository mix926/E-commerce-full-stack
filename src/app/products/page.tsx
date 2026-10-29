import { prisma } from '@/lib/prisma';
import ProductsContent from '@/components/ProductsContent';

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const category = params.category || '';
  const sort = params.sort || 'newest';

  // Build order
  type OrderBy = { createdAt?: 'asc' | 'desc'; price?: 'asc' | 'desc'; rating?: 'asc' | 'desc' };
  const orderBy: OrderBy =
    sort === 'price_asc' ? { price: 'asc' }
    : sort === 'price_desc' ? { price: 'desc' }
    : sort === 'rating' ? { rating: 'desc' }
    : { createdAt: 'desc' };

  const where: Record<string, unknown> = {};
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
    <ProductsContent
      products={products}
      totalCount={totalCount}
      search={search}
      category={category}
      sort={sort}
    />
  );
}
