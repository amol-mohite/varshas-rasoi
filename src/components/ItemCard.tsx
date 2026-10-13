import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useFlyToCart } from '@/context/FlyToCartContext';
import VegBadge from '@/components/VegBadge';

interface ItemCardProps {
  item: MenuItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { add } = useCart();
  const { flyToCart } = useFlyToCart();
  const navigate = useNavigate();
  const imgRef = useRef<HTMLImageElement>(null);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    add(item);
    if (imgRef.current) {
      flyToCart(item.image_url, imgRef.current);
    }
  };

  return (
    <div
      data-testid="item-card"
      onClick={() => navigate(`/item/${item.id}`)}
      className="bg-white rounded-3xl shadow-card hover:shadow-cardhover hover:-translate-y-1 transition-[transform,box-shadow] duration-300 cursor-pointer overflow-hidden flex flex-row sm:flex-col"
    >
      <div className="relative w-32 h-32 sm:w-full sm:h-44 shrink-0">
        <img ref={imgRef} src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        <VegBadge veg={item.veg} />
        {!item.available && (
          <div className="absolute inset-0 bg-brand-brown/50 flex items-center justify-center">
            <span className="bg-cream text-brand-brown text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-brand-brown text-base sm:text-lg leading-snug line-clamp-1">{item.name}</h3>
        <p className="text-brand-muted text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed flex-1">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-brand-brown text-base sm:text-lg">₹{item.price}</span>
          <button
            data-testid="add-to-cart-btn"
            onClick={handleAdd}
            disabled={!item.available}
            aria-label="Add to cart"
            className="w-10 h-10 rounded-full bg-brand-terra text-cream flex items-center justify-center hover:bg-brand-terrahover active:scale-95 transition-[background-color,transform] duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
