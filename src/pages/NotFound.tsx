import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Página no encontrada | Pucón Inmobiliaria';
  }, []);

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-2xl text-center">
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full bg-teal-450/15 blur-3xl" />
          <span className="relative text-7xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-teal-500">
            404
          </span>
        </div>
        <h1 className="section-title !text-3xl sm:!text-4xl">Página no encontrada</h1>
        <p className="section-subtitle mx-auto">
          La ruta que estás buscando no existe, fue removida o cambió de URL.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={18} />
            Volver al inicio
          </Link>
          <Link to="/propiedades" className="btn-outline">
            <ArrowLeft size={18} />
            Ver propiedades
          </Link>
        </div>
      </div>
    </section>
  );
}
