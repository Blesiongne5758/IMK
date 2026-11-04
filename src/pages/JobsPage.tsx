import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code2,
  Link as LinkIcon,
  FileText,
  Check,
  AlertCircle,
} from 'lucide-react';

interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  education: {
    degree: string;
    major: string;
    university: string;
    graduationYear: string;
    gpa: string;
  };
  experience: string;
  skills: string[];
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  cvUrl: string;
  coverLetter: string;
  submittedAt: string;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  degree: string;
  major: string;
  university: string;
  graduationYear: string;
  gpa: string;
  experience: string;
  skills: string[];
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  cvUrl: string;
  coverLetter: string;
}

const STORAGE_KEY = 'imk_job_applications';

const initialForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  position: '',
  degree: '',
  major: '',
  university: '',
  graduationYear: '',
  gpa: '',
  experience: '',
  skills: [],
  portfolioUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  cvUrl: '',
  coverLetter: '',
};

const positions = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer (iOS/Android)',
  'DevOps Engineer',
  'Cloud Architect',
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Specialist',
  'System Analyst',
  'Business Analyst',
  'QA Engineer',
  'UI/UX Designer',
  'Product Manager',
  'Project Manager',
  'IT Support Specialist',
  'Network Engineer',
  'Security Analyst',
  'Database Administrator',
  'Technical Writer',
  'Other',
];

const skillOptions = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#',
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 'NestJS',
  'Django', 'Flask', 'Spring Boot', 'Laravel',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform',
  'Git', 'CI/CD', 'Jenkins', 'GitHub Actions',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'Data Analysis', 'SQL', 'BigQuery', 'Spark',
  'Figma', 'Adobe XD', 'Sketch',
  'Agile', 'Scrum', 'Kanban',
  'REST API', 'GraphQL', 'gRPC',
  'Linux', 'Bash', 'Networking',
];

export default function JobsPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string>('');

  function handleChange(field: keyof FormState, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function toggleSkill(skill: string) {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    
    if (!form.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!form.phone.trim()) newErrors.phone = 'No. telepon wajib diisi';
    if (!form.position) newErrors.position = 'Posisi yang dilamar wajib dipilih';
    if (!form.degree) newErrors.degree = 'Jenjang pendidikan wajib diisi';
    if (!form.major.trim()) newErrors.major = 'Jurusan wajib diisi';
    if (!form.university.trim()) newErrors.university = 'Universitas wajib diisi';
    if (!form.graduationYear) newErrors.graduationYear = 'Tahun lulus wajib diisi';
    if (form.skills.length === 0) newErrors.skills = 'Pilih minimal 1 skill';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const application: JobApplication = {
      id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      position: form.position,
      education: {
        degree: form.degree,
        major: form.major.trim(),
        university: form.university.trim(),
        graduationYear: form.graduationYear,
        gpa: form.gpa.trim(),
      },
      experience: form.experience.trim(),
      skills: form.skills,
      portfolioUrl: form.portfolioUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      linkedinUrl: form.linkedinUrl.trim(),
      cvUrl: form.cvUrl.trim(),
      coverLetter: form.coverLetter.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const applications = existing ? JSON.parse(existing) : [];
      applications.push(application);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // ignore
    }

    setApplicationId(application.id);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl w-full border border-emerald-500/30 bg-emerald-500/5 rounded-2xl p-8 lg:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
            <Check size={32} className="text-emerald-400" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-text-primary mb-3">
            Lamaran Berhasil Dikirim!
          </h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Terima kasih atas minat Anda untuk bergabung dengan PT. Inti Mutiara Kreasindo. 
            Tim HR kami akan meninjau lamaran Anda dan menghubungi dalam 5-7 hari kerja.
          </p>
          <div className="border border-white/[0.08] rounded-lg p-4 bg-surface-elevated/30 mb-6">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">ID Lamaran</p>
            <p className="font-mono text-sm text-cyan">{applicationId}</p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm(initialForm);
              setApplicationId('');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/[0.1] text-sm font-medium text-text-secondary hover:text-text-primary hover:border-white/[0.2] transition-all"
          >
            Kirim Lamaran Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-cyan/50"></span>
            <span className="text-xs font-medium text-cyan uppercase tracking-widest">Karir</span>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-text-primary leading-tight mb-4">
            Bergabung dengan Tim Engineering Kami
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            Kami mencari talenta terbaik di bidang teknologi informasi untuk membangun solusi digital masa depan. 
            Isi formulir di bawah untuk melamar posisi yang tersedia.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="border border-white/[0.08] rounded-xl bg-surface/40 p-6 lg:p-8">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <User size={20} className="text-cyan" />
              Informasi Pribadi
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className={`w-full px-4 py-3 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                    errors.fullName ? 'border-red-500/50' : 'border-white/[0.08]'
                  }`}
                />
                {errors.fullName && <p className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="nama@email.com"
                  className={`w-full px-4 py-3 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                    errors.email ? 'border-red-500/50' : 'border-white/[0.08]'
                  }`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  No. Telepon <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className={`w-full px-4 py-3 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                    errors.phone ? 'border-red-500/50' : 'border-white/[0.08]'
                  }`}
                />
                {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Alamat
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Alamat lengkap (kota, provinsi)"
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="border border-white/[0.08] rounded-xl bg-surface/40 p-6 lg:p-8">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <Briefcase size={20} className="text-cyan" />
              Posisi yang Dilamar
            </h2>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Pilih Posisi <span className="text-red-400">*</span>
              </label>
              <select
                value={form.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border bg-surface-elevated text-text-primary text-sm transition-all focus:outline-none focus:border-cyan/50 ${
                  errors.position ? 'border-red-500/50' : 'border-white/[0.08]'
                }`}
              >
                <option value="">-- Pilih Posisi --</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              {errors.position && <p className="mt-1.5 text-xs text-red-400">{errors.position}</p>}
            </div>
          </div>

          {/* Education */}
          <div className="border border-white/[0.08] rounded-xl bg-surface/40 p-6 lg:p-8">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <GraduationCap size={20} className="text-cyan" />
              Pendidikan
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Jenjang Pendidikan <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.degree}
                  onChange={(e) => handleChange('degree', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border bg-surface-elevated text-text-primary text-sm transition-all focus:outline-none focus:border-cyan/50 ${
                    errors.degree ? 'border-red-500/50' : 'border-white/[0.08]'
                  }`}
                >
                  <option value="">-- Pilih Jenjang --</option>
                  <option value="D3">D3 (Diploma)</option>
                  <option value="S1">S1 (Sarjana)</option>
                  <option value="S2">S2 (Magister)</option>
                  <option value="S3">S3 (Doktor)</option>
                </select>
                {errors.degree && <p className="mt-1.5 text-xs text-red-400">{errors.degree}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Jurusan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.major}
                  onChange={(e) => handleChange('major', e.target.value)}
                  placeholder="Contoh: Teknik Informatika"
                  className={`w-full px-4 py-3 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                    errors.major ? 'border-red-500/50' : 'border-white/[0.08]'
                  }`}
                />
                {errors.major && <p className="mt-1.5 text-xs text-red-400">{errors.major}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Universitas <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.university}
                  onChange={(e) => handleChange('university', e.target.value)}
                  placeholder="Nama universitas"
                  className={`w-full px-4 py-3 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                    errors.university ? 'border-red-500/50' : 'border-white/[0.08]'
                  }`}
                />
                {errors.university && <p className="mt-1.5 text-xs text-red-400">{errors.university}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Tahun Lulus <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={form.graduationYear}
                  onChange={(e) => handleChange('graduationYear', e.target.value)}
                  placeholder="2023"
                  min="1990"
                  max="2030"
                  className={`w-full px-4 py-3 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                    errors.graduationYear ? 'border-red-500/50' : 'border-white/[0.08]'
                  }`}
                />
                {errors.graduationYear && <p className="mt-1.5 text-xs text-red-400">{errors.graduationYear}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  IPK (Opsional)
                </label>
                <input
                  type="text"
                  value={form.gpa}
                  onChange={(e) => handleChange('gpa', e.target.value)}
                  placeholder="Contoh: 3.75"
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50"
                />
              </div>
            </div>
          </div>

          {/* Experience & Skills */}
          <div className="border border-white/[0.08] rounded-xl bg-surface/40 p-6 lg:p-8">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <Code2 size={20} className="text-cyan" />
              Pengalaman & Skill
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Pengalaman Kerja (Opsional)
                </label>
                <textarea
                  value={form.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  placeholder="Deskripsikan pengalaman kerja Anda, proyek yang pernah dikerjakan, atau pencapaian relevan..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-3 uppercase tracking-wider">
                  Skill Teknis <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        form.skills.includes(skill)
                          ? 'bg-cyan/20 border border-cyan/50 text-cyan'
                          : 'bg-surface-elevated border border-white/[0.08] text-text-secondary hover:border-white/[0.15]'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {errors.skills && <p className="mt-2 text-xs text-red-400">{errors.skills}</p>}
              </div>
            </div>
          </div>

          {/* Links & Documents */}
          <div className="border border-white/[0.08] rounded-xl bg-surface/40 p-6 lg:p-8">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <LinkIcon size={20} className="text-cyan" />
              Portfolio & Dokumen
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  URL Portfolio
                </label>
                <input
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                  placeholder="https://portfolio.com"
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  GitHub
                </label>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => handleChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  URL CV/Resume
                </label>
                <input
                  type="url"
                  value={form.cvUrl}
                  onChange={(e) => handleChange('cvUrl', e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50"
                />
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="border border-white/[0.08] rounded-xl bg-surface/40 p-6 lg:p-8">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <FileText size={20} className="text-cyan" />
              Cover Letter
            </h2>
            <textarea
              value={form.coverLetter}
              onChange={(e) => handleChange('coverLetter', e.target.value)}
              placeholder="Ceritakan mengapa Anda tertarik bergabung dengan PT. Inti Mutiara Kreasindo dan apa yang bisa Anda kontribusikan..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <p className="text-xs text-text-secondary">
              <AlertCircle size={14} className="inline mr-1" />
              Data Anda akan disimpan secara aman dan hanya digunakan untuk proses rekrutmen.
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-cyan text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90 hover:scale-[1.02]"
            >
              <Check size={16} strokeWidth={3} />
              Kirim Lamaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
