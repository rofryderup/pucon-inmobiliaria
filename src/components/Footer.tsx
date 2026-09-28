import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { SITE_CONFIG, whatsappLink } from '../config/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-teal-450/10 bg-ink-950/95 mt-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-450/40 to-transparent" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1 max-w-xs">
            <Link to="/" className="flex items-center gap-2.5 mb-4" aria-label="Inicio">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-550 flex items-center justify-center shadow-glow-teal-sm">
                <svg viewBox="0 0 64 64" className="w-6 h-6" aria-hidden="true">
                  <path d="M16 36 L32 22 L48 36 L48 50 L16 50 Z" fill="none" stroke="#062526" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                  <rect x="28" y="40" width="8" height="10" fill="#062526" />
                </svg>
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-white font-semibold tracking-tight">Pucón</span>
                <span className="text-teal-400 text-xs tracking-widest font-medium -mt-0.5">INMOBILIARIA</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Propiedades y asesoría inmobiliaria en Pucón, Villarrica y sus alrededores.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">Navegación</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/propiedades', label: 'Propiedades' },
                { to: '/servicios', label: 'Servicios' },
                { to: '/contacto', label: 'Contacto' },
                { to: '/privacidad', label: 'Política de privacidad' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/65 hover:text-teal-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-white/65">
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="mt-1 text-teal-400 shrink-0" />
                <a href={`tel:${SITE_CONFIG.phoneDisplay.replace(/\s/g, '')}`} className="hover:text-teal-400 transition-colors">
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 text-teal-400 shrink-0 font-bold">W</span>
                <a
                  href={whatsappLink('Hola, vi su sitio web y me gustaría recibir información sobre propiedades disponibles en Pucón.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="mt-1 text-teal-400 shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-teal-400 transition-colors break-all">
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-1 text-teal-400 shrink-0" />
                <span>{SITE_CONFIG.location}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">Síguenos</h3>
            <div className="flex items-center gap-3">
              {SITE_CONFIG.instagram && (
                <a
                  href={SITE_CONFIG.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl border border-teal-450/20 flex items-center justify-center text-white/70 hover:text-teal-400 hover:border-teal-450/50 transition-colors"
                >
                  <Instagram size={18} />
                </a>
              )}
              {SITE_CONFIG.facebook && (
                <a
                  href={SITE_CONFIG.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl border border-teal-450/20 flex items-center justify-center text-white/70 hover:text-teal-400 hover:border-teal-450/50 transition-colors"
                >
                  <Facebook size={18} />
                </a>
              )}
              {!SITE_CONFIG.instagram && !SITE_CONFIG.facebook && (
                <p className="text-white/55 text-sm">Próximamente</p>
              )}
            </div>
            <p className="text-white/55 text-xs mt-4">
              Horario<br />
              {SITE_CONFIG.schedule}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-white/45">
          <p>
            © {year} {SITE_CONFIG.name}. Todos los derechos reservados.
          </p>
          <p>
            Hecho con enfoque en Pucón, Araucanía.
          </p>
        </div>
      </div>
    </footer>
  );
}
