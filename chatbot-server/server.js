import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';

const __dirname = dirname(fileURLToPath(import.meta.url));

const {
  OPENAI_API_KEY,
  OPENAI_BASE_URL = 'https://api.z.ai/api/paas/v4',
  OPENAI_MODEL = 'glm-5.2',
  PORT = 8787,
  ALLOWED_ORIGIN = 'https://bintangtobing.com',
  RATE_WINDOW_MIN = 10,
  RATE_MAX = 30,
  DAILY_REQUEST_CAP = 1500,
  MAX_INPUT_CHARS = 1500,
  MAX_HISTORY = 12,
  MAX_OUTPUT_TOKENS = 600,
} = process.env;

if (!OPENAI_API_KEY) {
  console.error('FATAL: OPENAI_API_KEY is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

// Build the system prompt once at startup: persona + guardrails + knowledge base.
// The knowledge base lives ONLY here on the server; it is never sent to the browser.
const persona = readFileSync(resolve(__dirname, 'system-prompt.md'), 'utf8');
const rawKb = readFileSync(resolve(__dirname, 'knowledge-base.md'), 'utf8');
// Years of experience auto-compute from start years (recomputed each restart).
const year = new Date().getFullYear();
const knowledgeBase = rawKb
  .replaceAll('{FS_YEARS}', String(year - 2016))
  .replaceAll('{PM_YEARS}', String(year - 2018));
const SYSTEM_PROMPT = `${persona}\n\n---\n# KNOWLEDGE BASE (your only factual source)\n\n${knowledgeBase}`;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_BASE_URL });

const app = express();
app.set('trust proxy', 1); // behind nginx -> read real client IP from X-Forwarded-For
app.use(express.json({ limit: '32kb' }));

// Simple in-memory daily budget guard (resets at UTC midnight / on restart).
// For multi-process or hard guarantees, back this with Redis.
let day = new Date().toISOString().slice(0, 10);
let dayCount = 0;
function underDailyCap() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; dayCount = 0; }
  if (dayCount >= Number(DAILY_REQUEST_CAP)) return false;
  dayCount += 1;
  return true;
}

const limiter = rateLimit({
  windowMs: Number(RATE_WINDOW_MIN) * 60 * 1000,
  max: Number(RATE_MAX),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please slow down and try again in a few minutes.' },
});

// Per-IP language preference, cached 24h (in-memory; resets on restart).
const LANG_TTL_MS = 24 * 60 * 60 * 1000;
const langByIp = new Map();
function getLang(ip) {
  const entry = langByIp.get(ip);
  if (entry && entry.expires > Date.now()) return entry.lang;
  if (entry) langByIp.delete(ip);
  return null;
}

app.get('/api/health', (_req, res) => res.json({ ok: true, model: OPENAI_MODEL }));

// Returns the cached language for this IP, or null if the visitor must be asked.
app.get('/api/session', (req, res) => res.json({ lang: getLang(req.ip) }));

// Stores the visitor's chosen language for 24h.
app.post('/api/session', (req, res) => {
  const lang = req.body?.lang;
  if (lang !== 'en' && lang !== 'id') {
    return res.status(400).json({ error: 'lang must be "en" or "id".' });
  }
  langByIp.set(req.ip, { lang, expires: Date.now() + LANG_TTL_MS });
  res.json({ lang });
});

app.post('/api/chat', limiter, async (req, res) => {
  // Defense in depth: the widget is same-origin, so any cross-origin POST is suspect.
  const origin = req.get('origin');
  if (origin && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: 'Forbidden origin.' });
  }

  if (!underDailyCap()) {
    return res.status(429).json({ error: 'Daily limit reached. Please email hello@bintangtobing.com.' });
  }

  const raw = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!raw || raw.length === 0) {
    return res.status(400).json({ error: 'No messages provided.' });
  }

  // Sanitize: only user/assistant turns, cap content length and history depth.
  const history = raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-Number(MAX_HISTORY))
    .map((m) => ({ role: m.role, content: m.content.slice(0, Number(MAX_INPUT_CHARS)) }));

  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Last message must be from the user.' });
  }

  // Lock the reply language: request body wins, else the IP's cached choice.
  const reqLang = req.body?.lang === 'id' ? 'id'
    : req.body?.lang === 'en' ? 'en'
    : getLang(req.ip);
  const langNote = reqLang
    ? [{ role: 'system', content: reqLang === 'id'
        ? 'Reply ONLY in Bahasa Indonesia, in the first person as Bintang ("saya"/"aku").'
        : 'Reply ONLY in English, in the first person as Bintang ("I").' }]
    : [];

  const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...langNote, ...history];

  // Stream the answer back as Server-Sent Events.
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    const stream = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: Number(MAX_OUTPUT_TOKENS),
      stream: true,
    });
    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content;
      if (token) res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('OpenAI error:', err?.message || err);
    res.write(`data: ${JSON.stringify({ error: 'AI service error. Please try again.' })}\n\n`);
    res.end();
  }
});

app.listen(Number(PORT), '127.0.0.1', () => {
  console.log(`Bintang chatbot on 127.0.0.1:${PORT} (model: ${OPENAI_MODEL})`);
});
