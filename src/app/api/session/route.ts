import { NextResponse } from 'next/server';
import { getSession, deleteSession } from '@/lib/session';

// GET /api/session — return current session
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}

// DELETE /api/session — sign out
export async function DELETE() {
  await deleteSession();
  return NextResponse.json({ success: true });
}
