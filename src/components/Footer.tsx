import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-16" aria-label="Footer">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-md border border-cyan/30 bg-cyan/5 flex items-center justify-center">
                <span className="font-display text-[9px] font-bold text-cyan">IMK</span>
              </div>
              <span className="font-display text-base font-semibold text-text-primary">PT. Inti Mutiara Kreasindo</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Enterprise IT Developer. Membangun infrastruktur digital yang aman, skalabel, dan siap untuk decade berikutnya.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-widest mb-4">Layanan</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/#services" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Custom Software
                </Link>
              </li>
              <li>
                <Link to="/#services" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Mobile & Web App
                </Link>
              </li>
              <li>
                <Link to="/#services" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  AI Integration
                </Link>
              </li>
              <li>
                <Link to="/showcase" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Showcase
                </Link>
              </li>
              <li>
                <Link to="/event" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-widest mb-4">Perusahaan</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/legalitas" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Legalitas
                </Link>
              </li>
              <li>
                <Link to="/lowongan" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Karir
                </Link>
              </li>
              <li>
                <Link to="/eoffice/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  E-Office
                </Link>
              </li>
              <li>
                <Link to="/jadwal" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Jadwal Konsultasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Security Whitepaper
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Architecture Guide
                </Link>
              </li>
              <li>
                <Link to="/jadwal" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                  Status Page
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-widest mb-4">Kontak</h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-text-secondary">engineering@intimutiara.co.id</li>
              <li className="text-sm text-text-secondary">+62 21 5055 8800</li>
              <li className="text-sm text-text-secondary">Jakarta • Singapore</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            © 2024 PT. Inti Mutiara Kreasindo. All rights reserved. ISO 27001 & SOC 2 Certified.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link to="/" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Terms of Service</Link>
            <Link to="/" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
