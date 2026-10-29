import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/session';
import ProductDetailContent from '@/components/ProductDetailContent';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  const [product, session] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    getSession(),
  ]);

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: { category: product.category, id: { not: id } },
    take: 4,
  });

  const userHasReviewed = session
    ? product.reviews.some((r) => r.userId === session.userId)
    : false;

  const isSignedIn = !!session;

  return (
    <ProductDetailContent
      product={product}
      relatedProducts={relatedProducts}
      userHasReviewed={userHasReviewed}
      isSignedIn={isSignedIn}
    />
  );
}
