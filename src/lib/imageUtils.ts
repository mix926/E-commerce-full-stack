/**
 * Check if URL points directly to an image file
 */
export function isDirectImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
}

/**
 * Get PIN ID from Pinterest URL
 */
export function getPinId(url: string): string {
  const match = url.match(/\/pin\/(\d+)/);
  return match ? match[1] : '';
}
