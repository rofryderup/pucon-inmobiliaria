import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Building2,
  KeyRound,
  Wrench,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import PropertyGrid from '../components/PropertyGrid';
import ServiceCard from '../components/ServiceCard';
import { getFeaturedProperties } from '../data/properties';
import { SITE_CONFIG, whatsappLink } from '../config/site';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    document.title = 'Pucón Inmobiliaria | Casas, Parcelas y Propiedades en Pucón';
  }, []);

  const featured = getFeaturedProperties();

  return (
    <>
      <Hero />
      <SearchBar variant="overlap" />

      {/* Propiedades destacadas */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-28" id="destacadas">
        <div className="text-center mb-12">
          <p className="section-eyebrow">Catálogo seleccionado</p>
          <h2 className="section-title">Propiedades Destacadas</h2>
          <p className="section-subtitle mx-auto">
            Descubre una selección de propiedades en Pucón, Villarrica y sus alrededores.
          </p>
        </div>
        <PropertyGrid properties={featured} />
        <div className="mt-12 text-center">
          <Link to="/propiedades" className="btn-primary text-base">
            Ver todas las propiedades
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Servicios */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32">
        <div className="text-center mb-12">
          <p className="section-eyebrow">Servicios</p>
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-subtitle mx-auto">
            Asesoría integral para todas tus necesidades inmobiliarias.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          <ServiceCard
            icon={<Compass size={24} />}
            title="Compra"
            description="Te ayudamos a encontrar la propiedad ideal, con evaluación técnica y jurídica completa."
          />
          <ServiceCard
            icon={<Building2 size={24} />}
            title="Venta"
            description="Maximizamos el valor y exposición de tu propiedad con estrategia profesional."
          />
          <ServiceCard
            icon={<KeyRound size={24} />}
            title="Arriendo"
            description="Gestión completa para propietarios y arrendatarios con foco en zonas premium."
          />
          <ServiceCard
            icon={<Wrench size={24} />}
            title="Administración"
            description="Cuidamos y administramos tu inversión inmobiliaria con reportes claros."
          />
        </div>

        <div className="mt-12 text-center">
          <Link to="/servicios" className="btn-outline text-base">
            Conoce nuestros servicios
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Conocimiento local */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-teal-450/15">
              <img
                src="/images/pucon-lago.jpg"
                alt="Paisaje de Pucón con lago y bosque"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/50 to-transparent pointer-events-none" />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-teal-450/40 shadow-glow-teal">
              <img
                src="/images/pucon-bosque.jpg"
                alt="Bosque nativo cerca de Pucón"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="section-eyebrow">Sobre nosotros</p>
            <h2 className="section-title">Expertos en el Mercado de Pucón</h2>
            <div className="section-subtitle text-white/70">
              <p className="mb-4">
                Somos una inmobiliaria enfocada en Pucón, Villarrica y sus
                alrededores. Conocemos el territorio, sus sectores, accesos,
                oportunidades de inversión y particularidades del mercado local.
              </p>
              <p>
                Pucón combina naturaleza, turismo, conectividad e inversión
                inmobiliaria. Nuestro objetivo es ayudarte a encontrar una
                propiedad que realmente tenga sentido para tus necesidades.
              </p>
            </div>
            <Link to="/contacto" className="btn-primary mt-8 text-base">
              Conversemos
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32">
        <div className="relative glass-card overflow-hidden">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(circle at 20% 20%, rgba(34,211,211,0.18), transparent 60%), radial-gradient(circle at 80% 80%, rgba(34,211,211,0.12), transparent 60%)',
            }}
            aria-hidden="true"
          />
          <div className="relative px-6 sm:px-12 lg:px-16 py-14 sm:py-20 text-center">
            <span className="chip mb-5">
              <Sparkles size={12} />
              Estamos disponibles
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto">
              ¿Buscas una propiedad en Pucón?
            </h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              Cuéntanos qué necesitas y te ayudaremos a encontrar opciones que se ajusten a tu presupuesto y objetivos.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <a
                href={whatsappLink('Hola, vi su sitio web y me gustaría recibir información sobre propiedades disponibles en Pucón.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-base"
              >
                <MessageCircle size={18} />
                Hablar por WhatsApp
              </a>
              <Link to="/propiedades" className="btn-outline text-base">
                <Building2 size={18} />
                Ver propiedades
              </Link>
            </div>
            <p className="mt-6 text-white/45 text-xs">
              {SITE_CONFIG.location}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
