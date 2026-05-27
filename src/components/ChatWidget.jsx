import { useState, useRef, useEffect } from 'react';
import { trackEvent } from '../utils/tracking';
import avatar from '../assets/askbintang.webp';

const CHAT_ENDPOINT = '/api/chat';
const SESSION_ENDPOINT = '/api/session';

// Launcher bubble greetings, cycled every 5s.
const GREETINGS = ['Hi there', 'Hello!', 'Halo!', 'Ask me anything', 'Tanya aku, yuk', 'Hey!'];

// Chat history + language persisted in the browser for 24h.
const STORE_KEY = 'askbintang_chat_v1';
const DAY_MS = 24 * 60 * 60 * 1000;

// Strip stray markdown so replies render as clean plain text (no asterisks/headers).
const clean = (s) =>
  s
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*\*\s+/gm, '- ');

// Turn cleaned text into React nodes with clickable links: markdown links
// [label](url), bare URLs, and email addresses.
const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)|([\w.+-]+@[\w.-]+\.[a-zA-Z]{2,})/g;
const linkify = (text) => {
  const nodes = [];
  let last = 0;
  let k = 0;
  let m;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      nodes.push(<a key={k++} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>);
    } else if (m[3]) {
      const url = m[3].replace(/[.,;:]+$/, '');
      nodes.push(<a key={k++} href={url} target="_blank" rel="noopener noreferrer">{url}</a>);
    } else if (m[4]) {
      nodes.push(<a key={k++} href={`mailto:${m[4]}`}>{m[4]}</a>);
    }
    last = LINK_RE.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

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
  const [greet, setGreet] = useState(0);
  const bodyRef = useRef(null);

  // Cycle the launcher greeting every 5s while the chat is closed.
  useEffect(() => {
    if (open) return undefined;
    const id = setInterval(() => setGreet((gi) => (gi + 1) % GREETINGS.length), 5000);
    return () => clearInterval(id);
  }, [open]);

  // Restore chat history + language for 24h (per browser).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.savedAt && Date.now() - saved.savedAt < DAY_MS) {
        if (Array.isArray(saved.messages)) setMessages(saved.messages);
        if (saved.lang) setLang(saved.lang);
      } else {
        localStorage.removeItem(STORE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist chat history + language (expires on read after 24h).
  useEffect(() => {
    try {
      if (messages.length || lang) {
        localStorage.setItem(STORE_KEY, JSON.stringify({ messages, lang, savedAt: Date.now() }));
      }
    } catch {
      /* ignore */
    }
  }, [messages, lang]);

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

  const openChat = (source) => {
    setOpen(true);
    trackEvent('chatbot_open', { source });
  };

  const closeChat = () => {
    setOpen(false);
    trackEvent('chatbot_close');
  };

  const chooseLang = (l) => {
    setLang(l);
    trackEvent('chatbot_lang_select', { lang: l });
    fetch(SESSION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang: l }),
    }).catch(() => {});
  };

  const t = COPY[lang] || COPY.en;

  const send = async (text, source = 'typed') => {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput('');
    const history = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setBusy(true);
    trackEvent('chatbot_message_sent', { source, length: content.length, lang });

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
      trackEvent('chatbot_reply_received', { lang });
    } catch {
      trackEvent('chatbot_error', { lang });
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
        <div className="ab-launcher">
          <div
            className="ab-bubble"
            key={greet}
            onClick={() => openChat('bubble')}
            role="presentation"
          >
            {GREETINGS[greet]}
          </div>
          <button
            className="ab-fab"
            onClick={() => openChat('avatar')}
            aria-label="#AskBintang, chat with Bintang"
            title="#AskBintang"
          >
            <img src={avatar} alt="Bintang Tobing avatar" />
            <span className="ab-dot" />
          </button>
        </div>
      )}

      {open && (
        <div className="chat-panel" role="dialog" aria-label="Chat with Bintang">
          <div className="chat-header">
            <div className="chat-head-left">
              <img className="chat-head-avatar" src={avatar} alt="" />
              <div>
                <p className="chat-title">#AskBintang</p>
                <p className="chat-subtitle">{lang ? t.subtitle : 'Pilih bahasa / Choose language'}</p>
              </div>
            </div>
            <button className="chat-close" onClick={closeChat} aria-label="Close chat">&times;</button>
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
                        <button key={s} className="chat-chip" onClick={() => send(s, 'suggestion')}>{s}</button>
                      ))}
                    </div>
                  </>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`chat-msg ${m.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}`}>
                    {m.role === 'assistant'
                      ? (m.content ? linkify(clean(m.content)) : (busy && i === messages.length - 1 ? '…' : ''))
                      : m.content}
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
