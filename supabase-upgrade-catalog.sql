-- ==========================================================================
-- JSM BAGS - SUPABASE CATALOG SCHEMA UPGRADE
-- Adds all optional e-commerce & inventory columns safely (IF NOT EXISTS)
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==========================================================================

-- 1. EXTEND PRODUCTS TABLE
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory TEXT DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'JSM Bags';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bulk_price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wholesale_price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS moq JSONB DEFAULT '{"retail":1,"bulk":50,"wholesale":250}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 100;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colours JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. CREATE CATEGORIES TABLE (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed standard 19 categories
INSERT INTO public.categories (name, slug, display_order, is_active)
VALUES
    ('Potli Bags', 'potli-bags', 1, true),
    ('Jute Bags', 'jute-bags', 2, true),
    ('Canvas Bags', 'canvas-bags', 3, true),
    ('Paper Bags', 'paper-bags', 4, true),
    ('Kids Bags', 'kids-bags', 5, true),
    ('School Bags', 'school-bags', 6, true),
    ('Gym Bags', 'gym-bags', 7, true),
    ('Travel Bags', 'travel-bags', 8, true),
    ('Trekking Bags', 'trekking-bags', 9, true),
    ('Trolleys', 'trolleys', 10, true),
    ('Laptop Bags', 'laptop-bags', 11, true),
    ('Executive Bags', 'executive-bags', 12, true),
    ('Carriage / Carry Bags', 'carriage-carry-bags', 13, true),
    ('Handbags', 'handbags', 14, true),
    ('Leather-Type (Faux/Vegan Leather) Bags', 'leather-type-bags', 15, true),
    ('Eco-Friendly Biodegradable Return Gift Bags', 'eco-friendly-return-gift-bags', 16, true),
    ('Transparent Bags', 'transparent-bags', 17, true),
    ('Gift Hamper Bags', 'gift-hamper-bags', 18, true),
    ('Backpack Bundles', 'backpack-bundles', 19, true)
ON CONFLICT (name) DO NOTHING;

-- 3. STORE SETTINGS TABLE (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    brand_name TEXT DEFAULT 'JSM Bags',
    phone TEXT DEFAULT '+91 94408 63516',
    whatsapp TEXT DEFAULT '919440863516',
    address TEXT DEFAULT 'Innes Peta, Rajahmundry, Andhra Pradesh - 533101, India',
    announcement TEXT DEFAULT '',
    announcement_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.store_settings (id, brand_name, phone, whatsapp, address, announcement, announcement_active)
VALUES ('global', 'JSM Bags', '+91 94408 63516', '919440863516', 'Innes Peta, Rajahmundry, Andhra Pradesh - 533101, India', '', false)
ON CONFLICT (id) DO NOTHING;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view coupons" ON public.coupons;
CREATE POLICY "Public can view coupons" ON public.coupons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);

-- Allow authenticated admin users full CRUD access
DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to categories" ON public.categories;
CREATE POLICY "Admins have full access to categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to coupons" ON public.coupons;
CREATE POLICY "Admins have full access to coupons" ON public.coupons FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to store settings" ON public.store_settings;
CREATE POLICY "Admins have full access to store settings" ON public.store_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
