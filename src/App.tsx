import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { FlyToCartProvider } from '@/context/FlyToCartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartFAB from '@/components/CartFAB';
import KitchenLoader from '@/components/KitchenLoader';

const Home = lazy(() => import('@/pages/Home'));
const Menu = lazy(() => import('@/pages/Menu'));
const ItemDetail = lazy(() => import('@/pages/ItemDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartProvider>
        <FlyToCartProvider>
          <div className="min-h-screen bg-cream flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<KitchenLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/item/:id" element={<ItemDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <CartFAB />
          </div>
        </FlyToCartProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
