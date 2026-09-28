import { useEffect } from 'react';
import { SITE_CONFIG } from '../config/site';

type SEOConfig = {
  title: string;
  description: string;
  image?: string;
  url?: string;
};

/**
 * Actualiza título, meta description y OG tags.
 * Respeta el global del sitio si no se pasa un valor.
 */
export function useSEO(config: SEOConfig): void {
  useEffect(() => {
    // Title
    const baseTitle = config.title || SITE_CONFIG.defaultTitle;
    document.title = baseTitle;

    // Description
    setMeta('description', config.description || SITE_CONFIG.defaultDescription);

    // OG
    setOg('og:title', baseTitle);
    setOg('og:description', config.description || SITE_CONFIG.defaultDescription);
    setOg('og:image', config.image || SITE_CONFIG.defaultOgImage);
    setOg('og:url', config.url || SITE_CONFIG.url);
    setOg('og:type', 'website');

    // Twitter
    setMeta('twitter:title', baseTitle);
    setMeta('twitter:description', config.description || SITE_CONFIG.defaultDescription);
    setMeta('twitter:image', config.image || SITE_CONFIG.defaultOgImage);

    // Canonical
    const canonical = config.url || SITE_CONFIG.url;
    setLink('canonical', canonical);
  }, [config.title, config.description, config.image, config.url]);
}

function setMeta(name: string, value: string): void {
  if (!value) return;
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = value;
}

function setOg(property: string, value: string): void {
  if (!value) return;
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.content = value;
}

function setLink(rel: string, href: string): void {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}
