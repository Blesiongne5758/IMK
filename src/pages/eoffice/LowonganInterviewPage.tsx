import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Video, Building } from 'lucide-react';
import { JobApplicationService } from '../../lib/services';

interface Interview {
  id: string;
  applicationId: string;
  applicantName: string;
  position: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  type: 'online' | 'offline';
  interviewer: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const STORAGE_KEY = 'imk_interviews';

export default function LowonganInterviewPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    applicationId: '',
    applicantName: '',
    position: '',
    date: '',
    time: '',
    duration: 60,
    location: '',
    type: 'online' as 'online' | 'offline',
    interviewer: '',
    notes: '',
  });
  const [interviewApps, setInterviewApps] = useState<any[]>([]);

  useEffect(() => {
    loadInterviews();
    loadInterviewCandidates();
  }, []);

  const loadInterviews = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setInterviews(JSON.parse(stored));
    }
  };

  const loadInterviewCandidates = async () => {
    try {
      const apps = await JobApplicationService.getAllJobApplications();
      setInterviewApps(apps.filter((a) => a.status === 'interview'));
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  const handleSelectApp = (appId: string) => {
    const app = interviewApps.find((a) => a.id === appId);
    if (app) {
      setFormData({
        ...formData,
        applicationId: app.id,
        applicantName: app.fullName,
        position: app.position,
      });
    }
  };

  const handleSave = () => {
    if (!formData.applicantName || !formData.date || !formData.time || !formData.location) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const newInterview: Interview = {
      id: `int_${Date.now()}`,
      ...formData,
      status: 'scheduled',
    };

    const updated = [...interviews, newInterview];
    setInterviews(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowForm(false);
    setFormData({
      applicationId: '',
      applicantName: '',
      position: '',
      date: '',
      time: '',
      duration: 60,
      location: '',
      type: 'online',
      interviewer: '',
      notes: '',
    });
  };

  const handleStatusChange = (id: string, status: Interview['status']) => {
    const updated = interviews.map((i) => (i.id === id ? { ...i, status } : i));
    setInterviews(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus jadwal interview ini?')) {
      const updated = interviews.filter((i) => i.id !== id);
      setInterviews(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusLabels = {
    scheduled: 'Terjadwal',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  const upcomingInterviews = interviews
    .filter((i) => i.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastInterviews = interviews
    .filter((i) => i.status !== 'scheduled')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Jadwal Wawancara</h1>
          <p className="text-gray-600">Kelola jadwal wawancara dengan kandidat</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Jadwal Baru</span>
        </button>
      </div>

      {/* Upcoming Interviews */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-cyan-600" />
          Wawancara Mendatang ({upcomingInterviews.length})
        </h2>
        {upcomingInterviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Belum ada jadwal wawancara</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{interview.applicantName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[interview.status]}`}>
                        {statusLabels[interview.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{interview.position}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(interview.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {interview.time} ({interview.duration} menit)
                      </span>
                      <span className="flex items-center gap-1">
                        {interview.type === 'online' ? <Video size={12} /> : <Building size={12} />}
                        {interview.location}
                      </span>
                    </div>
                    {interview.interviewer && (
                      <p className="text-xs text-gray-500 mt-1">
                        Interviewer: {interview.interviewer}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={interview.status}
                      onChange={(e) => handleStatusChange(interview.id, e.target.value as Interview['status'])}
                      className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500"
                    >
                      <option value="scheduled">Terjadwal</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                    <button
                      onClick={() => handleDelete(interview.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Interviews */}
      {pastInterviews.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            Riwayat Wawancara ({pastInterviews.length})
          </h2>
          <div className="space-y-3">
            {pastInterviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white border border-gray-200 rounded-xl p-4 opacity-75"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{interview.applicantName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[interview.status]}`}>
                        {statusLabels[interview.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{interview.position}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(interview.date).toLocaleDateString('id-ID')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {interview.time}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(interview.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Jadwal Wawancara Baru</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Pilih Kandidat</label>
                <select
                  onChange={(e) => handleSelectApp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                  defaultValue=""
                >
                  <option value="" disabled>-- Pilih Kandidat --</option>
                  {interviewApps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.fullName} - {app.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nama Kandidat</label>
                  <input
                    type="text"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Posisi</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Waktu</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Durasi (menit)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tipe</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'online' | 'offline' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Lokasi / Link Meeting</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ruang Meeting A / https://meet.google.com/..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Interviewer</label>
                <input
                  type="text"
                  value={formData.interviewer}
                  onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                  placeholder="Nama interviewer"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Catatan</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
