// Post-build: this site has NO SPA catch-all in nginx (dead URLs must return a
// true 404, not a soft-200). So every client route ships its own static HTML
// shell with route-specific meta AND route-specific pre-rendered content, so
// non-JS crawlers see the real page (fixes low-word-count / low-text-ratio /
// one-internal-link warnings). React replaces #root on mount, so JS visitors
// never see the static copy.
//
// Generates:
//   dist/index.html (home #root replaced), dist/links.html,
//   dist/case-study.html, dist/case-study/<slug>.html
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { caseStudies } from '../src/data/caseStudies.js';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const SITE = 'https://bintangtobing.com';
const HOME_OG = `${SITE}/og-image.jpg?v=2`;

const HOME_TITLE = 'Bintang Tobing | Product & Project Manager · Full-Stack Developer';
const HOME_DESC =
  'Bintang Tobing, Product & Project Manager and Full-Stack Developer based in Indonesia & UAE, delivering products across ASEAN and remotely worldwide. MarTech, AI integration & fintech.';
const HOME_SUMMARY =
  'Product & Project Manager and Full-Stack Developer: 8+ years leading products and teams (since 2018), built on 10+ years shipping production systems as a developer (since 2016). Experience across fintech, MarTech, ERP, and government. Based between Indonesia and the UAE, delivering across ASEAN and remotely worldwide. Recent work includes KlindrOS (a 26-module MarTech intelligence platform with a 1.55B events/day pipeline), the Bitunix MarTech Dashboard, and PMHelper with a self-built Claude-compatible MCP server.';
const INDEX_TITLE = "Case Studies | Bintang Tobing — Products I've Built & Shipped";
const INDEX_DESC =
  'In-depth case studies of products Bintang Tobing has built: PMHelper (a production PM tool with QA gates and an MCP server), the Bitunix MarTech Dashboard, KlindrOS marketing intelligence, and the KlindrOS CRM.';
const INDEX_INTRO =
  'Long-form case studies of real products in production — the problem I faced, the choices I made, and the results I got. Read one to decide if a similar build fits your team.';

const base = readFileSync(resolve(dist, 'index.html'), 'utf8');

// ── helpers ───────────────────────────────────────────────────
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inlineMd = (s) =>
  s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
const md = (s) => inlineMd(esc(s));

const SHORT = {
  pmhelper: 'PMHelper',
  'bitunix-martech-dashboard': 'Bitunix MarTech Dashboard',
  klindros: 'KlindrOS',
  'klindros-crm': 'KlindrOS CRM',
};

const NAV = `<nav class="more" aria-label="More pages"><strong>More:</strong> <a href="/">Home</a> · <a href="/case-study">Case Studies</a> · ${caseStudies
  .map((c) => `<a href="/case-study/${c.slug}">${esc(SHORT[c.slug] || c.slug)}</a>`)
  .join(' · ')} · <a href="/links">Links</a></nav>`;

const STYLE = `<style>
#root .ssg-wrap{min-height:100vh;background:#FDFCFA}
#root .ssg{max-width:720px;margin:0 auto;padding:5rem 1.5rem;font-family:'DM Sans',system-ui,sans-serif;line-height:1.75;color:#333}
#root .ssg h1{font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-size:2rem;font-weight:800;letter-spacing:-.03em;color:#1a1a1a;margin-bottom:.5rem;line-height:1.1}
#root .ssg h2{font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-size:1.3rem;font-weight:700;color:#1a1a1a;margin:2rem 0 .6rem}
#root .ssg p{margin-bottom:1rem}
#root .ssg .kicker{text-transform:uppercase;letter-spacing:.14em;font-size:.7rem;color:#888;font-weight:600;margin-bottom:.6rem}
#root .ssg .lead{font-size:1.15rem;color:#333}
#root .ssg .deck{font-size:1.1rem;color:#555;margin-bottom:1.5rem}
#root .ssg blockquote{border-left:3px solid #1a1a1a;padding-left:1rem;margin:1.5rem 0;font-weight:500;color:#1a1a1a}
#root .ssg ul,#root .ssg ol{margin:0 0 1rem 1.2rem}
#root .ssg li{margin-bottom:.4rem}
#root .ssg table{border-collapse:collapse;width:100%;font-size:.9rem;margin:1rem 0}
#root .ssg th,#root .ssg td{border:1px solid #ebebeb;padding:.5rem .7rem;text-align:left}
#root .ssg figure{margin:1.5rem 0}
#root .ssg img{max-width:100%;border-radius:10px;border:1px solid #ebebeb;display:block}
#root .ssg figcaption{font-size:.8rem;color:#888;margin-top:.4rem}
#root .ssg .more{margin-top:2.5rem;font-size:.85rem;color:#555}
#root .ssg a{color:inherit}
html[data-theme=dark] #root .ssg-wrap{background:#111}
html[data-theme=dark] #root .ssg{color:#bbb}
html[data-theme=dark] #root .ssg h1,html[data-theme=dark] #root .ssg h2,html[data-theme=dark] #root .ssg blockquote{color:#e8e8e8}
html[data-theme=dark] #root .ssg .lead{color:#ccc}
html[data-theme=dark] #root .ssg th,html[data-theme=dark] #root .ssg td,html[data-theme=dark] #root .ssg img{border-color:#2a2a2a}
</style>`;

function blocksToHtml(blocks) {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'lead':
          return `<p class="lead">${md(b.text)}</p>`;
        case 'h2':
          return `<h2>${esc(b.text)}</h2>`;
        case 'p':
          return `<p>${md(b.text)}</p>`;
        case 'quote':
          return `<blockquote>${md(b.text)}</blockquote>`;
        case 'list': {
          const tag = b.ordered ? 'ol' : 'ul';
          return `<${tag}>${b.items.map((i) => `<li>${md(i)}</li>`).join('')}</${tag}>`;
        }
        case 'stats':
          return `<ul class="stats">${b.items.map((s) => `<li><strong>${esc(s.value)}</strong> ${esc(s.label)}</li>`).join('')}</ul>`;
        case 'table':
          return `<table><thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows
            .map((r) => `<tr>${r.map((c) => `<td>${md(c)}</td>`).join('')}</tr>`)
            .join('')}</tbody></table>`;
        case 'image':
          return `<figure><img src="${b.src}" alt="${esc(b.alt)}" loading="lazy">${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
        default:
          return '';
      }
    })
    .join('');
}

const wrap = (inner) => `${STYLE}<div class="ssg-wrap"><main class="ssg">${inner}</main></div>`;

const studyList = () =>
  `<ul>${caseStudies.map((c) => `<li><a href="/case-study/${c.slug}">${esc(c.title)}</a> — ${esc(c.cardDesc)}</li>`).join('')}</ul>`;

const homeBody = () =>
  wrap(
    `<h1>Bintang Tobing</h1><p class="deck">Product &amp; Project Manager · Full-Stack Developer · AI Integration Specialist</p><p>${esc(HOME_SUMMARY)}</p><h2>Selected case studies</h2>${studyList()}${NAV}`
  );
const indexBody = () =>
  wrap(`<h1>Case Studies</h1><p class="deck">${esc(INDEX_INTRO)}</p>${studyList()}${NAV}`);
const linksBody = () =>
  wrap(
    `<h1>Links</h1><p class="deck">All professional, social, and personal links for Bintang Tobing — LinkedIn, GitHub, Instagram, Upwork, and more.</p>${NAV}`
  );
const detailBody = (c) =>
  wrap(
    `<p class="kicker">${esc(c.category)} · ${esc(c.year)}</p><h1>${esc(c.title)}</h1><p class="deck">${esc(c.deck)}</p>${blocksToHtml(c.blocks)}${NAV}`
  );

// Swap the home meta of the base index.html for a route.
function shell({ path, title, description, image = HOME_OG, type = 'website' }) {
  let html = base
    .replaceAll('https://bintangtobing.com/"', `${SITE}${path}"`)
    .replaceAll(HOME_TITLE, title)
    .replaceAll(HOME_DESC, description);
  if (image !== HOME_OG) html = html.replaceAll(HOME_OG, image);
  if (type !== 'website')
    html = html.replace('<meta property="og:type" content="website">', `<meta property="og:type" content="${type}">`);
  return html;
}

// Replace whatever is inside #root with route-specific pre-rendered content.
// The source #root fallback contains no nested <div>, so the first </div> is
// its close. (Vite hoists the module <script> to <head>, so we can't anchor on it.)
const ROOT_RE = /<div id="root">[\s\S]*?<\/div>/;
const setBody = (html, body) => html.replace(ROOT_RE, `<div id="root">${body}</div>`);

// ── write shells ──────────────────────────────────────────────
// Home (keeps home meta; just inject richer pre-rendered content)
writeFileSync(resolve(dist, 'index.html'), setBody(base, homeBody()));

writeFileSync(
  resolve(dist, 'links.html'),
  setBody(
    shell({
      path: '/links',
      title: 'Bintang Tobing | Links',
      description:
        'All professional, social, and personal links for Bintang Tobing. Connect on LinkedIn, GitHub, Instagram, and more.',
    }),
    linksBody()
  )
);

writeFileSync(
  resolve(dist, 'case-study.html'),
  setBody(shell({ path: '/case-study', title: INDEX_TITLE, description: INDEX_DESC }), indexBody())
);

mkdirSync(resolve(dist, 'case-study'), { recursive: true });
for (const c of caseStudies) {
  writeFileSync(
    resolve(dist, 'case-study', `${c.slug}.html`),
    setBody(
      shell({
        path: `/case-study/${c.slug}`,
        title: c.seo.title,
        description: c.seo.description,
        image: `${SITE}${c.ogImage}`,
        type: 'article',
      }),
      detailBody(c)
    )
  );
}

console.log(`postbuild: pre-rendered home, links, case-study index, and ${caseStudies.length} detail pages`);
