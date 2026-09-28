import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  images: string[];
  alt: string;
};

export default function PropertyGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = () => setLightbox(null);
  const next = () => {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % images.length);
  };
  const prev = () => {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  if (images.length === 0) return null;

  const main = images[active];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* Foto principal */}
        <button
          type="button"
          onClick={() => setLightbox(active)}
          className="md:col-span-2 relative aspect-[16/10] rounded-2xl overflow-hidden border border-teal-450/15 group cursor-zoom-in"
          aria-label="Ampliar foto principal"
        >
          <img
            src={main}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-ink-950/70 text-white/85 text-xs">
            {active + 1} / {images.length}
          </div>
        </button>

        {/* Miniaturas (2 visibles en desktop, las demás en thumbnails scrolleables en mobile) */}
        <div className="flex md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
          {images.slice(0, 4).map((src, idx) => (
            <button
              key={src + idx}
              type="button"
              onClick={() => setActive(idx)}
              onDoubleClick={() => setLightbox(idx)}
              className={`relative shrink-0 md:shrink aspect-[16/10] w-32 md:w-auto md:flex-1 rounded-xl overflow-hidden border-2 transition-all ${
                active === idx
                  ? 'border-teal-400 shadow-glow-teal-sm'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
              aria-label={`Ver imagen ${idx + 1}`}
            >
              <img
                src={src}
                alt={`${alt} - imagen ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Miniaturas adicionales (galería completa en grilla) */}
      {images.length > 4 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
          {images.map((src, idx) => (
            <button
              key={src + '-mini-' + idx}
              type="button"
              onClick={() => {
                setActive(idx);
                setLightbox(idx);
              }}
              className="aspect-square rounded-xl overflow-hidden border border-teal-450/15 hover:border-teal-450/40 transition-colors"
              aria-label={`Ampliar imagen ${idx + 1}`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-ink-950/96 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de imagen"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-ink-800/80 border border-white/10 text-white flex items-center justify-center hover:bg-ink-700"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 sm:left-6 w-11 h-11 rounded-full bg-ink-800/80 border border-white/10 text-white flex items-center justify-center hover:bg-ink-700"
            aria-label="Anterior"
          >
            <ChevronLeft size={22} />
          </button>
          <img
            src={images[lightbox]}
            alt={`${alt} - ${lightbox + 1}`}
            className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 sm:right-6 w-11 h-11 rounded-full bg-ink-800/80 border border-white/10 text-white flex items-center justify-center hover:bg-ink-700"
            aria-label="Siguiente"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs px-3 py-1.5 rounded-full bg-ink-800/70 border border-white/10">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
