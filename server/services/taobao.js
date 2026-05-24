const axios = require('axios');
const https = require('https');

const HOST = process.env.TAOBAO_API_HOST || 'taobao-datahub.p.rapidapi.com';
const KEY  = process.env.TAOBAO_API_KEY;

const client = axios.create({
  baseURL: `https://${HOST}`,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  timeout: 8000,
  headers: {
    'x-rapidapi-key':  KEY,
    'x-rapidapi-host': HOST,
  },
});

async function searchProducts(keyword, page = 1) {
  const { data } = await client.get('/item_search', { params: { q: keyword, page } });

  // Check API-level error
  const status = data?.result?.status;
  if (status?.data === 'error') {
    throw new Error(`API error ${status.code}: ${JSON.stringify(status.msg)}`);
  }

  const result = data?.result?.result || data?.result || {};
  const items  = result.items || result.resultList || result.itemsArray || [];
  console.log(`[Taobao] "${keyword}" p${page} → ${items.length} items`);
  return items;
}

async function getProductDetail(itemId) {
  try {
    const { data } = await client.get('/item_detail', { params: { id: itemId } });
    return data?.result?.result || data?.result || {};
  } catch {
    const { data } = await client.get('/item_info', { params: { itemId } });
    return data?.result?.result || data?.result || {};
  }
}

async function convertItemId(itemIdStr) {
  const { data } = await client.post('/itemidstr_convert', { itemIdStr });
  return data?.result?.result?.itemId || data?.result?.itemId || null;
}

function normalizeProduct(raw) {
  const item = raw.item || raw;
  return {
    taobao_id:      String(item.itemId || item.item_id || item.id || ''),
    title_original: item.title || item.name || item.subject || '',
    price:          parseFloat(item.reservePrice || item.price || item.currentPrice || 0),
    currency:       'CNY',
    image_url:      (item.picUrl || item.pic_url || item.image || '').replace(/^\/\//, 'https://'),
    images:         item.images || [],
    category:       String(item.categoryId || item.category || ''),
    shop_name:      item.shopTitle || item.shop_title || item.shopName || '',
    shop_url:       item.shopUrl || '',
    product_url:    item.itemUrl || item.detail_url || `https://item.taobao.com/item.htm?id=${item.itemId}`,
    sold_count:     parseInt(item.sold || item.soldCount || item.volume || 0, 10),
    rating:         parseFloat(item.rating || item.score || 0),
    attributes:     item.props || item.attributes || {},
  };
}

module.exports = { searchProducts, getProductDetail, convertItemId, normalizeProduct };
