import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Utensils, Image, Info, UserRound } from 'lucide-react';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { Settings, Category, MenuItem, Banner } from '@/types';
import AdminHeader from '@/components/admin/AdminHeader';
import BrandSettings from '@/components/admin/BrandSettings';
import CategoriesManager from '@/components/admin/CategoriesManager';
import ProductsManager from '@/components/admin/ProductsManager';
import BannersManager from '@/components/admin/BannersManager';
import AboutManager from '@/components/admin/AboutManager';
import ProfileManager from '@/components/admin/ProfileManager';

type Tab = 'brand' | 'categories' | 'products' | 'banners' | 'about' | 'profile';
type TabDefinition = { id: Tab; label: string; icon: typeof LayoutGrid };

const TABS: TabDefinition[] = [
  { id: 'brand', label: 'Brand Info', icon: Info },
  { id: 'categories', label: 'Categories', icon: LayoutGrid },
  { id: 'products', label: 'Products', icon: Utensils },
  { id: 'banners', label: 'Banners', icon: Image },
  { id: 'about', label: 'About Us', icon: Info },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('brand');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        navigate('/admin/login');
        return;
      }
      setAuthed(true);
      Promise.all([api.getSettings(), api.getCategories(), api.getItems(), api.getBanners()])
        .then(([settingsData, categoriesData, itemsData, bannersData]) => {
          if (!mounted) return;
          setSettings(settingsData);
          setCategories(categoriesData);
          setItems(itemsData);
          setBanners(bannersData);
          setLoading(false);
        })
        .catch(() => { if (mounted) setLoading(false); });
    });
    return () => { mounted = false; };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (!authed) return null;
  if (loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-brand-muted font-semibold">Loading admin panel...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-6 pb-16">
      <AdminHeader onLogout={handleLogout} />
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-6 pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${tab === id ? 'bg-brand-terra text-cream shadow-[0_0_12px_rgba(199,61,19,0.25)]' : 'bg-white text-brand-brownlight shadow-card hover:bg-creamdark hover:text-brand-terra'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>
      {tab === 'brand' && settings && <BrandSettings settings={settings} onUpdate={setSettings} />}
      {tab === 'categories' && <CategoriesManager categories={categories} setCategories={setCategories} />}
      {tab === 'products' && <ProductsManager items={items} setItems={setItems} categories={categories} />}
      {tab === 'banners' && <BannersManager banners={banners} setBanners={setBanners} />}
      {tab === 'about' && settings && <AboutManager settings={settings} onUpdate={setSettings} />}
      {tab === 'profile' && <ProfileManager />}
    </div>
  );
}
