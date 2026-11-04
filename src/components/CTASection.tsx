import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section id="contact" className="relative py-24 lg:py-32 border-t border-white/[0.04]" aria-label="Call to action">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-cyan/[0.02] blur-[100px]"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border border-white/[0.08] rounded-2xl bg-surface/40 p-8 lg:p-16 text-center">
          {/* Status indicator */}
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-cyan/20 bg-cyan/5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75 animate-ping-slow"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan"></span>
            </span>
            <span className="text-xs font-medium text-cyan">Tim Engineering Tersedia</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6 max-w-3xl mx-auto">
            Siap Membangun Sistem yang Skalabel, Aman, dan Siap untuk Masa Depan?
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Jadwalkan sesi konsultasi arsitektur gratis 60 menit dengan senior engineer kami. 
            Kami akan mengevaluasi kebutuhan teknis Anda dan memberikan rekomendasi konkret — bukan sales pitch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-lg bg-cyan px-8 py-4 text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90 hover:scale-[1.02]"
            >
              Jadwalkan Konsultasi Arsitektur
              <ArrowRight size={16} />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-8 py-4 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-white/[0.2] hover:text-text-primary"
            >
              Download Capability Deck (PDF)
            </a>
          </div>

          {/* Trust signals */}
          <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <span className="text-xs text-text-secondary">✓ NDA-protected consultation</span>
            <span className="text-xs text-text-secondary">✓ No obligation</span>
            <span className="text-xs text-text-secondary">✓ Response within 24 hours</span>
            <span className="text-xs text-text-secondary">✓ Senior engineer-led session</span>
          </div>
        </div>
      </div>
    </section>
  );
}
