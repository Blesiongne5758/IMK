import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  X,
  Check,
  Upload,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { validateFile, sanitizeInput } from '../lib/security';

interface LegalDocument {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'certificate' | 'organization' | 'photo';
  imageUrl: string;
  documentNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

const STORAGE_KEY = 'imk_legal_documents';
const UPLOADS_KEY = 'imk_legal_uploads';

const initialDocuments: LegalDocument[] = [
  {
    id: '1',
    title: 'Akta Pendirian Perusahaan',
    description: 'Akta Notaris Pendirian PT. Inti Mutiara Kreasindo',
    category: 'legal',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%230F0F12"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2300E5FF" font-size="20"%3EAkta Pendirian%3C/text%3E%3C/svg%3E',
    documentNumber: 'No. 45/2018/NOT-JKT',
    issuedDate: '2018-03-15',
    isPublic: true,
    createdBy: 'admin@imk.co.id',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Nomor Induk Berusaha (NIB)',
    description: 'NIB dari OSS (Online Single Submission)',
    category: 'legal',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%230F0F12"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2300E5FF" font-size="20"%3ENIB%3C/text%3E%3C/svg%3E',
    documentNumber: '1234567890123',
    issuedDate: '2020-06-10',
    isPublic: true,
    createdBy: 'admin@imk.co.id',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export default function LegalitasAdmin() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'legal' as LegalDocument['category'],
    imageUrl: '',
    documentNumber: '',
    issuedDate: '',
    expiryDate: '',
    isPublic: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setDocuments(JSON.parse(stored));
    } else {
      setDocuments(initialDocuments);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDocuments));
    }
  }, []);

  // Handle file upload with enhanced security validation
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Enhanced file validation using security utility
      const allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
      const validation = await validateFile(file, allowedTypes, 5);
      
      if (!validation.valid) {
        alert(validation.error || 'File tidak valid');
        setUploading(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Convert to base64 for localStorage storage
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, imageUrl: base64 });
        setUploading(false);
      };
      reader.onerror = () => {
        alert('Gagal membaca file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Gagal mengupload file');
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.imageUrl) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      ...formData,
      title: sanitizeInput(formData.title.trim()),
      description: sanitizeInput(formData.description.trim()),
      documentNumber: formData.documentNumber ? sanitizeInput(formData.documentNumber.trim()) : undefined,
    };

    if (editingDoc) {
      const updated = documents.map((doc) =>
        doc.id === editingDoc.id
          ? { ...doc, ...sanitizedData }
          : doc
      );
      setDocuments(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } else {
      const newDoc: LegalDocument = {
        id: `doc_${Date.now()}`,
        ...sanitizedData,
        createdBy: 'admin@imk.co.id',
        createdAt: new Date().toISOString(),
      };
      const updated = [...documents, newDoc];
      setDocuments(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    resetForm();
  };

  const handleEdit = (doc: LegalDocument) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      description: doc.description,
      category: doc.category,
      imageUrl: doc.imageUrl,
      documentNumber: doc.documentNumber || '',
      issuedDate: doc.issuedDate || '',
      expiryDate: doc.expiryDate || '',
      isPublic: doc.isPublic,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      const updated = documents.filter((doc) => doc.id !== id);
      setDocuments(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingDoc(null);
    setFormData({
      title: '',
      description: '',
      category: 'legal',
      imageUrl: '',
      documentNumber: '',
      issuedDate: '',
      expiryDate: '',
      isPublic: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const categoryLabels = {
    legal: 'Dokumen Legal',
    certificate: 'Sertifikasi',
    organization: 'Struktur Organisasi',
    photo: 'Foto Perusahaan',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-text-primary">
            Pengaturan Legalitas
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Kelola dokumen legalitas dan informasi perusahaan
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90"
        >
          <Plus size={16} strokeWidth={2.5} />
          Tambah Dokumen
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-void/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-white/[0.08] rounded-xl bg-surface">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06] bg-surface">
              <h3 className="font-display text-base sm:text-lg font-semibold text-text-primary">
                {editingDoc ? 'Edit Dokumen' : 'Tambah Dokumen Baru'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Judul Dokumen <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Akta Pendirian Perusahaan"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Keterangan <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat tentang dokumen"
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as LegalDocument['category'] })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm focus:outline-none focus:border-cyan/50"
                >
                  <option value="legal">Dokumen Legal</option>
                  <option value="certificate">Sertifikasi</option>
                  <option value="organization">Struktur Organisasi</option>
                  <option value="photo">Foto Perusahaan</option>
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Upload Gambar/Dokumen <span className="text-red-400">*</span>
                </label>
                <div className="border-2 border-dashed border-white/[0.1] rounded-lg p-4 sm:p-6 text-center hover:border-cyan/30 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {uploading ? (
                      <Loader2 size={32} className="text-cyan animate-spin" />
                    ) : formData.imageUrl ? (
                      <div className="relative w-full max-w-xs">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-32 sm:h-40 object-contain rounded-lg border border-white/[0.08]"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData({ ...formData, imageUrl: '' });
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="text-text-secondary/50" />
                        <div>
                          <p className="text-sm text-text-primary font-medium">
                            Klik untuk upload gambar
                          </p>
                          <p className="text-xs text-text-secondary/60 mt-1">
                            JPG, PNG, atau WebP (Maks. 5MB)
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Document Number */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Nomor Dokumen
                </label>
                <input
                  type="text"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                  placeholder="Contoh: No. 45/2018/NOT-JKT"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    value={formData.issuedDate}
                    onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm focus:outline-none focus:border-cyan/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Tanggal Kadaluarsa
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm focus:outline-none focus:border-cyan/50"
                  />
                </div>
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-white/[0.08] bg-surface-elevated/50">
                <div>
                  <p className="text-sm font-medium text-text-primary">Tampilkan di Halaman Publik</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Dokumen akan muncul di halaman Legalitas publik
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                    formData.isPublic ? 'bg-cyan' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-white/[0.1] text-sm font-medium text-text-secondary hover:text-text-primary hover:border-white/[0.2] transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={uploading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90 disabled:opacity-50"
                >
                  <Check size={14} strokeWidth={3} />
                  {editingDoc ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="border border-white/[0.08] rounded-xl bg-surface/40 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06]">
          <h3 className="font-display text-sm sm:text-base font-semibold text-text-primary">
            Daftar Dokumen ({documents.length})
          </h3>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {documents.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <FileText size={32} className="text-text-secondary/40 mx-auto mb-3" />
              <p className="text-sm text-text-secondary">Belum ada dokumen</p>
              <p className="text-xs text-text-secondary/60 mt-1">
                Klik "Tambah Dokumen" untuk menambahkan dokumen baru
              </p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-surface-elevated/30 transition-colors"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-surface-elevated overflow-hidden flex-shrink-0">
                    <img
                      src={doc.imageUrl}
                      alt={doc.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs sm:text-sm font-medium text-text-primary truncate">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {doc.isPublic ? (
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-400/10 border border-emerald-400/30 text-[9px] sm:text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                            <Eye size={9} />
                            <span className="hidden sm:inline">Publik</span>
                          </span>
                        ) : (
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-medium text-text-secondary flex items-center gap-1">
                            <EyeOff size={9} />
                            <span className="hidden sm:inline">Private</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] sm:text-xs text-text-secondary mb-2 line-clamp-2">{doc.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-text-secondary/70">
                      <span className="px-1.5 sm:px-2 py-0.5 rounded bg-surface-elevated/50">
                        {categoryLabels[doc.category]}
                      </span>
                      {doc.documentNumber && (
                        <span className="font-mono hidden sm:inline">{doc.documentNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="p-1.5 sm:p-2 rounded-lg border border-white/[0.08] text-text-secondary hover:text-cyan hover:border-cyan/30 transition-all"
                      title="Edit"
                    >
                      <Edit2 size={12} className="sm:hidden" />
                      <Edit2 size={14} className="hidden sm:block" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 sm:p-2 rounded-lg border border-white/[0.08] text-text-secondary hover:text-red-400 hover:border-red-400/30 transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={12} className="sm:hidden" />
                      <Trash2 size={14} className="hidden sm:block" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
