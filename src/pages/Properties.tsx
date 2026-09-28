import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PropertyGrid from '../components/PropertyGrid';
import PropertyFilters from '../components/PropertyFilters';
import { PROPERTIES } from '../data/properties';
import type { PropertyFilters as Filters } from '../types';
import type { Operation, PropertyType, Sector } from '../config/site';
import { priceComparable } from '../lib/utils';

function readQuery(s: URLSearchParams): Filters {
  const get = (k: string) => s.get(k) || undefined;
  return {
    operation: (get('op') as 'Todos' | Operation | undefined) ?? 'Todos',
    type: (get('type') as 'Todos' | PropertyType | undefined) ?? 'Todos',
    sector: (get('sector') as 'Todos' | Sector | undefined) ?? 'Todos',
    minPrice: get('minPrice') ? Number(get('minPrice')) : undefined,
    maxPrice: get('maxPrice') ? Number(get('maxPrice')) : undefined,
    bedrooms: 'Todos',
    sort: 'recent',
  };
}

export default function Properties() {
  const [searchParams] = useSearchParams();
  const initial = readQuery(searchParams);

  const [filters, setFilters] = useState<Filters>(initial);
  const [showSold, setShowSold] = useState(false);

  useEffect(() => {
    setFilters(readQuery(searchParams));
  }, [searchParams]);

  useEffect(() => {
    document.title = 'Propiedades en Pucón y Villarrica | Pucón Inmobiliaria';
  }, []);

  const filtered = useMemo(() => {
    let list = PROPERTIES.filter((p) => showSold || p.status === 'Disponible');

    if (filters.operation && filters.operation !== 'Todos') {
      list = list.filter((p) => p.operation === filters.operation);
    }
    if (filters.type && filters.type !== 'Todos') {
      list = list.filter((p) => p.type === filters.type);
    }
    if (filters.sector && filters.sector !== 'Todos') {
      list = list.filter((p) => p.sector === filters.sector);
    }
    if (typeof filters.bedrooms === 'number') {
      const min = filters.bedrooms;
      list = list.filter((p) => (p.bedrooms ?? 0) >= min);
    }
    if (typeof filters.minPrice === 'number' && !isNaN(filters.minPrice)) {
      list = list.filter((p) => priceComparable(p) >= filters.minPrice!);
    }
    if (typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice)) {
      list = list.filter((p) => priceComparable(p) <= filters.maxPrice!);
    }

    switch (filters.sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => priceComparable(a) - priceComparable(b));
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => priceComparable(b) - priceComparable(a));
        break;
      case 'recent':
      default:
        list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
    }

    return list;
  }, [filters, showSold]);

  const handleClear = () => {
    setFilters({
      operation: 'Todos',
      type: 'Todos',
      sector: 'Todos',
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: 'Todos',
      sort: 'recent',
    });
    setShowSold(false);
  };

  return (
    <>
      {/* Header */}
      <section className="relative pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-450/8 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow">Catálogo</p>
          <h1 className="section-title !text-4xl sm:!text-5xl">Propiedades</h1>
          <p className="section-subtitle">
            Explora casas, departamentos, parcelas, terrenos y proyectos disponibles en Pucón y sus alrededores.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <PropertyFilters
          value={filters}
          onChange={setFilters}
        />

        {/* Toggle mostrar vendidas */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <label className="flex items-center gap-2.5 text-sm text-white/75 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSold}
              onChange={(e) => setShowSold(e.target.checked)}
              className="w-4 h-4 rounded border-teal-450/40 bg-ink-800 text-teal-450 focus:ring-teal-450"
            />
            Mostrar propiedades vendidas/reservadas
          </label>
          <span className="text-white/55 text-sm ml-auto">
            {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
          </span>
        </div>

        <PropertyGrid
          properties={filtered}
          onClearFilters={handleClear}
          emptyTitle="No encontramos propiedades"
          emptyMessage="No hay propiedades que coincidan con estos filtros. Ajusta los criterios o limpia los filtros."
        />

        <div className="mt-14 text-center">
          <Link to="/contacto" className="btn-outline">
            ¿No encuentras lo que buscas? Conversemos
          </Link>
        </div>
      </section>
    </>
  );
}
