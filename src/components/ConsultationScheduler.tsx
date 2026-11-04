import { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Building2,
  Phone,
  Mail,
  Briefcase,
  X,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';

interface Consultation {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  clientName: string;
  position: string;
  companyName: string;
  contactNumber: string;
  email: string;
  createdAt: string;
}

interface FormState {
  date: string;
  time: string;
  clientName: string;
  position: string;
  companyName: string;
  contactNumber: string;
  email: string;
}

const STORAGE_KEY = 'imk_consultations';
const MIN_GAP_MINUTES = 150; // 2.5 hours

const initialForm: FormState = {
  date: '',
  time: '',
  clientName: '',
  position: '',
  companyName: '',
  contactNumber: '',
  email: '',
};

// Utility: parse "HH:mm" to minutes since midnight
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Check if new time conflicts with existing appointments on the same date
function hasTimeConflict(
  consultations: Consultation[],
  newDate: string,
  newTime: string,
  excludeId?: string
): { conflict: boolean; conflicting?: Consultation } {
  const newMinutes = timeToMinutes(newTime);
  const sameDay = consultations.filter(
    (c) => c.date === newDate && c.id !== excludeId
  );
  for (const c of sameDay) {
    const existingMinutes = timeToMinutes(c.time);
    const diff = Math.abs(newMinutes - existingMinutes);
    if (diff < MIN_GAP_MINUTES) {
      return { conflict: true, conflicting: c };
    }
  }
  return { conflict: false };
}

// Format date to readable Indonesian
function formatDateIndo(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

interface ConsultationSchedulerProps {
  isModalOpen: boolean;
  onModalClose: () => void;
}

export default function ConsultationScheduler({ isModalOpen: externalOpen, onModalClose }: ConsultationSchedulerProps) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [conflictMessage, setConflictMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Calendar navigation
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setConsultations(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
    } catch {
      // ignore
    }
  }, [consultations]);

  // Sync external open state
  useEffect(() => {
    if (externalOpen) {
      setForm({ ...initialForm, date: selectedDate || todayStr });
      setErrors({});
      setConflictMessage('');
      setIsModalOpen(true);
    }
  }, [externalOpen]);

  // Map date -> consultations
  const consultationsByDate = useMemo(() => {
    const map: Record<string, Consultation[]> = {};
    for (const c of consultations) {
      if (!map[c.date]) map[c.date] = [];
      map[c.date].push(c);
    }
    // Sort each day by time
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    }
    return map;
  }, [consultations]);

  // Selected date list
  const selectedDateList = useMemo(() => {
    if (!selectedDate) return [];
    return consultationsByDate[selectedDate] || [];
  }, [selectedDate, consultationsByDate]);

  // Calendar data
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const cells: Array<{ day: number; dateStr: string; isCurrentMonth: boolean } | null> = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, dateStr, isCurrentMonth: true });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function openModal() {
    setForm({ ...initialForm, date: selectedDate || todayStr });
    setErrors({});
    setConflictMessage('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setConflictMessage('');
    onModalClose();
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.date) newErrors.date = 'Tanggal wajib diisi';
    if (!form.time) newErrors.time = 'Waktu wajib diisi';
    if (!form.clientName.trim()) newErrors.clientName = 'Nama klien wajib diisi';
    if (!form.position.trim()) newErrors.position = 'Jabatan wajib diisi';
    if (!form.companyName.trim()) newErrors.companyName = 'Nama perusahaan wajib diisi';
    if (!form.contactNumber.trim()) newErrors.contactNumber = 'No. kontak wajib diisi';
    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Check time conflict
    if (form.date && form.time) {
      const { conflict, conflicting } = hasTimeConflict(consultations, form.date, form.time);
      if (conflict && conflicting) {
        const diff = Math.abs(timeToMinutes(form.time) - timeToMinutes(conflicting.time));
        const diffHours = Math.floor(diff / 60);
        const diffMins = diff % 60;
        setConflictMessage(
          `Waktu ${form.time} bentrok dengan janji temu ${conflicting.companyName} (${conflicting.time}). ` +
          `Silakan pilih waktu yang berbeda minimal 2 jam 30 menit dari waktu yang sudah terdaftar.` +
          (diff > 0 ? ` Selisih saat ini: ${diffHours} jam ${diffMins} menit.` : '')
        );
        newErrors.time = 'Waktu bentrok';
      } else {
        setConflictMessage('');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const newConsultation: Consultation = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      date: form.date,
      time: form.time,
      clientName: form.clientName.trim(),
      position: form.position.trim(),
      companyName: form.companyName.trim(),
      contactNumber: form.contactNumber.trim(),
      email: form.email.trim(),
      createdAt: new Date().toISOString(),
    };

    setConsultations((prev) => [...prev, newConsultation].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    }));
    setSelectedDate(form.date);
    setSuccessMessage(`Konsultasi untuk ${newConsultation.companyName} berhasil dijadwalkan pada ${formatDateIndo(newConsultation.date)} pukul ${newConsultation.time} WIB.`);
    closeModal();
    setTimeout(() => setSuccessMessage(''), 6000);
  }

  function handleDelete(id: string) {
    setConsultations((prev) => prev.filter((c) => c.id !== id));
  }

  function handleFieldChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if ((field === 'date' || field === 'time') && form.date && form.time) {
      const testDate = field === 'date' ? value : form.date;
      const testTime = field === 'time' ? value : form.time;
      const { conflict, conflicting } = hasTimeConflict(consultations, testDate, testTime);
      if (conflict && conflicting) {
        const diff = Math.abs(timeToMinutes(testTime) - timeToMinutes(conflicting.time));
        const diffHours = Math.floor(diff / 60);
        const diffMins = diff % 60;
        setConflictMessage(
          `Waktu ${testTime} bentrok dengan janji temu ${conflicting.companyName} (${conflicting.time}). ` +
          `Silakan pilih waktu yang berbeda minimal 2 jam 30 menit.` +
          (diff > 0 ? ` Selisih saat ini: ${diffHours} jam ${diffMins} menit.` : '')
        );
      } else {
        setConflictMessage('');
      }
    }
  }

  // Minimum time is today (can't book in the past)
  const minDate = todayStr;

  return (
    <section id="scheduler" className="relative py-24 lg:py-32 border-t border-white/[0.04]" aria-label="Jadwalkan konsultasi">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-cyan/50"></span>
              <span className="text-xs font-medium text-cyan uppercase tracking-widest">Konsultasi</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-text-primary leading-tight mb-4">
              Kalender Janji Temu Konsultasi
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Kelola jadwal konsultasi arsitektur. Setiap slot memiliki jeda minimal 2 jam 30 menit untuk memastikan kualitas sesi.
            </p>
          </div>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2.5 self-start lg:self-auto rounded-lg bg-cyan px-5 py-3 text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90 hover:scale-[1.02]"
          >
            <Plus size={16} strokeWidth={2.5} />
            Jadwalkan Konsultasi
          </button>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-6 border border-emerald-500/30 bg-emerald-500/5 rounded-lg px-5 py-4 flex items-start gap-3">
            <Check size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-100">{successMessage}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-7 border border-white/[0.08] rounded-xl bg-surface/40 overflow-hidden">
            {/* Calendar header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <button
                onClick={prevMonth}
                className="p-2 rounded-md border border-white/[0.06] text-text-secondary hover:text-text-primary hover:border-white/[0.15] transition-all"
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {monthNames[viewMonth]} {viewYear}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded-md border border-white/[0.06] text-text-secondary hover:text-text-primary hover:border-white/[0.15] transition-all"
                aria-label="Bulan berikutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 border-b border-white/[0.06]">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                <div key={d} className="px-2 py-2.5 text-center text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 p-3 gap-1.5">
              {calendarDays.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="aspect-square"></div>;
                }
                const hasAppt = !!consultationsByDate[cell.dateStr];
                const apptCount = consultationsByDate[cell.dateStr]?.length || 0;
                const isSelected = selectedDate === cell.dateStr;
                const isToday = cell.dateStr === todayStr;
                const isPast = cell.dateStr < todayStr;

                return (
                  <button
                    key={cell.dateStr}
                    onClick={() => setSelectedDate(cell.dateStr)}
                    disabled={isPast}
                    className={`
                      relative aspect-square rounded-lg border transition-all duration-200
                      flex flex-col items-center justify-center gap-0.5
                      ${isPast ? 'opacity-30 cursor-not-allowed border-white/[0.03]' : 'cursor-pointer'}
                      ${isSelected
                        ? 'border-cyan/60 bg-cyan/10'
                        : isToday
                          ? 'border-cyan/30 bg-cyan/5'
                          : 'border-white/[0.06] hover:border-white/[0.15] hover:bg-surface-elevated/50'
                      }
                    `}
                    aria-label={`${cell.day} ${monthNames[viewMonth]} ${viewYear}${hasAppt ? `, ${apptCount} janji temu` : ''}`}
                  >
                    <span className={`text-sm font-medium ${isSelected ? 'text-cyan' : isToday ? 'text-cyan' : 'text-text-primary'}`}>
                      {cell.day}
                    </span>
                    {hasAppt && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: Math.min(apptCount, 3) }).map((_, i) => (
                          <span key={i} className="w-1 h-1 rounded-full bg-cyan"></span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-text-secondary">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan"></span>
                  Ada janji temu
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded border border-cyan/30 bg-cyan/5"></span>
                  Hari ini
                </span>
              </div>
              <span className="font-mono">
                {consultations.length} total janji temu
              </span>
            </div>
          </div>

          {/* Right panel: selected date list */}
          <div className="lg:col-span-5 border border-white/[0.08] rounded-xl bg-surface/40 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-text-secondary uppercase tracking-widest block">Jadwal</span>
                <h3 className="font-display text-sm font-semibold text-text-primary mt-0.5">
                  {selectedDate ? formatDateIndo(selectedDate) : 'Pilih tanggal di kalender'}
                </h3>
              </div>
              {selectedDate && (
                <button
                  onClick={openModal}
                  className="text-xs text-cyan hover:text-cyan/80 transition-colors flex items-center gap-1"
                >
                  <Plus size={12} /> Tambah
                </button>
              )}
            </div>

            <div className="p-5 min-h-[300px]">
              {!selectedDate ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <CalendarIcon size={32} className="text-text-secondary/40 mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-text-secondary">Klik tanggal di kalender untuk melihat daftar janji temu</p>
                </div>
              ) : selectedDateList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Clock size={32} className="text-text-secondary/40 mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-text-secondary mb-1">Belum ada janji temu</p>
                  <p className="text-xs text-text-secondary/60">Klik "Tambah" untuk menjadwalkan konsultasi</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateList.map((c) => (
                    <div
                      key={c.id}
                      className="group border border-white/[0.06] rounded-lg p-4 bg-surface-elevated/30 transition-all duration-300 hover:border-cyan/30"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan/10 border border-cyan/20">
                            <Clock size={12} className="text-cyan" />
                            <span className="text-xs font-mono font-semibold text-cyan">{c.time} WIB</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-md text-text-secondary/50 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Hapus janji temu"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h4 className="font-display text-sm font-semibold text-text-primary mb-1">
                        {c.companyName}
                      </h4>
                      <div className="space-y-1 text-xs text-text-secondary">
                        <div className="flex items-center gap-2">
                          <User size={11} className="text-text-secondary/60" />
                          <span>{c.clientName}</span>
                          <span className="text-text-secondary/40">•</span>
                          <span className="text-text-secondary/70">{c.position}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={11} className="text-text-secondary/60" />
                          <span className="font-mono">{c.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={11} className="text-text-secondary/60" />
                          <span className="font-mono">{c.contactNumber}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Form jadwal konsultasi"
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/[0.08] rounded-xl bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-surface">
              <div>
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  Jadwalkan Konsultasi Arsitektur
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Sesi 60 menit dengan senior engineer kami
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all"
                aria-label="Tutup form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Date & Time */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    <CalendarIcon size={12} /> Tanggal
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    min={minDate}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface-elevated text-text-primary text-sm transition-all focus:outline-none focus:border-cyan/50 ${
                      errors.date ? 'border-red-500/50' : 'border-white/[0.08] focus:border-cyan/50'
                    }`}
                  />
                  {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    <Clock size={12} /> Waktu (WIB)
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => handleFieldChange('time', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface-elevated text-text-primary text-sm transition-all focus:outline-none focus:border-cyan/50 ${
                      errors.time ? 'border-red-500/50' : 'border-white/[0.08]'
                    }`}
                  />
                  {errors.time && <p className="mt-1 text-xs text-red-400">{errors.time}</p>}
                </div>
              </div>

              {/* Conflict message */}
              {conflictMessage && (
                <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-100 leading-relaxed">{conflictMessage}</p>
                </div>
              )}

              {/* Client info */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  <User size={12} /> Nama Klien
                </label>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) => handleFieldChange('clientName', e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                    errors.clientName ? 'border-red-500/50' : 'border-white/[0.08]'
                  }`}
                />
                {errors.clientName && <p className="mt-1 text-xs text-red-400">{errors.clientName}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    <Briefcase size={12} /> Jabatan
                  </label>
                  <input
                    type="text"
                    value={form.position}
                    onChange={(e) => handleFieldChange('position', e.target.value)}
                    placeholder="Contoh: CTO"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                      errors.position ? 'border-red-500/50' : 'border-white/[0.08]'
                    }`}
                  />
                  {errors.position && <p className="mt-1 text-xs text-red-400">{errors.position}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    <Building2 size={12} /> Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => handleFieldChange('companyName', e.target.value)}
                    placeholder="Contoh: PT Maju Bersama"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                      errors.companyName ? 'border-red-500/50' : 'border-white/[0.08]'
                    }`}
                  />
                  {errors.companyName && <p className="mt-1 text-xs text-red-400">{errors.companyName}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    <Phone size={12} /> No. Kontak
                  </label>
                  <input
                    type="tel"
                    value={form.contactNumber}
                    onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
                    placeholder="+62 812 3456 7890"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                      errors.contactNumber ? 'border-red-500/50' : 'border-white/[0.08]'
                    }`}
                  />
                  {errors.contactNumber && <p className="mt-1 text-xs text-red-400">{errors.contactNumber}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    <Mail size={12} /> Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="nama@perusahaan.com"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50 ${
                      errors.email ? 'border-red-500/50' : 'border-white/[0.08]'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
              </div>

              {/* Info box */}
              <div className="border border-white/[0.06] rounded-lg p-3.5 bg-surface-elevated/30">
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="text-cyan font-medium">Catatan:</span> Setiap slot konsultasi memiliki jeda minimal <span className="text-text-primary font-medium">2 jam 30 menit</span> dari janji temu lain untuk memastikan kualitas sesi dan kesiapan tim engineering.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-lg border border-white/[0.1] text-sm font-medium text-text-secondary hover:text-text-primary hover:border-white/[0.2] transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90 hover:scale-[1.02]"
                >
                  <Check size={14} strokeWidth={3} />
                  Submit Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
