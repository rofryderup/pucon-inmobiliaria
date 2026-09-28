import { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

type Errors = Partial<Record<'nombre' | 'email' | 'telefono' | 'asunto' | 'mensaje' | 'website_url', string>>;

type FormValues = {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
  wantToSell: boolean;
  website_url: string;
};

/**
 * Endpoint del formulario.
 *
 * Por defecto usa el PHP nativo en /api/contact.php (cPanel).
 * Para deploy en Cloudflare Pages, cambia esta línea por una de las alternativas:
 *
 *  - Formspree (recomendado, gratis hasta 50 envíos/mes):
 *      const FORM_ENDPOINT = 'https://formspree.io/f/TU_FORM_ID';
 *      → crea tu form en https://formspree.io (1 minuto) y pega el ID.
 *
 *  - Web3Forms (alternativa sin registro):
 *      const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
 *      y agrega <input type="hidden" name="access_key" value="TU_KEY" /> en el form.
 */
const FORM_ENDPOINT = '/api/contact.php';

function isExternalEndpoint(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function validate(values: FormValues): Errors {
  const e: Errors = {};
  if (!values.nombre || values.nombre.trim().length < 2) {
    e.nombre = 'Ingresa tu nombre.';
  }
  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    e.email = 'Email inválido.';
  }
  if (values.telefono && !/^[\d\s+\-()]{6,30}$/.test(values.telefono)) {
    e.telefono = 'Teléfono inválido.';
  }
  if (!values.mensaje || values.mensaje.trim().length < 10) {
    e.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  }
  if (values.website_url && values.website_url.trim() !== '') {
    e.website_url = 'spam';
  }
  return e;
}

export default function ContactForm() {
  const [values, setValues] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
    wantToSell: false,
    website_url: '', // honeypot
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const v = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus('error');
      setMessage('Por favor corrige los campos marcados.');
      return;
    }

    setStatus('sending');
    setMessage('');

    const payload = {
      nombre: values.nombre.trim(),
      email: values.email.trim(),
      telefono: values.telefono.trim(),
      asunto: values.asunto.trim(),
      mensaje: values.mensaje.trim(),
      wantToSell: values.wantToSell ? '1' : '0',
      website_url: values.website_url,
    };

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });

      // Si el endpoint es externo (Formspree) y devuelve HTML (redirect), trátalo como éxito
      if (isExternalEndpoint(FORM_ENDPOINT)) {
        if (res.ok || res.status === 302) {
          setStatus('success');
          setMessage('Mensaje enviado correctamente. Te contactaremos pronto.');
          setValues({
            nombre: '', email: '', telefono: '', asunto: '', mensaje: '',
            wantToSell: false, website_url: '',
          });
        } else {
          setStatus('error');
          setMessage('No fue posible enviar el mensaje. Intenta por WhatsApp.');
        }
        return;
      }

      // PHP nativo: respuesta JSON
      const ct = res.headers.get('content-type') || '';
      let data: { success: boolean; message?: string } = { success: false, message: '' };
      if (ct.includes('application/json')) {
        data = await res.json();
      } else {
        // Respuesta no-JSON (404 o error de hosting): mostrar mensaje amable
        const text = await res.text().catch(() => '');
        if (res.status === 404 || !text) {
          setStatus('error');
          setMessage('El formulario aún no está activo en este hosting. Por favor escríbenos por WhatsApp al +56 9 6839 7607.');
        } else {
          setStatus('error');
          setMessage('No fue posible enviar el mensaje. Intenta por WhatsApp.');
        }
        return;
      }

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Mensaje enviado correctamente.');
        setValues({
          nombre: '', email: '', telefono: '', asunto: '', mensaje: '',
          wantToSell: false, website_url: '',
        });
      } else {
        setStatus('error');
        setMessage(data.message || 'No fue posible enviar el mensaje.');
      }
    } catch {
      setStatus('error');
      setMessage('Error de red. Vuelve a intentar en unos minutos o escríbenos por WhatsApp.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-5" noValidate>
      {status === 'success' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-sm">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-300 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {/* Honeypot - hidden from real users */}
      <div className="absolute opacity-0 pointer-events-none -left-[9999px]" aria-hidden="true">
        <label htmlFor="website_url">Sitio web</label>
        <input
          id="website_url"
          type="text"
          name="website_url"
          value={values.website_url}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nombre" className="field-label">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
            type="text"
            autoComplete="name"
            className={`field ${errors.nombre ? 'border-rose-400/50' : ''}`}
            placeholder="Tu nombre"
            required
          />
          {errors.nombre && <p className="text-rose-400 text-xs mt-1">{errors.nombre}</p>}
        </div>
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            type="email"
            autoComplete="email"
            className={`field ${errors.email ? 'border-rose-400/50' : ''}`}
            placeholder="tu@email.cl"
            required
          />
          {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="telefono" className="field-label">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            value={values.telefono}
            onChange={handleChange}
            type="tel"
            autoComplete="tel"
            className={`field ${errors.telefono ? 'border-rose-400/50' : ''}`}
            placeholder="+56 9 ..."
          />
          {errors.telefono && <p className="text-rose-400 text-xs mt-1">{errors.telefono}</p>}
        </div>
        <div>
          <label htmlFor="asunto" className="field-label">Asunto</label>
          <input
            id="asunto"
            name="asunto"
            value={values.asunto}
            onChange={handleChange}
            type="text"
            className="field"
            placeholder="¿Sobre qué quieres conversar?"
          />
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="field-label">Mensaje</label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={values.mensaje}
          onChange={handleChange}
          rows={5}
          className={`field resize-none ${errors.mensaje ? 'border-rose-400/50' : ''}`}
          placeholder="Cuéntanos qué estás buscando o en qué podemos ayudarte."
          required
        />
        {errors.mensaje && <p className="text-rose-400 text-xs mt-1">{errors.mensaje}</p>}
      </div>

      <label className="flex items-center gap-3 text-sm text-white/75 cursor-pointer select-none">
        <input
          type="checkbox"
          name="wantToSell"
          checked={values.wantToSell}
          onChange={handleChange}
          className="w-4 h-4 rounded border-teal-450/40 bg-ink-800 text-teal-450 focus:ring-teal-450"
        />
        Quiero vender una propiedad
      </label>

      <button
        type="submit"
        className="btn-primary w-full sm:w-auto"
        disabled={status === 'sending'}
        aria-busy={status === 'sending'}
      >
        {status === 'sending' ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <Send size={18} />
            Enviar mensaje
          </>
        )}
      </button>

      <style>{`
        .field-label {
          display:block;
          font-size:0.78rem;
          font-weight:600;
          color:#22d3d3;
          margin-bottom:0.35rem;
          text-transform:uppercase;
          letter-spacing:0.08em;
        }
      `}</style>
    </form>
  );
}
