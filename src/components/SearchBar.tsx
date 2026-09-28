import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  OPERATIONS,
  PROPERTY_TYPES,
  SECTORS,
  type Operation,
  type PropertyType,
  type Sector,
} from '../config/site';

type Props = {
  variant?: 'overlap' | 'inline';
};

export default function SearchBar({ variant = 'overlap' }: Props) {
  const navigate = useNavigate();
  const [operation, setOperation] = useState<'Todos' | Operation>('Todos');
  const [type, setType] = useState<'Todos' | PropertyType>('Todos');
  const [sector, setSector] = useState<'Todos' | Sector>('Todos');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (operation !== 'Todos') params.set('op', operation);
    if (type !== 'Todos') params.set('type', type);
    if (sector !== 'Todos') params.set('sector', sector);
    if (minPrice.trim()) params.set('minPrice', minPrice.trim());
    if (maxPrice.trim()) params.set('maxPrice', maxPrice.trim());
    const qs = params.toString();
    navigate(`/propiedades${qs ? `?${qs}` : ''}`);
  };

  const handleClear = () => {
    setOperation('Todos');
    setType('Todos');
    setSector('Todos');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${variant === 'overlap' ? '-mt-12 sm:-mt-16 z-30' : ''}`}
      role="search"
      aria-label="Buscador rápido de propiedades"
    >
      <div className="glass-card p-4 sm:p-5 md:p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-end">
          <div>
            <label htmlFor="sb-op" className="block text-xs font-semibold text-teal-400 mb-1.5 uppercase tracking-wider">
              Operación
            </label>
            <select
              id="sb-op"
              value={operation}
              onChange={(e) => setOperation(e.target.value as 'Todos' | Operation)}
              className="field"
            >
              <option value="Todos">Comprar / Arrendar</option>
              {OPERATIONS.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sb-type" className="block text-xs font-semibold text-teal-400 mb-1.5 uppercase tracking-wider">
              Tipo
            </label>
            <select
              id="sb-type"
              value={type}
              onChange={(e) => setType(e.target.value as 'Todos' | PropertyType)}
              className="field"
            >
              <option value="Todos">Todos</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sb-sector" className="block text-xs font-semibold text-teal-400 mb-1.5 uppercase tracking-wider">
              Ubicación
            </label>
            <select
              id="sb-sector"
              value={sector}
              onChange={(e) => setSector(e.target.value as 'Todos' | Sector)}
              className="field"
            >
              <option value="Todos">Todos</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sb-min" className="block text-xs font-semibold text-teal-400 mb-1.5 uppercase tracking-wider">
              Precio mínimo
            </label>
            <input
              id="sb-min"
              type="text"
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="0"
              className="field"
            />
          </div>

          <div>
            <label htmlFor="sb-max" className="block text-xs font-semibold text-teal-400 mb-1.5 uppercase tracking-wider">
              Precio máximo
            </label>
            <input
              id="sb-max"
              type="text"
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="Sin tope"
              className="field"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 !py-3">
              <Search size={16} />
              <span className="hidden md:inline">Buscar</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn-outline !px-3 !py-3 text-xs"
              aria-label="Limpiar filtros"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
