CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  taobao_id VARCHAR(100) UNIQUE NOT NULL,
  title_original TEXT NOT NULL,
  title_mn TEXT,
  description_original TEXT,
  description_mn TEXT,
  price NUMERIC(12, 2),
  currency VARCHAR(10) DEFAULT 'CNY',
  image_url TEXT,
  images JSONB DEFAULT '[]',
  category VARCHAR(255),
  shop_name VARCHAR(255),
  shop_url TEXT,
  product_url TEXT,
  sold_count INTEGER DEFAULT 0,
  rating NUMERIC(3, 2),
  attributes JSONB DEFAULT '{}',
  is_translated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_taobao_id ON products(taobao_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_translated ON products(is_translated);

CREATE TABLE IF NOT EXISTS search_history (
  id SERIAL PRIMARY KEY,
  query VARCHAR(500) NOT NULL,
  result_count INTEGER DEFAULT 0,
  searched_at TIMESTAMPTZ DEFAULT NOW()
);
