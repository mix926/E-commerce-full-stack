import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code' },
      { status: 400 }
    );
  }

  // Verify state
  const storedState = req.cookies.get('google_state')?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.json(
      { error: 'Invalid state parameter' },
      { status: 400 }
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json(
        { error: tokenData.error_description || 'Failed to get access token' },
        { status: 400 }
      );
    }

    const accessToken = tokenData.access_token;

    // Get user info from Google
    const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.sub) {
      return NextResponse.json(
        { error: 'Failed to get Google user info' },
        { status: 400 }
      );
    }

    const email = googleUser.email;
    const name = googleUser.name;
    const googleId = googleUser.sub;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        // Link Google account to existing user
        user = await prisma.user.update({
          where: { email },
          data: { googleId },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            name,
            googleId,
            password: null, // OAuth user, no password needed
            role: 'customer',
          },
        });
      }
    }

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Redirect to home
    const redirectUrl = new URL('/', req.url);
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set('Set-Cookie', 'auth-success=true; Path=/; Max-Age=1');
    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
