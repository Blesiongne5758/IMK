import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Building, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { EventService } from '../../lib/services';

interface Registration {
  id: string;
  eventId: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt?: string;
  registeredAt: string;
}

interface Event {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  capacity: number;
  registered: number;
}

export default function EventParticipantsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadRegistrations();
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

  const loadRegistrations = async () => {
    if (!selectedEvent) return;
    try {
      const data = await EventService.getEventRegistrations(selectedEvent);
      setRegistrations(data);
    } catch (error) {
      console.error('Error loading registrations:', error);
    }
  };

  const checkedInCount = registrations.filter((r) => r.checkedIn).length;
  const selectedEventData = events.find((e) => e.id === selectedEvent);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Peserta Event</h1>
        <p className="text-gray-600">Kelola peserta dan check-in event</p>
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

      {/* Summary Cards */}
      {selectedEventData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <Users size={20} className="text-cyan-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
            <p className="text-xs text-gray-500">Total Peserta</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <CheckCircle size={20} className="text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{checkedInCount}</p>
            <p className="text-xs text-gray-500">Sudah Check-in</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <XCircle size={20} className="text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{registrations.length - checkedInCount}</p>
            <p className="text-xs text-gray-500">Belum Check-in</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <Calendar size={20} className="text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{selectedEventData.capacity}</p>
            <p className="text-xs text-gray-500">Kapasitas</p>
          </div>
        </div>
      )}

      {/* Participants List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <span className="text-sm font-medium text-gray-900">
            Daftar Peserta ({registrations.length})
          </span>
        </div>

        {registrations.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Belum ada peserta terdaftar</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {registrations.map((reg) => (
              <div key={reg.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{reg.fullName}</h3>
                      {reg.checkedIn ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                          <CheckCircle size={10} />
                          Checked In
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                          Belum Check-in
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={12} />
                        {reg.email}
                      </span>
                      {reg.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} />
                          {reg.phone}
                        </span>
                      )}
                      {reg.company && (
                        <span className="flex items-center gap-1">
                          <Building size={12} />
                          {reg.company}
                        </span>
                      )}
                    </div>
                    {reg.checkedInAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Check-in: {new Date(reg.checkedInAt).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
