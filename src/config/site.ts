/**
 * Configuración central del sitio. Toda la app consume estos valores.
 * Modifica este único archivo para actualizar datos de contacto y branding.
 */
export const SITE_CONFIG = {
  name: 'Pucón Inmobiliaria',
  shortName: 'Pucón Inmobiliaria',
  tagline: 'Tu Hogar en el Paraíso de la Araucanía',
  description:
    'Encuentra casas, departamentos, parcelas, terrenos y oportunidades inmobiliarias en Pucón, Villarrica y sus alrededores.',
  url: 'https://puconinmobiliaria.cl',

  // Contacto (reemplazar con los reales antes de subir a producción)
  whatsapp: '56968397607', // sin "+" - usado en https://wa.me/
  whatsappDisplay: '+56 9 6839 7607',
  phone: '+56 9 6839 7607',
  phoneDisplay: '+56 9 6839 7607',
  email: 'info@puconinmobiliaria.cl',

  // Ubicación
  location: 'Pucón, Región de La Araucanía',
  address: 'Pucón, Chile',
  schedule: 'Lunes a viernes · 9:00 a 19:00 hrs',

  // Redes
  instagram: 'https://www.instagram.com/puconagenciainmobiliaria',
  facebook: 'https://www.facebook.com/PuconAgenciaInmobiliaria',

  // SEO
  defaultTitle: 'Pucón Inmobiliaria | Casas, Parcelas y Propiedades en Pucón',
  defaultDescription:
    'Encuentra casas, departamentos, parcelas, terrenos y oportunidades inmobiliarias en Pucón, Villarrica y sus alrededores.',
  defaultOgImage: '/images/hero-volcan.jpg',
};

// Sectores disponibles (usado en filtros y datos)
export const SECTORS = [
  'Pucón',
  'Villarrica',
  'Caburgua',
  'Camino a Caburgua',
  'Los Calabosos',
  'Llafenco',
  'Candelaria',
  'Huife',
  'Lipulli',
  'Muquén',
  'Otro',
] as const;

export type Sector = (typeof SECTORS)[number];

// Tipos de operación
export const OPERATIONS = ['Venta', 'Arriendo'] as const;
export type Operation = (typeof OPERATIONS)[number];

// Tipos de propiedad
export const PROPERTY_TYPES = [
  'Casa',
  'Departamento',
  'Parcela',
  'Terreno',
  'Campo',
  'Proyecto',
  'Lodge',
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

// Estados de propiedad
export const PROPERTY_STATUS = ['Disponible', 'Reservada', 'Vendida', 'Arrendada'] as const;
export type PropertyStatus = (typeof PROPERTY_STATUS)[number];

// Helper: arma URL wa.me
export const whatsappLink = (text: string): string => {
  const phone = SITE_CONFIG.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

export const whatsappLinkFromProperty = (propertyTitle: string): string =>
  whatsappLink(`Hola, estoy interesado/a en "${propertyTitle}". ¿Podrían enviarme más información?`);
