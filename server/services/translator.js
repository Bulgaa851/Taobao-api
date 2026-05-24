const axios = require('axios');

// Free MyMemory translation API (no key needed, 1000 req/day)
// For production use Google Translate or DeepL
async function translateToMongolian(text) {
  if (!text) return '';
  try {
    const res = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text.substring(0, 500),
        langpair: 'zh|mn',
        de: process.env.USER_EMAIL || 'store@example.com',
      },
      timeout: 4000,
    });
    const translated = res.data?.responseData?.translatedText;
    return translated || text;
  } catch {
    return text;
  }
}

async function translateProduct(product) {
  const [title_mn, description_mn] = await Promise.all([
    translateToMongolian(product.title_original),
    translateToMongolian(product.description_original || ''),
  ]);
  return { ...product, title_mn, description_mn, is_translated: true };
}

module.exports = { translateToMongolian, translateProduct };
