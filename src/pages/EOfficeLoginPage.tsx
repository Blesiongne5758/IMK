import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login, isDemoModeEnabled } from '../lib/auth';

export default function EOfficeLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/eoffice');
    } else {
      setError(result.error || 'Login gagal');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-cyan-200 bg-cyan-50 mb-4">
            <span className="font-display text-xl font-bold text-cyan-600">IMK</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
            E-Office Login
          </h1>
          <p className="text-sm text-gray-600">
            Masuk ke sistem E-Office PT. Inti Mutiara Kreasindo
          </p>
        </div>

        {/* Login Form */}
        <div className="border border-gray-200 rounded-xl bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@imk.co.id"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm placeholder:text-gray-400 transition-all focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm placeholder:text-gray-400 transition-all focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 bg-red-50">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-cyan-600 text-sm font-semibold text-white transition-all duration-300 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* Demo Credentials - Only shown in development mode */}
          {isDemoModeEnabled() && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-3 text-center">
                Demo Credentials (Development Only):
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <span className="text-gray-600">Admin:</span>
                  <code className="text-cyan-600 font-mono">admin@imk.co.id / admin123</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <span className="text-gray-600">Manager:</span>
                  <code className="text-cyan-600 font-mono">manager@imk.co.id / manager123</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <span className="text-gray-600">Staff:</span>
                  <code className="text-cyan-600 font-mono">staff@imk.co.id / staff123</code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2024 PT. Inti Mutiara Kreasindo. All rights reserved.
        </p>
      </div>
    </div>
  );
}
