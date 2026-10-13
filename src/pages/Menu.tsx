import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import type { MenuItem, Category } from '@/types';
import KitchenLoader from '@/components/KitchenLoader';
import Reveal from '@/components/Reveal';
import ItemCard from '@/components/ItemCard';

const FALLBACK_CATEGORIES = ['Thali', 'Snacks', 'Main Course', 'Sweets', 'Beverages'];

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    Promise.all([api.getItems(), api.getCategories()])
      .then(([i, c]) => {
        setItems(i);
        if (c.length > 0) setCategories(c.map((cat) => cat.name));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, category, search]);

  const setCategory = (cat: string) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  if (loading) return <KitchenLoader />;

  return (
    <div className="menu-page max-w-6xl mx-auto px-4 pt-8 pb-10">
      <h1 className="font-heading font-bold text-brand-brown text-4xl sm:text-5xl tracking-tight">Our Menu</h1>
      <p className="text-brand-muted text-base md:text-lg mt-2">Cooked fresh in small batches, every single day.</p>

      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
        <input
          data-testid="menu-search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a dish..."
          className="w-full bg-white rounded-full pl-12 pr-5 py-3.5 shadow-card text-brand-brown placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-terra/40 transition-shadow duration-300"
        />
      </div>

      <div data-testid="category-tabs" className="category-tabs flex overflow-x-auto gap-2.5 no-scrollbar mt-6 pb-1">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm border-2 transition-[background-color,border-color,color] duration-300 ${
              category === cat
                ? 'bg-brand-terra text-cream border-brand-terra'
                : 'bg-creamdark text-brand-brownlight border-[#EFEBE9] hover:border-brand-terra/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div data-testid="menu-empty-state" className="menu-empty-state text-center text-brand-muted py-16 font-semibold">
          No dishes found. Try another search or category.
        </div>
      ) : (
        <div data-testid="menu-grid" className="menu-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {filtered.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 50}>
              <ItemCard item={item} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
