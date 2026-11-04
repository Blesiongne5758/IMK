import { useState, useEffect } from 'react';
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
  createdBy: string;
  createdAt: string;
}

const STORAGE_KEY = 'imk_events';

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
    image: 'https://via.placeholder.com/400x200/0F0F12/00E5FF?text=Tech+Summit+2024',
    isPublished: true,
    createdBy: 'admin@imk.co.id',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Workshop: Cybersecurity Best Practices',
    description: 'Workshop intensif tentang implementasi keamanan siber untuk infrastruktur enterprise.',
    date: '2024-03-22',
    time: '13:00 - 17:00 WIB',
    location: 'IMK Training Center, Jakarta',
    capacity: 50,
    category: 'Workshop',
    speaker: 'Budi Hartono, Security Lead',
    image: 'https://via.placeholder.com/400x200/0F0F12/6366F1?text=Cybersecurity+Workshop',
    isPublished: true,
    createdBy: 'admin@imk.co.id',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
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
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      setEvents(initialEvents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
    }
  }, []);

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    if (editingEvent) {
      const updated = events.map((event) =>
        event.id === editingEvent.id
          ? { ...event, ...formData }
          : event
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
    });
  };

  const categories: Event['category'][] = ['Conference', 'Workshop', 'Webinar', 'Hackathon', 'Meetup', 'Training'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Manajemen Event
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Kelola event dan kegiatan perusahaan
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90"
        >
          <Plus size={16} strokeWidth={2.5} />
          Buat Event
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/[0.08] rounded-xl bg-surface">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-surface">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {editingEvent ? 'Edit Event' : 'Buat Event Baru'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
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
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
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
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50 resize-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Tanggal <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm focus:outline-none focus:border-cyan/50"
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
                    className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                  />
                </div>
              </div>

              {/* Location & Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Lokasi <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Jakarta Convention Center"
                    className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
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
                    className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                  />
                </div>
              </div>

              {/* Category & Speaker */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Event['category'] })}
                    className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm focus:outline-none focus:border-cyan/50"
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
                    className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
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
                  className="w-full px-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-white/[0.08] bg-surface-elevated/50">
                <div>
                  <p className="text-sm font-medium text-text-primary">Publikasikan Event</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Event akan muncul di halaman publik
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-lg border border-white/[0.1] text-sm font-medium text-text-secondary hover:text-text-primary hover:border-white/[0.2] transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90"
                >
                  <Check size={14} strokeWidth={3} />
                  {editingEvent ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="border border-white/[0.08] rounded-xl bg-surface/40 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="font-display text-base font-semibold text-text-primary">
            Daftar Event ({events.length})
          </h3>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {events.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar size={32} className="text-text-secondary/40 mx-auto mb-3" />
              <p className="text-sm text-text-secondary">Belum ada event</p>
              <p className="text-xs text-text-secondary/60 mt-1">
                Klik "Buat Event" untuk menambahkan event baru
              </p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="px-6 py-4 hover:bg-surface-elevated/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg bg-surface-elevated overflow-hidden flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-medium text-text-primary truncate">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {event.isPublished ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-400/10 border border-emerald-400/30 text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                            <Eye size={10} />
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-text-secondary flex items-center gap-1">
                            <EyeOff size={10} />
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary mb-2 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary/70">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(event.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {event.capacity} peserta
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-elevated/50">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 rounded-lg border border-white/[0.08] text-text-secondary hover:text-cyan hover:border-cyan/30 transition-all"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 rounded-lg border border-white/[0.08] text-text-secondary hover:text-red-400 hover:border-red-400/30 transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
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
