import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Building2,
  KeyRound,
  Wrench,
  Tag,
  Plane,
  ArrowRight,
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

const SERVICES = [
  {
    icon: <Compass size={24} />,
    title: 'Asesoría en Compra',
    description:
      'Te guiamos durante la búsqueda, evaluación, negociación y cierre de la compra.',
    bullets: ['Búsqueda segmentada', 'Visita coordinada', 'Análisis legal del título', 'Acompañamiento en cierre'],
  },
  {
    icon: <Building2 size={24} />,
    title: 'Asesoría en Venta',
    description:
      'Fotografía, publicación, difusión, evaluación de mercado y gestión de compradores.',
    bullets: ['Tasación profesional', 'Fotografía y video', 'Difusión segmentada', 'Gestión de ofertas'],
  },
  {
    icon: <KeyRound size={24} />,
    title: 'Gestión de Arriendos',
    description:
      'Gestión de arrendatarios, contratos, pagos y coordinación mensual.',
    bullets: ['Contratos', 'Cobro mensual', 'Mantención', 'Reportes'],
  },
  {
    icon: <Wrench size={24} />,
    title: 'Administración de Propiedades',
    description:
      'Servicio pensado especialmente para propietarios que viven fuera de Pucón.',
    bullets: ['Inspección periódica', 'Gestión de proveedores', 'Mantención preventiva', 'Reportes mensuales'],
  },
  {
    icon: <Tag size={24} />,
    title: 'Tasaciones',
    description:
      'Evaluación comercial basada en mercado, ubicación, condiciones y propiedades comparables.',
    bullets: ['Análisis comparativo', 'Informe escrito', 'Recomendación de precio'],
  },
  {
    icon: <Plane size={24} />,
    title: 'Turismo Inmobiliario',
    description:
      'Organización de recorridos y visitas para personas interesadas en invertir en la zona.',
    bullets: ['Recorridos personalizados', 'Coordinación logística', 'Agenda de visitas', 'Asesoría legal/financiera'],
  },
];

export default function Services() {
  useEffect(() => {
    document.title = 'Servicios Inmobiliarios | Pucón Inmobiliaria';
  }, []);

  return (
    <>
      <section className="relative pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-450/8 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow">Servicios</p>
          <h1 className="section-title !text-4xl sm:!text-5xl">Nuestros Servicios</h1>
          <p className="section-subtitle">
            Soluciones inmobiliarias para propietarios, compradores e inversionistas.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.title}
              icon={s.icon}
              title={s.title}
              description={s.description}
              bullets={s.bullets}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative glass-card overflow-hidden">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(circle at 80% 30%, rgba(34,211,211,0.15), transparent 60%)',
            }}
            aria-hidden="true"
          />
          <div className="relative px-6 sm:px-12 py-14 sm:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="section-eyebrow">¿Tienes una propiedad?</p>
              <h2 className="section-title !text-3xl sm:!text-4xl max-w-2xl">
                ¿Tienes una propiedad en Pucón?
              </h2>
              <p className="mt-3 text-white/70 max-w-xl">
                Conversemos sobre cómo comercializarla. Hacemos tasación, fotografía profesional y difusión segmentada.
              </p>
            </div>
            <Link to="/contacto" className="btn-primary text-base shrink-0">
              Conversemos
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
