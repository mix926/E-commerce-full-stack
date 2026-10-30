import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProfileContent from './ProfileContent';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/signin');

  const [user, orderCount, reviewCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.order.count({ where: { userId: session.userId } }),
    prisma.review.count({ where: { userId: session.userId } }),
  ]);

  if (!user) redirect('/signin');

  return (
    <ProfileContent
      user={{ name: user.name, email: user.email, createdAt: user.createdAt.toISOString() }}
      orderCount={orderCount}
      reviewCount={reviewCount}
    />
  );
}
