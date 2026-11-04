import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  MailOpen,
  Send,
  FileText,
  Calendar,
  Archive,
  Bell,
  LogOut,
  User,
  Users,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { getCurrentUser, logout, refreshSession, User as UserType } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import { getDashboardStats, getDispositions, getNotifications, DashboardStats } from '../lib/supabase-service';

interface StatCard {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  color: string;
}

interface RecentItem {
  id: string;
  type: 'incoming' | 'outgoing' | 'disposition';
  title: string;
  from: string;
  date: string;
  status: 'unread' | 'read' | 'pending' | 'completed';
}

export default function EOfficeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    incomingLetters: 24,
    outgoingLetters: 18,
    dispositions: 7,
    todayAgendas: 5,
  });
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  useEffect(() => {
    const checkAuth = async () => {
      // Try to refresh session from Supabase if configured
      const currentUser = await refreshSession();
      if (!currentUser) {
        navigate('/eoffice/login');
        return;
      }
      setUser(currentUser);

      // Fetch real data from Supabase if configured
      if (isSupabaseConfigured) {
        const [dashboardStats, notifications] = await Promise.all([
          getDashboardStats(currentUser.email),
          getNotifications(currentUser.email, true),
        ]);
        setStats(dashboardStats);
        setUnreadNotifications(notifications.length);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/eoffice/login');
  };

  if (!user) return null;

  const statCards: StatCard[] = [
    { icon: Mail, label: 'Surat Masuk', value: stats.incomingLetters.toString(), change: '+12%', color: 'text-cyan' },
    { icon: Send, label: 'Surat Keluar', value: stats.outgoingLetters.toString(), change: '+8%', color: 'text-indigo' },
    { icon: FileText, label: 'Disposisi', value: stats.dispositions.toString(), change: '+3%', color: 'text-emerald-400' },
    { icon: Calendar, label: 'Agenda Hari Ini', value: stats.todayAgendas.toString(), change: '2 pending', color: 'text-amber-400' },
  ];

  const recentItems: RecentItem[] = [
    {
      id: '1',
      type: 'incoming',
      title: 'Permintaan Proposal Proyek Digital Transformation',
      from: 'PT. Maju Bersama',
      date: '2024-01-15',
      status: 'unread',
    },
    {
      id: '2',
      type: 'disposition',
      title: 'Approval Budget Q1 2024 - Department IT',
      from: 'Direktur Utama',
      date: '2024-01-14',
      status: 'pending',
    },
    {
      id: '3',
      type: 'outgoing',
      title: 'Laporan Progress Proyek Bank Central',
      from: 'Tim Engineering',
      date: '2024-01-14',
      status: 'completed',
    },
    {
      id: '4',
      type: 'incoming',
      title: 'Undangan Meeting Vendor Cloud Infrastructure',
      from: 'AWS Indonesia',
      date: '2024-01-13',
      status: 'read',
    },
    {
      id: '5',
      type: 'disposition',
      title: 'Review Kontrak Kerjasama Telkom Group',
      from: 'Legal Department',
      date: '2024-01-13',
      status: 'pending',
    },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'incoming', label: 'Surat Masuk', icon: Mail },
    { id: 'outgoing', label: 'Surat Keluar', icon: Send },
    { id: 'disposition', label: 'Disposisi', icon: FileText },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'archive', label: 'Arsip Digital', icon: Archive },
    { id: 'legalitas', label: 'Legalitas', icon: Shield },
    { id: 'event', label: 'Event', icon: Users },
  ];

  return (
    <div className="min-h-screen pt-16 bg-void">
      {/* Top Bar */}
      <div className="border-b border-white/[0.06] bg-surface/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="font-display text-sm sm:text-lg font-semibold text-text-primary">
                E-Office
              </h1>
              <span className="text-[10px] sm:text-xs text-text-secondary hidden sm:block">
                PT. Inti Mutiara Kreasindo
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.08] bg-surface-elevated/50">
                <Search size={14} className="text-text-secondary/50" />
                <input
                  type="text"
                  placeholder="Cari surat, disposisi..."
                  className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none w-48"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-1.5 sm:p-2 rounded-lg border border-white/[0.08] text-text-secondary hover:text-text-primary hover:border-white/[0.15] transition-all">
                <Bell size={16} className="sm:hidden" />
                <Bell size={18} className="hidden sm:block" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-cyan text-[8px] sm:text-[9px] font-bold text-void flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-text-primary">{user.name}</p>
                  <p className="text-xs text-text-secondary">{user.role}</p>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-bold text-cyan">{user.avatar}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 rounded-lg border border-white/[0.08] text-text-secondary hover:text-red-400 hover:border-red-400/30 transition-all"
                  title="Logout"
                >
                  <LogOut size={14} className="sm:hidden" />
                  <LogOut size={16} className="hidden sm:block" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar Menu */}
          <aside className="lg:col-span-3">
            <nav className="border border-white/[0.08] rounded-xl bg-surface/40 p-3 sm:p-4 space-y-1">
              {menuItems.map((item) => {
                const baseClasses = `w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-cyan/10 border border-cyan/30 text-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50 border border-transparent'
                }`;

                if (item.id === 'legalitas') {
                  return (
                    <Link key={item.id} to="/eoffice/legalitas" className={baseClasses}>
                      <item.icon size={16} className="sm:hidden" />
                      <item.icon size={18} className="hidden sm:block" />
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="sm:hidden text-[10px]">{item.label}</span>
                    </Link>
                  );
                }
                if (item.id === 'event') {
                  return (
                    <Link key={item.id} to="/eoffice/event" className={baseClasses}>
                      <item.icon size={16} className="sm:hidden" />
                      <item.icon size={18} className="hidden sm:block" />
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="sm:hidden text-[10px]">{item.label}</span>
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={baseClasses}
                  >
                    <item.icon size={16} className="sm:hidden" />
                    <item.icon size={18} className="hidden sm:block" />
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Info Card */}
            <div className="mt-3 sm:mt-4 border border-white/[0.08] rounded-xl bg-surface/40 p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center">
                  <User size={16} className="text-cyan sm:hidden" />
                  <User size={18} className="text-cyan hidden sm:block" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-text-primary truncate">{user.name}</p>
                  <p className="text-[10px] sm:text-xs text-text-secondary truncate">{user.department}</p>
                </div>
              </div>
              <div className="pt-2 sm:pt-3 border-t border-white/[0.06]">
                <p className="text-[10px] sm:text-xs text-text-secondary mb-0.5 sm:mb-1">Email</p>
                <p className="text-[10px] sm:text-xs text-text-primary font-mono truncate">{user.email}</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-4 sm:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-white/[0.06] rounded-xl bg-surface/40 p-3 sm:p-5 transition-all duration-300 hover:border-white/[0.12]"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <stat.icon size={16} className={`${stat.color} sm:hidden`} />
                    <stat.icon size={20} className={`${stat.color} hidden sm:block`} />
                    <span className="text-[10px] sm:text-xs text-text-secondary">{stat.change}</span>
                  </div>
                  <p className="font-display text-xl sm:text-2xl font-bold text-text-primary mb-0.5 sm:mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="border border-white/[0.08] rounded-xl bg-surface/40 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06] flex items-center justify-between gap-2">
                <h2 className="font-display text-sm sm:text-lg font-semibold text-text-primary truncate">
                  Aktivitas Terbaru
                </h2>
                <button className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-cyan/30 bg-cyan/5 text-[10px] sm:text-xs font-medium text-cyan hover:bg-cyan/10 transition-all flex-shrink-0">
                  <Plus size={12} className="sm:hidden" />
                  <Plus size={14} className="hidden sm:block" />
                  <span className="hidden sm:inline">Buat Surat</span>
                  <span className="sm:hidden">Buat</span>
                </button>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-surface-elevated/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                        item.type === 'incoming' ? 'bg-cyan/10' :
                        item.type === 'outgoing' ? 'bg-indigo/10' :
                        'bg-emerald-400/10'
                      }`}>
                        {item.type === 'incoming' && <Mail size={14} className="text-cyan" />}
                        {item.type === 'outgoing' && <Send size={14} className="text-indigo" />}
                        {item.type === 'disposition' && <FileText size={14} className="text-emerald-400" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-xs sm:text-sm font-medium text-text-primary truncate">
                            {item.title}
                          </h3>
                          {item.status === 'unread' && (
                            <span className="w-2 h-2 rounded-full bg-cyan flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-3 text-[10px] sm:text-xs text-text-secondary">
                          <span className="truncate">{item.from}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} className="sm:hidden" />
                            <Clock size={11} className="hidden sm:block" />
                            {new Date(item.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {item.status === 'unread' && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-cyan/10 border border-cyan/30 text-[9px] sm:text-[10px] font-medium text-cyan">
                            Baru
                          </span>
                        )}
                        {item.status === 'pending' && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-amber-400/10 border border-amber-400/30 text-[9px] sm:text-[10px] font-medium text-amber-400">
                            Pending
                          </span>
                        )}
                        {item.status === 'read' && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-medium text-text-secondary">
                            Dibaca
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-emerald-400/10 border border-emerald-400/30 text-[9px] sm:text-[10px] font-medium text-emerald-400">
                            Selesai
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button className="border border-white/[0.06] rounded-xl bg-surface/40 p-4 sm:p-5 text-left transition-all duration-300 hover:border-cyan/30 group">
                <MailOpen size={20} className="text-cyan mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xs sm:text-sm font-semibold text-text-primary mb-1">
                  Surat Masuk
                </h3>
                <p className="text-[10px] sm:text-xs text-text-secondary">
                  Lihat dan kelola surat masuk
                </p>
              </button>

              <button className="border border-white/[0.06] rounded-xl bg-surface/40 p-4 sm:p-5 text-left transition-all duration-300 hover:border-indigo/30 group">
                <Send size={20} className="text-indigo mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xs sm:text-sm font-semibold text-text-primary mb-1">
                  Buat Surat Keluar
                </h3>
                <p className="text-[10px] sm:text-xs text-text-secondary">
                  Kirim surat atau dokumen
                </p>
              </button>

              <button className="border border-white/[0.06] rounded-xl bg-surface/40 p-4 sm:p-5 text-left transition-all duration-300 hover:border-emerald-400/30 group">
                <Calendar size={20} className="text-emerald-400 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xs sm:text-sm font-semibold text-text-primary mb-1">
                  Agenda Hari Ini
                </h3>
                <p className="text-[10px] sm:text-xs text-text-secondary">
                  5 agenda terjadwal
                </p>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
