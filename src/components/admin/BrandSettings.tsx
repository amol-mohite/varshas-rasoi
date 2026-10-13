import { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { api } from '@/lib/api';
import type { Settings } from '@/types';

interface Props {
  settings: Settings;
  onUpdate: (s: Settings) => void;
}

export default function BrandSettings({ settings, onUpdate }: Props) {
  const [form, setForm] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: keyof Settings, value: string) => {
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
      <h2 className="font-heading font-bold text-brand-brown text-xl mb-6">Brand Information</h2>
      <div className="space-y-4">
        <Field label="Brand Name">
          <input
            type="text"
            value={form.brand_name}
            onChange={(e) => handleChange('brand_name', e.target.value)}
            className="admin-input"
          />
        </Field>
        <Field label="Brand Logo URL (optional — leave blank to use default icon)">
          <input
            type="text"
            value={form.brand_logo_url}
            onChange={(e) => handleChange('brand_logo_url', e.target.value)}
            placeholder="https://..."
            className="admin-input"
          />
          {form.brand_logo_url && (
            <img src={form.brand_logo_url} alt="Logo preview" className="w-16 h-16 rounded-full object-cover mt-2 shadow-card" />
          )}
        </Field>
        <Field label="Description (shown in footer)">
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="admin-input resize-none"
          />
        </Field>
        <Field label="WhatsApp Number (with country code, no +)">
          <input
            type="text"
            value={form.whatsapp_number}
            onChange={(e) => handleChange('whatsapp_number', e.target.value)}
            placeholder="919876543210"
            className="admin-input"
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Instagram URL">
            <input
              type="text"
              value={form.instagram_url}
              onChange={(e) => handleChange('instagram_url', e.target.value)}
              placeholder="https://instagram.com/..."
              className="admin-input"
            />
          </Field>
          <Field label="Facebook URL">
            <input
              type="text"
              value={form.facebook_url}
              onChange={(e) => handleChange('facebook_url', e.target.value)}
              placeholder="https://facebook.com/..."
              className="admin-input"
            />
          </Field>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-brand-brown font-semibold text-sm mb-1.5">{label}</label>
      {children}
    </div>
  );
}
