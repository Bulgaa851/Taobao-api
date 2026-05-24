// Sample products for offline/dev testing when API is blocked
const MOCK_PRODUCTS = [
  {
    taobao_id: 'mock_001',
    title_original: '女装夏季连衣裙',
    title_mn: 'Эмэгтэй зуны даашинз',
    price: 89.9, currency: 'CNY',
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
    images: [], category: 'clothing',
    shop_name: 'Fashion Store', shop_url: '', product_url: 'https://taobao.com',
    sold_count: 1200, rating: 4.8, attributes: {}, is_translated: true,
  },
  {
    taobao_id: 'mock_002',
    title_original: '男士运动鞋',
    title_mn: 'Эрэгтэй спорт гутал',
    price: 159.0, currency: 'CNY',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    images: [], category: 'clothing',
    shop_name: 'Sports Hub', shop_url: '', product_url: 'https://taobao.com',
    sold_count: 850, rating: 4.6, attributes: {}, is_translated: true,
  },
  {
    taobao_id: 'mock_003',
    title_original: '蓝牙耳机无线',
    title_mn: 'Bluetooth утасгүй чихэвч',
    price: 299.0, currency: 'CNY',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    images: [], category: 'electronics',
    shop_name: 'Tech World', shop_url: '', product_url: 'https://taobao.com',
    sold_count: 3400, rating: 4.9, attributes: {}, is_translated: true,
  },
  {
    taobao_id: 'mock_004',
    title_original: '护肤套装女',
    title_mn: 'Эмэгтэй арьс арчилгааны иж бүрдэл',
    price: 199.0, currency: 'CNY',
    image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
    images: [], category: 'beauty',
    shop_name: 'Beauty Pro', shop_url: '', product_url: 'https://taobao.com',
    sold_count: 2100, rating: 4.7, attributes: {}, is_translated: true,
  },
  {
    taobao_id: 'mock_005',
    title_original: '智能手表运动',
    title_mn: 'Ухаалаг спорт цаг',
    price: 399.0, currency: 'CNY',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    images: [], category: 'electronics',
    shop_name: 'Smart Gadgets', shop_url: '', product_url: 'https://taobao.com',
    sold_count: 980, rating: 4.5, attributes: {}, is_translated: true,
  },
  {
    taobao_id: 'mock_006',
    title_original: '家用榨汁机',
    title_mn: 'Гэрийн хэрэглээний шүүс хийгч',
    price: 129.0, currency: 'CNY',
    image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400',
    images: [], category: 'home',
    shop_name: 'Home Essentials', shop_url: '', product_url: 'https://taobao.com',
    sold_count: 560, rating: 4.3, attributes: {}, is_translated: true,
  },
  {
    taobao_id: 'mock_007',
    title_original: '男士T恤短袖',
    title_mn: 'Эрэгтэй богино ханцуйт',
    price: 49.9, currency: 'CNY',
    image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
    images: [], category: 'clothing',
    shop_name: 'Men Fashion', shop_url: '', product_url: 'https://taobao.com',
    sold_count: 4500, rating: 4.4, attributes: {}, is_translated: true,
  },
  {
    taobao_id: 'mock_008',
    title_original: '瑜伽垫防滑',
    title_mn: 'Гулгахгүй йога дэвсгэр',
    price: 79.0, currency: 'CNY',
    image_url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400',
    images: [], category: 'sports',
    shop_name: 'Fitness Store', shop_url: '', product_url: 'https://taobao.com',
    sold_count: 1800, rating: 4.6, attributes: {}, is_translated: true,
  },
];

function getMockProducts(keyword = '') {
  if (!keyword) return MOCK_PRODUCTS;
  const kw = keyword.toLowerCase();
  return MOCK_PRODUCTS.filter(p =>
    p.title_mn.toLowerCase().includes(kw) ||
    p.title_original.toLowerCase().includes(kw) ||
    p.category.toLowerCase().includes(kw)
  );
}

module.exports = { MOCK_PRODUCTS, getMockProducts };
