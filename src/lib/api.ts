import { supabase } from '@/lib/supabase';
import type { Banner, MenuItem, Settings, Category } from '@/types';

const MENU_ITEMS: MenuItem[] = [
  { id: '6a8c3453c4fc7f0166a27a4c', name: "Varsha's Special Veg Thali", description: '2 sabzis, dal tadka, jeera rice, 4 phulkas, salad, papad and a sweet of the day. A complete ghar-ka-khana experience.', price: 299, category: 'Thali', veg: true, available: true, featured: true, image_url: 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: '6a8c3453c4fc7f0166a27a4d', name: 'Dal Baati Feast Thali', description: 'Rajasthani-style baatis dunked in ghee, served with panchmel dal, churma and lehsun chutney.', price: 229, category: 'Thali', veg: true, available: true, featured: false, image_url: 'https://images.unsplash.com/photo-1559561724-732dbca7be1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjB0aGFsaSUyMGZvb2QlMjBwbGF0dGVyfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85' },
  { id: '6a8c3453c4fc7f0166a27a4e', name: 'Chicken Maharaja Thali', description: 'Homestyle chicken curry, dal, rice, 3 butter rotis, salad and gulab jamun. Sunday-special vibes, any day.', price: 329, category: 'Thali', veg: false, available: true, featured: true, image_url: 'https://images.pexels.com/photos/32797056/pexels-photo-32797056.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: '6a8c3453c4fc7f0166a27a4f', name: 'Crispy Punjabi Samosa (2 pc)', description: 'Golden, flaky crust with a spiced aloo-matar filling. Served with imli and dhaniya chutneys.', price: 49, category: 'Snacks', veg: true, available: true, featured: true, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85' },
  { id: '6a8c3453c4fc7f0166a27a50', name: 'Samosa Chaat', description: 'Crushed samosa layered with chole, dahi, chutneys, sev and pomegranate. Sweet, tangy, crunchy.', price: 89, category: 'Snacks', veg: true, available: true, featured: false, image_url: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85' },
  { id: '6a8c3453c4fc7f0166a27a51', name: 'Bread Pakora Basket', description: 'Crisp besan-fried bread pockets stuffed with spiced potato mash. Rainy-day comfort, delivered.', price: 69, category: 'Snacks', veg: true, available: true, featured: false, image_url: 'https://images.unsplash.com/photo-1601050690294-397f3c324515?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85' },
  { id: '6a8c3453c4fc7f0166a27a52', name: 'Chicken Handi Biryani', description: 'Slow-cooked on dum with fragrant basmati, caramelised onions and whole spices. Served with raita and salan.', price: 279, category: 'Main Course', veg: false, available: true, featured: true, image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMGJpcnlhbmklMjBob21lJTIwY29va2VkfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85' },
  { id: '6a8c3453c4fc7f0166a27a53', name: 'Veg Dum Biryani', description: 'Garden vegetables and paneer layered with saffron rice, sealed and slow-steamed. Served with mirchi ka salan.', price: 219, category: 'Main Course', veg: true, available: true, featured: false, image_url: 'https://images.pexels.com/photos/9609869/pexels-photo-9609869.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: '6a8c3453c4fc7f0166a27a54', name: 'Butter Chicken Bowl + Naan', description: 'Silky tomato-makhani gravy with char-grilled chicken, finished with cream. Comes with one butter naan.', price: 299, category: 'Main Course', veg: false, available: true, featured: false, image_url: 'https://images.pexels.com/photos/36282643/pexels-photo-36282643.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: '6a8c3453c4fc7f0166a27a55', name: 'Paneer Butter Masala Meal', description: 'Soft malai paneer in a rich makhani gravy, served with jeera rice and 2 phulkas.', price: 259, category: 'Main Course', veg: true, available: true, featured: false, image_url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBjdXJyeSUyMGJpcnlhbmklMjBob21lJTIwY29va2VkfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85' },
  { id: '6a8c3453c4fc7f0166a27a56', name: 'Rajma Chawal Comfort Bowl', description: 'Slow-simmered rajma in ghee-tempered masala over steamed rice, with pickled onions on the side.', price: 179, category: 'Main Course', veg: true, available: true, featured: false, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBjdXJyeSUyMGJpcnlhbmklMjBob21lJTIwY29va2VkfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85' },
  { id: '6a8c3453c4fc7f0166a27a57', name: 'Gulab Jamun (4 pc)', description: "Soft khoya dumplings soaked in warm cardamom-rose syrup. Melts before you can say 'one more'.", price: 79, category: 'Sweets', veg: true, available: true, featured: true, image_url: 'https://images.pexels.com/photos/11887844/pexels-photo-11887844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: '6a8c3453c4fc7f0166a27a58', name: 'Kesari Rasmalai (2 pc)', description: 'Feather-light chenna discs in saffron-infused chilled milk, topped with pistachio slivers.', price: 99, category: 'Sweets', veg: true, available: true, featured: false, image_url: 'https://images.pexels.com/photos/9198596/pexels-photo-9198596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: '6a8c3453c4fc7f0166a27a59', name: 'Motichoor Ladoo Box (250g)', description: 'Fine boondi laddus made in desi ghee — the box that disappears at every family gathering.', price: 149, category: 'Sweets', veg: true, available: true, featured: false, image_url: 'https://images.unsplash.com/photo-1695568180070-8b5acead5cf4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzd2VldHMlMjBndWxhYiUyMGphbXVuJTIwZGVzc2VydHxlbnwwfHx8fDE3ODc1NzMwNjN8MA&ixlib=rb-4.1.0&q=85' },
  { id: '6a8c3453c4fc7f0166a27a5a', name: 'Masala Kulhad Chai', description: 'Strong Assam leaves brewed with ginger, cardamom and lemongrass, served the kulhad way.', price: 39, category: 'Beverages', veg: true, available: true, featured: false, image_url: 'https://images.unsplash.com/photo-1630748662359-40a2105640c7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBsYXNzaSUyMG1hc2FsYSUyMGNoYWklMjBkcmlua3xlbnwwfHx8fDE3ODc1NzMwNjN8MA&ixlib=rb-4.1.0&q=85' },
  { id: '6a8c3453c4fc7f0166a27a5b', name: 'Mango Lassi', description: 'Thick curd churned with Alphonso pulp and a hint of elaichi, topped with crushed nuts.', price: 89, category: 'Beverages', veg: true, available: true, featured: true, image_url: 'https://images.pexels.com/photos/4475024/pexels-photo-4475024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
];

const BANNERS: Banner[] = [
  { id: 'b1', title: 'Craving something?', subtitle: 'Home-style Indian food, delivered hot from Varsha\u2019s kitchen to yours.', image_url: 'https://images.pexels.com/photos/37152225/pexels-photo-37152225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: 'b2', title: "Varsha's Special Veg Thali", subtitle: 'A complete ghar-ka-khana experience — 2 sabzis, dal, rice, phulkas & a sweet.', image_url: 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: 'b3', title: "Mango Lassi Season", subtitle: 'Thick, creamy, Alphonso-rich — the perfect cooldown for your spice.', image_url: 'https://images.pexels.com/photos/4475024/pexels-photo-4475024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: 'b4', title: "Gulab Jamun (4 pc)", subtitle: 'Warm, soft, soaked in cardamom-rose syrup. Order one box, regret nothing.', image_url: 'https://images.pexels.com/photos/11887844/pexels-photo-11887844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
];

const DEFAULT_SETTINGS: Settings = {
  whatsapp_number: '919876543210',
  brand_name: "Varsha's Rasoi",
  brand_logo_url: '',
  description: 'A cloud kitchen serving honest, home-style Indian food. Every dish is cooked in small batches, the way it\'s made at home — no shortcuts, no compromises.',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  about_title: "About Varsha's Rasoi",
  about_description: "What started as tiffins for neighbours became a full-fledged rasoi. Varsha still cooks the way she always has — spices ground fresh, vegetables from the morning mandi, and recipes passed down from her mother. No frozen gravies, no shortcuts. Just the kind of food that makes you ask for one more phulka.",
  about_image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85',
};

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'cat_thali', name: 'Thali', image_url: 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: 'cat_snacks', name: 'Snacks', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85' },
  { id: 'cat_main', name: 'Main Course', image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMGJpcnlhbmklMjBob21lJTIwY29va2VkfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85' },
  { id: 'cat_sweets', name: 'Sweets', image_url: 'https://images.pexels.com/photos/11887844/pexels-photo-11887844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: 'cat_beverages', name: 'Beverages', image_url: 'https://images.pexels.com/photos/4475024/pexels-photo-4475024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
];

export const api = {
  async getItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: true });
    if (error) return MENU_ITEMS;
    if (!data || data.length === 0) return MENU_ITEMS;
    return data as MenuItem[];
  },

  async getItem(id: string): Promise<MenuItem | null> {
    const { data, error } = await supabase.from('menu_items').select('*').eq('id', id).maybeSingle();
    if (error || !data) return MENU_ITEMS.find((i) => i.id === id) ?? null;
    return data as MenuItem;
  },

  async createItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem | null> {
    const id = crypto.randomUUID();
    const { data, error } = await supabase.from('menu_items').insert({ ...item, id }).select().single();
    if (error) return null;
    return data as MenuItem;
  },

  async updateItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    const { data, error } = await supabase.from('menu_items').update(updates).eq('id', id).select().single();
    if (error) return null;
    return data as MenuItem;
  },

  async deleteItem(id: string): Promise<boolean> {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    return !error;
  },

  async getBanners(): Promise<Banner[]> {
    const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: true });
    if (error) return BANNERS;
    if (!data || data.length === 0) return BANNERS;
    return data as Banner[];
  },

  async createBanner(banner: Omit<Banner, 'id'>): Promise<Banner | null> {
    const id = 'b_' + crypto.randomUUID().slice(0, 8);
    const { data, error } = await supabase.from('banners').insert({ ...banner, id }).select().single();
    if (error) return null;
    return data as Banner;
  },

  async updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
    const { data, error } = await supabase.from('banners').update(updates).eq('id', id).select().single();
    if (error) return null;
    return data as Banner;
  },

  async deleteBanner(id: string): Promise<boolean> {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    return !error;
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if (error) return FALLBACK_CATEGORIES;
    if (!data || data.length === 0) return FALLBACK_CATEGORIES;
    return data as Category[];
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
    const id = 'cat_' + crypto.randomUUID().slice(0, 8);
    const { data, error } = await supabase.from('categories').insert({ ...category, id }).select().single();
    if (error) return null;
    return data as Category;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
    if (error) return null;
    return data as Category;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    return !error;
  },

  async getSettings(): Promise<Settings> {
    const { data, error } = await supabase.from('settings').select('*').maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return data as Settings;
  },

  async updateSettings(updates: Partial<Settings>): Promise<Settings | null> {
    const { data, error } = await supabase.from('settings').update(updates).eq('id', 'singleton').select().maybeSingle();
    if (error) {
      const { data: inserted, error: insertError } = await supabase.from('settings').insert({ id: 'singleton', ...updates }).select().single();
      if (insertError) return null;
      return inserted as Settings;
    }
    return data as Settings;
  },
};
