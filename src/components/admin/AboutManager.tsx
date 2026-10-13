import { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { api } from '@/lib/api';
import type { Settings } from '@/types';

interface Props {
  settings: Settings;
  onUpdate: (s: Settings) => void;
}

export default function AboutManager({ settings, onUpdate }: Props) {
  const [form, setForm] = useState({
    about_title: settings.about_title,
    about_description: settings.about_description,
    about_image_url: settings.about_image_url,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const updated = await api.updateSettings(form);
    if (updated) onUpdate(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8 max-w-2xl">
      <h2 className="font-heading font-bold text-brand-brown text-xl mb-6">About Us Section</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-brand-brown font-semibold text-sm mb-1.5">Section Title</label>
          <input
            type="text"
            value={form.about_title}
            onChange={(e) => handleChange('about_title', e.target.value)}
            className="admin-input"
          />
        </div>
        <div>
          <label className="block text-brand-brown font-semibold text-sm mb-1.5">Description</label>
          <textarea
            value={form.about_description}
            onChange={(e) => handleChange('about_description', e.target.value)}
            rows={5}
            className="admin-input resize-none"
          />
        </div>
        <div>
          <label className="block text-brand-brown font-semibold text-sm mb-1.5">Image URL</label>
          <input
            type="text"
            value={form.about_image_url}
            onChange={(e) => handleChange('about_image_url', e.target.value)}
            placeholder="https://..."
            className="admin-input"
          />
          {form.about_image_url && (
            <img src={form.about_image_url} alt="Preview" className="w-full h-48 rounded-2xl object-cover mt-2 shadow-card" />
          )}
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 inline-flex items-center gap-2 bg-brand-terra text-cream font-bold px-6 py-3 rounded-full hover:bg-brand-terrahover hover:shadow-[0_0_20px_rgba(199,61,19,0.35)] active:scale-95 transition-all duration-300 disabled:opacity-60"
      >
        {saving ? 'Saving...' : saved ? <><Check className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Changes</>}
      </button>
    </div>
  );
}
