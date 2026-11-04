import { Code2, Smartphone, Database, Brain, ShieldCheck, Cloud, Server, GitBranch } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  tags: string[];
  className?: string;
}

function ServiceCard({ icon: Icon, title, description, tags, className = '' }: ServiceCardProps) {
  return (
    <div className={`group border border-white/[0.06] rounded-xl bg-surface/40 p-6 lg:p-8 transition-all duration-300 hover:border-cyan/30 hover:bg-surface/60 ${className}`}>
      <div className="mb-5 inline-flex p-2.5 rounded-lg border border-white/[0.06] bg-surface-elevated transition-colors duration-300 group-hover:border-cyan/20">
        <Icon size={20} className="text-cyan" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-lg lg:text-xl font-semibold text-text-primary mb-3">
        {title}
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-5">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-medium px-2.5 py-1 rounded-md border border-white/[0.06] bg-surface-elevated/50 text-text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-24 lg:py-32" aria-label="Layanan kami">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-cyan/50"></span>
            <span className="text-xs font-medium text-cyan uppercase tracking-widest">Layanan</span>
          </div>
          <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-text-primary leading-tight mb-5">
            Full-Stack Engineering untuk Kebutuhan Enterprise yang Kompleks
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Dari arsitektur backend hingga antarmuka pengguna — kami membangun sistem yang dirancang untuk skala, keamanan, dan performa tingkat production.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large card - spans 2 cols on lg */}
          <ServiceCard
            icon={Code2}
            title="Custom Software Development"
            description="Sistem enterprise yang dirancang dari nol dengan arsitektur clean-code, test coverage 90%+, dan dokumentasi teknis lengkap. Setiap baris kode melewati review ketat oleh senior engineer."
            tags={['Go', 'Rust', 'TypeScript', 'Microservices']}
            className="lg:col-span-2"
          />

          <ServiceCard
            icon={Smartphone}
            title="Mobile & Web Applications"
            description="Aplikasi cross-platform dengan performa native. React Native untuk mobile, Next.js untuk web — keduanya terhubung ke backend yang sama."
            tags={['React Native', 'Next.js', 'Flutter']}
          />

          <ServiceCard
            icon={Brain}
            title="AI & Machine Learning Integration"
            description="Integrasi model AI ke dalam workflow bisnis Anda. Dari NLP untuk customer service hingga predictive analytics untuk supply chain."
            tags={['LLM', 'Computer Vision', 'MLOps']}
          />

          <ServiceCard
            icon={Database}
            title="Data Engineering & Pipeline"
            description="Bangun pipeline data real-time yang memproses jutaan event per detik. ETL, streaming, dan data warehouse yang terintegrasi."
            tags={['Kafka', 'Spark', 'BigQuery']}
          />

          {/* Wide card */}
          <ServiceCard
            icon={Cloud}
            title="Cloud Infrastructure & DevOps"
            description="Infrastruktur cloud yang auto-scaling dengan CI/CD pipeline, monitoring 24/7, dan disaster recovery plan. Multi-cloud atau single-cloud — sesuai kebutuhan."
            tags={['AWS', 'GCP', 'Kubernetes', 'Terraform']}
            className="lg:col-span-2"
          />

          <ServiceCard
            icon={ShieldCheck}
            title="Security & Compliance"
            description="Audit keamanan menyeluruh, penetrasi testing, dan implementasi standar SOC 2, ISO 27001, serta PCI-DSS untuk industri finansial."
            tags={['SOC 2', 'ISO 27001', 'Pen-Test']}
          />

          <ServiceCard
            icon={Server}
            title="Legacy System Modernization"
            description="Migrasi sistem monolitik ke arsitektur modern tanpa downtime. Strategi strangler fig untuk transisi bertahap yang aman."
            tags={['Migration', 'Refactoring', 'API-First']}
          />

          <ServiceCard
            icon={GitBranch}
            title="System Integration & API"
            description="Hubungkan seluruh ekosistem digital Anda. REST API, GraphQL, gRPC — dengan rate limiting, versioning, dan dokumentasi otomatis."
            tags={['REST', 'GraphQL', 'gRPC', 'OAuth 2.0']}
          />
        </div>
      </div>
    </section>
  );
}
