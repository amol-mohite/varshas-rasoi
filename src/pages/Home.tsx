import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import type { Banner, MenuItem, Settings, Category } from '@/types';
import KitchenLoader from '@/components/KitchenLoader';
import Reveal from '@/components/Reveal';
import ItemCard from '@/components/ItemCard';

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'cat_thali', name: 'Thali', image_url: 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: 'cat_snacks', name: 'Snacks', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85' },
  { id: 'cat_main', name: 'Main Course', image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMGJpcnlhbmklMjBob21lJTIwY29va2VkfGVufDB8fHx8MTc4NzU3MzA2M3ww&ixlib=rb-4.1.0&q=85' },
  { id: 'cat_sweets', name: 'Sweets', image_url: 'https://images.pexels.com/photos/11887844/pexels-photo-11887844.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: 'cat_beverages', name: 'Beverages', image_url: 'https://images.pexels.com/photos/4475024/pexels-photo-4475024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
];

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    Promise.all([api.getBanners(), api.getItems(), api.getCategories(), api.getSettings()])
      .then(([b, i, c, s]) => {
        setBanners(b);
        setItems(i);
        if (c.length > 0) setCategories(c);
        setSettings(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const nextBanner = useCallback(() => setCurrentBanner((p) => (p + 1) % banners.length), [banners.length]);
  const prevBanner = useCallback(() => setCurrentBanner((p) => (p - 1 + banners.length) % banners.length), [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(nextBanner, 5000);
    return () => clearInterval(timer);
  }, [banners.length, nextBanner]);

  if (loading) return <KitchenLoader />;

  const featured = items.filter((i) => i.featured).slice(0, 6);

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <section data-testid="hero-carousel" className="hero-carousel relative w-full h-[420px] sm:h-[480px] overflow-hidden">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: idx === currentBanner ? 1 : 0 }}
          >
            <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/80 via-brand-brown/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-6xl mx-auto">
              <h1 className="font-heading font-bold text-cream text-4xl sm:text-5xl lg:text-6xl tracking-tight drop-shadow-md">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="text-cream/90 text-base md:text-lg mt-3 max-w-xl">{banner.subtitle}</p>
              )}
              <Link
                to="/menu"
                data-testid="hero-order-now-btn"
                className="inline-flex items-center gap-2 mt-6 bg-brand-mustard text-brand-brown font-bold px-7 py-3.5 rounded-full hover:bg-brand-mustardhover hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(249,167,36,0.55)] active:scale-95 transition-all duration-300"
              >
                Order Now <ArrowRight className="w-5 h-5 text-brand-brown" />
              </Link>
            </div>
          </div>
        ))}

        {banners.length > 1 && (
          <>
            <button
              data-testid="carousel-prev-btn"
              aria-label="Previous banner"
              onClick={prevBanner}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-cream/90 items-center justify-center hover:bg-cream hover:shadow-[0_0_16px_rgba(255,248,239,0.5)] active:scale-95 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-brand-brown" />
            </button>
            <button
              data-testid="carousel-next-btn"
              aria-label="Next banner"
              onClick={nextBanner}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-cream/90 items-center justify-center hover:bg-cream hover:shadow-[0_0_16px_rgba(255,248,239,0.5)] active:scale-95 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5 text-brand-brown" />
            </button>
            <div className="carousel-dots absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBanner(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-6 bg-brand-mustard' : 'w-2 bg-cream/60'}`}
                  aria-label={`Go to banner ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Categories */}
      <section data-testid="categories-section" className="categories-section max-w-6xl mx-auto px-4 pt-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-brand-terra font-bold text-sm uppercase tracking-widest">CATEGORIES</p>
            <h2 className="font-heading font-bold text-brand-brown text-3xl sm:text-4xl tracking-tight mt-1">Browse by Category</h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-brand-terra font-bold text-sm hover:gap-2.5 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(199,61,19,0.2)] hover:px-3 hover:py-1.5 hover:rounded-full transition-all duration-300"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 snap-x no-scrollbar pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="snap-start shrink-0 w-36 sm:w-44 group text-left"
            >
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-card group-hover:shadow-cardhover group-hover:-translate-y-2 group-hover:shadow-[0_8px_28px_rgba(199,61,19,0.18)] transition-all duration-300">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-heading font-semibold text-brand-brown text-center mt-3 group-hover:text-brand-terra group-hover:-translate-y-0.5 transition-all duration-300">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Dishes */}
      <section data-testid="featured-section" className="featured-section max-w-6xl mx-auto px-4 pt-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-brand-terra font-bold text-sm uppercase tracking-widest">VARSHA RECOMMENDS</p>
            <h2 className="font-heading font-bold text-brand-brown text-3xl sm:text-4xl tracking-tight mt-1">Today's Featured Dishes</h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-brand-terra font-bold text-sm hover:gap-2.5 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(199,61,19,0.2)] hover:px-3 hover:py-1.5 hover:rounded-full transition-all duration-300"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featured.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 80}>
              <ItemCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section data-testid="about-section" className="about-section max-w-6xl mx-auto px-4 pt-20">
        <div className="bg-creamdark rounded-3xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-card">
          <div>
            <p className="text-brand-terra font-bold text-sm uppercase tracking-widest">OUR STORY</p>
            <h2 className="font-heading font-bold text-brand-brown text-3xl sm:text-4xl tracking-tight mt-2 mb-6">{settings?.about_title || 'About Varsha\'s Rasoi'}</h2>
            <p className="text-brand-brownlight text-base leading-relaxed mt-4">
              {settings?.about_description || 'What started as tiffins for neighbours became a full-fledged rasoi.'}
            </p>
            <p className="text-brand-muted text-sm leading-relaxed mt-3">
              Every order is prepared fresh in small batches and packed with care, so it reaches you tasting like it just came off the stove.
            </p>
            <Link
              to="/menu"
              data-testid="about-explore-menu-btn"
              className="inline-flex items-center gap-2 mt-6 bg-brand-terra text-cream font-bold px-7 py-3.5 rounded-full hover:bg-brand-terrahover hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(199,61,19,0.45)] active:scale-95 transition-all duration-300"
            >
              Explore the Menu <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card group hover:shadow-[0_0_32px_rgba(199,61,19,0.2)] hover:-translate-y-1 transition-all duration-300">
            <img
              src={settings?.about_image_url || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzYW1vc2ElMjBzbmFja3N8ZW58MHx8fHwxNzg3NTczMDYzfDA&ixlib=rb-4.1.0&q=85'}
              alt="Inside Varsha's kitchen"
              className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
