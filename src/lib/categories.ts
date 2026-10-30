import { prisma } from './prisma';

/**
 * Returns all unique product categories currently in the database,
 * sorted alphabetically.
 */
export async function getCategories(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });
  return rows.map((r) => r.category);
}
