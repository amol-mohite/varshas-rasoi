interface KitchenLoaderProps {
  fullScreen?: boolean;
  label?: string;
}

export default function KitchenLoader({ fullScreen = true, label = 'Simmering something delicious...' }: KitchenLoaderProps) {
  return (
    <div data-testid="kitchen-loader" className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen bg-cream' : 'py-16'}`}>
      <svg viewBox="0 0 120 104" className="w-24 h-20" aria-label="Cooking pot loader">
        <path className="steam" d="M46 34 q5 -6 0 -12 q-5 -6 0 -12" fill="none" stroke="#D84315" strokeWidth="3.5" strokeLinecap="round" />
        <path className="steam steam-2" d="M60 34 q5 -6 0 -12 q-5 -6 0 -12" fill="none" stroke="#F9A825" strokeWidth="3.5" strokeLinecap="round" />
        <path className="steam steam-3" d="M74 34 q5 -6 0 -12 q-5 -6 0 -12" fill="none" stroke="#D84315" strokeWidth="3.5" strokeLinecap="round" />
        <g className="pot-body">
          <path d="M24 52 h72 v14 a32 20 0 0 1 -72 0 z" fill="#D84315" />
          <rect x="14" y="54" width="12" height="7" rx="3.5" fill="#BF360C" />
          <rect x="94" y="54" width="12" height="7" rx="3.5" fill="#BF360C" />
          <g className="pot-lid">
            <ellipse cx="60" cy="52" rx="38" ry="7" fill="#BF360C" />
            <circle cx="60" cy="44" r="4.5" fill="#F9A825" />
          </g>
        </g>
        <ellipse cx="60" cy="96" rx="34" ry="4" fill="#3E2723" opacity="0.08" />
      </svg>
      <p className="font-heading text-brand-brown text-lg">{label}</p>
    </div>
  );
}
