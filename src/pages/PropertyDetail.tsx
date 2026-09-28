import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bed,
  Bath,
  Maximize,
  Trees,
  CarFront,
  MapPin,
  MessageCircle,
  Calendar,
  Share2,
  Check,
} from 'lucide-react';
import PropertyGallery from '../components/PropertyGallery';
import PropertyMap from '../components/PropertyMap';
import { findPropertyBySlug, PROPERTIES } from '../data/properties';
import { displayPrice, shareProperty } from '../lib/utils';
import { whatsappLinkFromProperty } from '../config/site';
import { useSEO } from '../hooks/useSEO';

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const property = slug ? findPropertyBySlug(slug) : undefined;
  const [copied, setCopied] = useState(false);

  useSEO(
    property
      ? {
          title: `${property.title} | Pucón Inmobiliaria`,
          description: property.shortDescription,
          image: property.coverImage,
          url: window.location.href,
        }
      : {
          title: 'Propiedad no encontrada | Pucón Inmobiliaria',
          description: '',
        }
  );

  useEffect(() => {
    if (property) {
      // Inyecta JSON-LD de la propiedad
      const scriptId = 'property-jsonld';
      let old = document.getElementById(scriptId);
      if (old) old.remove();
      const s = document.createElement('script');
      s.id = scriptId;
      s.type = 'application/ld+json';
      s.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SingleFamilyResidence',
        name: property.title,
        description: property.shortDescription,
        image: property.images,
        address: {
          '@type': 'PostalAddress',
          addressLocality: property.commune,
          addressRegion: property.region,
          addressCountry: 'CL',
          streetAddress: property.location,
        },
        ...(property.bedrooms !== undefined && { numberOfBedrooms: property.bedrooms }),
        ...(property.bathrooms !== undefined && { numberOfBathroomsTotal: property.bathrooms }),
        ...(property.builtArea !== undefined && { floorSize: { '@type': 'QuantitativeValue', value: property.builtArea, unitCode: 'MTK' } }),
        offers: {
          '@type': 'Offer',
          price: property.price ?? property.priceUF,
          priceCurrency: property.price ? 'CLP' : 'CLF',
          availability: property.status === 'Disponible' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      });
      document.head.appendChild(s);
    }
  }, [property]);

  if (!property) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="section-eyebrow">404</p>
        <h1 className="section-title">Propiedad no encontrada</h1>
        <p className="section-subtitle mx-auto">
          Esta propiedad no existe, fue removida o cambió de URL.
        </p>
        <Link to="/propiedades" className="btn-primary mt-6">
          Ver todas las propiedades
        </Link>
      </section>
    );
  }

  const handleShare = async () => {
    const ok = await shareProperty(property.title, window.location.href);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const related = PROPERTIES
    .filter((p) => p.id !== property.id && p.status === 'Disponible')
    .filter((p) => p.type === property.type || p.sector === property.sector)
    .slice(0, 3);

  return (
    <>
      {/* Header */}
      <section className="relative pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/propiedades"
            className="inline-flex items-center gap-2 text-white/65 hover:text-teal-400 text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Volver a propiedades
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-wrap items-start gap-4 justify-between mb-6">
          <div className="flex-1 min-w-[280px]">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="chip">{property.type}</span>
              <span className="chip-muted">{property.operation}</span>
              {property.status !== 'Disponible' && (
                <span className="chip-muted text-rose-300 border-rose-400/30 bg-rose-500/10">
                  {property.status}
                </span>
              )}
              {property.reference && (
                <span className="chip-muted">Ref. {property.reference}</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-white/65 mt-3">
              <MapPin size={16} className="text-teal-400" />
              <span>{property.location}, {property.commune}, {property.region}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 text-right">
            <span className="text-teal-400 font-bold text-3xl sm:text-4xl">
              {displayPrice(property)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="btn-outline !py-2 !px-3 text-sm"
                aria-label="Compartir propiedad"
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />}
                {copied ? 'Copiado' : 'Compartir'}
              </button>
            </div>
          </div>
        </div>

        <PropertyGallery images={property.images} alt={property.title} />
      </section>

      {/* Datos clave */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="glass-card p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {property.bedrooms !== undefined && (
            <Stat icon={<Bed size={18} />} label="Dormitorios" value={`${property.bedrooms}`} />
          )}
          {property.bathrooms !== undefined && (
            <Stat icon={<Bath size={18} />} label="Baños" value={`${property.bathrooms}`} />
          )}
          {property.builtArea !== undefined && (
            <Stat icon={<Maximize size={18} />} label="Construidos" value={`${property.builtArea} m²`} />
          )}
          {property.landArea !== undefined && (
            <Stat icon={<Trees size={18} />} label="Terreno" value={`${property.landArea.toLocaleString('es-CL')} m²`} />
          )}
          {property.parking !== undefined && (
            <Stat icon={<CarFront size={18} />} label="Estacionamientos" value={`${property.parking}`} />
          )}
        </div>
      </section>

      {/* Descripción + Detalles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <p className="section-eyebrow">Descripción</p>
            <h2 className="section-title !text-2xl sm:!text-3xl mb-4">
              Sobre esta propiedad
            </h2>
            <p className="text-white/75 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {property.features && property.features.length > 0 && (
            <div>
              <p className="section-eyebrow">Características</p>
              <h2 className="section-title !text-2xl sm:!text-3xl mb-5">
                Lo que ofrece
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-white/75">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {property.services && property.services.length > 0 && (
            <div>
              <p className="section-eyebrow">Servicios del sector</p>
              <h2 className="section-title !text-2xl sm:!text-3xl mb-4">
                Conectividad y servicios
              </h2>
              <div className="flex flex-wrap gap-2">
                {property.services.map((s) => (
                  <span key={s} className="chip-muted">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="section-eyebrow">Ubicación</p>
            <h2 className="section-title !text-2xl sm:!text-3xl mb-4">
              Dónde se encuentra
            </h2>
            <PropertyMap
              latitude={property.latitude}
              longitude={property.longitude}
              sector={property.sector}
              location={property.location}
            />
          </div>
        </div>

        {/* Sidebar CTA */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="glass-card p-6 sm:p-7">
              <h3 className="text-white font-semibold text-lg mb-2">
                ¿Te interesa esta propiedad?
              </h3>
              <p className="text-white/65 text-sm mb-5">
                Conversemos directo por WhatsApp o agendemos una visita.
              </p>
              <a
                href={whatsappLinkFromProperty(property.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center mb-3"
              >
                <MessageCircle size={18} />
                Consultar por WhatsApp
              </a>
              <Link
                to="/contacto"
                state={{ asunto: `Consulta sobre ${property.title}` }}
                className="btn-outline w-full justify-center"
              >
                <Calendar size={18} />
                Agendar visita
              </Link>
            </div>

            <div className="glass-card p-6 sm:p-7">
              <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-3">
                Detalles
              </h4>
              <dl className="text-sm space-y-2">
                <Row label="Tipo" value={property.type} />
                <Row label="Operación" value={property.operation} />
                <Row label="Sector" value={property.sector} />
                <Row label="Comuna" value={property.commune} />
                {property.reference && <Row label="Referencia" value={property.reference} />}
              </dl>
            </div>
          </div>
        </aside>
      </section>

      {/* Relacionadas */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <p className="section-eyebrow">Otras opciones</p>
          <h2 className="section-title !text-2xl sm:!text-3xl mb-8">
            Propiedades similares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/propiedad/${p.slug}`}
                className="glass-card overflow-hidden group"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white text-sm font-semibold line-clamp-1">{p.title}</h3>
                  <p className="text-white/60 text-xs mt-1 line-clamp-1">{p.location}</p>
                  <p className="text-teal-400 font-bold mt-2">{displayPrice(p)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 h-10 rounded-xl bg-teal-450/10 border border-teal-450/25 text-teal-400 flex items-center justify-center">
        {icon}
      </span>
      <div>
        <p className="text-white/60 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-white font-semibold text-base">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-white/70">
      <dt className="text-white/55">{label}</dt>
      <dd className="text-white text-right">{value}</dd>
    </div>
  );
}
