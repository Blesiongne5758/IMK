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
  Briefcase,
  BarChart3,
  UserCheck,
  ClipboardList,
} from 'lucide-react';
import { getCurrentUser, logout, refreshSession, User as UserType } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import { getDashboardStats, getDispositions, getNotifications, DashboardStats } from '../lib/supabase-service';
import DropdownMenu, { MenuItem } from '../components/DropdownMenu';

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

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, path: '/eoffice' },
    { id: 'incoming', label: 'Surat Masuk', icon: Mail },
    { id: 'outgoing', label: 'Surat Keluar', icon: Send },
    { id: 'disposition', label: 'Disposisi', icon: FileText },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'archive', label: 'Arsip Digital', icon: Archive },
    { 
      id: 'lowongan', 
      label: 'Lowongan', 
      icon: Briefcase,
      children: [
        { id: 'lowongan-list', label: 'Daftar Lamaran', icon: ClipboardList, path: '/eoffice/lowongan' },
        { id: 'lowongan-report', label: 'Laporan', icon: BarChart3, path: '/eoffice/lowongan/report' },
        { id: 'lowongan-interview', label: 'Jadwal Wawancara', icon: Calendar, path: '/eoffice/lowongan/interview' },
      ]
    },
    { 
      id: 'event', 
      label: 'Event', 
      icon: Users,
      children: [
        { id: 'event-create', label: 'Buat Event', icon: Plus, path: '/eoffice/event' },
        { id: 'event-list', label: 'Daftar Event', icon: Calendar, path: '/eoffice/event/list' },
        { id: 'event-participants', label: 'Peserta', icon: UserCheck, path: '/eoffice/event/participants' },
        { id: 'event-committee', label: 'Panitia', icon: Users, path: '/eoffice/event/committee' },
      ]
    },
    { id: 'legalitas', label: 'Legalitas', icon: Shield, path: '/eoffice/legalitas' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-white">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="font-display text-sm sm:text-lg font-semibold text-gray-900">
                E-Office
              </h1>
              <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                PT. Inti Mutiara Kreasindo
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari surat, disposisi..."
                  className="bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none w-48"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-1.5 sm:p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-all">
                <Bell size={16} className="sm:hidden" />
                <Bell size={18} className="hidden sm:block" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-cyan-500 text-[8px] sm:text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-bold text-cyan-600">{user.avatar}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all"
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
            <nav className="border border-gray-200 rounded-xl bg-gray-50 p-3 sm:p-4 space-y-1">
              {menuItems.map((item) => {
                const baseClasses = `w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-cyan-50 border border-cyan-200 text-cyan-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white border border-transparent'
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
            <div className="mt-3 sm:mt-4 border border-gray-200 rounded-xl bg-gray-50 p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center">
                  <User size={16} className="text-cyan-600 sm:hidden" />
                  <User size={18} className="text-cyan-600 hidden sm:block" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">{user.department}</p>
                </div>
              </div>
              <div className="pt-2 sm:pt-3 border-t border-gray-200">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Email</p>
                <p className="text-[10px] sm:text-xs text-gray-900 font-mono truncate">{user.email}</p>
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
                  className="border border-gray-200 rounded-xl bg-white p-3 sm:p-5 transition-all duration-300 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <stat.icon size={16} className={`${stat.color} sm:hidden`} />
                    <stat.icon size={20} className={`${stat.color} hidden sm:block`} />
                    <span className="text-[10px] sm:text-xs text-gray-500">{stat.change}</span>
                  </div>
                  <p className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between gap-2">
                <h2 className="font-display text-sm sm:text-lg font-semibold text-gray-900 truncate">
                  Aktivitas Terbaru
                </h2>
                <button className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-cyan-300 bg-cyan-50 text-[10px] sm:text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-all flex-shrink-0">
                  <Plus size={12} className="sm:hidden" />
                  <Plus size={14} className="hidden sm:block" />
                  <span className="hidden sm:inline">Buat Surat</span>
                  <span className="sm:hidden">Buat</span>
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                        item.type === 'incoming' ? 'bg-cyan-50' :
                        item.type === 'outgoing' ? 'bg-indigo-50' :
                        'bg-emerald-50'
                      }`}>
                        {item.type === 'incoming' && <Mail size={14} className="text-cyan-600" />}
                        {item.type === 'outgoing' && <Send size={14} className="text-indigo-600" />}
                        {item.type === 'disposition' && <FileText size={14} className="text-emerald-600" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </h3>
                          {item.status === 'unread' && (
                            <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-3 text-[10px] sm:text-xs text-gray-500">
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
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-cyan-50 border border-cyan-200 text-[9px] sm:text-[10px] font-medium text-cyan-700">
                            Baru
                          </span>
                        )}
                        {item.status === 'pending' && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-amber-50 border border-amber-200 text-[9px] sm:text-[10px] font-medium text-amber-700">
                            Pending
                          </span>
                        )}
                        {item.status === 'read' && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-gray-50 border border-gray-200 text-[9px] sm:text-[10px] font-medium text-gray-600">
                            Dibaca
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[9px] sm:text-[10px] font-medium text-emerald-700">
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
              <button className="border border-gray-200 rounded-xl bg-white p-4 sm:p-5 text-left transition-all duration-300 hover:border-cyan-300 hover:shadow-md group">
                <MailOpen size={20} className="text-cyan-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                  Surat Masuk
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Lihat dan kelola surat masuk
                </p>
              </button>

              <button className="border border-gray-200 rounded-xl bg-white p-4 sm:p-5 text-left transition-all duration-300 hover:border-indigo-300 hover:shadow-md group">
                <Send size={20} className="text-indigo-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                  Buat Surat Keluar
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Kirim surat atau dokumen
                </p>
              </button>

              <button className="border border-gray-200 rounded-xl bg-white p-4 sm:p-5 text-left transition-all duration-300 hover:border-emerald-300 hover:shadow-md group">
                <Calendar size={20} className="text-emerald-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                  Agenda Hari Ini
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500">
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
