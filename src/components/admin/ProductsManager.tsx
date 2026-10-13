import { useState, type Dispatch, type SetStateAction } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category, MenuItem } from '@/types';

interface Props {
  items: MenuItem[];
  setItems: (items: MenuItem[]) => void;
  categories: Category[];
}

type ProductDraft = Omit<MenuItem, 'id'>;

const EMPTY_ITEM: ProductDraft = {
  name: '', description: '', price: 0, category: '', veg: true, available: true, featured: false, image_url: '',
};

export default function ProductsManager({ items, setItems, categories }: Props) {
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<ProductDraft>(EMPTY_ITEM);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('All dishes');
  const categoryNames = categories.map((category) => category.name);
  const filteredItems = filter === 'All dishes' ? items : filter === 'Featured dishes' ? items.filter((item) => item.featured) : items.filter((item) => item.category === filter);

  const openAdd = () => { setForm(EMPTY_ITEM); setAdding(true); };
  const openEdit = (item: MenuItem) => {
    const { id: _id, ...draft } = item;
    setForm(draft);
    setEditing(item);
  };
  const closeModal = () => { setAdding(false); setEditing(null); };

  const save = async () => {
    if (!form.name.trim() || !form.image_url.trim()) return;
    setSaving(true);
    if (editing) {
      const updated = await api.updateItem(editing.id, form);
      if (updated) setItems(items.map((item) => item.id === editing.id ? updated : item));
    } else {
      const created = await api.createItem(form);
      if (created) setItems([...items, created]);
    }
    setSaving(false);
    closeModal();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    if (await api.deleteItem(id)) setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-brand-brown text-xl">Products ({items.length})</h2>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 bg-brand-terra text-cream font-bold text-sm px-4 py-2 rounded-full hover:bg-brand-terrahover active:scale-95 transition-all duration-300"><Plus className="w-4 h-4" /> Add Product</button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <label htmlFor="product-filter" className="text-sm font-semibold text-brand-brown">Show</label>
        <select id="product-filter" value={filter} onChange={(event) => setFilter(event.target.value)} className="admin-input sm:max-w-xs">
          <option>All dishes</option><option>Featured dishes</option>{categoryNames.map((category) => <option key={category}>{category}</option>)}
        </select>
        <span className="text-xs text-brand-muted">{filteredItems.length} dish{filteredItems.length === 1 ? '' : 'es'}</span>
      </div>
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-creamdark rounded-2xl p-3">
            <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0"><h3 className="font-semibold text-brand-brown truncate">{item.name}</h3><p className="text-brand-muted text-xs">{item.category} · ₹{item.price} · {item.veg ? 'Veg' : 'Non-veg'}</p><div className="flex gap-1.5 mt-1">{item.featured && <span className="text-[10px] font-bold bg-brand-mustard/20 text-brand-brown px-2 py-0.5 rounded-full">Featured</span>}{!item.available && <span className="text-[10px] font-bold bg-nonveg/15 text-nonveg px-2 py-0.5 rounded-full">Out of Stock</span>}</div></div>
            <button onClick={() => openEdit(item)} aria-label={`Edit ${item.name}`} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-brand-mustard/30 active:scale-95 transition-all duration-300"><Pencil className="w-4 h-4 text-brand-brown" /></button>
            <button onClick={() => remove(item.id)} aria-label={`Delete ${item.name}`} className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-nonveg/15 active:scale-95 transition-all duration-300"><Trash2 className="w-4 h-4 text-nonveg" /></button>
          </div>
        ))}
      </div>
      {(adding || editing) && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal-panel bg-white rounded-3xl shadow-floatbar p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5"><h3 className="font-heading font-bold text-brand-brown text-xl">{editing ? 'Edit Product' : 'Add Product'}</h3><button onClick={closeModal} aria-label="Close" className="w-9 h-9 rounded-full bg-creamdark flex items-center justify-center hover:bg-brand-mustard/30"><X className="w-4 h-4 text-brand-brown" /></button></div>
            <ProductForm form={form} setForm={setForm} categoryNames={categoryNames} onSave={save} onCancel={closeModal} saving={saving} />
          </div>
        </div>
      )}
    </div>
  );
}

interface ProductFormProps {
  form: ProductDraft;
  setForm: Dispatch<SetStateAction<ProductDraft>>;
  categoryNames: string[];
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

function ProductForm({ form, setForm, categoryNames, onSave, onCancel, saving }: ProductFormProps) {
  const update = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <div className="space-y-3">
      <input type="text" placeholder="Product name" value={form.name} onChange={(event) => update('name', event.target.value)} className="admin-input" />
      <textarea placeholder="Description" value={form.description} onChange={(event) => update('description', event.target.value)} rows={3} className="admin-input resize-none" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><input type="number" min="0" placeholder="Price (₹)" value={form.price} onChange={(event) => update('price', Number(event.target.value))} className="admin-input" /><select value={form.category} onChange={(event) => update('category', event.target.value)} className="admin-input"><option value="">Select category</option>{categoryNames.map((category) => <option key={category} value={category}>{category}</option>)}</select></div>
      <input type="text" placeholder="Image URL" value={form.image_url} onChange={(event) => update('image_url', event.target.value)} className="admin-input" />
      {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-40 rounded-2xl object-cover shadow-card" />}
      <div className="flex flex-wrap gap-4"><Toggle label="Veg" checked={form.veg} onChange={(value) => update('veg', value)} /><Toggle label="Available" checked={form.available} onChange={(value) => update('available', value)} /><Toggle label="Featured" checked={form.featured} onChange={(value) => update('featured', value)} /></div>
      <div className="flex gap-2 pt-2"><button onClick={onSave} disabled={saving || !form.name.trim() || !form.image_url.trim()} className="inline-flex items-center gap-1.5 bg-brand-terra text-cream font-bold text-sm px-4 py-2 rounded-full hover:bg-brand-terrahover disabled:opacity-50"><Check className="w-4 h-4" /> Save</button><button onClick={onCancel} className="inline-flex items-center gap-1.5 bg-creamdark text-brand-brownlight font-bold text-sm px-4 py-2 rounded-full hover:bg-brand-mustard/30"><X className="w-4 h-4" /> Cancel</button></div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown cursor-pointer"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="admin-checkbox" />{label}</label>;
}
