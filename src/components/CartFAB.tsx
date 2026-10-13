import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartFAB() {
  const { count, total } = useCart();
  const location = useLocation();

  if (location.pathname.startsWith('/admin') || count === 0) return null;

  return (
    <Link
      to="/cart"
      data-testid="cart-fab"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-brand-terra text-cream rounded-full shadow-floatbar px-6 py-3.5 flex items-center gap-3 hover:bg-brand-terrahover active:scale-95 transition-[background-color,transform] duration-200"
    >
      <ShoppingCart className="w-5 h-5 text-cream" />
      <span className="font-semibold text-sm">View Cart · ₹{total}</span>
    </Link>
  );
}
