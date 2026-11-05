/**
 * Simple translation utility using free Google Translate API
 * Translates text between languages
 */

export async function translateText(text: string, targetLang: string, sourceLang: string = 'en'): Promise<string> {
  try {
    // If source and target are the same, return original text
    if (sourceLang === targetLang) {
      return text;
    }

    // Map language codes to Google Translate language codes
    const langMap: Record<string, string> = {
      'en': 'en',
      'km': 'km', // Khmer
    };

    const mappedTarget = langMap[targetLang] || targetLang;
    const mappedSource = langMap[sourceLang] || sourceLang;

    // Use the free Google Translate API endpoint
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit&client=gtx&sl=${mappedSource}&tl=${mappedTarget}&q=${encodedText}`;

    // Alternative approach using a more reliable endpoint
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${mappedSource}|${mappedTarget}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      console.warn(`Translation API returned status ${response.status}`);
      return text; // Return original text if translation fails
    }

    const data = (await response.json()) as { responseData?: { translatedText?: string }; responseStatus?: number };

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    console.warn('Translation API returned unexpected response');
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

/**
 * Translate text to multiple languages at once
 */
export async function translateToMultiple(
  text: string,
  targetLangs: string[],
  sourceLang: string = 'en'
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  for (const lang of targetLangs) {
    results[lang] = await translateText(text, lang, sourceLang);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}
