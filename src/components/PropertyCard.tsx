import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import type { Property } from '../types';
import { displayPrice } from '../lib/utils';

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  const isSold = property.status === 'Vendida' || property.status === 'Arrendada' || property.status === 'Reservada';

  return (
    <Link
      to={`/propiedad/${property.slug}`}
      className="group block glass-card overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60"
      aria-label={`Ver ${property.title}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.coverImage}
          alt={property.title}
          loading="lazy"
          decoding="async"
          width={800}
          height={600}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/hero-volcan.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/20 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="chip backdrop-blur-md bg-ink-950/70">
            {property.type}
          </span>
          {property.operation === 'Arriendo' && (
            <span className="chip-muted backdrop-blur-md bg-ink-950/65 border-teal-450/30 text-teal-300">
              {property.operation}
            </span>
          )}
        </div>
        {isSold && (
          <div className="absolute inset-0 bg-ink-950/70 flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold tracking-widest text-sm">
              {property.status.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 group-hover:text-teal-400 transition-colors">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-white/60 text-xs mb-4">
          <MapPin size={12} className="text-teal-400 shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-white/65 mb-4">
          {property.bedrooms !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <Bed size={14} className="text-teal-400" />
              {property.bedrooms} dorm.
            </span>
          )}
          {property.bathrooms !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <Bath size={14} className="text-teal-400" />
              {property.bathrooms} baños
            </span>
          )}
          {property.builtArea !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <Maximize size={14} className="text-teal-400" />
              {property.builtArea} m²
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/8">
          <span className="text-teal-400 font-bold text-lg">
            {displayPrice(property)}
          </span>
          <span className="text-white/60 text-xs group-hover:text-white transition-colors inline-flex items-center gap-1">
            Ver propiedad →
          </span>
        </div>
      </div>
    </Link>
  );
}
