import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { label: 'Inicio', to: '/' },
  { label: 'Propiedades', to: '/propiedades' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Contacto', to: '/contacto' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-ink-950/85 backdrop-blur-xl border-b border-teal-450/15'
          : 'bg-ink-950/40 backdrop-blur-md border-b border-transparent'
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          aria-label={`${SITE_CONFIG.name} — Inicio`}
        >
          <span className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-550 flex items-center justify-center shadow-glow-teal-sm overflow-hidden">
            <svg viewBox="0 0 64 64" className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true">
              <path d="M16 36 L32 22 L48 36 L48 50 L16 50 Z" fill="none" stroke="#062526" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              <rect x="28" y="40" width="8" height="10" fill="#062526" />
              <path d="M22 32 L28 24 L34 30 L40 22 L46 30" fill="none" stroke="#062526" strokeWidth="1.5" strokeOpacity="0.6" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-white font-semibold tracking-tight">Pucón</span>
            <span className="text-teal-400 text-xs tracking-widest font-medium -mt-0.5">INMOBILIARIA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => cn('nav-link', isActive && 'is-active')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link to="/contacto" className="btn-primary text-sm !py-2.5 !px-5">
            Contáctanos
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-teal-450/20 text-white/90 hover:border-teal-450/50"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          open ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!open}
      >
        <nav
          className="border-t border-teal-450/15 bg-ink-950/95 backdrop-blur-xl px-6 py-6 flex flex-col gap-1"
          aria-label="Navegación móvil"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'block py-3.5 px-4 rounded-xl text-base font-medium',
                  isActive
                    ? 'bg-teal-450/10 text-white border border-teal-450/25'
                    : 'text-white/80 border border-transparent hover:bg-white/5'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/contacto" className="btn-primary mt-4 justify-center">
            Contáctanos
          </Link>
        </nav>
      </div>
    </header>
  );
}
