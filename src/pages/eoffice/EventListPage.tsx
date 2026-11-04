import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Eye, EyeOff, Edit2, Trash2, Plus } from 'lucide-react';
import { EventService } from '../../lib/services';

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  capacity: number;
  registered: number;
  category: string;
  speaker?: string;
  imageUrl?: string;
  isPublished: boolean;
  requireRegistration: boolean;
}

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await EventService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus event ini?')) {
      try {
        await EventService.deleteEvent(id);
        await loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await EventService.updateEvent(id, { isPublished: !currentStatus });
      await loadEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Daftar Event</h1>
          <p className="text-gray-600">Kelola semua event yang telah dibuat</p>
        </div>
        <Link
          to="/eoffice/event"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Buat Event</span>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">Belum ada event</p>
          <Link
            to="/eoffice/event"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus size={16} />
            Buat Event Pertama
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-100">
            {events.map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{event.title}</h3>
                      {event.isPublished ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(event.eventDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {event.registered}/{event.capacity} peserta
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 text-xs">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublish(event.id, event.isPublished)}
                      className="p-2 text-gray-400 hover:text-cyan-600 transition-colors"
                      title={event.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {event.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <Link
                      to="/eoffice/event"
                      className="p-2 text-gray-400 hover:text-cyan-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
