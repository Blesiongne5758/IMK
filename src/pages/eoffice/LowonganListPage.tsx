import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Phone, Calendar, MapPin, Eye, Filter, Download } from 'lucide-react';
import { JobApplicationService } from '../../lib/services';

interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  position: string;
  education: {
    degree: string;
    major: string;
    university: string;
    graduationYear: string;
    gpa?: string;
  };
  experience?: string;
  skills: string[];
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  cvUrl?: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  submittedAt: string;
  updatedAt: string;
}

export default function LowonganListPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await JobApplicationService.getAllJobApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: JobApplication['status']) => {
    try {
      await JobApplicationService.updateJobApplicationStatus(id, status);
      await loadApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (filterPosition !== 'all' && app.position !== filterPosition) return false;
    return true;
  });

  const uniquePositions = [...new Set(applications.map((app) => app.position))];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
    interview: 'bg-purple-100 text-purple-800 border-purple-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusLabels = {
    pending: 'Menunggu Review',
    reviewed: 'Sudah Direview',
    interview: 'Jadwal Interview',
    accepted: 'Diterima',
    rejected: 'Ditolak',
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Daftar Lamaran Pekerjaan</h1>
        <p className="text-gray-600">Kelola semua lamaran yang masuk dari halaman lowongan</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Filter</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Review</option>
              <option value="reviewed">Sudah Direview</option>
              <option value="interview">Jadwal Interview</option>
              <option value="accepted">Diterima</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Posisi</label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Semua Posisi</option>
              {uniquePositions.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              Total: {filteredApplications.length} lamaran
            </span>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Belum ada lamaran yang masuk</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedApplication(app)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {app.fullName}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{app.position}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={12} />
                        {app.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {app.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(app.submittedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApplication(app);
                    }}
                    className="p-2 text-gray-400 hover:text-cyan-600 transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Detail Lamaran</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedApplication.fullName}</h3>
                <p className="text-gray-600">{selectedApplication.position}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Telepon</label>
                  <p className="text-sm text-gray-900">{selectedApplication.phone}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Pendidikan</label>
                <div className="mt-1 text-sm text-gray-900">
                  <p>{selectedApplication.education.degree} - {selectedApplication.education.major}</p>
                  <p className="text-gray-600">{selectedApplication.education.university}</p>
                  <p className="text-gray-600">Lulus: {selectedApplication.education.graduationYear}</p>
                  {selectedApplication.education.gpa && (
                    <p className="text-gray-600">IPK: {selectedApplication.education.gpa}</p>
                  )}
                </div>
              </div>

              {selectedApplication.experience && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Pengalaman</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedApplication.experience}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500">Skills</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedApplication.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {(selectedApplication.portfolioUrl || selectedApplication.githubUrl || selectedApplication.linkedinUrl) && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Links</label>
                  <div className="mt-1 space-y-1">
                    {selectedApplication.portfolioUrl && (
                      <a href={selectedApplication.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:underline block">
                        Portfolio
                      </a>
                    )}
                    {selectedApplication.githubUrl && (
                      <a href={selectedApplication.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:underline block">
                        GitHub
                      </a>
                    )}
                    {selectedApplication.linkedinUrl && (
                      <a href={selectedApplication.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:underline block">
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}

              {selectedApplication.coverLetter && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Cover Letter</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500">Status</label>
                <select
                  value={selectedApplication.status}
                  onChange={(e) => {
                    handleStatusChange(selectedApplication.id, e.target.value as JobApplication['status']);
                    setSelectedApplication({ ...selectedApplication, status: e.target.value as JobApplication['status'] });
                  }}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="pending">Menunggu Review</option>
                  <option value="reviewed">Sudah Direview</option>
                  <option value="interview">Jadwal Interview</option>
                  <option value="accepted">Diterima</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
