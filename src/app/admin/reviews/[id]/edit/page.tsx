import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditReviewContent from './EditReviewContent';

interface EditReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  const { id } = await params;

  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, image: true } },
    },
  });

  if (!review) notFound();

  return <EditReviewContent review={review} />;
}
