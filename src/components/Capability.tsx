const metrics = [
  { value: '200+', label: 'Senior Software Engineer', sublabel: 'Avg. 8+ tahun pengalaman' },
  { value: '50+', label: 'Enterprise Deployment', sublabel: 'Across 12 industri' },
  { value: '99.97%', label: 'Uptime Guarantee', sublabel: 'SLA-backed commitment' },
  { value: '< 48h', label: 'Incident Response', sublabel: 'Critical severity P0' },
  { value: '4.2M+', label: 'Lines of Code Delivered', sublabel: 'With 92%+ test coverage' },
  { value: '0', label: 'Data Breach Incidents', sublabel: 'Since inception 2018' },
];

const capabilities = [
  { name: 'Backend Engineering', level: 98 },
  { name: 'Frontend & Mobile', level: 95 },
  { name: 'Cloud & DevOps', level: 96 },
  { name: 'AI/ML Engineering', level: 91 },
  { name: 'Security & Compliance', level: 97 },
  { name: 'System Architecture', level: 99 },
];

export default function Capability() {
  return (
    <section id="capability" className="relative py-24 lg:py-32 border-t border-white/[0.04]" aria-label="Kapabilitas tim">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-cyan/50"></span>
            <span className="text-xs font-medium text-cyan uppercase tracking-widest">Kapabilitas</span>
          </div>
          <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-text-primary leading-tight mb-5">
            Angka yang Berbicara Lebih Keras dari Klaim
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Bukan sekadar angka marketing. Setiap metrik di bawah ini diaudit secara berkala dan menjadi bagian dari SLA kontrak kami.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="group border border-white/[0.06] rounded-xl bg-surface/30 p-5 lg:p-6 transition-all duration-300 hover:border-white/[0.12]"
            >
              <span className="font-display text-2xl lg:text-3xl xl:text-4xl font-bold text-text-primary block mb-1">
                {metric.value}
              </span>
              <span className="text-sm font-medium text-text-primary block mb-1">
                {metric.label}
              </span>
              <span className="text-xs text-text-secondary">
                {metric.sublabel}
              </span>
            </div>
          ))}
        </div>

        {/* Capability Bars */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
              Maturity Index per Domain
            </h3>
            <p className="text-sm text-text-secondary mb-8">
              Diukur berdasarkan delivery success rate, client satisfaction, dan technical depth assessment.
            </p>
            <div className="space-y-5">
              {capabilities.map((cap) => (
                <div key={cap.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">{cap.name}</span>
                    <span className="text-xs font-mono text-cyan">{cap.level}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan/80 to-indigo/80 transition-all duration-1000"
                      style={{ width: `${cap.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="border border-white/[0.08] rounded-xl bg-surface/40 p-6 lg:p-8">
            <h3 className="font-display text-xl font-semibold text-text-primary mb-6">
              Sertifikasi & Compliance
            </h3>
            <div className="space-y-4">
              {[
                { cert: 'ISO 27001:2022', desc: 'Information Security Management' },
                { cert: 'SOC 2 Type II', desc: 'Security, Availability, Confidentiality' },
                { cert: 'PCI-DSS Level 1', desc: 'Payment Card Industry Data Security' },
                { cert: 'GDPR Compliant', desc: 'EU Data Protection Regulation' },
                { cert: 'AWS Advanced Partner', desc: 'Advanced Technology Partner' },
                { cert: 'Google Cloud Partner', desc: 'Build Partner - AI/ML Specialization' },
              ].map((item) => (
                <div key={item.cert} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan/70 mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-sm font-medium text-text-primary block">{item.cert}</span>
                    <span className="text-xs text-text-secondary">{item.desc}</span>
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
