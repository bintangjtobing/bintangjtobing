import { useState, useRef, useEffect } from 'react';
import { trackEvent } from '../utils/tracking';

const CHAT_ENDPOINT = '/api/chat';
const SESSION_ENDPOINT = '/api/session';

// Strip stray markdown so replies render as clean plain text (no asterisks/headers).
const clean = (s) =>
  s
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*\*\s+/gm, '- ');

const COPY = {
  en: {
    open: 'Chat with Bintang',
    title: 'Chat with Bintang (AI)',
    subtitle: 'Work, projects, advice',
    placeholder: 'Type your message...',
    intro: "Hi, I'm Bintang (AI version). Ask about my work, my projects (KlindrOS, PMHelper, Bitunix MarTech Dashboard), my experience, or whether I'm open to new roles.",
    suggestions: ['What have you built?', 'Are you open to Product Manager roles?', "What's your tech stack?"],
    error: 'Something went wrong. Please try again or email hello@bintangtobing.com.',
    disclaimer: 'AI version of Bintang. May be imperfect.',
  },
  id: {
    open: 'Ngobrol sama Bintang',
    title: 'Ngobrol sama Bintang (AI)',
    subtitle: 'Kerjaan, proyek, saran',
    placeholder: 'Tulis pesanmu...',
    intro: 'Hai, saya Bintang (versi AI). Tanya soal kerjaan saya, proyek saya (KlindrOS, PMHelper, Bitunix MarTech Dashboard), pengalaman saya, atau apakah saya terbuka untuk role baru.',
    suggestions: ['Kamu pernah bikin apa?', 'Terbuka untuk role Product Manager?', 'Apa tech stack kamu?'],
    error: 'Terjadi kesalahan. Coba lagi atau email hello@bintangtobing.com.',
    disclaimer: 'Versi AI Bintang. Bisa keliru.',
  },
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(null); // null until chosen / loaded from session
  const [checking, setChecking] = useState(false);
  const [messages, setMessages] = useState([]); // { role, content }
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef(null);

  // On first open, load the per-IP cached language (24h). If none, show the picker.
  useEffect(() => {
    if (!open || lang || checking) return;
    setChecking(true);
    fetch(SESSION_ENDPOINT)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.lang) setLang(data.lang); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [open, lang, checking]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, lang]);

  const chooseLang = (l) => {
    setLang(l);
    trackEvent('chatbot_lang', { lang: l });
    fetch(SESSION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang: l }),
    }).catch(() => {});
  };

  const t = COPY[lang] || COPY.en;

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput('');
    const history = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setBusy(true);
    trackEvent('chatbot_message', { length: content.length, lang });

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, lang }),
      });
      if (!res.ok || !res.body) throw new Error('bad response');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamed = false;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.token) {
              streamed = true;
              setMessages((prev) => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                copy[copy.length - 1] = { role: 'assistant', content: last.content + parsed.token };
                return copy;
              });
            }
          } catch {
            /* ignore malformed chunk */
          }
        }
      }
      if (!streamed) throw new Error('empty');
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'assistant', content: t.error };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          className="chat-fab"
          onClick={() => { setOpen(true); trackEvent('chatbot_open'); }}
          aria-label="Chat with Bintang"
          title="Chat with Bintang"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span>Chat with Bintang</span>
        </button>
      )}

      {open && (
        <div className="chat-panel" role="dialog" aria-label="Chat with Bintang">
          <div className="chat-header">
            <div>
              <p className="chat-title">{lang ? t.title : 'Chat with Bintang (AI)'}</p>
              <p className="chat-subtitle">{lang ? t.subtitle : 'Pilih bahasa / Choose language'}</p>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">&times;</button>
          </div>

          {!lang ? (
            <div className="chat-lang">
              <p className="chat-lang-q">Mau ngobrol pakai bahasa apa?<br />Which language do you prefer?</p>
              <div className="chat-lang-btns">
                <button onClick={() => chooseLang('id')}>Bahasa Indonesia</button>
                <button onClick={() => chooseLang('en')}>English</button>
              </div>
            </div>
          ) : (
            <>
              <div className="chat-body" ref={bodyRef}>
                {messages.length === 0 && (
                  <>
                    <div className="chat-msg chat-msg-bot">{t.intro}</div>
                    <div className="chat-suggestions">
                      {t.suggestions.map((s) => (
                        <button key={s} className="chat-chip" onClick={() => send(s)}>{s}</button>
                      ))}
                    </div>
                  </>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`chat-msg ${m.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}`}>
                    {(m.role === 'assistant' ? clean(m.content) : m.content) || (busy && i === messages.length - 1 ? '…' : '')}
                  </div>
                ))}
              </div>

              <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  disabled={busy}
                  aria-label={t.placeholder}
                />
                <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
              </form>
              <p className="chat-disclaimer">{t.disclaimer}</p>
            </>
          )}
        </div>
      )}
    </>
  );
}
