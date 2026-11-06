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

/**
 * Returns a map of categoryName → Khmer translation for all categories
 * that have a translation in the CategoryTranslation table.
 */
export async function getCategoryTranslations(): Promise<Map<string, string>> {
  const translations = await prisma.categoryTranslation.findMany({
    where: { lang: 'km' },
    select: { categoryName: true, translation: true },
  });
  return new Map(translations.map((t) => [t.categoryName, t.translation]));
}
