import { ArrowRight, Shield, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import SmartCityBackground from './SmartCityBackground';

function StatusIndicator({ label, status }: { label: string; status: 'active' | 'stable' | 'secure' }) {
  const colors = {
    active: 'bg-cyan',
    stable: 'bg-emerald-400',
    secure: 'bg-indigo',
  };

  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-75 animate-ping-slow`}></span>
        <span className={`relative inline-flex h-2 w-2 rounded-full ${colors[status]}`}></span>
      </span>
      <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
  );
}

function MetricCard({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="border border-white/[0.06] rounded-lg p-4 bg-surface/50 transition-all duration-300 hover:border-white/[0.12]">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-1.5 rounded border border-white/[0.06] bg-surface-elevated">
          <Icon size={14} className="text-cyan" />
        </div>
        <span className="text-xs text-text-secondary uppercase tracking-wider">{label}</span>
      </div>
      <span className="font-display text-2xl font-bold text-text-primary">{value}</span>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-16 overflow-hidden" aria-label="Hero section">
      {/* Smart City Background */}
      <SmartCityBackground />
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void/90 to-void"></div>
      
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
      
      {/* Subtle radial gradient */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan/[0.03] blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo/[0.04] blur-[100px]"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-20 lg:pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left: Content (55%) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Status bar */}
            <div className="flex items-center gap-4 flex-wrap">
              <StatusIndicator label="All Systems Operational" status="active" />
              <span className="text-white/[0.1]">|</span>
              <StatusIndicator label="99.97% Uptime SLA" status="stable" />
              <span className="text-white/[0.1]">|</span>
              <StatusIndicator label="SOC 2 Compliant" status="secure" />
            </div>

            {/* Headline */}
            <div className="space-y-5">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-text-primary">
                Bangun Infrastruktur
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-indigo animate-gradient">
                  Digital Enterprise
                </span>
                <br />
                yang Tak Tertandingi.
              </h1>
              <p className="text-lg lg:text-xl text-text-secondary max-w-xl leading-relaxed">
                Arsitektur microservices skalabel dengan enkripsi end-to-end, 
                didukung 200+ Senior Software Engineer dan integrasi AI infrastruktur 
                untuk transformasi digital yang terukur.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/jadwal"
                className="inline-flex items-center gap-2.5 rounded-lg bg-cyan px-6 py-3.5 text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90 hover:scale-[1.02]"
              >
                Konsultasikan Arsitektur Proyek Anda
                <ArrowRight size={16} />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-6 py-3.5 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-white/[0.2] hover:text-text-primary"
              >
                Lihat Kapabilitas Teknis
              </a>
            </div>

            {/* Trust line */}
            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-text-secondary uppercase tracking-widest">
                Dipercaya oleh tim engineering di
              </p>
              <div className="flex items-center gap-6 mt-3 flex-wrap">
                {['Bank Central', 'Telkom Group', 'Astra Intl', 'GoTo Corp', 'Mandiri'].map((name) => (
                  <span key={name} className="text-sm font-medium text-text-secondary/60 font-display">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: System Status Panel (45%) */}
          <div className="lg:col-span-5">
            <div className="border border-white/[0.08] rounded-xl bg-surface/60 backdrop-blur-sm overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
                  </div>
                  <span className="text-xs text-text-secondary ml-2 font-mono">system-dashboard</span>
                </div>
                <span className="text-[10px] text-text-secondary/60 font-mono">v4.2.1</span>
              </div>

              {/* Metrics grid */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard value="200+" label="Engineers" icon={Cpu} />
                  <MetricCard value="99.97%" label="Uptime" icon={Shield} />
                  <MetricCard value="< 50ms" label="Latency" icon={Globe} />
                  <MetricCard value="AES-256" label="Encryption" icon={Shield} />
                </div>

                {/* Architecture mini-diagram */}
                <div className="border border-white/[0.06] rounded-lg p-4 bg-surface-elevated/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Architecture Stack</span>
                    <span className="text-[10px] text-cyan font-mono">LIVE</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { layer: 'API Gateway', tech: 'Kong / Nginx', status: 'active' },
                      { layer: 'Microservices', tech: 'Go / Rust / Node.js', status: 'active' },
                      { layer: 'AI/ML Pipeline', tech: 'PyTorch / TensorFlow', status: 'active' },
                      { layer: 'Data Layer', tech: 'PostgreSQL / Redis', status: 'active' },
                    ].map((item) => (
                      <div key={item.layer} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan/70"></span>
                          <span className="text-xs text-text-primary">{item.layer}</span>
                        </div>
                        <span className="text-[11px] text-text-secondary font-mono">{item.tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
