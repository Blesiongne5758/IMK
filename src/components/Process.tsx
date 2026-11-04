import { Search, PenTool, Code2, Rocket, HeadphonesIcon } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery & Audit',
    duration: '1–2 minggu',
    description: 'Deep-dive ke sistem existing Anda. Codebase audit, architecture review, threat modeling, dan stakeholder interview untuk memetakan kebutuhan teknis dan bisnis.',
    deliverables: ['Technical Assessment Report', 'Architecture Blueprint', 'Risk Matrix'],
  },
  {
    number: '02',
    icon: PenTool,
    title: 'Architecture Design',
    duration: '2–3 minggu',
    description: 'Desain sistem dari level component hingga deployment. API contract definition, database schema, infrastructure-as-code, dan security architecture document.',
    deliverables: ['System Design Document', 'API Specification', 'Infrastructure Plan'],
  },
  {
    number: '03',
    icon: Code2,
    title: 'Engineering Sprint',
    duration: '8–16 minggu',
    description: 'Development dalam 2-week sprints dengan demo setiap akhir sprint. CI/CD pipeline aktif dari hari pertama. Code review wajib oleh 2+ senior engineer.',
    deliverables: ['Production-Ready Code', 'Test Suite (90%+)', 'Documentation'],
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Deployment & Hardening',
    duration: '1–2 minggu',
    description: 'Staged rollout dengan canary deployment. Load testing, security scanning, dan chaos engineering untuk memastikan ketahanan sistem di production.',
    deliverables: ['Deployed System', 'Performance Report', 'Security Audit'],
  },
  {
    number: '05',
    icon: HeadphonesIcon,
    title: 'Support & Evolution',
    duration: 'Ongoing',
    description: 'Dedicated support team dengan SLA response time < 4 jam. Monitoring proaktif, quarterly architecture review, dan roadmap evolution berbasis data.',
    deliverables: ['24/7 Monitoring', 'Monthly Reports', 'Quarterly Reviews'],
  },
];

export default function Process() {
  return (
    <section id="process" className="relative py-24 lg:py-32 border-t border-white/[0.04]" aria-label="Proses kerja">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-indigo/50"></span>
            <span className="text-xs font-medium text-indigo uppercase tracking-widest">Proses</span>
          </div>
          <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-text-primary leading-tight mb-5">
            Metodologi yang Terbukti, Bukan Eksperimen
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Setiap proyek mengikuti framework yang telah diuji pada 50+ deployment enterprise. Transparan, terukur, dan dapat diaudit di setiap tahap.
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group border border-white/[0.06] rounded-xl bg-surface/30 p-6 lg:p-8 transition-all duration-300 hover:border-white/[0.12]"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Left: Number + Icon */}
                <div className="flex items-center gap-4 lg:w-64 flex-shrink-0">
                  <span className="font-display text-3xl font-bold text-white/[0.08] group-hover:text-cyan/30 transition-colors duration-300">
                    {step.number}
                  </span>
                  <div className="p-2 rounded-lg border border-white/[0.06] bg-surface-elevated transition-colors duration-300 group-hover:border-cyan/20">
                    <step.icon size={18} className="text-cyan" strokeWidth={1.5} />
                  </div>
                  <div className="lg:hidden">
                    <h3 className="font-display text-base font-semibold text-text-primary">{step.title}</h3>
                    <span className="text-xs text-text-secondary">{step.duration}</span>
                  </div>
                </div>

                {/* Middle: Content */}
                <div className="flex-1">
                  <div className="hidden lg:block mb-2">
                    <h3 className="font-display text-base font-semibold text-text-primary">{step.title}</h3>
                    <span className="text-xs text-text-secondary">{step.duration}</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mt-2 lg:mt-0">
                    {step.description}
                  </p>
                </div>

                {/* Right: Deliverables */}
                <div className="lg:w-56 flex-shrink-0">
                  <span className="text-[10px] text-text-secondary uppercase tracking-widest block mb-2">Deliverables</span>
                  <div className="space-y-1.5">
                    {step.deliverables.map((d) => (
                      <div key={d} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-cyan/50"></span>
                        <span className="text-xs text-text-secondary">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connector line (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex justify-start ml-8 mt-4">
                  <div className="w-px h-4 bg-white/[0.06]"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
