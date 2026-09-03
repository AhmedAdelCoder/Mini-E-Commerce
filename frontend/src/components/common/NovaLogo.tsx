import { cn } from '@/lib/utils';

interface NovaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showWordmark?: boolean;
}

const sizes = {
  sm: { icon: 24, text: 'text-lg', gap: 'gap-2' },
  md: { icon: 32, text: 'text-xl', gap: 'gap-2.5' },
  lg: { icon: 44, text: 'text-3xl', gap: 'gap-3' },
};

export function NovaLogo({ size = 'md', className, showWordmark = true }: NovaLogoProps) {
  const { icon, text, gap } = sizes[size];

  return (
    <div className={cn('flex items-center', gap, className)}>
      {/* Nova Icon — orbital star concept using the O */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="NOVA icon"
      >
        {/* Outer ring */}
        <circle
          cx="22"
          cy="22"
          r="20"
          stroke="url(#nova-ring-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.6"
        />
        {/* Core orbital circle */}
        <circle
          cx="22"
          cy="22"
          r="13"
          stroke="url(#nova-core-gradient)"
          strokeWidth="2"
        />
        {/* Star core */}
        <circle cx="22" cy="22" r="3.5" fill="url(#nova-star-gradient)" />
        {/* Cardinal light rays */}
        <line x1="22" y1="4" x2="22" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        <line x1="22" y1="35" x2="22" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        <line x1="4" y1="22" x2="9" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        <line x1="35" y1="22" x2="40" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        {/* Diagonal accent rays (shorter) */}
        <line x1="9.5" y1="9.5" x2="12.5" y2="12.5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
        <line x1="31.5" y1="31.5" x2="34.5" y2="34.5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
        <line x1="34.5" y1="9.5" x2="31.5" y2="12.5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
        <line x1="9.5" y1="34.5" x2="12.5" y2="31.5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
        {/* Orbital accent dot */}
        <circle cx="22" cy="9" r="1.5" fill="white" opacity="0.85" />

        <defs>
          <linearGradient id="nova-ring-gradient" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="nova-core-gradient" x1="9" y1="9" x2="35" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <radialGradient id="nova-star-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a5b4fc" />
          </radialGradient>
        </defs>
      </svg>

      {showWordmark && (
        <span
          className={cn(
            'font-syne font-bold tracking-tight leading-none',
            text
          )}
          style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' }}
        >
          <span className="text-white">NOV</span>
          <span
            className="relative"
            style={{
              background: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            A
          </span>
        </span>
      )}
    </div>
  );
}
