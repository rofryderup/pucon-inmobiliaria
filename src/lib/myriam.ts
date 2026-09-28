/**
 * Myriam — Motor de respuestas basado en reglas.
 *
 * Diseñado para funcionar offline y ser reemplazable por una API de IA externa.
 * La separación engine ↔ UI permite conectar OpenAI/Claude/etc. en el futuro.
 */

import { PROPERTIES } from '../data/properties';
import { displayPrice } from './utils';

export interface MyriamResponse {
  text: string;
  quickReplies?: string[];
  openWhatsApp?: boolean;
}

const QUICK_REPLIES_DEFAULT = [
  'Quiero comprar',
  'Quiero vender',
  'Busco parcela',
  'Busco casa',
  'Quiero invertir',
  'Hablar con un asesor',
];

const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const hasAny = (s: string, words: string[]): boolean => {
  const n = normalize(s);
  return words.some((w) => n.includes(normalize(w)));
};

const countByType = (predicate: (s: string) => boolean): number =>
  PROPERTIES.filter((p) => predicate(normalize(p.title + ' ' + p.type + ' ' + p.sector + ' ' + p.location)))
    .filter((p) => p.status === 'Disponible').length;

const listByType = (type: string, max = 3): string => {
  const items = PROPERTIES.filter(
    (p) => p.type === type && p.status === 'Disponible'
  ).slice(0, max);
  if (items.length === 0) return '';
  return items
    .map((p) => `• ${p.title} — ${p.location} (${displayPrice(p)})`)
    .join('\n');
};

export const replyMyriam = (userMessage: string): MyriamResponse => {
  const m = userMessage.trim();

  // Saludo
  if (hasAny(m, ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'que tal'])) {
    return {
      text:
        '¡Hola! Soy Myriam, tu asesora virtual. Cuéntame qué tipo de propiedad buscas y te ayudaré a orientarte.',
      quickReplies: QUICK_REPLIES_DEFAULT,
    };
  }

  // Hablar con asesor / contacto humano
  if (
    hasAny(m, [
      'hablar con un asesor',
      'asesor humano',
      'hablar con alguien',
      'contacto humano',
      'llamar',
      'hablar con persona',
    ])
  ) {
    return {
      text:
        '¡Perfecto! Te conectaré con un asesor por WhatsApp. En un instante abriré la conversación para que nos cuentes qué necesitas.',
      openWhatsApp: true,
      quickReplies: QUICK_REPLIES_DEFAULT,
    };
  }

  // Quiero comprar
  if (hasAny(m, ['quiero comprar', 'comprar', 'busco comprar', 'adquirir'])) {
    const casas = countByType((s) => s.includes('casa'));
    const parcelas = countByType((s) => s.includes('parcela'));
    const deptos = countByType((s) => s.includes('departamento'));
    let txt = 'Con gusto te ayudo. Actualmente tenemos en cartera:\n\n';
    txt += `• Casas: ${casas} disponibles\n`;
    txt += `• Departamentos: ${deptos} disponibles\n`;
    txt += `• Parcelas: ${parcelas} disponibles\n\n`;
    const ej = listByType('Casa');
    if (ej) {
      txt += 'Algunas opciones destacadas:\n' + ej + '\n\n';
    }
    txt += '¿Quieres que te muestre opciones en un sector o presupuesto específico?';
    return {
      text: txt,
      quickReplies: ['Casas en Pucón', 'Parcelas', 'Bajo presupuesto', 'Hablar con un asesor'],
    };
  }

  // Quiero vender
  if (hasAny(m, ['quiero vender', 'vender mi', 'tengo una propiedad'])) {
    return {
      text:
        'Excelente. Podemos ayudarte con todo el proceso: tasación, fotografía, publicación y gestión de compradores. Para avanzar, un asesor te contactará y evaluará tu propiedad en Pucón o Villarrica.',
      quickReplies: ['Contactar asesor', '¿Qué servicios incluyen?', 'Hablar con un asesor'],
    };
  }

  // Invertir
  if (hasAny(m, ['invertir', 'inversion', 'rentabilidad', 'roi'])) {
    return {
      text:
        'Pucón y Villarrica son plazas con alta demanda turística y de segunda vivienda. Tenemos opciones con potencial de renta corta (departamentos nuevos) y proyectos turísticos (lodge en Caburgua, parcelas con cabañas). Te recomiendo partir con un asesor para evaluar tu objetivo.',
      quickReplies: ['Ver proyectos', 'Ver parcelas', 'Hablar con un asesor'],
    };
  }

  // Tipos de propiedad
  if (hasAny(m, ['casa', 'casas'])) {
    const txt = listByType('Casa');
    return {
      text:
        (txt
          ? 'Tenemos estas casas disponibles:\n\n' + txt + '\n\n'
          : 'Por el momento no tenemos casas disponibles en cartera. ') +
        '¿Quieres que te contactemos cuando entre alguna?',
      quickReplies: ['Parcelas', 'Departamentos', 'Hablar con un asesor'],
    };
  }
  if (hasAny(m, ['departamento', 'depto', 'depa'])) {
    const txt = listByType('Departamento');
    return {
      text:
        (txt
          ? 'Opciones en departamentos:\n\n' + txt + '\n\n'
          : 'Hoy no tenemos departamentos disponibles. ') +
        '¿Quieres que te avisemos cuando entre alguno?',
      quickReplies: ['Casas', 'Proyectos nuevos', 'Hablar con un asesor'],
    };
  }
  if (hasAny(m, ['parcela', 'parcelas'])) {
    const txt = listByType('Parcela');
    return {
      text:
        (txt
          ? 'Estas son nuestras parcelas:\n\n' + txt + '\n\n'
          : 'Hoy no tenemos parcelas publicadas. ') +
        'También manejamos terrenos y campos. ¿Quieres verlos?',
      quickReplies: ['Ver terrenos', 'Ver campos', 'Hablar con un asesor'],
    };
  }
  if (hasAny(m, ['terreno', 'terrenos', 'lote'])) {
    const txt = listByType('Terreno');
    return {
      text:
        (txt
          ? 'Terrenos disponibles:\n\n' + txt + '\n\n'
          : 'Por ahora no hay terrenos en cartera. ') +
        '¿Te puedo mostrar parcelas o campos?',
      quickReplies: ['Parcelas', 'Campos', 'Hablar con un asesor'],
    };
  }
  if (hasAny(m, ['campo', 'campos'])) {
    const txt = listByType('Campo');
    return {
      text:
        (txt
          ? 'Campos disponibles:\n\n' + txt + '\n\n'
          : 'No tenemos campos publicados en este momento. ') +
        '¿Quieres buscar otra alternativa?',
      quickReplies: ['Parcelas', 'Proyectos', 'Hablar con un asesor'],
    };
  }
  if (hasAny(m, ['proyecto', 'proyectos'])) {
    const txt = listByType('Proyecto');
    return {
      text:
        (txt
          ? 'Proyectos disponibles:\n\n' + txt + '\n\n'
          : 'Hoy no hay proyectos publicados. ') +
        '¿Te interesa recibir información de nuevas etapas?',
      quickReplies: ['Casas', 'Departamentos', 'Hablar con un asesor'],
    };
  }

  // Localidades
  if (hasAny(m, ['pucon', 'pucon'])) {
    return {
      text:
        'Pucón es nuestra zona principal. ¿Qué tipo de propiedad te interesa ver ahí?',
      quickReplies: ['Casas en Pucón', 'Parcelas en Pucón', 'Departamentos en Pucón', 'Hablar con un asesor'],
    };
  }
  if (hasAny(m, ['villarrica'])) {
    return {
      text:
        'Villarrica es una zona con mucha oferta. ¿Quieres ver casas, parcelas o departamentos?',
      quickReplies: ['Casas en Villarrica', 'Parcelas en Villarrica', 'Hablar con un asesor'],
    };
  }
  if (hasAny(m, ['caburgua'])) {
    return {
      text:
        'Caburgua es una zona premium a metros del lago. Disponemos de un lodge boutique operativo en venta. ¿Quieres que te cuente?',
      quickReplies: ['Ver lodge', 'Otras opciones en Caburgua', 'Hablar con un asesor'],
    };
  }

  // Presupuesto / precio
  if (hasAny(m, ['precio', 'presupuesto', 'cuesta', 'costo', 'valor', 'uf', 'pesos'])) {
    return {
      text:
        'Tenemos propiedades en distintos rangos: opciones desde UF para inversionistas hasta casas y campos sobre CLP $260M. ¿Tienes un rango definido?',
      quickReplies: ['Menos de 100M', '100M a 200M', 'Más de 200M', 'Hablar con un asesor'],
    };
  }

  // Visita
  if (hasAny(m, ['visita', 'ver la propiedad', 'agendar', 'recorrido'])) {
    return {
      text:
        'Para coordinar una visita puedo conectarte con uno de nuestros asesores por WhatsApp. Te responderán rápido.',
      quickReplies: ['Hablar con un asesor', 'Volver al inicio'],
    };
  }

  // Contacto
  if (hasAny(m, ['contacto', 'contactar', 'mail', 'correo', 'email', 'telefono'])) {
    return {
      text:
        'Puedes escribirnos por WhatsApp o completar el formulario de contacto. ¿Cuál prefieres?',
      quickReplies: ['WhatsApp', 'Formulario de contacto', 'Volver al inicio'],
    };
  }

  // Gracias / despedida
  if (hasAny(m, ['gracias', 'muchas gracias', 'chau', 'adios', 'bye'])) {
    return {
      text:
        '¡Con gusto! Cuando quieras conversar o quieras más información, escríbeme. ¡Que tengas un excelente día!',
      quickReplies: ['Hola', 'Hablar con un asesor'],
    };
  }

  // Fallback
  return {
    text:
      'Puedo ayudarte con búsquedas por tipo (casa, parcela, departamento, terreno, campo, proyecto) o por zona (Pucón, Villarrica, Caburgua). También puedo ponerte en contacto con un asesor humano.',
    quickReplies: QUICK_REPLIES_DEFAULT,
  };
};

export const INITIAL_MYRIAM = `¡Hola! Soy Myriam, tu asesora virtual. Cuéntame qué tipo de propiedad buscas y te ayudaré a orientarte.

Puedes preguntarme por:
• Tipos: casa, departamento, parcela, terreno, campo, proyecto
• Zonas: Pucón, Villarrica, Caburgua
• O decirme qué quieres hacer (comprar, vender, invertir)`;

export const MYRIAM_QUICK_REPLIES = QUICK_REPLIES_DEFAULT;
