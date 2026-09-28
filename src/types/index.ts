import type { Operation, PropertyStatus, PropertyType, Sector } from '../config/site';

export interface Property {
  id: string;
  slug: string;

  // Identidad
  title: string;
  reference?: string;

  // Clasificación
  operation: Operation;
  type: PropertyType;
  status: PropertyStatus;

  // Precio
  price?: number;          // CLP
  priceUF?: number;        // UF
  priceLabel?: string;     // Ej: "Consultar", "Desde 3.500 UF"

  // Ubicación
  location: string;
  sector: Sector;
  commune: string;
  region: string;
  latitude?: number;
  longitude?: number;

  // Características
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  builtArea?: number;   // m² construidos
  landArea?: number;    // m² terreno

  // Contenido
  description: string;
  shortDescription: string;
  features?: string[];   // Ej: ["Piscina", "Calefacción"]
  services?: string[];   // servicios del sector (opcional)

  // Media
  images: string[];      // rutas a /images/properties/...
  coverImage: string;

  // Estado y publicación
  featured?: boolean;
  createdAt: string;     // ISO 8601
}

export type PropertyFilters = {
  operation?: Operation | 'Todos';
  type?: PropertyType | 'Todos';
  sector?: Sector | 'Todos';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'Todos';
  status?: PropertyStatus;
  sort?: 'recent' | 'price-asc' | 'price-desc';
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ts: number;
  quickReplies?: string[];
};
