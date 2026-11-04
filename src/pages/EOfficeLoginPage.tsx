import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login } from '../lib/auth';

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
    <div className="min-h-screen pt-16 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-cyan/30 bg-cyan/5 mb-4">
            <span className="font-display text-xl font-bold text-cyan">IMK</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">
            E-Office Login
          </h1>
          <p className="text-sm text-text-secondary">
            Masuk ke sistem E-Office PT. Inti Mutiara Kreasindo
          </p>
        </div>

        {/* Login Form */}
        <div className="border border-white/[0.08] rounded-xl bg-surface/40 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@imk.co.id"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-white/[0.08] bg-surface-elevated text-text-primary text-sm placeholder:text-text-secondary/40 transition-all focus:outline-none focus:border-cyan/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50 hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-cyan text-sm font-semibold text-void transition-all duration-300 hover:bg-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-text-secondary mb-3 text-center">
              Demo Credentials:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-surface-elevated/50">
                <span className="text-text-secondary">Admin:</span>
                <code className="text-cyan font-mono">admin@imk.co.id / admin123</code>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-elevated/50">
                <span className="text-text-secondary">Manager:</span>
                <code className="text-cyan font-mono">manager@imk.co.id / manager123</code>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-elevated/50">
                <span className="text-text-secondary">Staff:</span>
                <code className="text-cyan font-mono">staff@imk.co.id / staff123</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-secondary/60 mt-6">
          © 2024 PT. Inti Mutiara Kreasindo. All rights reserved.
        </p>
      </div>
    </div>
  );
}
