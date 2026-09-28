import type { Property } from '../types';
import PropertyCard from './PropertyCard';

type Props = {
  properties: Property[];
  emptyTitle?: string;
  emptyMessage?: string;
  onClearFilters?: () => void;
};

export default function PropertyGrid({
  properties,
  emptyTitle = 'No encontramos propiedades',
  emptyMessage = 'No hay propiedades disponibles que coincidan con los filtros aplicados.',
  onClearFilters,
}: Props) {
  if (properties.length === 0) {
    return (
      <div className="glass-card p-10 text-center max-w-2xl mx-auto">
        <h3 className="section-title text-2xl mb-3">{emptyTitle}</h3>
        <p className="text-white/65 mb-6">{emptyMessage}</p>
        {onClearFilters && (
          <button onClick={onClearFilters} className="btn-outline">
            Limpiar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
