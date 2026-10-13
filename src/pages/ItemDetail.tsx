import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { api } from '@/lib/api';
import type { MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useFlyToCart } from '@/context/FlyToCartContext';
import KitchenLoader from '@/components/KitchenLoader';
import VegBadge from '@/components/VegBadge';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { add } = useCart();
  const { flyToCart } = useFlyToCart();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getItem(id)
      .then((i) => {
        setItem(i);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <KitchenLoader />;

  if (!item) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-brand-muted text-lg font-semibold">This dish isn't on the menu anymore.</p>
        <Link to="/menu" className="inline-flex items-center gap-1.5 text-brand-brownlight font-semibold text-sm hover:text-brand-terra transition-colors duration-300 mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>
      </div>
    );
  }

  const triggerFly = () => {
    if (imgRef.current) {
      flyToCart(item.image_url, imgRef.current);
    }
  };

  return (
    <div className="item-detail-page max-w-6xl mx-auto px-4 pt-6 pb-12">
      <Link to="/menu" className="inline-flex items-center gap-1.5 text-brand-brownlight font-semibold text-sm hover:text-brand-terra transition-colors duration-300 mb-5">
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="relative rounded-3xl overflow-hidden shadow-card">
          <img ref={imgRef} src={item.image_url} alt={item.name} className="w-full h-72 sm:h-96 md:h-full object-cover" />
          <VegBadge veg={item.veg} />
          {!item.available && (
            <div className="absolute inset-0 bg-brand-brown/50 flex items-center justify-center">
              <span className="bg-cream text-brand-brown font-bold px-5 py-2 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-brand-muted text-sm font-semibold">{item.category}</p>
          <h1 className="font-heading font-bold text-brand-brown text-4xl sm:text-5xl tracking-tight mt-3" data-testid="item-name">{item.name}</h1>
          <p className="text-brand-terra font-bold text-2xl mt-4" data-testid="item-price">₹{item.price}</p>
          <p className="text-brand-brownlight text-base leading-relaxed mt-4 flex-1" data-testid="item-description">{item.description}</p>

          {item.available && (
            <>
              <div className="flex items-center gap-3 mt-8">
                <span className="text-brand-brown font-bold text-sm">Quantity</span>
                <div className="flex items-center gap-3 bg-white rounded-full shadow-card px-2 py-1.5">
                  <button
                    data-testid="qty-decrease-btn"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full bg-creamdark flex items-center justify-center hover:bg-brand-mustard/40 active:scale-95 transition-[background-color,transform] duration-200"
                  >
                    <Minus className="w-4 h-4 text-brand-brown" />
                  </button>
                  <span data-testid="qty-value" className="w-6 text-center font-bold text-brand-brown">{quantity}</span>
                  <button
                    data-testid="qty-increase-btn"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-full bg-creamdark flex items-center justify-center hover:bg-brand-mustard/40 active:scale-95 transition-[background-color,transform] duration-200"
                  >
                    <Plus className="w-4 h-4 text-brand-brown" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  data-testid="buy-now-btn"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) add(item);
                    navigate('/cart');
                  }}
                  className="h-14 rounded-full bg-brand-terra text-cream font-bold flex items-center justify-center gap-2 hover:bg-brand-terrahover active:scale-95 transition-[background-color,transform] duration-200"
                >
                  <ShoppingCart className="w-5 h-5" /> Buy Now
                </button>
                <button
                  data-testid="add-to-cart-btn"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) add(item);
                    triggerFly();
                  }}
                  className="h-14 rounded-full bg-white border-2 border-brand-terra text-brand-terra font-bold flex items-center justify-center gap-2 hover:bg-creamdark active:scale-95 transition-[background-color,transform] duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
