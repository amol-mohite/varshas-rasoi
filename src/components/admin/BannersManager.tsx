import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Banner } from '@/types';

interface Props {
  banners: Banner[];
  setBanners: (banners: Banner[]) => void;
}

type BannerForm = Omit<Banner, 'id'>;

const EMPTY_FORM: BannerForm = { title: '', subtitle: '', image_url: '' };

export default function BannersManager({ banners, setBanners }: Props) {
  const [editing, setEditing] = useState<Banner | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setAdding(true);
  };

  const openEdit = (banner: Banner) => {
    setForm({ title: banner.title, subtitle: banner.subtitle, image_url: banner.image_url });
    setEditing(banner);
  };

  const closeModal = () => {
    setAdding(false);
    setEditing(null);
  };

  const save = async () => {
    if (!form.title.trim() || !form.image_url.trim()) return;
    setSaving(true);
    if (editing) {
      const updated = await api.updateBanner(editing.id, form);
      if (updated) setBanners(banners.map((banner) => banner.id === editing.id ? updated : banner));
    } else {
      const created = await api.createBanner(form);
      if (created) setBanners([...banners, created]);
    }
    setSaving(false);
    closeModal();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    if (await api.deleteBanner(id)) setBanners(banners.filter((banner) => banner.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-brand-brown text-xl">Banner Section ({banners.length})</h2>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 bg-brand-terra text-cream font-bold text-sm px-4 py-2 rounded-full hover:bg-brand-terrahover active:scale-95 transition-all duration-300">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>
      <div className="space-y-3">
        {banners.map((banner) => (
          <div key={banner.id} className="flex items-center gap-4 bg-creamdark rounded-2xl p-3">
            <img src={banner.image_url} alt={banner.title} className="w-20 h-14 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-brand-brown truncate">{banner.title}</h3>
              <p className="text-brand-muted text-xs truncate">{banner.subtitle}</p>
            </div>
            <button onClick={() => openEdit(banner)} aria-label={`Edit ${banner.title}`} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-brand-mustard/30 active:scale-95 transition-all duration-300"><Pencil className="w-4 h-4 text-brand-brown" /></button>
            <button onClick={() => remove(banner.id)} aria-label={`Delete ${banner.title}`} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-nonveg/15 active:scale-95 transition-all duration-300"><Trash2 className="w-4 h-4 text-nonveg" /></button>
          </div>
        ))}
      </div>
      {(adding || editing) && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal-panel bg-white rounded-3xl shadow-floatbar p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-brand-brown text-xl">{editing ? 'Edit Banner' : 'Add Banner'}</h3>
              <button onClick={closeModal} aria-label="Close" className="w-9 h-9 rounded-full bg-creamdark flex items-center justify-center hover:bg-brand-mustard/30"><X className="w-4 h-4 text-brand-brown" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Banner title" className="admin-input" />
              <input type="text" value={form.subtitle} onChange={(event) => setForm({ ...form, subtitle: event.target.value })} placeholder="Subtitle (optional)" className="admin-input" />
              <input type="text" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} placeholder="Image URL" className="admin-input" />
              {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-40 rounded-2xl object-cover" />}
              <div className="flex gap-2 pt-2">
                <button onClick={save} disabled={saving || !form.title.trim() || !form.image_url.trim()} className="inline-flex items-center gap-1.5 bg-brand-terra text-cream text-sm font-bold px-4 py-2 rounded-full hover:bg-brand-terrahover disabled:opacity-50"><Check className="w-4 h-4" /> Save</button>
                <button onClick={closeModal} className="inline-flex items-center gap-1.5 bg-creamdark text-brand-brownlight text-sm font-bold px-4 py-2 rounded-full hover:bg-brand-mustard/30"><X className="w-4 h-4" /> Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
