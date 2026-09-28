import { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => {
    document.title = 'Política de privacidad | Pucón Inmobiliaria';
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <p className="section-eyebrow">Legal</p>
      <h1 className="section-title !text-4xl sm:!text-5xl">Política de Privacidad</h1>

      <div className="mt-8 prose prose-invert prose-sm sm:prose-base max-w-none text-white/75 space-y-5 leading-relaxed">
        <p>
          En Pucón Inmobiliaria respetamos tu privacidad y nos comprometemos a proteger la información personal que compartes con nosotros a través de este sitio web.
        </p>

        <h2 className="text-white text-xl font-semibold mt-8 mb-3">Datos que recopilamos</h2>
        <p>
          Cuando nos contactas a través del formulario o WhatsApp, recopilamos: nombre, email, teléfono y el contenido de tu mensaje. Estos datos se utilizan exclusivamente para responder a tu consulta.
        </p>

        <h2 className="text-white text-xl font-semibold mt-8 mb-3">Uso de la información</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Responder consultas y coordinar visitas o reuniones.</li>
          <li>Enviarte información sobre propiedades que coincidan con tu búsqueda.</li>
          <li>Mejorar nuestro servicio.</li>
        </ul>

        <h2 className="text-white text-xl font-semibold mt-8 mb-3">Protección antispam</h2>
        <p>
          Nuestro formulario de contacto incluye mecanismos automáticos para reducir el envío de mensajes no deseados.
        </p>

        <h2 className="text-white text-xl font-semibold mt-8 mb-3">Cookies</h2>
        <p>
          Este sitio no utiliza cookies de seguimiento publicitario. Sólo utiliza almacenamiento local del navegador para mejorar la experiencia (recordar filtros aplicados, por ejemplo).
        </p>

        <h2 className="text-white text-xl font-semibold mt-8 mb-3">Tus derechos</h2>
        <p>
          Puedes solicitar la eliminación o rectificación de tus datos enviando una solicitud a nuestro correo de contacto.
        </p>

        <p className="text-white/50 text-sm mt-10">
          Última actualización: {new Date().toLocaleDateString('es-CL')}.
        </p>
      </div>
    </section>
  );
}
