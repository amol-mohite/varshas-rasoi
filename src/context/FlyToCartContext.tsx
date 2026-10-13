import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface FlyingItem {
  id: number;
  imageUrl: string;
  startRect: DOMRect;
}

interface FlyToCartContextType {
  flyToCart: (imageUrl: string, sourceEl: HTMLElement) => void;
}

const FlyToCartContext = createContext<FlyToCartContextType | null>(null);

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  const flyToCart = useCallback((imageUrl: string, sourceEl: HTMLElement) => {
    const startRect = sourceEl.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setFlyingItems((prev) => [...prev, { id, imageUrl, startRect }]);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((f) => f.id !== id));
    }, 900);

    const cartTarget = document.getElementById('cart-icon-target');
    if (cartTarget) {
      cartTarget.classList.remove('cart-bump');
      void cartTarget.offsetWidth;
      cartTarget.classList.add('cart-bump');
    }
  }, []);

  return (
    <FlyToCartContext.Provider value={{ flyToCart }}>
      {children}
      {createPortal(
        flyingItems.map((f) => <FlyingImage key={f.id} item={f} />),
        document.body,
      )}
    </FlyToCartContext.Provider>
  );
}

function FlyingImage({ item }: { item: FlyingItem }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;

    const cartTarget = document.getElementById('cart-icon-target');
    const endRect = cartTarget?.getBoundingClientRect();

    const startX = item.startRect.left;
    const startY = item.startRect.top;
    const startW = item.startRect.width;
    const startH = item.startRect.height;

    const midW = startW * 0.35;
    const midH = startH * 0.35;
    const midX = window.innerWidth / 2 - midW / 2;
    const midY = window.innerHeight / 2 - midH / 2;

    const endW = startW * 0.08;
    const endH = startH * 0.08;
    const endX = endRect ? endRect.left + endRect.width / 2 - endW / 2 : window.innerWidth - 40;
    const endY = endRect ? endRect.top + endRect.height / 2 - endH / 2 : 20;

    const animation = img.animate(
      [
        {
          left: `${startX}px`,
          top: `${startY}px`,
          width: `${startW}px`,
          height: `${startH}px`,
          opacity: 1,
          borderRadius: '16px',
          offset: 0,
        },
        {
          left: `${midX}px`,
          top: `${midY}px`,
          width: `${midW}px`,
          height: `${midH}px`,
          opacity: 0.9,
          borderRadius: '50%',
          offset: 0.45,
        },
        {
          left: `${endX}px`,
          top: `${endY}px`,
          width: `${endW}px`,
          height: `${endH}px`,
          opacity: 0,
          borderRadius: '50%',
          offset: 1,
        },
      ],
      {
        duration: 800,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
        fill: 'forwards',
      },
    );

    return () => animation.cancel();
  }, [item]);

  return (
    <img
      ref={ref}
      src={item.imageUrl}
      alt=""
      className="pointer-events-none fixed z-[9999] object-cover shadow-lg"
      style={{ left: 0, top: 0 }}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFlyToCart() {
  const ctx = useContext(FlyToCartContext);
  if (!ctx) throw new Error('useFlyToCart must be used within FlyToCartProvider');
  return ctx;
}
