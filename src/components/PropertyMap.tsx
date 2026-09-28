import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { SECTOR_COORDS } from '../lib/utils';

type Props = {
  latitude?: number;
  longitude?: number;
  sector?: string;
  location: string;
  privateHideExact?: boolean;
};

/**
 * Mapa simple renderizado con Leaflet + OpenStreetMap (sin API key).
 * Si no hay coordenadas exactas, cae al centro del sector.
 */
export default function PropertyMap({ latitude, longitude, sector, location, privateHideExact }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  const hasExact = latitude !== undefined && longitude !== undefined && !privateHideExact;
  const fallback = sector ? SECTOR_COORDS[sector] : undefined;
  const finalCoords = hasExact
    ? { lat: latitude!, lng: longitude! }
    : fallback;

  useEffect(() => {
    if (!ref.current || !finalCoords || error) return;

    let map: any = null;
    let cancelled = false;

    const initMap = async () => {
      try {
        // Cargar Leaflet dinámicamente (no se incluye en el bundle inicial)
        const L = (await import('leaflet')).default;

        // Cargar CSS de Leaflet
        if (!document.querySelector('link[data-leaflet]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.setAttribute('data-leaflet', 'true');
          document.head.appendChild(link);
        }

        // Esperar un poco para layout
        await new Promise((r) => setTimeout(r, 30));
        if (cancelled || !ref.current) return;

        // Evitar doble inicialización en StrictMode
        if ((ref.current as any)._leaflet_id) {
          return;
        }

        map = L.map(ref.current, {
          center: [finalCoords.lat, finalCoords.lng],
          zoom: hasExact ? 13 : 11,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            background: linear-gradient(135deg, #22d3d3 0%, #06b6b6 100%);
            width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 6px 18px rgba(34,211,211,0.45), 0 0 0 3px rgba(11,16,17,0.8);
            display:flex;align-items:center;justify-content:center;
          "><div style="transform: rotate(45deg); color:#062526;font-weight:bold;">📍</div></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        L.marker([finalCoords.lat, finalCoords.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${location}</strong>`);

        // Habilitar scroll-zoom al click
        map.on('click', () => map.scrollWheelZoom.enable());
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Map failed to init:', e);
        setError(true);
      }
    };

    initMap();
    return () => {
      cancelled = true;
      if (map) {
        try {
          map.remove();
        } catch {}
      }
    };
  }, [finalCoords?.lat, finalCoords?.lng, hasExact, location, error]);

  if (!finalCoords) {
    return (
      <div className="rounded-2xl border border-teal-450/15 bg-ink-800/40 p-6 text-center text-white/65">
        <MapPin size={20} className="text-teal-400 mx-auto mb-2" />
        <p className="text-sm">Ubicación referencial: {location}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-teal-450/15 bg-ink-800/40">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-teal-450/10 text-sm text-white/75">
        <MapPin size={16} className="text-teal-400" />
        <span>{location}</span>
        {!hasExact && (
          <span className="chip-muted ml-auto text-[10px]">Ubicación referencial</span>
        )}
      </div>
      <div
        ref={ref}
        className="w-full h-72 sm:h-80 bg-ink-900"
        aria-label="Mapa de ubicación"
      />
    </div>
  );
}
