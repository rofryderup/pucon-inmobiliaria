import { useEffect, useRef, useState } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import {
  INITIAL_MYRIAM,
  MYRIAM_QUICK_REPLIES,
  replyMyriam,
} from '../lib/myriam';
import { SITE_CONFIG, whatsappLink } from '../config/site';
import type { ChatMessage } from '../types';

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: 'assistant',
      content: INITIAL_MYRIAM,
      ts: Date.now(),
      quickReplies: MYRIAM_QUICK_REPLIES,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const sendMessage = (text: string) => {
    const clean = text.trim();
    if (!clean) return;

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: 'user', content: clean, ts: Date.now() },
    ]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = replyMyriam(clean);
      const newMessage: ChatMessage = {
        id: uid(),
        role: 'assistant',
        content: reply.text,
        ts: Date.now(),
        quickReplies: reply.quickReplies,
      };
      setMessages((prev) => [...prev, newMessage]);

      if (reply.openWhatsApp) {
        setTimeout(() => {
          window.open(whatsappLink('Hola, soy un usuario del sitio web y necesito asesoría.'), '_blank');
        }, 600);
      }
      setTyping(false);
    }, 600 + Math.random() * 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label={open ? 'Cerrar Myriam' : 'Abrir Myriam'}
        aria-expanded={open}
      >
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-ink-800/85 border border-teal-450/40 backdrop-blur-xl shadow-glow-teal hover:shadow-glow-teal-lg hover:scale-105 transition-all">
          {open ? (
            <X size={22} className="text-teal-300" />
          ) : (
            <Bot size={26} className="text-teal-300" />
          )}
          <span className="absolute inset-0 rounded-full ring-2 ring-teal-400/20 animate-pulse-soft pointer-events-none" />
        </span>
      </button>

      {/* Panel de chat */}
      {open && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[80vh] flex flex-col glass-card overflow-hidden animate-fade-in-up shadow-2xl"
          role="dialog"
          aria-label="Myriam - Asistente virtual"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-teal-450/15 bg-gradient-to-r from-ink-800 to-ink-900">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-550 flex items-center justify-center text-ink-950 shadow-glow-teal-sm">
                  <Sparkles size={18} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-ink-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">Myriam</h3>
                <p className="text-white/55 text-xs">Tu asesora virtual · {SITE_CONFIG.name}</p>
              </div>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {messages.map((m) => (
              <div key={m.id}>
                <div
                  className={`max-w-[88%] ${
                    m.role === 'user'
                      ? 'ml-auto bg-gradient-to-br from-teal-450/90 to-teal-550/90 text-ink-950'
                      : 'mr-auto bg-ink-700/70 text-white border border-white/8'
                  } rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line leading-relaxed shadow-card`}
                >
                  {m.content}
                </div>
                {m.role === 'assistant' && m.quickReplies && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.quickReplies.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendMessage(q)}
                        className="text-xs px-2.5 py-1.5 rounded-full border border-teal-450/30 text-teal-300 hover:bg-teal-450/10 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-1.5 text-white/60 text-xs px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-soft" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-soft" style={{ animationDelay: '120ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-soft" style={{ animationDelay: '240ms' }} />
                <span className="ml-1">Myriam está escribiendo…</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-4 py-3 border-t border-teal-450/15 bg-ink-900/70 flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              placeholder="Escribe tu pregunta..."
              className="flex-1 resize-none bg-ink-800 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/40 focus:border-teal-450/50 focus:outline-none"
              aria-label="Mensaje"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-primary !py-2 !px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Enviar"
            >
              <Send size={16} />
            </button>
          </form>

          <div className="px-4 py-2 text-center text-[10px] text-white/35 bg-ink-950/40 border-t border-white/5">
            Myriam · asistente basado en reglas
          </div>
        </div>
      )}
    </>
  );
}
