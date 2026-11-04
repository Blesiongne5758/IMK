import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { label: 'Layanan', href: '#services' },
  { label: 'Infrastruktur', href: '#infrastructure' },
  { label: 'Kapabilitas', href: '#capability' },
  { label: 'Proses', href: '#process' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-void/80 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <Logo variant="icon" size={36} />
            <div className="flex flex-col">
              <span className="font-display text-base font-semibold tracking-tight text-text-primary leading-tight">
                Inti Mutiara Kreasindo
              </span>
              <span className="text-[9px] text-text-secondary/60 uppercase tracking-[0.2em] leading-none mt-0.5">
                Technology & AI Solutions
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-cyan/40 bg-cyan/5 px-4 py-2 text-sm font-medium text-cyan transition-all duration-300 hover:bg-cyan/10 hover:border-cyan/70"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75 animate-ping-slow"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan"></span>
              </span>
              Konsultasi Proyek
            </a>
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
              <a
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-cyan/40 bg-cyan/5 px-4 py-2 text-sm font-medium text-cyan mt-3"
              onClick={() => setMobileOpen(false)}
            >
              Konsultasi Proyek
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
