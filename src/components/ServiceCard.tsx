import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  to?: string;
  cta?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets?: string[];
  variant?: 'default' | 'compact';
};

export default function ServiceCard({ to, cta = 'Conoce más', icon, title, description, bullets, variant = 'default' }: Props) {
  const content = (
    <div className={`glass-card h-full p-6 sm:p-8 ${to ? 'cursor-pointer hover:translate-y-[-2px] transition-transform' : ''}`}>
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border border-teal-450/30 bg-teal-450/10 text-teal-400 mb-5 shadow-glow-teal-sm">
        {icon}
      </div>
      <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">{title}</h3>
      <p className="text-white/65 text-sm leading-relaxed">{description}</p>
      {bullets && bullets.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {to && variant !== 'compact' && (
        <div className="mt-5 inline-flex items-center gap-1.5 text-teal-400 text-sm font-medium group-hover:gap-2.5 transition-all">
          {cta}
          <ArrowRight size={15} />
        </div>
      )}
    </div>
  );

  return to ? (
    <Link to={to} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60 rounded-[20px]">
      {content}
    </Link>
  ) : (
    content
  );
}
