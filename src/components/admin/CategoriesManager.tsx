import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

export default function CategoriesManager({ categories, setCategories }: Props) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', image_url: '' });
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setForm({ name: '', image_url: '' });
    setAdding(true);
  };

  const openEdit = (category: Category) => {
    setForm({ name: category.name, image_url: category.image_url });
    setEditing(category);
  };

  const closeModal = () => {
    setAdding(false);
    setEditing(null);
  };

  const save = async () => {
    if (!form.name.trim() || !form.image_url.trim()) return;
    setSaving(true);
    if (editing) {
      const updated = await api.updateCategory(editing.id, form);
      if (updated) setCategories(categories.map((category) => category.id === editing.id ? updated : category));
    } else {
      const created = await api.createCategory(form);
      if (created) setCategories([...categories, created]);
    }
    setSaving(false);
    closeModal();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    if (await api.deleteCategory(id)) setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-brand-brown text-xl">Categories</h2>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 bg-brand-terra text-cream font-bold text-sm px-4 py-2 rounded-full hover:bg-brand-terrahover active:scale-95 transition-all duration-300">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-4 bg-creamdark rounded-2xl p-3">
            <img src={category.image_url} alt={category.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <span className="font-semibold text-brand-brown flex-1">{category.name}</span>
            <button onClick={() => openEdit(category)} aria-label={`Edit ${category.name}`} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-brand-mustard/30 active:scale-95 transition-all duration-300">
              <Pencil className="w-4 h-4 text-brand-brown" />
            </button>
            <button onClick={() => remove(category.id)} aria-label={`Delete ${category.name}`} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-nonveg/15 active:scale-95 transition-all duration-300">
              <Trash2 className="w-4 h-4 text-nonveg" />
            </button>
          </div>
        ))}
      </div>
      {(adding || editing) && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal-panel bg-white rounded-3xl shadow-floatbar p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-brand-brown text-xl">{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={closeModal} aria-label="Close" className="w-9 h-9 rounded-full bg-creamdark flex items-center justify-center hover:bg-brand-mustard/30"><X className="w-4 h-4 text-brand-brown" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Category name" className="admin-input" />
              <input type="text" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} placeholder="Image URL" className="admin-input" />
              {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-40 rounded-2xl object-cover" />}
              <div className="flex gap-2 pt-2">
                <button onClick={save} disabled={saving || !form.name.trim() || !form.image_url.trim()} className="inline-flex items-center gap-1.5 bg-brand-terra text-cream text-sm font-bold px-4 py-2 rounded-full hover:bg-brand-terrahover disabled:opacity-50"><Check className="w-4 h-4" /> Save</button>
                <button onClick={closeModal} className="inline-flex items-center gap-1.5 bg-creamdark text-brand-brownlight text-sm font-bold px-4 py-2 rounded-full hover:bg-brand-mustard/30"><X className="w-4 h-4" /> Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
