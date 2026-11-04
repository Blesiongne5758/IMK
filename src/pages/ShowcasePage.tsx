import { Code, Database, Globe, Shield, Smartphone, Zap } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Sistem Perbankan Digital',
    client: 'Bank Central',
    category: 'Financial Technology',
    description: 'Platform perbankan digital dengan arsitektur microservices, mendukung 10 juta+ transaksi per hari dengan uptime 99.99%.',
    tech: ['Go', 'PostgreSQL', 'Redis', 'Kubernetes'],
    icon: Database,
    color: 'cyan',
  },
  {
    id: 2,
    title: 'E-Commerce Enterprise',
    client: 'Retail Corp Indonesia',
    category: 'E-Commerce',
    description: 'Platform e-commerce B2B dengan integrasi payment gateway, inventory management, dan analytics dashboard real-time.',
    tech: ['React', 'Node.js', 'MongoDB', 'AWS'],
    icon: Globe,
    color: 'indigo',
  },
  {
    id: 3,
    title: 'Aplikasi Mobile Kesehatan',
    client: 'Kementerian Kesehatan',
    category: 'Healthcare',
    description: 'Aplikasi mobile untuk telemedicine dengan fitur video call, e-prescription, dan integrasi dengan sistem rumah sakit.',
    tech: ['React Native', 'Firebase', 'WebRTC'],
    icon: Smartphone,
    color: 'emerald',
  },
  {
    id: 4,
    title: 'Sistem Keamanan Siber',
    client: 'Lembaga Pemerintahan',
    category: 'Cybersecurity',
    description: 'Platform monitoring keamanan siber dengan AI-powered threat detection, SIEM integration, dan automated incident response.',
    tech: ['Python', 'TensorFlow', 'Elasticsearch', 'Kafka'],
    icon: Shield,
    color: 'red',
  },
  {
    id: 5,
    title: 'Platform IoT Smart City',
    client: 'Pemkot Jakarta',
    category: 'IoT & Smart City',
    description: 'Sistem IoT untuk monitoring traffic, CCTV analytics, dan environmental sensors dengan dashboard real-time.',
    tech: ['IoT', 'MQTT', 'TimescaleDB', 'Grafana'],
    icon: Zap,
    color: 'amber',
  },
  {
    id: 6,
    title: 'ERP System Manufacturing',
    client: 'PT Manufaktur Jaya',
    category: 'Enterprise Resource Planning',
    description: 'Sistem ERP terintegrasi untuk manajemen produksi, supply chain, dan financial dengan modul AI forecasting.',
    tech: ['Java', 'Spring Boot', 'Oracle', 'SAP'],
    icon: Code,
    color: 'purple',
  },
];

const colorClasses = {
  cyan: {
    bg: 'bg-cyan/10',
    border: 'border-cyan/30',
    text: 'text-cyan',
    hover: 'hover:border-cyan/50',
  },
  indigo: {
    bg: 'bg-indigo/10',
    border: 'border-indigo/30',
    text: 'text-indigo',
    hover: 'hover:border-indigo/50',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    hover: 'hover:border-emerald-500/50',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    hover: 'hover:border-red-500/50',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    hover: 'hover:border-amber-500/50',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    hover: 'hover:border-purple-500/50',
  },
};

export default function ShowcasePage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-cyan/50"></span>
              <span className="text-xs font-medium text-cyan uppercase tracking-widest">
                Portfolio Showcase
              </span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary leading-tight mb-6">
              Project Showcase
            </h1>
            <p className="text-lg lg:text-xl text-text-secondary leading-relaxed">
              Portofolio project enterprise yang telah kami kerjakan bersama klien dari berbagai industri. 
              Setiap project mencerminkan komitmen kami terhadap kualitas, keamanan, dan inovasi.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="font-display text-3xl lg:text-4xl font-bold text-cyan mb-2">50+</div>
              <div className="text-sm text-text-secondary">Project Selesai</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl lg:text-4xl font-bold text-indigo mb-2">30+</div>
              <div className="text-sm text-text-secondary">Klien Enterprise</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl lg:text-4xl font-bold text-emerald-400 mb-2">12</div>
              <div className="text-sm text-text-secondary">Industri Dilayani</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl lg:text-4xl font-bold text-amber-400 mb-2">99%</div>
              <div className="text-sm text-text-secondary">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Featured Projects
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl">
              Beberapa project unggulan yang menunjukkan kapabilitas kami dalam mengembangkan solusi enterprise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const colors = colorClasses[project.color as keyof typeof colorClasses];
              const Icon = project.icon;

              return (
                <div
                  key={project.id}
                  className={`group relative border ${colors.border} rounded-xl bg-surface/40 p-6 transition-all duration-300 ${colors.hover} hover:bg-surface/60`}
                >
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-lg ${colors.bg} mb-4`}>
                    <Icon size={24} className={colors.text} />
                  </div>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className={`text-xs font-medium ${colors.text} uppercase tracking-wider`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Title & Client */}
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    Klien: {project.client}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded border border-white/[0.08] bg-surface-elevated/50 text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="border border-white/[0.08] rounded-2xl bg-surface/40 p-8 lg:p-12 text-center">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              Tertarik Melihat Lebih Banyak?
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Hubungi kami untuk mendapatkan portfolio lengkap dan studi kasus detail dari project kami.
            </p>
            <a
              href="/jadwal"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan px-8 py-4 text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90 hover:scale-[1.02]"
            >
              Konsultasikan Proyek Anda
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
