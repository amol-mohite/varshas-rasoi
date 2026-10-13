import { Link } from 'react-router-dom';
import { LogOut, UtensilsCrossed } from 'lucide-react';

interface Props {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: Props) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-brand-terra flex items-center justify-center shadow-card">
          <UtensilsCrossed className="w-5 h-5 text-cream" />
        </span>
        <div>
          <h1 className="font-heading font-bold text-brand-brown text-2xl leading-none">Admin Dashboard</h1>
          <p className="text-brand-muted text-xs mt-1">Manage your restaurant content</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm font-semibold text-brand-brownlight hover:text-brand-terra transition-colors duration-300">
          View Site
        </Link>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-brownlight bg-creamdark px-4 py-2 rounded-full hover:bg-nonveg/10 hover:text-nonveg transition-all duration-300"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
}
