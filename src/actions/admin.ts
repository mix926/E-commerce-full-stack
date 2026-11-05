'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { translateToMultiple } from '@/lib/translate';

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');
  return session;
}

/**
 * Get category translation or translate if not exists
 */
export async function getCategoryTranslation(categoryName: string, lang: string = 'km') {
  try {
    // Check if translation exists
    const existing = await prisma.categoryTranslation.findUnique({
      where: {
        categoryName_lang: {
          categoryName,
          lang,
        },
      },
    });

    if (existing) {
      return existing.translation;
    }

    // Translate the category name
    const translations = await translateToMultiple(categoryName, [lang], 'en');
    const translated = translations[lang] || categoryName;

    // Store the translation
    await prisma.categoryTranslation.upsert({
      where: {
        categoryName_lang: {
          categoryName,
          lang,
        },
      },
      create: {
        categoryName,
        lang,
        translation: translated,
      },
      update: {
        translation: translated,
      },
    });

    return translated;
  } catch (error) {
    console.error('Error getting category translation:', error);
    return categoryName;
  }
}

/**
 * Get all translations for a category
 */
export async function getAllCategoryTranslations(categoryName: string) {
  try {
    const translations = await prisma.categoryTranslation.findMany({
      where: { categoryName },
    });

    const result: Record<string, string> = { en: categoryName };
    translations.forEach(t => {
      result[t.lang] = t.translation;
    });

    return result;
  } catch (error) {
    console.error('Error getting all category translations:', error);
    return { en: categoryName };
  }
}

/**
 * Auto-translate and store category when creating a product with custom category
 */
export async function autoTranslateCategory(categoryName: string) {
  try {
    // Translate to all supported languages (English, Khmer)
    const translations = await translateToMultiple(categoryName, ['km'], 'en');

    // Store translations in database
    for (const [lang, translated] of Object.entries(translations)) {
      await prisma.categoryTranslation.upsert({
        where: {
          categoryName_lang: {
            categoryName,
            lang,
          },
        },
        create: {
          categoryName,
          lang,
          translation: translated,
        },
        update: {
          translation: translated,
        },
      });
    }

    return translations;
  } catch (error) {
    console.error('Error auto-translating category:', error);
    return { km: categoryName };
  }
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const name        = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price       = parseFloat(formData.get('price') as string);
  const image       = formData.get('image') as string;
  const category    = formData.get('category') as string;
  const stock       = parseInt(formData.get('stock') as string, 10);
  const sizes       = (formData.get('sizes') as string | null)?.trim() || null;
  const colors      = (formData.get('colors') as string | null)?.trim() || null;
  const featured    = formData.get('featured') === 'true';

  // Auto-translate category if it's a new custom category
  await autoTranslateCategory(category);

  await prisma.product.create({
    data: { name, description, price, image, category, stock, sizes, colors, featured },
  });

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const name        = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price       = parseFloat(formData.get('price') as string);
  const image       = formData.get('image') as string;
  const category    = formData.get('category') as string;
  const stock       = parseInt(formData.get('stock') as string, 10);
  const sizes       = (formData.get('sizes') as string | null)?.trim() || null;
  const colors      = (formData.get('colors') as string | null)?.trim() || null;
  const featured    = formData.get('featured') === 'true';

  // Auto-translate category if it's a new custom category
  await autoTranslateCategory(category);

  await prisma.product.update({
    where: { id },
    data: { name, description, price, image, category, stock, sizes, colors, featured },
  });

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  
  // Validate product exists before attempting deletion
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new Error('Product not found');
  }
  
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/products');
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function deleteReview(reviewId: string) {
  await requireAdmin();

  // Get the productId before deleting so we can recalculate rating
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return;

  await prisma.review.delete({ where: { id: reviewId } });

  // Recalculate product rating after deletion
  const remaining = await prisma.review.aggregate({
    where: { productId: review.productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: {
      rating: remaining._count.rating > 0 ? (remaining._avg.rating ?? 0) : 0,
    },
  });

  revalidatePath('/admin/reviews');
  revalidatePath(`/products/${review.productId}`);
}

export async function updateReview(reviewId: string, formData: FormData) {
  await requireAdmin();

  const rating = parseInt(formData.get('rating') as string, 10);
  const comment = formData.get('comment') as string;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return;

  await prisma.review.update({
    where: { id: reviewId },
    data: { rating, comment },
  });

  // Recalculate product average rating
  const agg = await prisma.review.aggregate({
    where: { productId: review.productId },
    _avg: { rating: true },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: { rating: agg._avg.rating ?? 0 },
  });

  revalidatePath('/admin/reviews');
  revalidatePath(`/products/${review.productId}`);
  redirect('/admin/reviews');
}

export async function deleteCategory(category: string) {
  try {
    await requireAdmin();
    
    if (!category) {
      throw new Error('Category name cannot be empty');
    }
    
    // Check if category has products
    const productCount = await prisma.product.count({
      where: { category },
    });
    
    if (productCount > 0) {
      throw new Error(`Cannot delete category with ${productCount} product(s). Move or delete products first.`);
    }
    
    revalidatePath('/admin/categories');
    return { success: true, message: 'Category deleted' };
  } catch (error) {
    console.error('deleteCategory error:', error);
    throw error;
  }
}

export async function renameCategory(oldCategory: string, newCategory: string) {
  try {
    await requireAdmin();
    
    if (!oldCategory || !newCategory) {
      throw new Error('Category names cannot be empty');
    }

    if (oldCategory === newCategory) {
      throw new Error('New category name must be different');
    }

    // Check if new category already exists
    const existing = await prisma.product.findFirst({
      where: { category: newCategory },
    });
    
    if (existing) {
      throw new Error(`Category "${newCategory}" already exists`);
    }
    
    // Rename all products in this category
    const result = await prisma.product.updateMany({
      where: { category: oldCategory },
      data: { category: newCategory },
    });

    if (result.count === 0) {
      throw new Error(`Category "${oldCategory}" not found`);
    }
    
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    
    return { success: true, message: `Renamed to "${newCategory}"` };
  } catch (error) {
    console.error('renameCategory error:', error);
    throw error;
  }
}
