import { useEffect, useState } from 'react';
import {
  Building2,
  Shield,
  Award,
  Users,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface LegalDocument {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'certificate' | 'organization' | 'photo';
  imageUrl: string;
  documentNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
}

// Demo data - akan diambil dari Supabase di production
const demoDocuments: LegalDocument[] = [
  {
    id: '1',
    title: 'Akta Pendirian Perusahaan',
    description: 'Akta Notaris Pendirian PT. Inti Mutiara Kreasindo',
    category: 'legal',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%230F0F12"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2300E5FF" font-size="20"%3EAkta Pendirian%3C/text%3E%3C/svg%3E',
    documentNumber: 'No. 45/2018/NOT-JKT',
    issuedDate: '2018-03-15',
  },
  {
    id: '2',
    title: 'Nomor Induk Berusaha (NIB)',
    description: 'NIB dari OSS (Online Single Submission)',
    category: 'legal',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%230F0F12"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2300E5FF" font-size="20"%3ENIB Certificate%3C/text%3E%3C/svg%3E',
    documentNumber: '1234567890123',
    issuedDate: '2020-06-10',
  },
  {
    id: '3',
    title: 'NPWP Perusahaan',
    description: 'Nomor Pokok Wajib Pajak PT. Inti Mutiara Kreasindo',
    category: 'legal',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%230F0F12"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2300E5FF" font-size="20"%3ENPWP%3C/text%3E%3C/svg%3E',
    documentNumber: '01.234.567.8-901.000',
    issuedDate: '2018-04-01',
  },
  {
    id: '4',
    title: 'ISO 27001:2022',
    description: 'Sertifikasi Information Security Management System',
    category: 'certificate',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%230F0F12"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2300E5FF" font-size="20"%3EISO 27001%3C/text%3E%3C/svg%3E',
    issuedDate: '2022-01-15',
    expiryDate: '2025-01-14',
  },
  {
    id: '5',
    title: 'SOC 2 Type II',
    description: 'Service Organization Control 2 Certification',
    category: 'certificate',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%230F0F12"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2300E5FF" font-size="20"%3ESOC 2 Type II%3C/text%3E%3C/svg%3E',
    issuedDate: '2023-03-20',
    expiryDate: '2024-03-19',
  },
  {
    id: '6',
    title: 'AWS Advanced Partner',
    description: 'AWS Advanced Technology Partner Certification',
    category: 'certificate',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%230F0F12"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2300E5FF" font-size="20"%3EAWS Partner%3C/text%3E%3C/svg%3E',
    issuedDate: '2023-06-01',
  },
];

const organizationStructure = [
  {
    level: 1,
    title: 'Direktur Utama',
    name: 'Ir. Hendra Wijaya, M.T.',
    avatar: 'HW',
  },
  {
    level: 2,
    title: 'Direktur Operasional',
    name: 'Drs. Ahmad Santoso, M.M.',
    avatar: 'AS',
  },
  {
    level: 2,
    title: 'Direktur Teknologi',
    name: 'Ir. Siti Rahayu, M.Kom.',
    avatar: 'SR',
  },
  {
    level: 2,
    title: 'Direktur Keuangan',
    name: 'Dra. Maya Putri, M.Ak.',
    avatar: 'MP',
  },
  {
    level: 3,
    title: 'Head of Engineering',
    name: 'Budi Hartono, S.T., M.T.',
    avatar: 'BH',
    parent: 'Direktur Teknologi',
  },
  {
    level: 3,
    title: 'Head of Product',
    name: 'Rina Kusuma, S.Kom.',
    avatar: 'RK',
    parent: 'Direktur Teknologi',
  },
  {
    level: 3,
    title: 'Head of Operations',
    name: 'Agus Prasetyo, S.T.',
    avatar: 'AP',
    parent: 'Direktur Operasional',
  },
  {
    level: 3,
    title: 'Head of HR & GA',
    name: 'Dewi Lestari, S.Psi.',
    avatar: 'DL',
    parent: 'Direktur Operasional',
  },
];

export default function LegalitasPage() {
  const [documents] = useState<LegalDocument[]>(demoDocuments);

  // Anti-screenshot protection
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable print screen and common shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screenshot tidak diizinkan untuk konten ini');
        return false;
      }
      // Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        alert('Print tidak diizinkan untuk konten ini');
        return false;
      }
      // Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (Dev Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    // Disable copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  const legalDocs = documents.filter((d) => d.category === 'legal');
  const certificates = documents.filter((d) => d.category === 'certificate');

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
                Tentang Perusahaan
              </span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary leading-tight mb-6">
              PT. Inti Mutiara Kreasindo
            </h1>
            <p className="text-lg lg:text-xl text-text-secondary leading-relaxed mb-8">
              Perusahaan teknologi informasi terkemuka yang berfokus pada pengembangan solusi digital enterprise, 
              infrastruktur cloud, dan integrasi AI untuk transformasi bisnis yang terukur dan aman.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-white/[0.06] bg-surface/40">
                <Building2 size={20} className="text-cyan flex-shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Berdiri Sejak</p>
                  <p className="text-sm font-semibold text-text-primary">2018</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-white/[0.06] bg-surface/40">
                <Users size={20} className="text-cyan flex-shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Karyawan</p>
                  <p className="text-sm font-semibold text-text-primary">200+ Orang</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-white/[0.06] bg-surface/40">
                <MapPin size={20} className="text-cyan flex-shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Kantor Pusat</p>
                  <p className="text-sm font-semibold text-text-primary">Jakarta</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-white/[0.06] bg-surface/40">
                <Globe size={20} className="text-cyan flex-shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Cabang</p>
                  <p className="text-sm font-semibold text-text-primary">3 Kota</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-16 lg:py-20 border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-text-primary mb-6">
                Informasi Perusahaan
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border border-white/[0.06] bg-surface/40">
                  <Building2 size={20} className="text-cyan flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                      Nama Perusahaan
                    </p>
                    <p className="text-sm font-semibold text-text-primary">
                      PT. Inti Mutiara Kreasindo
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-white/[0.06] bg-surface/40">
                  <FileText size={20} className="text-cyan flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                      NPWP
                    </p>
                    <p className="text-sm font-mono text-text-primary">
                      01.234.567.8-901.000
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-white/[0.06] bg-surface/40">
                  <Award size={20} className="text-cyan flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                      NIB (Nomor Induk Berusaha)
                    </p>
                    <p className="text-sm font-mono text-text-primary">
                      1234567890123
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-white/[0.06] bg-surface/40">
                  <MapPin size={20} className="text-cyan flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                      Alamat Kantor Pusat
                    </p>
                    <p className="text-sm text-text-primary">
                      Gedung Graha Mandiri Lt. 15<br />
                      Jl. Jend. Sudirman Kav. 32<br />
                      Jakarta Selatan 12150
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-white/[0.06] bg-surface/40">
                  <Phone size={20} className="text-cyan flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                      Kontak
                    </p>
                    <p className="text-sm text-text-primary">+62 21 5055 8800</p>
                    <p className="text-sm text-text-secondary">info@intimutiara.co.id</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-text-primary mb-6">
                Visi & Misi
              </h2>
              <div className="space-y-6">
                <div className="p-6 rounded-xl border border-cyan/20 bg-cyan/5">
                  <h3 className="font-display text-lg font-semibold text-cyan mb-3 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Visi
                  </h3>
                  <p className="text-sm text-text-primary leading-relaxed">
                    Menjadi perusahaan teknologi informasi terdepan di Asia Tenggara yang menyediakan 
                    solusi digital enterprise berkelas dunia dengan standar keamanan internasional, 
                    mendukung transformasi digital yang berkelanjutan dan inklusif.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-indigo/20 bg-indigo/5">
                  <h3 className="font-display text-lg font-semibold text-indigo mb-3 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Misi
                  </h3>
                  <ul className="space-y-2 text-sm text-text-primary leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo mt-2 flex-shrink-0"></span>
                      Mengembangkan solusi teknologi inovatif yang memenuhi kebutuhan spesifik industri enterprise
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo mt-2 flex-shrink-0"></span>
                      Menyediakan layanan dengan standar kualitas tertinggi dan keamanan data tingkat enterprise
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo mt-2 flex-shrink-0"></span>
                      Membangun ekosistem talenta digital unggul melalui pelatihan dan pengembangan berkelanjutan
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo mt-2 flex-shrink-0"></span>
                      Berkontribusi pada transformasi digital nasional dengan solusi yang terjangkau dan scalable
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="py-16 lg:py-20 border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-cyan/50"></span>
              <span className="text-xs font-medium text-cyan uppercase tracking-widest">
                Dokumen Legal
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Legalitas Perusahaan
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl">
              Seluruh dokumen legalitas perusahaan yang telah terverifikasi dan terdaftar resmi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalDocs.map((doc) => (
              <div
                key={doc.id}
                className="group relative border border-white/[0.06] rounded-xl bg-surface/40 overflow-hidden transition-all duration-300 hover:border-cyan/30"
              >
                {/* Image with watermark */}
                <div className="relative aspect-[4/3] bg-surface-elevated overflow-hidden select-none pointer-events-none">
                  <img
                    src={doc.imageUrl}
                    alt={doc.title}
                    className="w-full h-full object-cover opacity-60"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {/* Watermark overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="font-display text-2xl font-bold text-cyan/20 rotate-[-15deg] whitespace-nowrap">
                        PT. INTI MUTIARA KREASINDO
                      </div>
                      <div className="text-xs text-cyan/15 mt-2">
                        CONFIDENTIAL DOCUMENT
                      </div>
                    </div>
                  </div>
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,229,255,0.1) 10px, rgba(0,229,255,0.1) 11px)'
                  }}></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold text-text-primary mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-text-secondary mb-3">{doc.description}</p>
                  {doc.documentNumber && (
                    <div className="flex items-center gap-2 text-xs">
                      <FileText size={12} className="text-cyan" />
                      <span className="font-mono text-text-secondary">{doc.documentNumber}</span>
                    </div>
                  )}
                  {doc.issuedDate && (
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <Calendar size={12} className="text-text-secondary/50" />
                      <span className="text-text-secondary/70">
                        Terbit: {new Date(doc.issuedDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="py-16 lg:py-20 border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-indigo/50"></span>
              <span className="text-xs font-medium text-indigo uppercase tracking-widest">
                Sertifikasi
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Sertifikasi & Penghargaan
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl">
              Sertifikasi internasional yang dimiliki sebagai bukti komitmen terhadap kualitas dan keamanan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="group relative border border-white/[0.06] rounded-xl bg-surface/40 overflow-hidden transition-all duration-300 hover:border-indigo/30"
              >
                {/* Image with watermark */}
                <div className="relative aspect-[4/3] bg-surface-elevated overflow-hidden select-none pointer-events-none">
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover opacity-60"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="font-display text-2xl font-bold text-indigo/20 rotate-[-15deg] whitespace-nowrap">
                        PT. INTI MUTIARA KREASINDO
                      </div>
                      <div className="text-xs text-indigo/15 mt-2">
                        CERTIFIED DOCUMENT
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(99,102,241,0.1) 10px, rgba(99,102,241,0.1) 11px)'
                  }}></div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold text-text-primary mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-text-secondary mb-3">{cert.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Shield size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Aktif</span>
                  </div>
                  {cert.issuedDate && (
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <Calendar size={12} className="text-text-secondary/50" />
                      <span className="text-text-secondary/70">
                        {new Date(cert.issuedDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        {cert.expiryDate && (
                          <>
                            {' - '}
                            {new Date(cert.expiryDate).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Structure */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-cyan/50"></span>
              <span className="text-xs font-medium text-cyan uppercase tracking-widest">
                Struktur Organisasi
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Struktur Organisasi Perusahaan
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl">
              Tim kepemimpinan yang berpengalaman dalam industri teknologi informasi enterprise.
            </p>
          </div>

          {/* Organization Chart */}
          <div className="space-y-8">
            {/* Level 1: Direktur Utama */}
            <div className="flex justify-center">
              {organizationStructure
                .filter((p) => p.level === 1)
                .map((person) => (
                  <div
                    key={person.title}
                    className="border-2 border-cyan/40 rounded-xl bg-cyan/5 p-6 text-center min-w-[280px]"
                  >
                    <div className="w-16 h-16 rounded-full bg-cyan/20 border-2 border-cyan/40 flex items-center justify-center mx-auto mb-3">
                      <span className="font-display text-lg font-bold text-cyan">
                        {person.avatar}
                      </span>
                    </div>
                    <h3 className="font-display text-sm font-semibold text-cyan mb-1">
                      {person.title}
                    </h3>
                    <p className="text-xs text-text-primary">{person.name}</p>
                  </div>
                ))}
            </div>

            {/* Connector Line */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-white/[0.1]"></div>
            </div>

            {/* Level 2: Direksi */}
            <div className="grid md:grid-cols-3 gap-4">
              {organizationStructure
                .filter((p) => p.level === 2)
                .map((person) => (
                  <div
                    key={person.title}
                    className="border border-indigo/30 rounded-xl bg-indigo/5 p-5 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo/20 border border-indigo/40 flex items-center justify-center mx-auto mb-3">
                      <span className="font-display text-sm font-bold text-indigo">
                        {person.avatar}
                      </span>
                    </div>
                    <h3 className="font-display text-xs font-semibold text-indigo mb-1">
                      {person.title}
                    </h3>
                    <p className="text-[11px] text-text-primary">{person.name}</p>
                  </div>
                ))}
            </div>

            {/* Connector Line */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-white/[0.1]"></div>
            </div>

            {/* Level 3: Head of Departments */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {organizationStructure
                .filter((p) => p.level === 3)
                .map((person) => (
                  <div
                    key={person.title}
                    className="border border-white/[0.08] rounded-xl bg-surface/40 p-4 text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-elevated border border-white/[0.1] flex items-center justify-center mx-auto mb-2">
                      <span className="font-display text-xs font-bold text-text-secondary">
                        {person.avatar}
                      </span>
                    </div>
                    <h3 className="font-display text-[11px] font-semibold text-text-primary mb-1">
                      {person.title}
                    </h3>
                    <p className="text-[10px] text-text-secondary">{person.name}</p>
                    {person.parent && (
                      <p className="text-[9px] text-text-secondary/50 mt-1">
                        → {person.parent}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Notice */}
      <div className="border-t border-white/[0.06] py-6 bg-surface/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-xs text-text-secondary/60">
            <Shield size={14} />
            <span>
              Konten ini dilindungi. Screenshot, download, dan reproduksi tidak diizinkan tanpa izin tertulis.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
