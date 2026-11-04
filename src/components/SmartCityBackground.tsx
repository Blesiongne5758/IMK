export default function SmartCityBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradient untuk buildings */}
          <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
          </linearGradient>

          {/* Gradient untuk glow effects */}
          <radialGradient id="glowCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="glowIndigo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>

          {/* Pattern untuk grid */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00E5FF" strokeWidth="0.5" strokeOpacity="0.2" />
          </pattern>
        </defs>

        {/* Background grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Glow effects */}
        <circle cx="300" cy="400" r="200" fill="url(#glowCyan)" />
        <circle cx="1600" cy="300" r="250" fill="url(#glowIndigo)" />
        <circle cx="960" cy="600" r="300" fill="url(#glowCyan)" />

        {/* Buildings - Left side */}
        <rect x="100" y="500" width="80" height="400" fill="url(#buildingGradient)" />
        <rect x="200" y="400" width="100" height="500" fill="url(#buildingGradient)" />
        <rect x="320" y="450" width="90" height="450" fill="url(#buildingGradient)" />
        <rect x="430" y="350" width="110" height="550" fill="url(#buildingGradient)" />

        {/* Buildings - Center */}
        <rect x="700" y="300" width="120" height="600" fill="url(#buildingGradient)" />
        <rect x="840" y="250" width="140" height="650" fill="url(#buildingGradient)" />
        <rect x="1000" y="280" width="130" height="620" fill="url(#buildingGradient)" />

        {/* Buildings - Right side */}
        <rect x="1300" y="380" width="100" height="520" fill="url(#buildingGradient)" />
        <rect x="1420" y="420" width="90" height="480" fill="url(#buildingGradient)" />
        <rect x="1530" y="350" width="110" height="550" fill="url(#buildingGradient)" />
        <rect x="1660" y="400" width="95" height="500" fill="url(#buildingGradient)" />

        {/* Building windows - Left */}
        {[...Array(8)].map((_, i) => (
          <rect key={`win-l1-${i}`} x="115" y={520 + i * 45} width="15" height="20" fill="#00E5FF" opacity="0.6" />
        ))}
        {[...Array(10)].map((_, i) => (
          <rect key={`win-l2-${i}`} x="220" y={420 + i * 45} width="15" height="20" fill="#00E5FF" opacity="0.6" />
        ))}
        {[...Array(9)].map((_, i) => (
          <rect key={`win-l3-${i}`} x="335" y={470 + i * 45} width="15" height="20" fill="#00E5FF" opacity="0.6" />
        ))}
        {[...Array(11)].map((_, i) => (
          <rect key={`win-l4-${i}`} x="450" y={370 + i * 45} width="15" height="20" fill="#00E5FF" opacity="0.6" />
        ))}

        {/* Building windows - Center */}
        {[...Array(12)].map((_, i) => (
          <rect key={`win-c1-${i}`} x="720" y={320 + i * 45} width="20" height="25" fill="#00E5FF" opacity="0.7" />
        ))}
        {[...Array(13)].map((_, i) => (
          <rect key={`win-c2-${i}`} x="865" y={270 + i * 45} width="20" height="25" fill="#00E5FF" opacity="0.7" />
        ))}
        {[...Array(12)].map((_, i) => (
          <rect key={`win-c3-${i}`} x="1020" y={300 + i * 45} width="20" height="25" fill="#00E5FF" opacity="0.7" />
        ))}

        {/* Building windows - Right */}
        {[...Array(10)].map((_, i) => (
          <rect key={`win-r1-${i}`} x="1315" y={400 + i * 45} width="15" height="20" fill="#00E5FF" opacity="0.6" />
        ))}
        {[...Array(9)].map((_, i) => (
          <rect key={`win-r2-${i}`} x="1435" y={440 + i * 45} width="15" height="20" fill="#00E5FF" opacity="0.6" />
        ))}
        {[...Array(11)].map((_, i) => (
          <rect key={`win-r3-${i}`} x="1545" y={370 + i * 45} width="15" height="20" fill="#00E5FF" opacity="0.6" />
        ))}
        {[...Array(10)].map((_, i) => (
          <rect key={`win-r4-${i}`} x="1675" y={420 + i * 45} width="15" height="20" fill="#00E5FF" opacity="0.6" />
        ))}

        {/* Network connections - Horizontal lines */}
        <line x1="180" y1="600" x2="400" y2="550" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="540" y1="500" x2="700" y2="450" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="820" y1="400" x2="1000" y2="380" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="1130" y1="420" x2="1300" y2="480" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="1420" y1="520" x2="1660" y2="500" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.3" />

        {/* Network connections - Diagonal lines */}
        <line x1="200" y1="400" x2="700" y2="300" stroke="#6366F1" strokeWidth="1" strokeOpacity="0.2" />
        <line x1="840" y1="250" x2="1300" y2="380" stroke="#6366F1" strokeWidth="1" strokeOpacity="0.2" />
        <line x1="1000" y1="280" x2="1530" y2="350" stroke="#6366F1" strokeWidth="1" strokeOpacity="0.2" />

        {/* Data flow particles */}
        <circle cx="300" cy="500" r="3" fill="#00E5FF" opacity="0.8">
          <animate attributeName="cy" values="500;450;500" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="450" r="3" fill="#00E5FF" opacity="0.8">
          <animate attributeName="cy" values="450;400;450" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="900" cy="350" r="3" fill="#00E5FF" opacity="0.8">
          <animate attributeName="cy" values="350;300;350" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="1200" cy="400" r="3" fill="#00E5FF" opacity="0.8">
          <animate attributeName="cy" values="400;350;400" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="1500" cy="450" r="3" fill="#00E5FF" opacity="0.8">
          <animate attributeName="cy" values="450;400;450" dur="3.2s" repeatCount="indefinite" />
        </circle>

        {/* Flying vehicles */}
        <g opacity="0.6">
          <ellipse cx="400" cy="200" rx="20" ry="5" fill="#00E5FF" />
          <line x1="400" y1="200" x2="350" y2="200" stroke="#00E5FF" strokeWidth="2" strokeOpacity="0.4" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 100,-20; 200,0"
            dur="8s"
            repeatCount="indefinite"
          />
        </g>

        <g opacity="0.6">
          <ellipse cx="1200" cy="150" rx="20" ry="5" fill="#6366F1" />
          <line x1="1200" y1="150" x2="1150" y2="150" stroke="#6366F1" strokeWidth="2" strokeOpacity="0.4" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; -150,30; -300,0"
            dur="10s"
            repeatCount="indefinite"
          />
        </g>

        {/* Abstract geometric patterns */}
        <polygon points="960,100 980,140 940,140" fill="none" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.3" />
        <polygon points="500,250 520,290 480,290" fill="none" stroke="#6366F1" strokeWidth="1" strokeOpacity="0.3" />
        <polygon points="1400,200 1420,240 1380,240" fill="none" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
    </div>
  );
}
