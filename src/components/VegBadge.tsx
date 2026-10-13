interface VegBadgeProps {
  veg: boolean;
}

export default function VegBadge({ veg }: VegBadgeProps) {
  return (
    <span
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
      data-testid={veg ? 'veg-badge' : 'nonveg-badge'}
      className={`absolute top-2 left-2 bg-white/90 rounded-md p-0.5 border-2 ${veg ? 'border-veg' : 'border-nonveg'}`}
    >
      <span className={`flex items-center justify-center w-2.5 h-2.5 rounded-sm ${veg ? 'bg-veg' : 'bg-nonveg'}`}>
        <span className="w-1 h-1 rounded-full bg-white" />
      </span>
    </span>
  );
}
