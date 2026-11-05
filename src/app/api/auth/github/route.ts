import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

export async function GET(req: NextRequest) {
  if (!GITHUB_CLIENT_ID) {
    return NextResponse.json(
      { error: 'GitHub Client ID not configured' },
      { status: 500 }
    );
  }

  // Generate random state for CSRF protection
  const state = crypto.randomBytes(16).toString('hex');

  // Store state in cookie
  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?` +
      `client_id=${GITHUB_CLIENT_ID}` +
      `&redirect_uri=${process.env.NEXTAUTH_CALLBACK_URL || 'http://localhost:3000'}/api/auth/github/callback` +
      `&scope=user:email` +
      `&state=${state}`
  );

  response.cookies.set('github_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  return response;
}
