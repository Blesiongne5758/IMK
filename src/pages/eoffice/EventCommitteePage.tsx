import { useState, useEffect } from 'react';
import { Users, Mail, UserCheck, Shield, Plus, Trash2 } from 'lucide-react';
import { EventService } from '../../lib/services';

interface Committee {
  id: string;
  eventId: string;
  userId: string;
  role: 'scanner' | 'organizer';
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  eventDate: string;
}

const DEMO_EMPLOYEES = [
  { id: 'emp1', name: 'Ahmad Wijaya', email: 'admin@imk.co.id', department: 'IT Management' },
  { id: 'emp2', name: 'Siti Rahayu', email: 'manager@imk.co.id', department: 'Operations' },
  { id: 'emp3', name: 'Budi Santoso', email: 'staff@imk.co.id', department: 'Engineering' },
  { id: 'emp4', name: 'Dewi Lestari', email: 'dewi@imk.co.id', department: 'HR' },
  { id: 'emp5', name: 'Rina Kusuma', email: 'rina@imk.co.id', department: 'Product' },
];

const COMMITTEE_KEY = 'imk_event_committees';

export default function EventCommitteePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCommittee, setNewCommittee] = useState({
    employeeId: '',
    role: 'scanner' as 'scanner' | 'organizer',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadCommittees();
    }
  }, [selectedEvent]);

  const loadEvents = async () => {
    try {
      const data = await EventService.getEvents();
      setEvents(data);
      if (data.length > 0) {
        setSelectedEvent(data[0].id);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommittees = () => {
    const stored = localStorage.getItem(COMMITTEE_KEY);
    if (stored) {
      const allCommittees = JSON.parse(stored);
      setCommittees(allCommittees.filter((c: Committee) => c.eventId === selectedEvent));
    }
  };

  const handleAddCommittee = () => {
    if (!newCommittee.employeeId) {
      alert('Pilih karyawan terlebih dahulu');
      return;
    }

    const employee = DEMO_EMPLOYEES.find((e) => e.id === newCommittee.employeeId);
    if (!employee) return;

    const existing = committees.find((c) => c.userId === newCommittee.employeeId);
    if (existing) {
      alert('Karyawan sudah menjadi panitia untuk event ini');
      return;
    }

    const stored = localStorage.getItem(COMMITTEE_KEY);
    const allCommittees = stored ? JSON.parse(stored) : [];

    const newCommitteeData: Committee = {
      id: `committee_${Date.now()}`,
      eventId: selectedEvent,
      userId: newCommittee.employeeId,
      role: newCommittee.role,
      createdAt: new Date().toISOString(),
    };

    allCommittees.push(newCommitteeData);
    localStorage.setItem(COMMITTEE_KEY, JSON.stringify(allCommittees));

    setCommittees([...committees, newCommitteeData]);
    setShowAddForm(false);
    setNewCommittee({ employeeId: '', role: 'scanner' });
  };

  const handleRemoveCommittee = (id: string) => {
    if (confirm('Hapus panitia ini?')) {
      const stored = localStorage.getItem(COMMITTEE_KEY);
      if (stored) {
        const allCommittees = JSON.parse(stored);
        const updated = allCommittees.filter((c: Committee) => c.id !== id);
        localStorage.setItem(COMMITTEE_KEY, JSON.stringify(updated));
        setCommittees(committees.filter((c) => c.id !== id));
      }
    }
  };

  const getEmployeeInfo = (userId: string) => {
    return DEMO_EMPLOYEES.find((e) => e.id === userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Panitia Event</h1>
          <p className="text-gray-600">Kelola panitia untuk setiap event</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Tambah Panitia</span>
        </button>
      </div>

      {/* Event Selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <label className="block text-xs font-medium text-gray-600 mb-2">Pilih Event</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title} - {new Date(event.eventDate).toLocaleDateString('id-ID')}
            </option>
          ))}
        </select>
      </div>

      {/* Committee List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <span className="text-sm font-medium text-gray-900">
            Daftar Panitia ({committees.length})
          </span>
        </div>

        {committees.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">Belum ada panitia</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Plus size={16} />
              Tambah Panitia
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {committees.map((committee) => {
              const employee = getEmployeeInfo(committee.userId);
              if (!employee) return null;

              return (
                <div key={committee.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{employee.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                            committee.role === 'scanner'
                              ? 'bg-cyan-100 text-cyan-700 border-cyan-200'
                              : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          {committee.role === 'scanner' ? (
                            <span className="flex items-center gap-1">
                              <UserCheck size={10} />
                              Scanner
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Shield size={10} />
                              Organizer
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail size={12} />
                          {employee.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {employee.department}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCommittee(committee.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Committee Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Tambah Panitia</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Pilih Karyawan</label>
                <select
                  value={newCommittee.employeeId}
                  onChange={(e) => setNewCommittee({ ...newCommittee, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Pilih Karyawan --</option>
                  {DEMO_EMPLOYEES.filter(
                    (emp) => !committees.find((c) => c.userId === emp.id)
                  ).map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                <select
                  value={newCommittee.role}
                  onChange={(e) =>
                    setNewCommittee({ ...newCommittee, role: e.target.value as 'scanner' | 'organizer' })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="scanner">Scanner (Scan QR Code)</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddCommittee}
                  className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
