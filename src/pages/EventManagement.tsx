import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  X,
  Check,
  Eye,
  EyeOff,
  QrCode,
  UserCheck,
  Download,
  Copy,
  ScanLine,
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  category: 'Conference' | 'Workshop' | 'Webinar' | 'Hackathon' | 'Meetup' | 'Training';
  speaker: string;
  image: string;
  isPublished: boolean;
  requireRegistration: boolean;
  createdBy: string;
  createdAt: string;
}

interface Registration {
  id: string;
  eventId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
  qrCode: string;
}

interface Committee {
  id: string;
  eventId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  role: 'scanner' | 'organizer';
}

const STORAGE_KEY = 'imk_events';
const REGISTRATION_KEY = 'imk_event_registrations';
const COMMITTEE_KEY = 'imk_event_committees';

// Demo employees (registered in E-Office)
const DEMO_EMPLOYEES = [
  { id: 'emp1', name: 'Ahmad Wijaya', email: 'admin@imk.co.id', department: 'IT Management' },
  { id: 'emp2', name: 'Siti Rahayu', email: 'manager@imk.co.id', department: 'Operations' },
  { id: 'emp3', name: 'Budi Santoso', email: 'staff@imk.co.id', department: 'Engineering' },
  { id: 'emp4', name: 'Dewi Lestari', email: 'dewi@imk.co.id', department: 'HR' },
  { id: 'emp5', name: 'Rina Kusuma', email: 'rina@imk.co.id', department: 'Product' },
];

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Summit 2024: AI & Cloud Innovation',
    description: 'Konferensi teknologi tahunan membahas tren terbaru dalam AI, cloud computing, dan transformasi digital enterprise.',
    date: '2024-03-15',
    time: '09:00 - 17:00 WIB',
    location: 'Jakarta Convention Center',
    capacity: 500,
    category: 'Conference',
    speaker: 'Dr. Ahmad Wijaya, CTO',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" fill="%230F0F12"%3E%3Crect width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2300E5FF" font-size="24"%3ETech Summit 2024%3C/text%3E%3C/svg%3E',
    isPublished: true,
    requireRegistration: true,
    createdBy: 'admin@imk.co.id',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showCommitteeModal, setShowCommitteeModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
    category: 'Conference' as Event['category'],
    speaker: '',
    image: '',
    isPublished: true,
    requireRegistration: true,
  });

  const [committeeForm, setCommitteeForm] = useState({
    employeeId: '',
    role: 'scanner' as Committee['role'],
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      setEvents(initialEvents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
    }

    const storedRegs = localStorage.getItem(REGISTRATION_KEY);
    if (storedRegs) {
      setRegistrations(JSON.parse(storedRegs));
    }

    const storedCommittees = localStorage.getItem(COMMITTEE_KEY);
    if (storedCommittees) {
      setCommittees(JSON.parse(storedCommittees));
    }
  }, []);

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    if (editingEvent) {
      const updated = events.map((event) =>
        event.id === editingEvent.id ? { ...event, ...formData } : event
      );
      setEvents(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } else {
      const newEvent: Event = {
        id: `event_${Date.now()}`,
        ...formData,
        createdBy: 'admin@imk.co.id',
        createdAt: new Date().toISOString(),
      };
      const updated = [...events, newEvent];
      setEvents(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    resetForm();
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      capacity: event.capacity,
      category: event.category,
      speaker: event.speaker,
      image: event.image,
      isPublished: event.isPublished,
      requireRegistration: event.requireRegistration,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      const updated = events.filter((event) => event.id !== id);
      setEvents(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: 0,
      category: 'Conference',
      speaker: '',
      image: '',
      isPublished: true,
      requireRegistration: true,
    });
  };

  const handleRegister = (eventId: string, employeeId: string) => {
    const employee = DEMO_EMPLOYEES.find((e) => e.id === employeeId);
    if (!employee) return;

    // Check if already registered
    const existing = registrations.find(
      (r) => r.eventId === eventId && r.employeeId === employeeId
    );
    if (existing) {
      alert('Karyawan sudah terdaftar untuk event ini');
      return;
    }

    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    // Check capacity
    const eventRegistrations = registrations.filter((r) => r.eventId === eventId);
    if (eventRegistrations.length >= event.capacity) {
      alert('Kapasitas event sudah penuh');
      return;
    }

    const newReg: Registration = {
      id: `reg_${Date.now()}`,
      eventId,
      employeeId,
      employeeName: employee.name,
      employeeEmail: employee.email,
      department: employee.department,
      registeredAt: new Date().toISOString(),
      checkedIn: false,
      qrCode: `TICKET-${eventId}-${employeeId}-${Date.now()}`,
    };

    const updated = [...registrations, newReg];
    setRegistrations(updated);
    localStorage.setItem(REGISTRATION_KEY, JSON.stringify(updated));
  };

  const handleAddCommittee = (eventId: string) => {
    const employee = DEMO_EMPLOYEES.find((e) => e.id === committeeForm.employeeId);
    if (!employee) return;

    // Check if already committee
    const existing = committees.find(
      (c) => c.eventId === eventId && c.employeeId === committeeForm.employeeId
    );
    if (existing) {
      alert('Karyawan sudah menjadi panitia untuk event ini');
      return;
    }

    const newCommittee: Committee = {
      id: `committee_${Date.now()}`,
      eventId,
      employeeId: committeeForm.employeeId,
      employeeName: employee.name,
      employeeEmail: employee.email,
      role: committeeForm.role,
    };

    const updated = [...committees, newCommittee];
    setCommittees(updated);
    localStorage.setItem(COMMITTEE_KEY, JSON.stringify(updated));
    setCommitteeForm({ employeeId: '', role: 'scanner' });
  };

  const handleRemoveCommittee = (committeeId: string) => {
    const updated = committees.filter((c) => c.id !== committeeId);
    setCommittees(updated);
    localStorage.setItem(COMMITTEE_KEY, JSON.stringify(updated));
  };

  const getEventRegistrations = (eventId: string) => {
    return registrations.filter((r) => r.eventId === eventId);
  };

  const getEventCommittees = (eventId: string) => {
    return committees.filter((c) => c.eventId === eventId);
  };

  const categories: Event['category'][] = ['Conference', 'Workshop', 'Webinar', 'Hackathon', 'Meetup', 'Training'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-text-primary">
            Manajemen Event
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Kelola event, pendaftaran, dan panitia
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <a
            href="/eoffice/qr-scanner"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-cyan/30 bg-cyan/5 text-sm font-medium text-cyan hover:bg-cyan/10 transition-all"
          >
            <ScanLine size={16} />
            QR Scanner
          </a>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90"
          >
            <Plus size={16} strokeWidth={2.5} />
            Buat Event
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-void/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-white/[0.08] rounded-xl bg-surface">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06] bg-surface">
              <h3 className="font-display text-base sm:text-lg font-semibold text-text-primary">
                {editingEvent ? 'Edit Event' : 'Buat Event Baru'}
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
                  Judul Event <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Tech Summit 2024"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Deskripsi <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi lengkap tentang event"
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50 resize-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Tanggal <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm focus:outline-none focus:border-cyan/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Waktu <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="09:00 - 17:00 WIB"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                  />
                </div>
              </div>

              {/* Location & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Lokasi <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Jakarta Convention Center"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Kapasitas
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                  />
                </div>
              </div>

              {/* Category & Speaker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Event['category'] })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm focus:outline-none focus:border-cyan/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Speaker
                  </label>
                  <input
                    type="text"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    placeholder="Nama speaker"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  URL Gambar
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-white/[0.08] bg-surface-elevated/50">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Publikasikan Event</p>
                    <p className="text-xs text-text-secondary mt-0.5">Event akan muncul di halaman publik</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      formData.isPublished ? 'bg-cyan' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isPublished ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-white/[0.08] bg-surface-elevated/50">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Wajib Pendaftaran</p>
                    <p className="text-xs text-text-secondary mt-0.5">Hanya karyawan terdaftar yang bisa ikut</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, requireRegistration: !formData.requireRegistration })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      formData.requireRegistration ? 'bg-cyan' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.requireRegistration ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90"
                >
                  <Check size={14} strokeWidth={3} />
                  {editingEvent ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-void/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-white/[0.08] rounded-xl bg-surface">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06] bg-surface">
              <div>
                <h3 className="font-display text-base sm:text-lg font-semibold text-text-primary">
                  Pendaftaran: {selectedEvent.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                  {getEventRegistrations(selectedEvent.id).length} / {selectedEvent.capacity} peserta
                </p>
              </div>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {/* Register new employee */}
              <div className="p-4 rounded-lg border border-white/[0.08] bg-surface-elevated/30">
                <h4 className="text-sm font-medium text-text-primary mb-3">Daftarkan Karyawan</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    className="flex-1 px-3 py-2 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm focus:outline-none focus:border-cyan/50"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleRegister(selectedEvent.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Pilih karyawan...</option>
                    {DEMO_EMPLOYEES.filter((emp) => {
                      const regs = getEventRegistrations(selectedEvent.id);
                      return !regs.find((r) => r.employeeId === emp.id);
                    }).map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Registrations list */}
              <div className="space-y-2">
                {getEventRegistrations(selectedEvent.id).length === 0 ? (
                  <p className="text-sm text-text-secondary text-center py-8">
                    Belum ada pendaftaran
                  </p>
                ) : (
                  getEventRegistrations(selectedEvent.id).map((reg) => (
                    <div
                      key={reg.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-white/[0.08] bg-surface-elevated/30"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{reg.employeeName}</p>
                        <p className="text-xs text-text-secondary">{reg.department}</p>
                        <p className="text-xs text-text-secondary/60 font-mono truncate">{reg.employeeEmail}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          reg.checkedIn
                            ? 'bg-emerald-400/10 border border-emerald-400/30 text-emerald-400'
                            : 'bg-white/5 border border-white/10 text-text-secondary'
                        }`}>
                          {reg.checkedIn ? '✓ Checked In' : 'Belum Hadir'}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedEvent(selectedEvent);
                            setShowQRModal(true);
                          }}
                          className="p-2 rounded-lg border border-white/[0.08] text-text-secondary hover:text-cyan hover:border-cyan/30 transition-all"
                          title="Lihat QR Code"
                        >
                          <QrCode size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Committee Modal */}
      {showCommitteeModal && selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-void/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-white/[0.08] rounded-xl bg-surface">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06] bg-surface">
              <div>
                <h3 className="font-display text-base sm:text-lg font-semibold text-text-primary">
                  Panitia: {selectedEvent.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                  Kelola panitia event
                </p>
              </div>
              <button
                onClick={() => setShowCommitteeModal(false)}
                className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {/* Add committee */}
              <div className="p-4 rounded-lg border border-white/[0.08] bg-surface-elevated/30">
                <h4 className="text-sm font-medium text-text-primary mb-3">Tambah Panitia</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={committeeForm.employeeId}
                    onChange={(e) => setCommitteeForm({ ...committeeForm, employeeId: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm focus:outline-none focus:border-cyan/50"
                  >
                    <option value="">Pilih karyawan...</option>
                    {DEMO_EMPLOYEES.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </select>
                  <select
                    value={committeeForm.role}
                    onChange={(e) => setCommitteeForm({ ...committeeForm, role: e.target.value as Committee['role'] })}
                    className="px-3 py-2 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm focus:outline-none focus:border-cyan/50"
                  >
                    <option value="scanner">Scanner (Scan QR)</option>
                    <option value="organizer">Organizer</option>
                  </select>
                  <button
                    onClick={() => handleAddCommittee(selectedEvent.id)}
                    disabled={!committeeForm.employeeId}
                    className="px-4 py-2 rounded-lg bg-cyan text-sm font-semibold text-void hover:bg-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Committee list */}
              <div className="space-y-2">
                {getEventCommittees(selectedEvent.id).length === 0 ? (
                  <p className="text-sm text-text-secondary text-center py-8">
                    Belum ada panitia
                  </p>
                ) : (
                  getEventCommittees(selectedEvent.id).map((committee) => (
                    <div
                      key={committee.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/[0.08] bg-surface-elevated/30"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">{committee.employeeName}</p>
                        <p className="text-xs text-text-secondary">{committee.employeeEmail}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                          committee.role === 'scanner'
                            ? 'bg-cyan/10 border border-cyan/30 text-cyan'
                            : 'bg-indigo/10 border border-indigo/30 text-indigo'
                        }`}>
                          {committee.role === 'scanner' ? 'Scanner' : 'Organizer'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveCommittee(committee.id)}
                        className="p-2 rounded-lg border border-white/[0.08] text-text-secondary hover:text-red-400 hover:border-red-400/30 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-void/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md border border-white/[0.08] rounded-xl bg-surface p-6">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="font-display text-lg font-semibold text-text-primary mb-4 text-center">
              Tiket Digital QR Code
            </h3>

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-xl">
                <QRCodeSVG
                  value={`TICKET-${selectedEvent.id}-${Date.now()}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-text-primary">{selectedEvent.title}</p>
                <p className="text-xs text-text-secondary mt-1">
                  Scan QR code ini saat check-in
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="border border-white/[0.08] rounded-xl bg-surface/40 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06]">
          <h3 className="font-display text-sm sm:text-base font-semibold text-text-primary">
            Daftar Event ({events.length})
          </h3>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {events.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <Calendar size={32} className="text-text-secondary/40 mx-auto mb-3" />
              <p className="text-sm text-text-secondary">Belum ada event</p>
              <p className="text-xs text-text-secondary/60 mt-1">
                Klik "Buat Event" untuk menambahkan event baru
              </p>
            </div>
          ) : (
            events.map((event) => {
              const regs = getEventRegistrations(event.id);
              const committees = getEventCommittees(event.id);

              return (
                <div
                  key={event.id}
                  className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-surface-elevated/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    {/* Thumbnail */}
                    <div className="w-full sm:w-20 h-24 sm:h-20 rounded-lg bg-surface-elevated overflow-hidden flex-shrink-0">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h4 className="text-sm font-medium text-text-primary">{event.title}</h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {event.isPublished ? (
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-400/10 border border-emerald-400/30 text-[9px] sm:text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                              <Eye size={9} />
                              <span className="hidden sm:inline">Published</span>
                            </span>
                          ) : (
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-medium text-text-secondary flex items-center gap-1">
                              <EyeOff size={9} />
                              <span className="hidden sm:inline">Draft</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] sm:text-xs text-text-secondary mb-2 line-clamp-2">{event.description}</p>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-text-secondary/70 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(event.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {regs.length}/{event.capacity}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCheck size={11} />
                          {committees.length} panitia
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {event.requireRegistration && (
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowRegistrationModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg border border-cyan/30 bg-cyan/5 text-[10px] sm:text-xs font-medium text-cyan hover:bg-cyan/10 transition-all"
                          >
                            <Users size={12} />
                            Pendaftaran
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowCommitteeModal(true);
                          }}
                          className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg border border-indigo/30 bg-indigo/5 text-[10px] sm:text-xs font-medium text-indigo hover:bg-indigo/10 transition-all"
                        >
                          <UserCheck size={12} />
                          Panitia
                        </button>
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-1.5 rounded-lg border border-white/[0.08] text-text-secondary hover:text-cyan hover:border-cyan/30 transition-all"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-1.5 rounded-lg border border-white/[0.08] text-text-secondary hover:text-red-400 hover:border-red-400/30 transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
