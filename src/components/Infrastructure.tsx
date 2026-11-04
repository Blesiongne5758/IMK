import { Layers, Lock, Zap, RefreshCw } from 'lucide-react';

const infraFeatures = [
  {
    icon: Layers,
    title: 'Multi-Layer Architecture',
    description: 'Pemisahan concern yang ketat: presentation, business logic, data access, dan infrastructure layer — masing-masing independently deployable.',
  },
  {
    icon: Lock,
    title: 'Zero-Trust Security Model',
    description: 'Setiap request divalidasi. mTLS antar service, RBAC granular, dan audit trail lengkap untuk setiap aksi dalam sistem.',
  },
  {
    icon: Zap,
    title: 'Sub-50ms Response Time',
    description: 'Edge caching, connection pooling, dan query optimization memastikan latensi di bawah 50ms untuk 95th percentile.',
  },
  {
    icon: RefreshCw,
    title: 'Self-Healing Infrastructure',
    description: 'Auto-scaling berdasarkan traffic pattern, circuit breaker untuk fault tolerance, dan automated rollback pada deployment failure.',
  },
];

export default function Infrastructure() {
  return (
    <section id="infrastructure" className="relative py-24 lg:py-32 border-t border-white/[0.04]" aria-label="Infrastruktur AI">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left: Visual / Architecture Diagram */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="border border-white/[0.08] rounded-xl bg-surface/40 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-mono text-text-secondary">infrastructure-diagram</span>
                <span className="text-[10px] font-mono text-cyan/70">REAL-TIME</span>
              </div>
              
              {/* Diagram */}
              <div className="p-6 space-y-3">
                {/* Layer visualization */}
                {[
                  { label: 'Edge / CDN', detail: 'Cloudflare • Vercel Edge', color: 'border-cyan/30 bg-cyan/5' },
                  { label: 'API Gateway', detail: 'Kong • Rate Limiting • Auth', color: 'border-cyan/20 bg-cyan/[0.03]' },
                  { label: 'Service Mesh', detail: 'Istio • mTLS • Observability', color: 'border-indigo/30 bg-indigo/5' },
                  { label: 'Compute Layer', detail: 'Go Services • Rust Workers • Node API', color: 'border-indigo/20 bg-indigo/[0.03]' },
                  { label: 'AI/ML Pipeline', detail: 'Model Serving • Feature Store • Vector DB', color: 'border-cyan/20 bg-cyan/[0.03]' },
                  { label: 'Data Layer', detail: 'PostgreSQL • Redis • S3 • Elasticsearch', color: 'border-white/10 bg-surface-elevated/50' },
                ].map((layer, i) => (
                  <div key={layer.label} className="relative">
                    <div className={`border rounded-lg p-3.5 ${layer.color} transition-all duration-300 hover:border-cyan/40`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-primary">{layer.label}</span>
                        <span className="text-[10px] font-mono text-text-secondary">{layer.detail}</span>
                      </div>
                    </div>
                    {i < 5 && (
                      <div className="flex justify-center py-1">
                        <div className="w-px h-3 bg-white/[0.08]"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer stats */}
              <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] text-text-secondary font-mono">6 layers • 24 services • 3 regions</span>
                <span className="text-[10px] text-emerald-400 font-mono">● HEALTHY</span>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-indigo/50"></span>
              <span className="text-xs font-medium text-indigo uppercase tracking-widest">Infrastruktur</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary leading-tight mb-5">
              Infrastruktur AI yang Dirancang untuk Beban Kerja Enterprise
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-12">
              Bukan sekadar wrapper API. Kami membangun pipeline ML end-to-end — dari data ingestion, model training, hingga deployment dan monitoring — yang terintegrasi native dengan sistem existing Anda.
            </p>

            <div className="space-y-8">
              {infraFeatures.map((feature) => (
                <div key={feature.title} className="group flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg border border-white/[0.06] bg-surface-elevated flex items-center justify-center transition-colors duration-300 group-hover:border-cyan/30">
                    <feature.icon size={18} className="text-cyan" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-text-primary mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
