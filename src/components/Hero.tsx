import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      aria-label="Hero Pucón Inmobiliaria"
    >
      {/* Background image + overlays */}
      <div className="relative h-[680px] sm:h-[720px] md:h-[760px] lg:h-[760px]">
        <img
          src="/images/hero-volcan.jpg"
          alt="Volcán Villarrica y lago visto desde Pucón"
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        {/* Gradientes superpuestos */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/55 to-ink-950/95"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(34,211,211,0.18), transparent 60%)',
          }}
          aria-hidden="true"
        />
        {/* Grid sutil */}
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />

        {/* Contenido */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="chip mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-soft" />
              Tu destino inmobiliario en Pucón
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-[1.05] tracking-tight">
              <span className="block text-white">Tu Hogar en el Paraíso</span>
              <span
                className="block"
                style={{
                  background:
                    'linear-gradient(180deg, #ffffff 0%, #c4f0f0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                de la Araucanía
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl">
              Encuentra la propiedad perfecta en Pucón y sus alrededores, rodeado
              de lagos, volcanes, bosques y algunos de los paisajes más
              privilegiados del sur de Chile.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/propiedades" className="btn-primary text-base">
                Ver propiedades
                <ArrowRight size={18} />
              </Link>
              <Link to="/contacto" className="btn-outline text-base">
                <Phone size={18} />
                Contáctanos
              </Link>
            </div>

            {/* Indicador sutil */}
            <div className="mt-12 flex items-center gap-3 text-white/45 text-xs tracking-widest uppercase">
              <span className="w-8 h-px bg-teal-400/50" />
              Pucón · Villarrica · Caburgua
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] tracking-widest uppercase">Desliza</span>
          <span className="w-px h-8 bg-gradient-to-b from-teal-400/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
