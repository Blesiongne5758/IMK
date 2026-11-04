import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Briefcase, Calendar, PieChart } from 'lucide-react';
import { JobApplicationService } from '../../lib/services';

interface Stats {
  total: number;
  pending: number;
  reviewed: number;
  interview: number;
  accepted: number;
  rejected: number;
  byPosition: Record<string, number>;
  byMonth: Record<string, number>;
}

export default function LowonganReportPage() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    reviewed: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
    byPosition: {},
    byMonth: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const applications = await JobApplicationService.getAllJobApplications();
      
      const statusCount = await JobApplicationService.getApplicationCountByStatus();
      const positions = await JobApplicationService.getAppliedPositions();
      
      const byPosition: Record<string, number> = {};
      positions.forEach((pos) => {
        byPosition[pos] = applications.filter((a) => a.position === pos).length;
      });

      const byMonth: Record<string, number> = {};
      applications.forEach((app) => {
        const month = new Date(app.submittedAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
        byMonth[month] = (byMonth[month] || 0) + 1;
      });

      setStats({
        total: applications.length,
        pending: statusCount.pending || 0,
        reviewed: statusCount.reviewed || 0,
        interview: statusCount.interview || 0,
        accepted: statusCount.accepted || 0,
        rejected: statusCount.rejected || 0,
        byPosition,
        byMonth,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Memuat laporan...</div>
      </div>
    );
  }

  const acceptanceRate = stats.total > 0 ? ((stats.accepted / stats.total) * 100).toFixed(1) : '0';

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Laporan Lowongan</h1>
        <p className="text-gray-600">Statistik dan analisis lamaran pekerjaan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Briefcase size={20} className="text-cyan-600" />
            <TrendingUp size={14} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Lamaran</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users size={20} className="text-green-600" />
            <span className="text-xs font-medium text-green-600">{acceptanceRate}%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
          <p className="text-xs text-gray-500">Diterima</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar size={20} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.interview}</p>
          <p className="text-xs text-gray-500">Jadwal Interview</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 size={20} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          <p className="text-xs text-gray-500">Menunggu Review</p>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Distribusi Status</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Menunggu Review', value: stats.pending, color: 'bg-yellow-500' },
              { label: 'Sudah Direview', value: stats.reviewed, color: 'bg-blue-500' },
              { label: 'Jadwal Interview', value: stats.interview, color: 'bg-purple-500' },
              { label: 'Diterima', value: stats.accepted, color: 'bg-green-500' },
              { label: 'Ditolak', value: stats.rejected, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">{item.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${stats.total > 0 ? (item.value / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={18} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Lamaran per Posisi</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(stats.byPosition)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([position, count]) => (
                <div key={position} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{position}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            {Object.keys(stats.byPosition).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada data</p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Tren Lamaran per Bulan</h3>
        </div>
        <div className="space-y-2">
          {Object.entries(stats.byMonth)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .slice(0, 6)
            .map(([month, count]) => (
              <div key={month} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24">{month}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.max((count / Math.max(...Object.values(stats.byMonth))) * 100, 10)}%` }}
                  >
                    <span className="text-xs font-medium text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          {Object.keys(stats.byMonth).length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">Belum ada data</p>
          )}
        </div>
      </div>
    </div>
  );
}
