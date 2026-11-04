import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Layanan', href: '/#services' },
  { label: 'Infrastruktur', href: '/#infrastructure' },
  { label: 'Kapabilitas', href: '/#capability' },
  { label: 'Legalitas', href: '/legalitas' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-void/80 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-md border border-cyan/30 bg-cyan/5 flex items-center justify-center transition-colors duration-300 group-hover:border-cyan/60">
              <span className="font-display text-[10px] font-bold text-cyan">IMK</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
              PT. Inti Mutiara Kreasindo
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/jadwal"
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/jadwal' ? 'text-cyan' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Jadwal
            </Link>
            <Link
              to="/lowongan"
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/lowongan' ? 'text-cyan' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Lowongan
            </Link>
            <Link
              to="/eoffice/login"
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname.startsWith('/eoffice') ? 'text-cyan' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              E-Office
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              to="/jadwal"
              className="inline-flex items-center gap-2 rounded-md border border-cyan/40 bg-cyan/5 px-4 py-2 text-sm font-medium text-cyan transition-all duration-300 hover:bg-cyan/10 hover:border-cyan/70"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75 animate-ping-slow"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan"></span>
              </span>
              Konsultasi Proyek
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-void/95 backdrop-blur-md">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/jadwal"
              className={`block text-sm font-medium transition-colors py-2 ${
                location.pathname === '/jadwal' ? 'text-cyan' : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Jadwal
            </Link>
            <Link
              to="/lowongan"
              className={`block text-sm font-medium transition-colors py-2 ${
                location.pathname === '/lowongan' ? 'text-cyan' : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Lowongan
            </Link>
            <Link
              to="/eoffice/login"
              className={`block text-sm font-medium transition-colors py-2 ${
                location.pathname.startsWith('/eoffice') ? 'text-cyan' : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              E-Office
            </Link>
            <Link
              to="/jadwal"
              className="inline-flex items-center gap-2 rounded-md border border-cyan/40 bg-cyan/5 px-4 py-2 text-sm font-medium text-cyan mt-3"
              onClick={() => setMobileOpen(false)}
            >
              Konsultasi Proyek
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
