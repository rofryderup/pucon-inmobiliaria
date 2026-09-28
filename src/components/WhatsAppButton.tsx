import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG, whatsappLink } from '../config/site';

export default function WhatsAppButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const message = 'Hola, vi su sitio web y me gustaría recibir información sobre propiedades disponibles en Pucón.';
  const link = whatsappLink(message);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`fixed bottom-6 left-6 z-40 transition-all duration-500 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-550 text-ink-950 shadow-glow-teal hover:shadow-glow-teal-lg hover:scale-105 transition-all">
        <MessageCircle size={26} fill="#062526" strokeWidth={0} className="text-ink-950" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-ink-950 animate-pulse-soft" />
        <span className="absolute inset-0 rounded-full animate-pulse-soft ring-2 ring-teal-400/30" />
      </span>
      <span className="absolute left-0 -top-9 px-3 py-1.5 rounded-lg bg-ink-950/85 border border-teal-450/20 text-white text-xs whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none">
        WhatsApp {SITE_CONFIG.whatsappDisplay}
      </span>
    </a>
  );
}
