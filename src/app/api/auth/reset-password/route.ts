import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/tokenUtils';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    // Validate inputs
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing reset token' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          { password_reset_token: { not: null } },
          { password_reset_expires: { gt: new Date() } },
        ],
      },
    });

    if (!user || !user.password_reset_token) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Verify the plain token against the hashed token in database
    const tokenIsValid = await verifyToken(token, user.password_reset_token);

    if (!tokenIsValid) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
      },
    });

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
