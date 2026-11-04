import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a secure 32-character hex token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Hash a token using bcryptjs
 */
export async function hashToken(token: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
}

/**
 * Verify a plain token against a hashed token
 */
export async function verifyToken(plainToken: string, hashedToken: string): Promise<boolean> {
  return bcrypt.compare(plainToken, hashedToken);
}
