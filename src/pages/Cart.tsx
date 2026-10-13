import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import KitchenLoader from '@/components/KitchenLoader';
import Reveal from '@/components/Reveal';

interface DeliveryForm {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

const EMPTY_FORM: DeliveryForm = { name: '', phone: '', address: '', notes: '' };

export default function Cart() {
  const { items, total, increase, decrease, remove, clear } = useCart();
  const [form, setForm] = useState<DeliveryForm>(EMPTY_FORM);
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<DeliveryForm>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getSettings().then((s) => {
      setWhatsapp(s.whatsapp_number);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const validate = (): boolean => {
    const e: Partial<DeliveryForm> = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit phone number';
    if (!form.address.trim()) e.address = 'Please enter your delivery address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = () => {
    if (!validate()) return;
    setSubmitting(true);

    const orderText = items
      .map((i) => `• ${i.name} × ${i.quantity} — ₹${i.price * i.quantity}`)
      .join('\n');

    const fullMessage =
      `*New Order — Varsha's Rasoi*\n\n${orderText}\n\n*Order Total: Rs.${total}*\n\n` +
      `Name: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}` +
      (form.notes.trim() ? `\nNotes: ${form.notes.trim()}` : '');

    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(fullMessage)}`;
    window.open(url, '_blank');

    setTimeout(() => {
      setSubmitting(false);
      clear();
      setForm(EMPTY_FORM);
    }, 1500);
  };

  if (loading) return <KitchenLoader />;

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-creamdark flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-brand-muted" />
        </div>
        <h1 className="font-heading font-bold text-brand-brown text-3xl">Your Cart is Empty</h1>
        <p className="text-brand-muted text-base mt-3">The kadhai is ready — pick something delicious.</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 mt-6 bg-brand-terra text-cream font-bold px-7 py-3.5 rounded-full hover:bg-brand-terrahover active:scale-95 transition-[background-color,transform] duration-200"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8 pb-24">
      <h1 className="font-heading font-bold text-brand-brown text-4xl sm:text-5xl tracking-tight">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 50}>
              <div className="bg-white rounded-3xl shadow-card p-4 flex items-center gap-4">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-brand-brown text-base sm:text-lg leading-snug line-clamp-1">{item.name}</h3>
                  <p className="text-brand-muted text-sm mt-0.5">₹{item.price} each</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 bg-creamdark rounded-full px-2 py-1">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => decrease(item.id)}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-brand-mustard/30 active:scale-95 transition-[background-color,transform] duration-200"
                      >
                        <Minus className="w-3.5 h-3.5 text-brand-brown" />
                      </button>
                      <span className="w-6 text-center font-bold text-brand-brown text-sm">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => increase(item.id)}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-brand-mustard/30 active:scale-95 transition-[background-color,transform] duration-200"
                      >
                        <Plus className="w-3.5 h-3.5 text-brand-brown" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      aria-label="Remove item"
                      className="text-brand-muted hover:text-nonveg transition-colors duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-brand-brown text-lg">₹{item.price * item.quantity}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Order Summary + Delivery Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-card p-6 sticky top-24">
            <h2 className="font-heading font-bold text-brand-brown text-xl mb-4">Order Summary</h2>
            <div className="flex items-center justify-between text-brand-brownlight text-sm">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex items-center justify-between text-brand-brownlight text-sm mt-2">
              <span>Delivery</span>
              <span className="text-brand-muted">Calculated on confirmation</span>
            </div>
            <div className="border-t border-creamdark mt-4 pt-4 flex items-center justify-between">
              <span className="font-heading font-bold text-brand-brown text-lg">Total</span>
              <span className="font-bold text-brand-terra text-2xl">₹{total}</span>
            </div>

            <h2 className="font-heading font-bold text-brand-brown text-xl mt-6 mb-4">Delivery Details</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-creamdark rounded-xl px-4 py-3 text-brand-brown placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-terra/40 transition-shadow duration-300"
              />
              {errors.name && <p className="text-nonveg text-xs font-semibold">{errors.name}</p>}
              <input
                type="tel"
                placeholder="Phone number (10 digits)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-creamdark rounded-xl px-4 py-3 text-brand-brown placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-terra/40 transition-shadow duration-300"
              />
              {errors.phone && <p className="text-nonveg text-xs font-semibold">{errors.phone}</p>}
              <textarea
                placeholder="Delivery address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                className="w-full bg-creamdark rounded-xl px-4 py-3 text-brand-brown placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-terra/40 transition-shadow duration-300 resize-none"
              />
              {errors.address && <p className="text-nonveg text-xs font-semibold">{errors.address}</p>}
              <input
                type="text"
                placeholder="Notes / instructions (optional) — e.g. less spicy, no onion"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-creamdark rounded-xl px-4 py-3 text-brand-brown placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-terra/40 transition-shadow duration-300"
              />
            </div>

            <p className="text-brand-muted text-xs leading-relaxed mt-4">
              You'll be redirected to WhatsApp with your order pre-filled. We confirm every order personally.
            </p>

            <button
              onClick={placeOrder}
              disabled={submitting}
              className="w-full h-14 mt-5 rounded-full bg-brand-terra text-cream font-bold flex items-center justify-center gap-2 hover:bg-brand-terrahover active:scale-95 transition-[background-color,transform] duration-200 disabled:opacity-60"
            >
              {submitting ? 'Opening WhatsApp with your order...' : `Place Order on WhatsApp · ₹${total}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
