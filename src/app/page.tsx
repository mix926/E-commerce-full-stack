import { prisma } from '@/lib/prisma';
import HomeContent from '@/components/HomeContent';

export const dynamic = 'force-dynamic';

interface HomePageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const searchQuery = params.search || '';

  const where: Record<string, unknown> = {};
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
    <HomeContent
      products={products}
      featuredProducts={featuredProducts}
      searchQuery={searchQuery}
    />
  );
}
