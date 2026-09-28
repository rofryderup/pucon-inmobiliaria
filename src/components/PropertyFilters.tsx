import {
  OPERATIONS,
  PROPERTY_TYPES,
  SECTORS,
  type Operation,
  type PropertyType,
  type Sector,
} from '../config/site';
import type { PropertyFilters as Filters } from '../types';
import { Filter, X } from 'lucide-react';

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
  showStatus?: boolean;
};

const SORT_OPTIONS: { value: NonNullable<Filters['sort']>; label: string }[] = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
];

export default function PropertyFilters({ value, onChange, showStatus = false }: Props) {
  const update = (patch: Partial<Filters>) => onChange({ ...value, ...patch });

  const handleClear = () => {
    onChange({
      operation: 'Todos',
      type: 'Todos',
      sector: 'Todos',
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: 'Todos',
      sort: 'recent',
      status: undefined,
    });
  };

  const activeFilters =
    (value.operation && value.operation !== 'Todos' ? 1 : 0) +
    (value.type && value.type !== 'Todos' ? 1 : 0) +
    (value.sector && value.sector !== 'Todos' ? 1 : 0) +
    (value.minPrice ? 1 : 0) +
    (value.maxPrice ? 1 : 0) +
    (value.bedrooms && value.bedrooms !== 'Todos' ? 1 : 0);

  return (
    <div className="glass-card p-4 sm:p-5 mb-8" role="region" aria-label="Filtros de propiedades">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-teal-400" />
          <h2 className="text-white font-semibold text-sm tracking-wide">Filtros</h2>
          {activeFilters > 0 && (
            <span className="chip-muted">{activeFilters} activos</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-white/65 hover:text-teal-400 inline-flex items-center gap-1 transition-colors"
          aria-label="Limpiar filtros"
        >
          <X size={14} />
          Limpiar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label htmlFor="f-op" className="field-label">Operación</label>
          <select
            id="f-op"
            value={value.operation ?? 'Todos'}
            onChange={(e) => update({ operation: e.target.value as 'Todos' | Operation })}
            className="field"
          >
            <option value="Todos">Todas</option>
            {OPERATIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
          </select>
        </div>

        <div>
          <label htmlFor="f-type" className="field-label">Tipo</label>
          <select
            id="f-type"
            value={value.type ?? 'Todos'}
            onChange={(e) => update({ type: e.target.value as 'Todos' | PropertyType })}
            className="field"
          >
            <option value="Todos">Todos</option>
            {PROPERTY_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>

        <div>
          <label htmlFor="f-sector" className="field-label">Sector</label>
          <select
            id="f-sector"
            value={value.sector ?? 'Todos'}
            onChange={(e) => update({ sector: e.target.value as 'Todos' | Sector })}
            className="field"
          >
            <option value="Todos">Todos</option>
            {SECTORS.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>

        <div>
          <label htmlFor="f-bedrooms" className="field-label">Dormitorios</label>
          <select
            id="f-bedrooms"
            value={value.bedrooms ?? 'Todos'}
            onChange={(e) => {
              const v = e.target.value;
              update({ bedrooms: v === 'Todos' ? 'Todos' : Number(v) });
            }}
            className="field"
          >
            <option value="Todos">Todos</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div>
          <label htmlFor="f-min" className="field-label">Precio mínimo</label>
          <input
            id="f-min"
            type="text"
            inputMode="numeric"
            value={value.minPrice ?? ''}
            onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="0"
            className="field"
          />
        </div>

        <div>
          <label htmlFor="f-max" className="field-label">Precio máximo</label>
          <input
            id="f-max"
            type="text"
            inputMode="numeric"
            value={value.maxPrice ?? ''}
            onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="Sin tope"
            className="field"
          />
        </div>

        <div>
          <label htmlFor="f-sort" className="field-label">Ordenar</label>
          <select
            id="f-sort"
            value={value.sort ?? 'recent'}
            onChange={(e) => update({ sort: e.target.value as NonNullable<Filters['sort']> })}
            className="field"
          >
            {SORT_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </div>

        {showStatus && (
          <div>
            <label htmlFor="f-status" className="field-label">Estado</label>
            <select
              id="f-status"
              value={value.status ?? 'Disponible'}
              onChange={(e) => update({ status: e.target.value as Filters['status'] })}
              className="field"
            >
              <option value="Disponible">Disponibles</option>
              <option value="Reservada">Reservadas</option>
              <option value="Vendida">Vendidas</option>
              <option value="Arrendada">Arrendadas</option>
            </select>
          </div>
        )}
      </div>

      <style>{`
        .field-label {
          display:block;
          font-size:0.72rem;
          font-weight:600;
          color:#22d3d3;
          margin-bottom:0.35rem;
          text-transform:uppercase;
          letter-spacing:0.08em;
        }
      `}</style>
    </div>
  );
}
