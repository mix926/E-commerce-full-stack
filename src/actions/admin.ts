'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');
  return session;
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

  await prisma.product.update({
    where: { id },
    data: { name, description, price, image, category, stock, sizes, colors, featured },
  });

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  await requireAdmin();
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
