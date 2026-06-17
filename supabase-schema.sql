-- ===========================================
-- SİPAHİOĞLU ÇEKME HELVA - SUPABASE ŞEMASI
-- ===========================================
-- Bu SQL'i Supabase SQL Editor'da çalıştırın
-- https://supabase.com/dashboard -> SQL Editor -> New Query

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory VARCHAR(255),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  weight VARCHAR(100),
  short_description TEXT,
  long_description TEXT,
  ingredients TEXT,
  images TEXT[] DEFAULT '{}',
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Politikaları
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni
CREATE POLICY "Herkes kategorileri okuyabilir" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Herkes ürünleri okuyabilir" ON products
  FOR SELECT USING (true);

-- Anon kullanıcılar için yazma izni (basit admin paneli için)
CREATE POLICY "Anonim kullanıcılar kategori ekleyebilir" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anonim kullanıcılar kategori güncelleyebilir" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Anonim kullanıcılar kategori silebilir" ON categories
  FOR DELETE USING (true);

CREATE POLICY "Anonim kullanıcılar ürün ekleyebilir" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anonim kullanıcılar ürün güncelleyebilir" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Anonim kullanıcılar ürün silebilir" ON products
  FOR DELETE USING (true);

-- İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- ===========================================
-- ÖRNEK VERİLER (İsteğe bağlı)
-- ===========================================

-- Ana kategoriler
INSERT INTO categories (name, slug, description, image) VALUES
  ('Çekme Helva', 'cekme-helva', 'Geleneksel tariflerle hazırlanan el yapımı çekme helvalarımız', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80'),
  ('Reçel', 'recel', 'Doğal meyvelerden hazırlanan ev yapımı reçellerimiz', 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=600&q=80'),
  ('Hediye Paketleri', 'hediye-paketleri', 'Sevdiklerinize özel hazırlanmış hediye kutuları', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80'),
  ('Yöresel Ürünler', 'yoresel-urunler', 'Kastamonu''nun geleneksel lezzetleri', 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600&q=80')
ON CONFLICT (slug) DO NOTHING;

-- Örnek ürün ekleme (Çekme Helva kategorisi ID'si gerekli)
-- Aşağıdaki sorguyu kategoriler eklendikten sonra çalıştırın:
/*
INSERT INTO products (name, slug, category_id, price, weight, short_description, long_description, ingredients, images, is_bestseller)
SELECT
  'Sade Çekme Helva',
  'sade-cekme-helva',
  id,
  180,
  '500g',
  'Geleneksel tarifle hazırlanan sade çekme helva',
  'Osmanlı''dan günümüze uzanan geleneksel tarifimizle hazırlanan sade çekme helvamız.',
  'Tahin, şeker, un, su',
  ARRAY['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80'],
  TRUE
FROM categories WHERE slug = 'cekme-helva';
*/
