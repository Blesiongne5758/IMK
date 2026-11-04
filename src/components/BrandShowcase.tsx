import Logo from './Logo';

export default function BrandShowcase() {
  return (
    <section className="relative py-20 lg:py-28 border-t border-white/[0.04]" aria-label="Brand identity">
      {/* Subtle background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-cyan/[0.015] blur-[80px]"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Logo showcase */}
        <div className="flex flex-col items-center text-center mb-16">
          {/* Large logo display */}
          <div className="mb-8 p-8 border border-white/[0.06] rounded-2xl bg-surface/30 transition-all duration-500 hover:border-cyan/20">
            <Logo variant="icon" size={120} />
          </div>
          
          {/* Brand name */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-3">
            Inti Mutiara Kreasindo
          </h2>
          
          {/* Decorative divider */}
          <div className="flex items-center gap-4 mb-4">
            <span className="w-16 h-px bg-gradient-to-r from-transparent to-cyan/40"></span>
            <span className="w-2 h-2 rotate-45 border border-cyan/40"></span>
            <span className="w-16 h-px bg-gradient-to-l from-transparent to-cyan/40"></span>
          </div>
          
          {/* Legal entity */}
          <p className="text-sm text-text-secondary/70 uppercase tracking-[0.3em] font-medium mb-2">
            PT Inti Mutiara Kreasindo
          </p>
          <p className="text-sm text-text-secondary max-w-lg">
            Enterprise IT Infrastructure & AI Solutions
          </p>
        </div>

        {/* Logo variants showcase */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Icon only */}
          <div className="border border-white/[0.06] rounded-xl bg-surface/30 p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:border-white/[0.12]">
            <Logo variant="icon" size={56} />
            <div className="text-center">
              <span className="text-xs text-text-secondary uppercase tracking-widest block">Icon Mark</span>
              <span className="text-[10px] text-text-secondary/50 mt-1 block">Primary — All sizes</span>
            </div>
          </div>

          {/* Wordmark */}
          <div className="border border-white/[0.06] rounded-xl bg-surface/30 p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-white/[0.12]">
            <Logo variant="wordmark" size={40} />
            <div className="text-center">
              <span className="text-xs text-text-secondary uppercase tracking-widest block">Wordmark</span>
              <span className="text-[10px] text-text-secondary/50 mt-1 block">Navigation & Headers</span>
            </div>
          </div>

          {/* Full brand */}
          <div className="border border-white/[0.06] rounded-xl bg-surface/30 p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-white/[0.12]">
            <Logo variant="full" size={48} />
            <div className="text-center">
              <span className="text-xs text-text-secondary uppercase tracking-widest block">Full Identity</span>
              <span className="text-[10px] text-text-secondary/50 mt-1 block">Presentations & Print</span>
            </div>
          </div>
        </div>

        {/* Design philosophy */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <p className="text-xs text-text-secondary/50 uppercase tracking-widest mb-3">Design Philosophy</p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Logo ini merepresentasikan presisi engineering (facet berlian), 
            kejernihan visi (cahaya interior), dan nilai inti yang langka (mutiara). 
            Setiap garis dirancang untuk mengkomunikasikan kepercayaan, teknologi, dan keunggulan.
          </p>
        </div>
      </div>
    </section>
  );
}
