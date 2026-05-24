const express = require('express');
const router = express.Router();
const db = require('../db');
const { searchProducts, getProductDetail, normalizeProduct } = require('../services/taobao');
const { translateProduct } = require('../services/translator');

// GET /api/products — list saved products
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = 'WHERE 1=1';

    if (category) {
      params.push(category);
      where += ` AND category = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      where += ` AND (title_mn ILIKE $${params.length} OR title_original ILIKE $${params.length})`;
    }

    params.push(parseInt(limit), offset);
    const { rows } = await db.query(
      `SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    const countRes = await db.query(`SELECT COUNT(*) FROM products ${where}`, params.slice(0, -2));
    res.json({ products: rows, total: parseInt(countRes.rows[0].count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/search — fetch from Taobao, translate, save
router.post('/search', async (req, res) => {
  try {
    const { keyword, page = 1 } = req.body;
    if (!keyword) return res.status(400).json({ error: 'keyword шаардлагатай' });

    const rawItems = await searchProducts(keyword, page);
    if (!rawItems.length) {
      return res.json({ saved: 0, products: [], message: 'Taobao-оос үр дүн олдсонгүй' });
    }

    const normalized = rawItems.map(normalizeProduct).filter(p => p.taobao_id);

    const saved = [];
    for (const item of normalized) {
      const translated = await translateProduct(item);
      const { rows } = await db.query(
        `INSERT INTO products
          (taobao_id, title_original, title_mn, description_mn, price, currency,
           image_url, images, category, shop_name, shop_url, product_url,
           sold_count, rating, attributes, is_translated)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         ON CONFLICT (taobao_id) DO UPDATE SET
           title_mn    = EXCLUDED.title_mn,
           price       = EXCLUDED.price,
           sold_count  = EXCLUDED.sold_count,
           updated_at  = NOW()
         RETURNING *`,
        [
          translated.taobao_id,   translated.title_original, translated.title_mn,
          translated.description_mn, translated.price,       translated.currency,
          translated.image_url,   JSON.stringify(translated.images),
          translated.category,    translated.shop_name,      translated.shop_url,
          translated.product_url, translated.sold_count,     translated.rating,
          JSON.stringify(translated.attributes), translated.is_translated,
        ]
      );
      saved.push(rows[0]);
    }

    await db.query(
      'INSERT INTO search_history (query, result_count) VALUES ($1, $2)',
      [keyword, saved.length]
    );

    res.json({ saved: saved.length, products: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Олдсонгүй' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
