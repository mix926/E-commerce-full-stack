'use server';

import { getPinId } from '@/lib/imageUtils';

/**
 * Server-side extraction of Pinterest image URL
 * Bypasses CORS restrictions by running on the server
 */
export async function extractPinterestImage(pinterestUrl: string): Promise<string> {
  try {
    const pinId = getPinId(pinterestUrl);
    if (!pinId) return pinterestUrl;

    const response = await fetch(`https://www.pinterest.com/pin/${pinId}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) return pinterestUrl;

    const html = await response.text();
    
    // Extract og:image content
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
    if (ogImageMatch && ogImageMatch[1]) {
      return decodeURIComponent(ogImageMatch[1]);
    }

    // Fallback: extract from JSON-LD structured data
    const jsonMatch = html.match(/"image":\s*"([^"]+)"/);
    if (jsonMatch && jsonMatch[1]) {
      return decodeURIComponent(jsonMatch[1]);
    }

    return pinterestUrl;
  } catch (error) {
    console.error('Failed to extract Pinterest image:', error);
    return pinterestUrl;
  }
}
