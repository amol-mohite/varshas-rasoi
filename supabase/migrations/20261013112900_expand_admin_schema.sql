/*
# Expand schema for admin panel management

1. New Tables
- `categories`: Food categories with name and image URL, managed via admin CRUD.

2. Modified Tables
- `settings`: Added columns for brand_name, brand_logo_url, description, instagram_url, facebook_url, about_title, about_description, about_image_url.
  All new columns have defaults so existing rows and the frontend keep working.

3. Security
- RLS remains enabled on all tables.
- `categories`: public read (anon + authenticated), public CRUD (this is a no-auth public restaurant site; admin writes via anon key).
- `settings`, `menu_items`, `banners`: added INSERT/UPDATE/DELETE policies for anon + authenticated so the admin panel can manage data.
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
TO anon, authenticated USING (true);

-- Add new columns to settings (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'brand_name') THEN
    ALTER TABLE settings ADD COLUMN brand_name text NOT NULL DEFAULT 'Varsha''s Rasoi';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'brand_logo_url') THEN
    ALTER TABLE settings ADD COLUMN brand_logo_url text NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'description') THEN
    ALTER TABLE settings ADD COLUMN description text NOT NULL DEFAULT 'A cloud kitchen serving honest, home-style Indian food.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'instagram_url') THEN
    ALTER TABLE settings ADD COLUMN instagram_url text NOT NULL DEFAULT 'https://instagram.com';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'facebook_url') THEN
    ALTER TABLE settings ADD COLUMN facebook_url text NOT NULL DEFAULT 'https://facebook.com';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'about_title') THEN
    ALTER TABLE settings ADD COLUMN about_title text NOT NULL DEFAULT 'About Varsha''s Rasoi';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'about_description') THEN
    ALTER TABLE settings ADD COLUMN about_description text NOT NULL DEFAULT 'What started as tiffins for neighbours became a full-fledged rasoi. Varsha still cooks the way she always has — spices ground fresh, vegetables from the morning mandi, and recipes passed down from her mother. No frozen gravies, no shortcuts. Just the kind of food that makes you ask for one more phulka.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'about_image_url') THEN
    ALTER TABLE settings ADD COLUMN about_image_url text NOT NULL DEFAULT 'https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85';
  END IF;
END $$;

-- Add write policies to settings
DROP POLICY IF EXISTS "anon_update_settings" ON settings;
CREATE POLICY "anon_update_settings" ON settings FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

-- Add write policies to menu_items
DROP POLICY IF EXISTS "anon_insert_menu_items" ON menu_items;
CREATE POLICY "anon_insert_menu_items" ON menu_items FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_menu_items" ON menu_items;
CREATE POLICY "anon_update_menu_items" ON menu_items FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_menu_items" ON menu_items;
CREATE POLICY "anon_delete_menu_items" ON menu_items FOR DELETE
TO anon, authenticated USING (true);

-- Add write policies to banners
DROP POLICY IF EXISTS "anon_insert_banners" ON banners;
CREATE POLICY "anon_insert_banners" ON banners FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_banners" ON banners;
CREATE POLICY "anon_update_banners" ON banners FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_banners" ON banners;
CREATE POLICY "anon_delete_banners" ON banners FOR DELETE
TO anon, authenticated USING (true);

-- Seed default categories
INSERT INTO categories (id, name, image_url) VALUES
('cat_thali', 'Thali', 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'),
('cat_snacks', 'Snacks', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85'),
('cat_main', 'Main Course', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMGJpcnlhbmklMjBob21lJTIwY29va2VkfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85'),
('cat_sweets', 'Sweets', 'https://images.pexels.com/photos/11887844/pexels-photo-11887844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'),
('cat_beverages', 'Beverages', 'https://images.pexels.com/photos/4475024/pexels-photo-4475024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')
ON CONFLICT (id) DO NOTHING;
