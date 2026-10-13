import { Link, NavLink, useLocation } from 'react-router-dom';
import { UtensilsCrossed, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { count } = useCart();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-[#EFEBE9]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2.5 group">
          <span className="w-10 h-10 rounded-full bg-brand-terra flex items-center justify-center shadow-card group-hover:shadow-[0_0_16px_rgba(199,61,19,0.4)] transition-shadow duration-300">
            <UtensilsCrossed className="w-5 h-5 text-cream" />
          </span>
          <span className="font-heading font-bold text-xl text-brand-brown leading-none group-hover:text-brand-terra transition-colors duration-300">
            Varsha's <span className="text-brand-terra">Rasoi</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            data-testid="nav-home-link"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-brand-terra text-cream shadow-[0_0_12px_rgba(199,61,19,0.3)]'
                  : 'text-brand-brownlight hover:bg-creamdark hover:text-brand-terra hover:shadow-[0_0_10px_rgba(199,61,19,0.15)]'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            data-testid="nav-menu-link"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-brand-terra text-cream shadow-[0_0_12px_rgba(199,61,19,0.3)]'
                  : 'text-brand-brownlight hover:bg-creamdark hover:text-brand-terra hover:shadow-[0_0_10px_rgba(199,61,19,0.15)]'
              }`
            }
          >
            Menu
          </NavLink>
          <Link
            to="/cart"
            data-testid="nav-cart-button"
            className="relative ml-1 w-11 h-11 rounded-full bg-brand-terra shadow-card flex items-center justify-center hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(199,61,19,0.45)] active:scale-95 transition-all duration-300 group"
          >
            <span id="cart-icon-target" className="flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-cream group-hover:scale-110 transition-transform duration-300" />
            </span>
            {count > 0 && (
              <span
                data-testid="cart-count-badge"
                className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-brand-mustard text-brand-brown text-xs font-bold flex items-center justify-center shadow-[0_0_8px_rgba(249,167,36,0.5)]"
              >
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
