import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

export async function GET(req: NextRequest) {
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Google Client ID not configured' },
      { status: 500 }
    );
  }

  // Generate random state for CSRF protection
  const state = crypto.randomBytes(16).toString('hex');

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    state: state,
    prompt: 'consent',
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );

  response.cookies.set('google_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  return response;
}
