import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { api } from '@/lib/api';
import type { Settings } from '@/types';

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  const whatsapp = settings?.whatsapp_number || '919876543210';
  const instagramUrl = settings?.instagram_url || 'https://instagram.com';
  const facebookUrl = settings?.facebook_url || 'https://facebook.com';
  const brandName = settings?.brand_name || "Varsha's Rasoi";
  const description = settings?.description || 'A cloud kitchen serving honest, home-style Indian food. Every dish is cooked in small batches, the way it\'s made at home — no shortcuts, no compromises.';

  return (
    <footer className="bg-brand-brown text-cream/90 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div className="group">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-9 h-9 rounded-full bg-brand-terra flex items-center justify-center group-hover:shadow-[0_0_14px_rgba(199,61,19,0.5)] transition-shadow duration-300">
              <UtensilsCrossed className="w-4 h-4 text-cream" />
            </span>
            <span className="font-heading font-bold text-lg text-cream group-hover:text-brand-mustard transition-colors duration-300">{brandName}</span>
          </div>
          <p className="text-sm text-cream/70 leading-relaxed group-hover:text-cream/90 transition-colors duration-300">
            {description}
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-cream mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5 group">
              <span className="w-7 h-7 rounded-full bg-cream/10 flex items-center justify-center group-hover:bg-brand-mustard transition-colors duration-300">
                <Phone className="w-3.5 h-3.5 text-brand-mustard group-hover:text-brand-brown transition-colors duration-300" />
              </span>
              <a
                data-testid="footer-whatsapp-link"
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-mustard transition-colors duration-300"
              >
                WhatsApp: +{whatsapp}
              </a>
            </li>
            <li className="flex items-start gap-2.5 group">
              <span className="w-7 h-7 rounded-full bg-cream/10 flex items-center justify-center mt-0.5 group-hover:bg-brand-mustard transition-colors duration-300">
                <MapPin className="w-3.5 h-3.5 text-brand-mustard group-hover:text-brand-brown transition-colors duration-300" />
              </span>
              <span>Varsha's Rasoi Cloud Kitchen, Pune, Maharashtra</span>
            </li>
            <li className="flex items-center gap-2.5 group">
              <span className="w-7 h-7 rounded-full bg-cream/10 flex items-center justify-center group-hover:bg-brand-mustard transition-colors duration-300">
                <Clock className="w-3.5 h-3.5 text-brand-mustard group-hover:text-brand-brown transition-colors duration-300" />
              </span>
              <span>Open daily, 11 AM – 10 PM</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-cream mb-4">Follow Along</h4>
          <div className="flex gap-3">
            <a
              data-testid="footer-instagram-link"
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-brand-terra hover:shadow-[0_0_16px_rgba(199,61,19,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Instagram className="w-5 h-5 text-cream" />
            </a>
            <a
              data-testid="footer-facebook-link"
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-brand-terra hover:shadow-[0_0_16px_rgba(199,61,19,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Facebook className="w-5 h-5 text-cream" />
            </a>
          </div>
          <Link
            to="/admin/login"
            data-testid="footer-admin-link"
            className="inline-block mt-6 text-xs text-cream/50 hover:text-cream hover:shadow-[0_0_10px_rgba(255,248,239,0.15)] hover:px-3 hover:py-1 hover:rounded-full transition-all duration-300"
          >
            Admin Login
          </Link>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {brandName}. Made with love and a little extra ghee.
      </div>
    </footer>
  );
}
