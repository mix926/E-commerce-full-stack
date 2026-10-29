'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { clearCart, getOrCreateCart } from './cart';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Place an order from the cart
export async function placeOrder(formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/signin');

  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const zip = formData.get('zip') as string;
  const country = formData.get('country') as string;
  const paymentMethod = (formData.get('paymentMethod') as string) || 'Credit Card';
  const promoCode = (formData.get('promoCode') as string || '').toUpperCase().trim();
  const deliveryNotes = formData.get('notes') as string;

  if (!address || !city || !zip || !country) {
    throw new Error('All address fields are required');
  }

  let fullAddress = `${address}, ${city}, ${zip}, ${country} • Method: ${paymentMethod}`;
  if (deliveryNotes) {
    fullAddress += ` (Note: ${deliveryNotes})`;
  }

  const cart = await getOrCreateCart(session.userId);

  if (!cart.items || cart.items.length === 0) {
    throw new Error('Your cart is empty');
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Apply discounts
  let discount = 0;
  let shipping = subtotal > 50 ? 0 : 9.99;

  if (promoCode === 'WELCOME10') {
    discount = subtotal * 0.1;
  } else if (promoCode === 'SAVE20' && subtotal >= 100) {
    discount = 20;
  } else if (promoCode === 'FREESHIP') {
    shipping = 0;
  }

  const total = Math.max(0, subtotal - discount + shipping);

  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      total: Math.round(total * 100) / 100,
      address: fullAddress,
      status: 'processing',
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  await clearCart(session.userId);
  revalidatePath('/orders');
  revalidatePath('/cart');

  redirect(`/orders/${order.id}`);
}

// Cancel an order
export async function cancelOrder(orderId: string) {
  const session = await getSession();
  if (!session) redirect('/signin');

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.userId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== 'pending' && order.status !== 'processing') {
    throw new Error('This order cannot be cancelled as it is already shipped or delivered');
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'cancelled' },
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/orders');
  return { success: true };
}

// Get all orders for the current user
export async function getUserOrders() {
  const session = await getSession();
  if (!session) return [];

  return prisma.order.findMany({
    where: { userId: session.userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get a single order by ID
export async function getOrderById(orderId: string) {
  const session = await getSession();
  if (!session) return null;

  return prisma.order.findFirst({
    where: { id: orderId, userId: session.userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
}

// Submit a product review
export async function submitReview(formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/signin');

  const productId = formData.get('productId') as string;
  const rating = parseInt(formData.get('rating') as string);
  const comment = formData.get('comment') as string;

  if (!productId || !rating || !comment) {
    throw new Error('All review fields are required');
  }

  await prisma.review.upsert({
    where: { userId_productId: { userId: session.userId, productId } },
    update: { rating, comment },
    create: { userId: session.userId, productId, rating, comment },
  });

  // Recalculate average rating for the product
  const reviews = await prisma.review.findMany({ where: { productId } });
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.product.update({
    where: { id: productId },
    data: { rating: Math.round(avgRating * 10) / 10 },
  });

  revalidatePath(`/products/${productId}`);
}
