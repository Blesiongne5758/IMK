interface LogoProps {
  variant?: 'icon' | 'full' | 'wordmark' | 'hero';
  size?: number;
  className?: string;
}

/**
 * Logo "Inti Mutiara Berlian" — Premium SVG Mark
 * 
 * Design Philosophy:
 * - Diamond (berlian) as the sacred geometric form — precision & value
 * - Faceted cuts representing multi-dimensional engineering capability
 * - Inner light refraction symbolizing clarity, intelligence & transparency
 * - The pearl (mutiara) at the apex — rarity, perfection, the "inti" (core)
 * - Monogram "IMB" integrated within the architecture of the gem
 * - Dual gradient: Cyan (technology) → Indigo (trust & stability)
 * 
 * The mark works at any size from 24px favicon to 200px+ hero display.
 */
export default function Logo({ variant = 'icon', size = 40, className = '' }: LogoProps) {
  if (variant === 'wordmark') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Logo variant="icon" size={size} />
        <div className="flex flex-col">
          <span className="font-display text-base font-semibold tracking-tight text-text-primary leading-tight">
            Inti Mutiara Berlian
          </span>
          <span className="text-[9px] text-text-secondary/60 uppercase tracking-[0.2em] leading-none mt-0.5">
            Technology & AI Solutions
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center gap-5 ${className}`}>
        <Logo variant="icon" size={72} />
        <div className="text-center">
          <span className="font-display text-2xl font-bold tracking-tight text-text-primary block">
            Inti Mutiara Berlian
          </span>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-6 h-px bg-cyan/30"></span>
            <span className="text-[10px] text-text-secondary/70 uppercase tracking-[0.3em]">
              PT Inti Mutiara Kreasindo
            </span>
            <span className="w-6 h-px bg-cyan/30"></span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center gap-6 ${className}`}>
        <Logo variant="icon" size={96} />
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Inti Mutiara Berlian
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="w-10 h-px bg-gradient-to-r from-transparent to-cyan/40"></span>
            <span className="text-xs text-text-secondary/70 uppercase tracking-[0.3em] font-medium">
              PT Inti Mutiara Kreasindo
            </span>
            <span className="w-10 h-px bg-gradient-to-l from-transparent to-cyan/40"></span>
          </div>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Enterprise IT Infrastructure & AI Solutions
          </p>
        </div>
      </div>
    );
  }

  // Icon variant — the primary diamond mark
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${className}`}
      aria-label="Inti Mutiara Berlian — Logo"
      role="img"
    >
      <defs>
        {/* Primary diamond gradient */}
        <linearGradient id="logo-diamond-stroke" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#00E5FF" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#6366F1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
        </linearGradient>

        {/* Inner glow gradient */}
        <linearGradient id="logo-inner-glow" x1="60" y1="20" x2="60" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.03" />
        </linearGradient>

        {/* Pearl radial gradient */}
        <radialGradient id="logo-pearl" cx="45%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="30%" stopColor="#E0F7FA" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#00E5FF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
        </radialGradient>

        {/* Text gradient */}
        <linearGradient id="logo-text" x1="0" y1="45" x2="0" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#C0C0C0" />
        </linearGradient>

        {/* Facet line gradient */}
        <linearGradient id="logo-facet" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* === OUTER DIAMOND SHAPE === */}
      {/* Main diamond outline — the berlian silhouette */}
      <path
        d="M60 6 L106 38 L90 108 L30 108 L14 38 Z"
        stroke="url(#logo-diamond-stroke)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="url(#logo-inner-glow)"
      />

      {/* === FACET LINES — creating the gem's internal structure === */}
      {/* Crown facets (top section) */}
      <path d="M60 6 L60 38" stroke="url(#logo-facet)" strokeWidth="0.7" />
      <path d="M14 38 L60 38 L106 38" stroke="url(#logo-facet)" strokeWidth="0.7" />
      
      {/* Table facet (horizontal line in crown) */}
      <path d="M32 22 L88 22" stroke="rgba(0,229,255,0.12)" strokeWidth="0.5" />
      
      {/* Pavilion facets (bottom section) */}
      <path d="M14 38 L30 108" stroke="rgba(0,229,255,0.12)" strokeWidth="0.5" />
      <path d="M106 38 L90 108" stroke="rgba(0,229,255,0.12)" strokeWidth="0.5" />
      
      {/* Internal refraction lines — light passing through */}
      <path d="M60 38 L30 108" stroke="rgba(99,102,241,0.15)" strokeWidth="0.5" />
      <path d="M60 38 L90 108" stroke="rgba(99,102,241,0.15)" strokeWidth="0.5" />
      <path d="M60 38 L60 108" stroke="rgba(99,102,241,0.1)" strokeWidth="0.5" />
      
      {/* Star facets — the small triangles at the crown */}
      <path d="M32 22 L60 38" stroke="rgba(0,229,255,0.1)" strokeWidth="0.4" />
      <path d="M88 22 L60 38" stroke="rgba(0,229,255,0.1)" strokeWidth="0.4" />

      {/* === INNER DIAMOND — secondary facet boundary === */}
      <path
        d="M60 16 L94 38 L80 98 L40 98 L26 38 Z"
        stroke="rgba(0,229,255,0.1)"
        strokeWidth="0.5"
        fill="none"
      />

      {/* === THE PEARL (MUTIARA) — at the apex === */}
      {/* Outer glow */}
      <circle cx="60" cy="26" r="6" fill="rgba(0,229,255,0.06)" />
      {/* Pearl body */}
      <circle cx="60" cy="26" r="4.5" fill="url(#logo-pearl)" />
      {/* Pearl highlight */}
      <circle cx="58" cy="24.5" r="1.8" fill="rgba(255,255,255,0.7)" />
      {/* Pearl secondary highlight */}
      <circle cx="61.5" cy="27" r="0.8" fill="rgba(255,255,255,0.3)" />

      {/* === MONOGRAM "IMB" — integrated into the pavilion === */}
      {/* Letter "I" — center pillar */}
      <rect x="57.5" y="50" width="5" height="32" rx="1" fill="url(#logo-text)" />
      {/* I serifs */}
      <rect x="54" y="50" width="12" height="2.5" rx="0.5" fill="url(#logo-text)" />
      <rect x="54" y="79.5" width="12" height="2.5" rx="0.5" fill="url(#logo-text)" />

      {/* Letter "M" — left wing */}
      <path
        d="M28 82 L28 54 L36 66 L44 54 L44 82"
        stroke="url(#logo-text)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Letter "B" — right wing */}
      <path
        d="M76 54 L76 82"
        stroke="url(#logo-text)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M76 54 L84 54 Q90 54 90 60 Q90 66 84 66 L76 66"
        stroke="url(#logo-text)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M76 66 L85 66 Q92 66 92 73 Q92 82 84 82 L76 82"
        stroke="url(#logo-text)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* === SPARKLE ACCENTS === */}
      {/* Top left sparkle */}
      <circle cx="24" cy="32" r="1" fill="rgba(0,229,255,0.5)" />
      <path d="M24 30 L24 34 M22 32 L26 32" stroke="rgba(0,229,255,0.3)" strokeWidth="0.5" />
      
      {/* Top right sparkle */}
      <circle cx="96" cy="32" r="1" fill="rgba(0,229,255,0.5)" />
      <path d="M96 30 L96 34 M94 32 L98 32" stroke="rgba(0,229,255,0.3)" strokeWidth="0.5" />
      
      {/* Bottom accent */}
      <circle cx="60" cy="104" r="0.8" fill="rgba(99,102,241,0.5)" />

      {/* === BOTTOM DECORATIVE LINE === */}
      <path d="M42 108 L78 108" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
    </svg>
  );
}
