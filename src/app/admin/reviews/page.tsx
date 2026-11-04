import { prisma } from '@/lib/prisma';
import AdminReviewsContent from './AdminReviewsContent';

export const dynamic = 'force-dynamic';

const CATEGORIES = ['Electronics', 'Accessories', 'Clothing', 'Home', 'Sports', 'Books'];

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ rating?: string; product?: string; category?: string }>;
}) {
  const {
    rating: ratingFilter,
    product: productFilter,
    category: categoryFilter,
  } = await searchParams;

  // Build where clause
  const where: Record<string, unknown> = {};
  if (ratingFilter && ratingFilter !== 'all') {
    where.rating = parseInt(ratingFilter);
  }
  if (productFilter) {
    where.product = { name: { contains: productFilter } };
  }
  if (categoryFilter && categoryFilter !== 'all') {
    where.product = {
      ...(typeof where.product === 'object' && where.product !== null ? where.product as object : {}),
      category: categoryFilter,
    };
  }

  const [reviews, totalReviews, avgRatingResult] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { id: true, name: true, image: true, category: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count(),
    prisma.review.aggregate({ _avg: { rating: true } }),
  ]);

  return (
    <AdminReviewsContent
      reviews={reviews.map((r) => ({ ...r, createdAt: r.createdAt }))}
      totalReviews={totalReviews}
      avgRating={avgRatingResult._avg.rating ?? null}
      ratingFilter={ratingFilter}
      productFilter={productFilter}
      categoryFilter={categoryFilter}
    />
  );
}
