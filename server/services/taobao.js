const https = require('https');

const HOST = process.env.TAOBAO_API_HOST || 'taobao-datahub.p.rapidapi.com';
const KEY  = process.env.TAOBAO_API_KEY;

function apiRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const options = {
      method,
      hostname: HOST,
      path,
      headers: {
        'x-rapidapi-key':  KEY,
        'x-rapidapi-host': HOST,
        'Content-Type':    'application/json',
        ...(bodyStr && { 'Content-Length': Buffer.byteLength(bodyStr) }),
      },
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        try {
          const data = JSON.parse(Buffer.concat(chunks).toString());
          if (res.statusCode >= 400) {
            return reject(new Error(`API ${res.statusCode}: ${JSON.stringify(data)}`));
          }
          resolve(data);
        } catch (e) {
          reject(new Error('Invalid JSON response from Taobao API'));
        }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// Search products by keyword
// GET /item_search?q=<keyword>&page=<n>&catId=<optional>
async function searchProducts(keyword, page = 1) {
  const qs = new URLSearchParams({ q: keyword, page: String(page) });
  const data = await apiRequest(`/item_search?${qs}`);
  // result.result.items or result.result.resultList
  const result = data?.result?.result || data?.result || {};
  return result.items || result.resultList || result.itemsArray || [];
}

// Get item detail by numeric itemId
// GET /item_detail?id=<itemId>  (fallback: /item_info?itemId=<id>)
async function getProductDetail(itemId) {
  try {
    const data = await apiRequest(`/item_detail?id=${itemId}`);
    return data?.result?.result || data?.result || {};
  } catch {
    const data = await apiRequest(`/item_info?itemId=${itemId}`);
    return data?.result?.result || data?.result || {};
  }
}

// Convert obfuscated itemIdStr back to numeric id
async function convertItemId(itemIdStr) {
  const data = await apiRequest('/itemidstr_convert', 'POST', { itemIdStr });
  return data?.result?.result?.itemId || data?.result?.itemId || null;
}

function normalizeProduct(raw) {
  const item = raw.item || raw;
  return {
    taobao_id:        String(item.itemId || item.item_id || item.id || ''),
    title_original:   item.title || item.name || item.subject || '',
    price:            parseFloat(item.reservePrice || item.price || item.currentPrice || 0),
    currency:         'CNY',
    image_url:        (item.picUrl || item.pic_url || item.image || '').replace(/^\/\//, 'https://'),
    images:           item.images || [],
    category:         item.categoryId || item.category || '',
    shop_name:        item.shopTitle || item.shop_title || item.shopName || '',
    shop_url:         item.shopUrl  || '',
    product_url:      item.itemUrl  || item.detail_url || `https://item.taobao.com/item.htm?id=${item.itemId}`,
    sold_count:       parseInt(item.sold || item.soldCount || item.volume || 0, 10),
    rating:           parseFloat(item.rating || item.score || 0),
    attributes:       item.props || item.attributes || {},
  };
}

module.exports = { searchProducts, getProductDetail, convertItemId, normalizeProduct };
