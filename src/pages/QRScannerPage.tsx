import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Check, X, AlertCircle, Camera, User } from 'lucide-react';
import { getCurrentUser } from '../lib/auth';

interface ScanResult {
  success: boolean;
  employeeName?: string;
  employeeEmail?: string;
  department?: string;
  eventName?: string;
  message?: string;
  alreadyCheckedIn?: boolean;
}

export default function QRScannerPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/eoffice/login');
      return;
    }

    // Check if user is committee with scanner role
    const committees = JSON.parse(localStorage.getItem('imk_event_committees') || '[]');
    const isScanner = committees.find(
      (c: any) => c.employeeEmail === user.email && c.role === 'scanner'
    );

    if (!isScanner) {
      alert('Anda tidak memiliki akses sebagai scanner. Hubungi admin event.');
      navigate('/eoffice');
    }
  }, [navigate, user]);

  const handleManualCheckIn = () => {
    if (!manualCode.trim()) {
      alert('Masukkan kode tiket');
      return;
    }

    // Parse ticket code
    const parts = manualCode.split('-');
    if (parts.length < 3) {
      setLastScan({
        success: false,
        message: 'Format kode tiket tidak valid',
      });
      return;
    }

    const [, eventId, employeeId] = parts;

    // Find registration
    const registrations = JSON.parse(localStorage.getItem('imk_event_registrations') || '[]');
    const registration = registrations.find(
      (r: any) => r.eventId === eventId && r.employeeId === employeeId
    );

    if (!registration) {
      setLastScan({
        success: false,
        message: 'Tiket tidak ditemukan',
      });
      return;
    }

    // Check if already checked in
    if (registration.checkedIn) {
      setLastScan({
        success: false,
        message: 'Peserta sudah check-in sebelumnya',
        employeeName: registration.employeeName,
        employeeEmail: registration.employeeEmail,
        department: registration.department,
        alreadyCheckedIn: true,
      });
      return;
    }

    // Find event
    const events = JSON.parse(localStorage.getItem('imk_events') || '[]');
    const event = events.find((e: any) => e.id === eventId);

    // Update registration
    registration.checkedIn = true;
    registration.checkedInAt = new Date().toISOString();
    localStorage.setItem('imk_event_registrations', JSON.stringify(registrations));

    setLastScan({
      success: true,
      employeeName: registration.employeeName,
      employeeEmail: registration.employeeEmail,
      department: registration.department,
      eventName: event?.title,
    });

    setManualCode('');

    // Reset after 3 seconds
    setTimeout(() => setLastScan(null), 3000);
  };

  // Simulate camera scan (in real app, use camera library)
  const startCameraScan = () => {
    setScanning(true);
    // Simulate scan after 2 seconds
    setTimeout(() => {
      setScanning(false);
      // In real implementation, this would use a QR code scanning library
      alert('Fitur scan kamera akan tersedia setelah mengintegrasikan library QR scanner seperti html5-qrcode atau react-qr-reader');
    }, 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-16 bg-void">
      {/* Top Bar */}
      <div className="border-b border-white/[0.06] bg-surface/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <QrCode size={20} className="text-cyan" />
              <div>
                <h1 className="font-display text-sm sm:text-base font-semibold text-text-primary">
                  QR Scanner
                </h1>
                <p className="text-[10px] sm:text-xs text-text-secondary hidden sm:block">
                  Scan tiket peserta untuk check-in
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/eoffice')}
              className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-text-secondary hover:text-text-primary hover:border-white/[0.15] transition-all"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Scanner Area */}
        <div className="border border-white/[0.08] rounded-xl bg-surface/40 p-4 sm:p-6 mb-6">
          <div className="aspect-square max-w-md mx-auto bg-surface-elevated rounded-xl border-2 border-dashed border-white/[0.1] flex items-center justify-center mb-4">
            {scanning ? (
              <div className="text-center">
                <Camera size={48} className="text-cyan mx-auto mb-3 animate-pulse" />
                <p className="text-sm text-text-secondary">Scanning...</p>
              </div>
            ) : (
              <div className="text-center">
                <QrCode size={64} className="text-text-secondary/30 mx-auto mb-3" />
                <p className="text-sm text-text-secondary mb-1">Area Scanner</p>
                <p className="text-xs text-text-secondary/60">
                  Arahkan kamera ke QR code tiket
                </p>
              </div>
            )}
          </div>

          <button
            onClick={startCameraScan}
            disabled={scanning}
            className="w-full py-3 rounded-lg bg-cyan text-sm font-semibold text-void hover:bg-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {scanning ? 'Scanning...' : 'Mulai Scan Kamera'}
          </button>
        </div>

        {/* Manual Input */}
        <div className="border border-white/[0.08] rounded-xl bg-surface/40 p-4 sm:p-6 mb-6">
          <h3 className="font-display text-sm sm:text-base font-semibold text-text-primary mb-3">
            Input Manual
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mb-4">
            Masukkan kode tiket secara manual jika scan tidak berhasil
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="TICKET-eventId-employeeId-timestamp"
              className="flex-1 px-3 sm:px-4 py-2.5 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-cyan/50"
            />
            <button
              onClick={handleManualCheckIn}
              className="px-4 sm:px-6 py-2.5 rounded-lg bg-cyan text-sm font-semibold text-void hover:bg-cyan/90 transition-all"
            >
              Check-in
            </button>
          </div>
        </div>

        {/* Scan Result */}
        {lastScan && (
          <div
            className={`border rounded-xl p-4 sm:p-6 ${
              lastScan.success
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-red-500/30 bg-red-500/5'
            }`}
          >
            <div className="flex items-start gap-3">
              {lastScan.success ? (
                <Check size={24} className="text-emerald-400 flex-shrink-0" />
              ) : (
                <X size={24} className="text-red-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4
                  className={`font-display text-base sm:text-lg font-semibold mb-2 ${
                    lastScan.success ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {lastScan.success ? 'Check-in Berhasil!' : 'Check-in Gagal'}
                </h4>
                {lastScan.success && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-text-secondary" />
                      <span className="text-sm text-text-primary font-medium">
                        {lastScan.employeeName}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">{lastScan.department}</p>
                    <p className="text-xs text-text-secondary/60 font-mono">
                      {lastScan.employeeEmail}
                    </p>
                    {lastScan.eventName && (
                      <p className="text-xs text-text-secondary mt-2">
                        Event: {lastScan.eventName}
                      </p>
                    )}
                  </div>
                )}
                {!lastScan.success && (
                  <p className="text-sm text-text-secondary">{lastScan.message}</p>
                )}
                {lastScan.alreadyCheckedIn && lastScan.employeeName && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-text-secondary" />
                      <span className="text-sm text-text-primary font-medium">
                        {lastScan.employeeName}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">{lastScan.department}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 rounded-lg border border-white/[0.06] bg-surface-elevated/30">
          <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-cyan" />
            Petunjuk Penggunaan
          </h4>
          <ul className="space-y-1 text-xs text-text-secondary">
            <li>• Pastikan peserta menunjukkan QR code tiket digital</li>
            <li>• Arahkan kamera ke QR code atau input kode manual</li>
            <li>• Sistem akan memvalidasi dan mencatat waktu check-in</li>
            <li>• Peserta yang sudah check-in tidak bisa check-in ulang</li>
            <li>• Hanya panitia dengan role "Scanner" yang bisa menggunakan fitur ini</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
