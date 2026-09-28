import { useEffect } from 'react';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { SITE_CONFIG, whatsappLink } from '../config/site';

export default function Contact() {
  useEffect(() => {
    document.title = 'Contacto | Pucón Inmobiliaria';
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="text-center mb-12">
        <p className="section-eyebrow">Conversemos</p>
        <h1 className="section-title !text-4xl sm:!text-5xl">Contacto</h1>
        <p className="section-subtitle mx-auto">
          Completa el formulario o escríbenos directo por WhatsApp. Respondemos en horario hábil en pocos minutos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
        <aside className="lg:col-span-2 space-y-5">
          <div className="glass-card p-6 sm:p-7">
            <h2 className="text-white font-semibold text-lg mb-5">Información de contacto</h2>
            <ul className="space-y-4">
              <ContactRow
                icon={<Phone size={16} />}
                label="Teléfono"
                value={SITE_CONFIG.phoneDisplay}
                href={`tel:${SITE_CONFIG.phoneDisplay.replace(/\s/g, '')}`}
              />
              <ContactRow
                icon={<MessageCircle size={16} />}
                label="WhatsApp"
                value={SITE_CONFIG.whatsappDisplay}
                href={whatsappLink('Hola, vi su sitio web y me gustaría recibir información.')}
                external
              />
              <ContactRow
                icon={<Mail size={16} />}
                label="Email"
                value={SITE_CONFIG.email}
                href={`mailto:${SITE_CONFIG.email}`}
              />
              <ContactRow
                icon={<MapPin size={16} />}
                label="Ubicación"
                value={SITE_CONFIG.address}
              />
            </ul>
            <div className="mt-6 pt-6 border-t border-white/8">
              <p className="text-white/55 text-xs uppercase tracking-widest mb-1.5">Horario</p>
              <p className="text-white/75 text-sm">{SITE_CONFIG.schedule}</p>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-7 bg-gradient-to-br from-teal-450/8 to-transparent">
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-2">
              Tiempo de respuesta
            </h3>
            <p className="text-white/75 text-sm leading-relaxed">
              Cuesta poco contactarnos: normalmente respondemos el mismo día en horario hábil. Para una atención más rápida te recomendamos WhatsApp.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <span className="mt-1 w-9 h-9 rounded-xl bg-teal-450/10 border border-teal-450/25 text-teal-400 flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-white/55 text-xs uppercase tracking-widest">{label}</p>
        <p className="text-white mt-0.5 break-all">{value}</p>
      </div>
    </div>
  );

  if (!href) return <li>{inner}</li>;
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="block hover:translate-x-1 transition-transform"
      >
        {inner}
      </a>
    </li>
  );
}
