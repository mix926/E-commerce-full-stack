import { prisma } from '@/lib/prisma';
import AdminProductsContent from './AdminProductsContent';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return <AdminProductsContent products={products} />;
}
