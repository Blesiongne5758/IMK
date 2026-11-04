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
              {['Custom Software', 'Mobile & Web App', 'AI Integration', 'Cloud & DevOps', 'Security Audit'].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-widest mb-4">Perusahaan</h4>
            <ul className="space-y-2.5">
              {['Tentang Kami', 'Tim Engineering', 'Karir', 'Blog Teknis', 'Case Studies'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {['Documentation', 'API Reference', 'Security Whitepaper', 'Architecture Guide', 'Status Page'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
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
            <a href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
