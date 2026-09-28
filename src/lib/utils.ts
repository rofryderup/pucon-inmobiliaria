/**
 * Helpers utilitarios (formatos, slugs, clasificaciones).
 */

export const formatPriceCLP = (n: number): string => {
  if (!n || isNaN(n)) return '';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n);
};

export const formatUF = (n: number): string => {
  if (!n || isNaN(n)) return '';
  return `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)} UF`;
};

export const slugify = (input: string): string => {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const cn = (...classes: Array<string | undefined | null | false>): string =>
  classes.filter(Boolean).join(' ');

// Convierte un precio a número representativo para ordenar (CLP si hay, si no CLP aprox de UF).
const UF_TO_CLP = 37500; // referencia; ajustar en producción

export const priceComparable = (
  p: { price?: number; priceUF?: number; priceLabel?: string }
): number => {
  if (p.price && p.price > 0) return p.price;
  if (p.priceUF && p.priceUF > 0) return p.priceUF * UF_TO_CLP;
  return Number.POSITIVE_INFINITY;
};

export const displayPrice = (
  p: { price?: number; priceUF?: number; priceLabel?: string }
): string => {
  if (p.priceLabel && p.priceLabel !== '') return p.priceLabel;
  if (p.price && p.price > 0) return formatPriceCLP(p.price);
  if (p.priceUF && p.priceUF > 0) return formatUF(p.priceUF);
  return 'Consultar';
};

export const buildImageList = (slug: string, count: number): string[] => {
  const list: string[] = [];
  for (let i = 1; i <= count; i++) {
    list.push(`/images/properties/${slug}/${String(i).padStart(2, '0')}.jpg`);
  }
  return list;
};

// Coordenadas aproximadas por sector (para mostrar mapa cuando no hay lat/lng en la propiedad)
export const SECTOR_COORDS: Record<string, { lat: number; lng: number }> = {
  Pucón: { lat: -39.2823, lng: -71.9544 },
  Villarrica: { lat: -39.2857, lng: -72.2279 },
  Caburgua: { lat: -39.1800, lng: -71.8700 },
  'Camino a Caburgua': { lat: -39.2200, lng: -71.9050 },
  'Los Calabosos': { lat: -39.1650, lng: -71.7850 },
  Llafenco: { lat: -39.2500, lng: -71.8900 },
  Candelaria: { lat: -39.2700, lng: -71.9500 },
  Huife: { lat: -39.2400, lng: -71.7700 },
  Lipulli: { lat: -39.2300, lng: -71.9600 },
  Muquén: { lat: -39.2600, lng: -72.1400 },
  Otro: { lat: -39.2800, lng: -71.9600 },
};

export const shareProperty = async (
  title: string,
  url: string
): Promise<boolean> => {
  const shareData = {
    title,
    text: title,
    url,
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch {
      // usuario canceló
    }
  }
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

// Trunca texto con elipsis
export const truncate = (text: string, max: number): string => {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
};
