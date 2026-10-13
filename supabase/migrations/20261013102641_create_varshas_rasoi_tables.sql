/*
# Varsha's Rasoi — Cloud Kitchen Database

1. New Tables
- `menu_items`: Food dishes with name, description, price, category, veg/non-veg, availability, featured flag, and image URL.
- `banners`: Hero carousel slides with title, subtitle, and image URL.
- `settings`: Single-row table for kitchen settings (WhatsApp number).
2. Security
- This is a no-auth public restaurant site. RLS enabled on all tables with anon+authenticated public read access. No writes from the frontend.
- SELECT policies use `TO anon, authenticated` so the anon-key client can read data.
*/

CREATE TABLE IF NOT EXISTS menu_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  veg boolean NOT NULL DEFAULT true,
  available boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_menu_items" ON menu_items;
CREATE POLICY "anon_read_menu_items" ON menu_items FOR SELECT
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS banners (
  id text PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_banners" ON banners;
CREATE POLICY "anon_read_banners" ON banners FOR SELECT
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS settings (
  id text PRIMARY KEY DEFAULT 'singleton',
  whatsapp_number text NOT NULL DEFAULT '919876543210',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_settings" ON settings;
CREATE POLICY "anon_read_settings" ON settings FOR SELECT
TO anon, authenticated USING (true);

-- Seed menu items
INSERT INTO menu_items (id, name, description, price, category, veg, available, featured, image_url, created_at) VALUES
('6a8c3453c4fc7f0166a27a4c', 'Varsha''s Special Veg Thali', '2 sabzis, dal tadka, jeera rice, 4 phulkas, salad, papad and a sweet of the day. A complete ghar-ka-khana experience.', 299, 'Thali', true, true, true, 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a4d', 'Dal Baati Feast Thali', 'Rajasthani-style baatis dunked in ghee, served with panchmel dal, churma and lehsun chutney.', 229, 'Thali', true, true, false, 'https://images.unsplash.com/photo-1559561724-732dbca7be1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjB0aGFsaSUyMGZvb2QlMjBwbGF0dGVyfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a4e', 'Chicken Maharaja Thali', 'Homestyle chicken curry, dal, rice, 3 butter rotis, salad and gulab jamun. Sunday-special vibes, any day.', 329, 'Thali', false, true, true, 'https://images.pexels.com/photos/32797056/pexels-photo-32797056.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a4f', 'Crispy Punjabi Samosa (2 pc)', 'Golden, flaky crust with a spiced aloo-matar filling. Served with imli and dhaniya chutneys.', 49, 'Snacks', true, true, true, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a50', 'Samosa Chaat', 'Crushed samosa layered with chole, dahi, chutneys, sev and pomegranate. Sweet, tangy, crunchy.', 89, 'Snacks', true, true, false, 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a51', 'Bread Pakora Basket', 'Crisp besan-fried bread pockets stuffed with spiced potato mash. Rainy-day comfort, delivered.', 69, 'Snacks', true, true, false, 'https://images.unsplash.com/photo-1601050690294-397f3c324515?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a52', 'Chicken Handi Biryani', 'Slow-cooked on dum with fragrant basmati, caramelised onions and whole spices. Served with raita and salan.', 279, 'Main Course', false, true, true, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMGJpcnlhbmklMjBob21lJTIwY29va2VkfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a53', 'Veg Dum Biryani', 'Garden vegetables and paneer layered with saffron rice, sealed and slow-steamed. Served with mirchi ka salan.', 219, 'Main Course', true, true, false, 'https://images.pexels.com/photos/9609869/pexels-photo-9609869.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a54', 'Butter Chicken Bowl + Naan', 'Silky tomato-makhani gravy with char-grilled chicken, finished with cream. Comes with one butter naan.', 299, 'Main Course', false, true, false, 'https://images.pexels.com/photos/36282643/pexels-photo-36282643.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a55', 'Paneer Butter Masala Meal', 'Soft malai paneer in a rich makhani gravy, served with jeera rice and 2 phulkas.', 259, 'Main Course', true, true, false, 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBjdXJyeSUyMGJpcnlhbmklMjBob21lJTIwY29va2VkfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a56', 'Rajma Chawal Comfort Bowl', 'Slow-simmered rajma in ghee-tempered masala over steamed rice, with pickled onions on the side.', 179, 'Main Course', true, true, false, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBjdXJyeSUyMGJpcnlhbmklMjBob21lJTIwY29va2VkfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a57', 'Gulab Jamun (4 pc)', 'Soft khoya dumplings soaked in warm cardamom-rose syrup. Melts before you can say ''one more''.', 79, 'Sweets', true, true, true, 'https://images.pexels.com/photos/11887844/pexels-photo-11887844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a58', 'Kesari Rasmalai (2 pc)', 'Feather-light chenna discs in saffron-infused chilled milk, topped with pistachio slivers.', 99, 'Sweets', true, true, false, 'https://images.pexels.com/photos/9198596/pexels-photo-9198596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a59', 'Motichoor Ladoo Box (250g)', 'Fine boondi laddus made in desi ghee — the box that disappears at every family gathering.', 149, 'Sweets', true, true, false, 'https://images.unsplash.com/photo-1695568180070-8b5acead5cf4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzd2VldHMlMjBndWxhYiUyMGphbXVuJTIwZGVzc2VydHxlbnwwfHx8fDE3ODc1NzMwNjN8MA&ixlib=rb-4.1.0&q=85', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a5a', 'Masala Kulhad Chai', 'Strong Assam leaves brewed with ginger, cardamom and lemongrass, served the kulhad way.', 39, 'Beverages', true, true, false, 'https://images.unsplash.com/photo-1630748662359-40a2105640c7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBsYXNzaSUyMG1hc2FsYSUyMGNoYWklMjBkcmlua3xlbnwwfHx8fDE3ODc1NzMwNjN8MA&ixlib=rb-4.1.0&q=85', '2026-08-24T12:08:51.101268+00:00'),
('6a8c3453c4fc7f0166a27a5b', 'Mango Lassi', 'Thick curd churned with Alphonso pulp and a hint of elaichi, topped with crushed nuts.', 89, 'Beverages', true, true, true, 'https://images.pexels.com/photos/4475024/pexels-photo-4475024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00')
ON CONFLICT (id) DO NOTHING;

-- Seed banners
INSERT INTO banners (id, title, subtitle, image_url, created_at) VALUES
('b1', 'Craving something?', 'Home-style Indian food, delivered hot from Varsha''s kitchen to yours.', 'https://images.pexels.com/photos/37152225/pexels-photo-37152225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00'),
('b2', 'Varsha''s Special Veg Thali', 'A complete ghar-ka-khana experience — 2 sabzis, dal, rice, phulkas & a sweet.', 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00'),
('b3', 'Mango Lassi Season', 'Thick, creamy, Alphonso-rich — the perfect cooldown for your spice.', 'https://images.pexels.com/photos/4475024/pexels-photo-4475024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00'),
('b4', 'Gulab Jamun (4 pc)', 'Warm, soft, soaked in cardamom-rose syrup. Order one box, regret nothing.', 'https://images.pexels.com/photos/11887844/pexels-photo-11887844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '2026-08-24T12:08:51.101268+00:00')
ON CONFLICT (id) DO NOTHING;

-- Seed settings
INSERT INTO settings (id, whatsapp_number) VALUES ('singleton', '919876543210')
ON CONFLICT (id) DO NOTHING;
