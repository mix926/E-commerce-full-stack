import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateResetToken, hashToken } from '@/lib/tokenUtils';
import { sendPasswordResetEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // For security, always return the same success message
    // even if user doesn't exist (prevents email enumeration)
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with that email, we have sent a password reset link.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const hashedToken = await hashToken(resetToken);

    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Save hashed token and expiration to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_reset_token: hashedToken,
        password_reset_expires: expiresAt,
      },
    });

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Send password reset email
    await sendPasswordResetEmail(user.email, resetUrl);

    // Return success message without exposing whether email exists
    return NextResponse.json(
      { message: 'If an account exists with that email, we have sent a password reset link.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
