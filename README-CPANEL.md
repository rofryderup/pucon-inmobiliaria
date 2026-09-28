# Pucón Inmobiliaria — Guía de deploy en cPanel

Sitio web inmobiliario profesional para Pucón, Villarrica y sus alrededores.
Listo para subir a hosting tradicional cPanel/Apache. **No requiere Node.js en producción, ni Lovable, ni Supabase, ni Docker**.

---

## Resumen rápido

```bash
npm install      # instalar dependencias
npm run build    # generar build de producción en /dist
```

El contenido de `dist/` es lo que se sube a tu hosting.

---

## Requisitos del hosting

- Apache con `mod_rewrite` habilitado (todos los cPanel lo traen).
- PHP 7.4+ (sólo se usa para el endpoint de contacto).
- Cuenta de correo configurada para `noreply@tu-dominio.cl` (opcional, recomendado).

---

## Paso a paso para subir a cPanel

### 1) Compilar localmente

```bash
npm install
npm run build
```

Al finalizar, abre la carpeta `dist/`. Dentro debe haber un `index.html`, una carpeta `assets/` y una carpeta `images/`.

### 2) Comprimir la carpeta dist

Comprime **el CONTENIDO** de la carpeta `dist/` (no la carpeta en sí) en un archivo `.zip`.

En macOS:
- Entra a `dist/`, selecciona todo el contenido (Ctrl+A), comprimir.

En Windows:
- Selecciona todo el contenido de `dist/`, "Enviar a > Carpeta comprimida".

El archivo ZIP debe verse así al abrirlo:

```
index.html
.htaccess       ← muy importante
assets/
images/
api/
```

> ⚠️ Si descomprimes, **.htaccess** debe quedar al mismo nivel que `index.html`, no dentro de una carpeta.

### 3) Acceder a cPanel

- Entra a tu cPanel (tudominio.cl/cpanel).
- Abre **"Administrador de archivos"**.
- Navega a `public_html/`.

### 4) Subir el ZIP

- Sube el ZIP generado.
- Botón derecho sobre el archivo subido → **Extract** (extraer aquí).
- Asegúrate de que `index.html` queda directamente dentro de `public_html/`.

### 5) Verificar que el .htaccess quedó bien

En el Administrador de Archivos, ve a `public_html/`, pulsa **"Configuración"** y habilita **"Mostrar archivos ocultos (dotfiles)"**. Verás el `.htaccess`. Es fundamental.

### 6) Configurar el correo del formulario

Edita `public_html/api/contact.php` (o mejor, configura una variable de entorno en cPanel):

**Opción A — Variable de entorno (recomendado):**
En cPanel → "Variables de entorno" del dominio, agrega:

| Variable | Valor |
|---|---|
| `PUCON_CONTACT_TO` | `contacto@tu-dominio.cl` |
| `PUCON_SITE_NAME` | `Pucón Inmobiliaria` |

**Opción B — Editar PHP directamente:**

Abre `api/contact.php` y reemplaza:

```php
$TO_EMAIL = getenv('PUCON_CONTACT_TO') ?: 'contacto@puconinmobiliaria.cl';
```

por tu correo real:

```php
$TO_EMAIL = 'contacto@tu-dominio.cl';
```

> En muchos hostings cPanel la función `mail()` de PHP usa la dirección `From: noreply@tu-dominio.cl` por defecto y algunos correos (Gmail, Outlook) pueden marcar el mensaje como spam. Para mejorar la entrega puedes usar **SMTP con PHPMailer**, pero eso es opcional para esta versión.

### 7) Configurar datos de contacto visibles

Edita `assets/index-XXXXXX.js` (o el archivo principal JS del build) reemplazando los valores por defecto que están en `src/config/site.ts` antes de hacer un nuevo build:

```ts
whatsapp: '569XXXXXXXX',      // tu número sin "+"
email: 'contacto@tu-dominio.cl',
phone: '+56 9 ...',
instagram: '',
facebook: '',
```

Recompila con `npm run build` y vuelve a subir.

### 8) Probar

Visita `https://tu-dominio.cl/` y verifica:
- ✅ La página principal carga con la imagen del volcán.
- ✅ El menú se ve correctamente.
- ✅ `/propiedades` muestra todas las propiedades.
- ✅ `/propiedad/[slug]` muestra la página de detalle con fotos y mapa.
- ✅ El formulario de contacto envía y llega a tu correo.
- ✅ El botón de WhatsApp abre `wa.me/` con tu número.

---

## Configurar HTTPS / SSL

En cPanel puedes activar **AutoSSL** o usar Let's Encrypt:
- Buscar "SSL/TLS Status".
- Activar AutoSSL para tu dominio.
- Forzar HTTPS: descomenta estas líneas en `.htaccess`:

```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Errores frecuentes en cPanel

### ❌ Error 404 al refrescar `/propiedades`

**Causa:** el servidor no redirige a `index.html` cuando la ruta no existe.
**Solución:** verifica que `.htaccess` quedó en `public_html/` (no en una subcarpeta). El servidor Apache necesita `mod_rewrite` que ya viene por defecto en cPanel.

### ❌ CSS o JS no se cargan (sitio en blanco o sin estilos)

**Causa:** subiste el ZIP y se descomprimió **dentro** de `public_html/dist/` en vez de extraerlo en `public_html/`.
**Solución:** mueve los archivos a `public_html/` directamente.

### ❌ Blank page (página en blanco)

**Causa 1:** archivo `.htaccess` no subió.
**Causa 2:** subieron la carpeta `dist/` en vez de su contenido.
**Solución:** sube el `.htaccess` manualmente y asegúrate de que `index.html` está en la raíz.

### ❌ MIME incorrecto (errores de tipo en la consola)

**Causa:** hosting con reglas antiguas.
**Solución:** el `.htaccess` ya incluye los tipos MIME correctos para `.js`, `.css`, `.webp`, `.svg`, `.json`. Verifica que esté presente.

### ❌ Imágenes no aparecen o rutas equivocadas

**Causa:** se subieron `assets/` pero no `images/`.
**Solución:** verifica que la carpeta `images/` quedó completa en `public_html/images/`.

### ❌ Formulario PHP no envía correo

**Causa 1:** correo destinatario mal configurado.
**Solución:** edita `api/contact.php` y revisa `$TO_EMAIL`.

**Causa 2:** hosting bloqueó `mail()`.
**Solución:** contacta a soporte del hosting para habilitar envío. Como alternativa, en producción avanzada puedes conectar PHPMailer con SMTP autenticado.

**Causa 3:** ruta equivocada. Prueba accediendo a `https://tu-dominio.cl/api/contact.php` en el navegador: debe devolver un JSON con un error o nada. Si devuelve **404**, el archivo no subió.

### ❌ Error "Mixed content" al forzar HTTPS

**Solución:** ya está cubierto por el `.htaccess` al activar HTTPS. Si persiste, asegúrate de que ningún asset externo use `http://`.

### ❌ Imágenes muy pesadas (carga lenta)

**Causa:** las fotos del sitio pesan más de 500 KB cada una.
**Solución:** optimiza las imágenes con herramientas como **Squoosh.app** o **ImageOptim** antes de subirlas. Para producción real reemplaza las imágenes de `public/images/` por fotos comprimidas en WebP.

---

## Estructura del proyecto

```
pucon-inmobiliaria/
├── public/
│   ├── .htaccess               ← reglas de Apache (SPA fallback)
│   ├── api/
│   │   └── contact.php         ← endpoint contacto
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon.svg
│   └── images/
│       ├── hero-volcan.jpg     ← reemplazar por fotos reales
│       ├── pucon-lago.jpg
│       ├── pucon-bosque.jpg
│       └── properties/
│           └── <slug-de-propiedad>/
│               └── 01.jpg, 02.jpg, ...
├── src/
│   ├── main.tsx                ← entry point
│   ├── App.tsx                 ← router
│   ├── config/
│   │   └── site.ts             ← DATOS CENTRALES: nombre, WhatsApp, email, redes
│   ├── data/
│   │   └── properties.ts       ← CATÁLOGO: reemplazar por API/PHP luego
│   ├── components/             ← Navbar, Footer, Hero, PropertyCard, etc.
│   ├── pages/                  ← Home, Properties, PropertyDetail, Services, Contact, Privacy, NotFound
│   ├── lib/
│   │   ├── utils.ts            ← helpers
│   │   └── myriam.ts           ← motor asistente local
│   └── hooks/
│       └── useSEO.ts           ← meta tags/OG por página
├── index.html                  ← SEO root + JSON-LD RealEstateAgent
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README-CPANEL.md            ← este archivo
```

---

## Reemplazar el catálogo de propiedades más adelante

El archivo `src/data/properties.ts` contiene un array `PROPERTIES`. Para reemplazarlo por una API PHP/MySQL:

1. Crea un endpoint, por ejemplo `/api/properties.php` que retorne JSON con la misma forma del array.
2. Cambia `src/data/properties.ts` por algo así:

```ts
export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch('/api/properties.php');
  return res.json();
}
```

3. En las páginas usa `useEffect` + `useState` para cargar y mostrar.

La interfaz `Property` en `src/types/index.ts` es la fuente de verdad del modelo de datos.

---

## Personalizar el asistente Myriam

`src/lib/myriam.ts` contiene el motor basado en reglas locales. Para conectarlo a una IA real:

1. Crea un endpoint `/api/myriam.php` que reciba `{ message, context }` y devuelva `{ text, quickReplies, openWhatsApp }`.
2. Reemplaza `replyMyriam(text)` por una llamada a tu endpoint.

La UI del chat (en `src/components/AIAssistant.tsx`) **no necesita cambios** porque consume el mismo contrato.

---

## Soporte adicional

- **Tipografía principal:** Inter (incluida via Google Fonts en el HTML). Para uso 100% offline descarga los `.woff2` y cámbialos en `index.html`.
- **Mapa:** OpenStreetMap vía Leaflet (sin clave de API).
- **Sin Tailwind CDN:** el CSS va bundleado en `dist/assets/`.
- **Sin frameworks backend:** sólo PHP plano.

---

© Pucón Inmobiliaria · Hecho con enfoque en la Araucanía.
