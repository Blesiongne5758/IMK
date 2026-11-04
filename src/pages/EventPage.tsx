import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Tech Summit 2024: AI & Cloud Innovation',
    description: 'Konferensi teknologi tahunan membahas tren terbaru dalam AI, cloud computing, dan transformasi digital enterprise.',
    date: '2024-03-15',
    time: '09:00 - 17:00 WIB',
    location: 'Jakarta Convention Center',
    capacity: 500,
    registered: 342,
    category: 'Conference',
    speaker: 'Dr. Ahmad Wijaya, CTO',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" fill="%230F0F12"%3E%3Crect width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2300E5FF" font-size="24"%3ETech Summit 2024%3C/text%3E%3C/svg%3E',
  },
  {
    id: 2,
    title: 'Workshop: Cybersecurity Best Practices',
    description: 'Workshop intensif tentang implementasi keamanan siber untuk infrastruktur enterprise dengan hands-on lab.',
    date: '2024-03-22',
    time: '13:00 - 17:00 WIB',
    location: 'IMK Training Center, Jakarta',
    capacity: 50,
    registered: 38,
    category: 'Workshop',
    speaker: 'Budi Hartono, Security Lead',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" fill="%230F0F12"%3E%3Crect width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%236366F1" font-size="24"%3ECybersecurity Workshop%3C/text%3E%3C/svg%3E',
  },
  {
    id: 3,
    title: 'Webinar: Microservices Architecture',
    description: 'Webinar online membahas desain arsitektur microservices yang scalable dan maintainable untuk aplikasi enterprise.',
    date: '2024-04-05',
    time: '14:00 - 16:00 WIB',
    location: 'Online (Zoom)',
    capacity: 200,
    registered: 156,
    category: 'Webinar',
    speaker: 'Siti Rahayu, Solutions Architect',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" fill="%230F0F12"%3E%3Crect width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2310B981" font-size="24"%3EMicroservices Webinar%3C/text%3E%3C/svg%3E',
  },
  {
    id: 4,
    title: 'Hackathon: Build the Future',
    description: 'Kompetisi hackathon 48 jam untuk mengembangkan solusi inovatif menggunakan AI dan IoT.',
    date: '2024-04-20',
    time: '08:00 - 20:00 WIB',
    location: 'IMK Innovation Hub, Bandung',
    capacity: 100,
    registered: 87,
    category: 'Hackathon',
    speaker: 'Tim Engineering IMK',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" fill="%230F0F12"%3E%3Crect width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23F59E0B" font-size="24"%3EHackathon 2024%3C/text%3E%3C/svg%3E',
  },
];

const categoryColors = {
  Conference: 'bg-cyan/10 border-cyan/30 text-cyan',
  Workshop: 'bg-indigo/10 border-indigo/30 text-indigo',
  Webinar: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  Hackathon: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
};

export default function EventPage() {
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
                Event & Kegiatan
              </span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary leading-tight mb-6">
              Upcoming Events
            </h1>
            <p className="text-lg lg:text-xl text-text-secondary leading-relaxed">
              Ikuti berbagai event teknologi yang kami selenggarakan. Dari konferensi, workshop, 
              hingga hackathon - semua dirancang untuk meningkatkan kapabilitas dan networking profesional Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Event yang Akan Datang
            </h2>
            <p className="text-text-secondary text-lg">
              Daftar event yang sedang dibuka untuk pendaftaran.
            </p>
          </div>

          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group border border-white/[0.08] rounded-xl bg-surface/40 overflow-hidden transition-all duration-300 hover:border-cyan/30 hover:bg-surface/60"
              >
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className="relative aspect-video md:aspect-auto bg-surface-elevated overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-medium px-3 py-1.5 rounded border ${categoryColors[event.category as keyof typeof categoryColors]}`}>
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-6 lg:p-8">
                    <h3 className="font-display text-xl lg:text-2xl font-semibold text-text-primary mb-3 group-hover:text-cyan transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Calendar size={16} className="text-cyan flex-shrink-0" />
                        <span>{new Date(event.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock size={16} className="text-cyan flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <MapPin size={16} className="text-cyan flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Users size={16} className="text-cyan flex-shrink-0" />
                        <span>{event.registered} / {event.capacity} peserta</span>
                      </div>
                    </div>

                    {/* Speaker */}
                    <div className="mb-4">
                      <span className="text-xs text-text-secondary uppercase tracking-wider">Speaker:</span>
                      <p className="text-sm text-text-primary font-medium">{event.speaker}</p>
                    </div>

                    {/* Capacity Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                        <span>Kapasitas Terisi</span>
                        <span>{Math.round((event.registered / event.capacity) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan to-indigo rounded-full transition-all duration-500"
                          style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Register Button */}
                    <button className="inline-flex items-center gap-2 rounded-lg bg-cyan px-6 py-2.5 text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90 hover:scale-[1.02]">
                      Daftar Sekarang
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 lg:py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Event Sebelumnya
            </h2>
            <p className="text-text-secondary text-lg">
              Dokumentasi event yang telah kami selenggarakan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Annual Tech Talk 2023', date: '2023-11-20', attendees: 450 },
              { title: 'Cloud Migration Workshop', date: '2023-09-15', attendees: 80 },
              { title: 'DevOps Bootcamp', date: '2023-07-10', attendees: 60 },
            ].map((pastEvent, idx) => (
              <div
                key={idx}
                className="border border-white/[0.06] rounded-xl bg-surface/30 p-6 transition-all duration-300 hover:border-white/[0.12]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-text-secondary/60 uppercase tracking-wider">
                    Selesai
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary mb-2">
                  {pastEvent.title}
                </h3>
                <div className="space-y-1 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    <span>{new Date(pastEvent.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={12} />
                    <span>{pastEvent.attendees} peserta</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
