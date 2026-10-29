import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getOrCreateCart } from '@/actions/cart';
import { prisma } from '@/lib/prisma';

// GET /api/cart — return cart data
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ items: [], total: 0, count: 0 });
  }

  const cart = await getOrCreateCart(session.userId);
  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return NextResponse.json({ items: cart.items, total, count });
}

// POST /api/cart — add item to cart
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { productId, quantity = 1 } = body;

  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

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

  return NextResponse.json({ success: true });
}

// DELETE /api/cart — clear entire cart
export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cart = await prisma.cart.findUnique({ where: { userId: session.userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return NextResponse.json({ success: true });
}
