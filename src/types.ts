export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  veg: boolean;
  available: boolean;
  featured: boolean;
  image_url: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
}

export interface Category {
  id: string;
  name: string;
  image_url: string;
}

export interface Settings {
  whatsapp_number: string;
  brand_name: string;
  brand_logo_url: string;
  description: string;
  instagram_url: string;
  facebook_url: string;
  about_title: string;
  about_description: string;
  about_image_url: string;
}
