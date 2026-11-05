import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        state,
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

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const githubUser = await userResponse.json();

    if (!githubUser.id) {
      return NextResponse.json(
        { error: 'Failed to get GitHub user info' },
        { status: 400 }
      );
    }

    // Get user email
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const emails = await emailResponse.json();
    const primaryEmail = emails.find((e: any) => e.primary)?.email || emails[0]?.email || githubUser.email;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { githubId: githubUser.id.toString() },
    });

    if (!user) {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: primaryEmail },
      });

      if (existingUser) {
        // Link GitHub account to existing user
        user = await prisma.user.update({
          where: { email: primaryEmail },
          data: { githubId: githubUser.id.toString() },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: primaryEmail,
            name: githubUser.name || githubUser.login,
            githubId: githubUser.id.toString(),
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

    // Redirect to home or intended page
    const redirectUrl = new URL('/', req.url);
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set('Set-Cookie', 'auth-success=true; Path=/; Max-Age=1');
    return response;
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
