'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Get or create the user's cart
export async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  return cart;
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1) {
  const session = await getSession();
  if (!session) redirect('/signin');

  const cart = await getOrCreateCart(session.userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  revalidatePath('/cart');
  revalidatePath('/');
}

// Update cart item quantity
export async function updateCartItem(cartItemId: string, quantity: number) {
  const session = await getSession();
  if (!session) redirect('/signin');

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  revalidatePath('/cart');
}

// Remove item from cart
export async function removeFromCart(cartItemId: string) {
  const session = await getSession();
  if (!session) redirect('/signin');

  await prisma.cartItem.delete({ where: { id: cartItemId } });
  revalidatePath('/cart');
}

// Clear the entire cart
export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  revalidatePath('/cart');
}

// Get cart item count for navbar badge
export async function getCartCount(): Promise<number> {
  const session = await getSession();
  if (!session) return 0;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.userId },
    include: { items: true },
  });

  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}
