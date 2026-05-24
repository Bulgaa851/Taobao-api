const axios = require('axios');

const client = axios.create({
  baseURL: `https://${process.env.TAOBAO_API_HOST}`,
  headers: {
    'x-rapidapi-key': process.env.TAOBAO_API_KEY,
    'x-rapidapi-host': process.env.TAOBAO_API_HOST,
  },
});

async function searchProducts(keyword, page = 1) {
  const res = await client.get('/search', {
    params: { q: keyword, page },
  });
  return res.data;
}

async function getProductDetail(itemId) {
  const res = await client.get('/item/detail', {
    params: { itemId },
  });
  return res.data;
}

function normalizeProduct(raw) {
  return {
    taobao_id: String(raw.itemId || raw.item_id || raw.id),
    title_original: raw.title || raw.name || '',
    price: parseFloat(raw.price || raw.currentPrice || 0),
    currency: 'CNY',
    image_url: raw.pic_url || raw.image || raw.img || '',
    images: raw.images || [],
    category: raw.category || '',
    shop_name: raw.shopName || raw.shop_title || '',
    shop_url: raw.shopUrl || '',
    product_url: raw.itemUrl || raw.detail_url || '',
    sold_count: parseInt(raw.soldCount || raw.sold || 0, 10),
    rating: parseFloat(raw.rating || raw.score || 0),
    attributes: raw.props || raw.attributes || {},
  };
}

module.exports = { searchProducts, getProductDetail, normalizeProduct };
