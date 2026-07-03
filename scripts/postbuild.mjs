// Post-build: this site has NO SPA catch-all in nginx (dead URLs must return a
// true 404, not a soft-200). So every client route ships its own static HTML
// shell with a route-specific canonical + Open Graph/Twitter meta, and nginx
// maps the route to that file. This generates:
//   dist/links.html                       -> /links
//   dist/case-study.html                  -> /case-study        (index)
//   dist/case-study/<slug>.html           -> /case-study/<slug> (detail, article)
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

const base = readFileSync(resolve(dist, 'index.html'), 'utf8');

// Build a route shell from the home index.html by swapping in route-specific meta.
// `path` is the canonical path (e.g. "/links"); opts overrides title/desc/image/type.
function shell({ path, title, description, image = HOME_OG, type = 'website' }) {
  let html = base
    // canonical + og:url + twitter:url  ("/" -> route)
    .replaceAll('https://bintangtobing.com/"', `${SITE}${path}"`)
    // <title>, og:title, twitter:title
    .replaceAll(HOME_TITLE, title)
    // description, og:description, twitter:description
    .replaceAll(HOME_DESC, description);
  if (image !== HOME_OG) html = html.replaceAll(HOME_OG, image); // og:image + twitter:image
  if (type !== 'website') html = html.replace('<meta property="og:type" content="website">', `<meta property="og:type" content="${type}">`);
  return html;
}

// /links
writeFileSync(
  resolve(dist, 'links.html'),
  shell({
    path: '/links',
    title: 'Bintang Tobing | Links',
    description: 'All professional, social, and personal links for Bintang Tobing. Connect on LinkedIn, GitHub, Instagram, and more.',
  })
);

// /case-study (index) — keep the site OG image
writeFileSync(
  resolve(dist, 'case-study.html'),
  shell({
    path: '/case-study',
    title: "Case Studies | Bintang Tobing — Products I've Built & Shipped",
    description: 'In-depth case studies of products Bintang Tobing has built: PMHelper (a production PM tool with QA gates and an MCP server), the Bitunix MarTech Dashboard, KlindrOS marketing intelligence, and the KlindrOS CRM.',
  })
);

// /case-study/<slug> (article, per-study OG image)
mkdirSync(resolve(dist, 'case-study'), { recursive: true });
for (const c of caseStudies) {
  writeFileSync(
    resolve(dist, 'case-study', `${c.slug}.html`),
    shell({
      path: `/case-study/${c.slug}`,
      title: c.seo.title,
      description: c.seo.description,
      image: `${SITE}${c.ogImage}`,
      type: 'article',
    })
  );
}

console.log(`postbuild: wrote links.html, case-study.html, and ${caseStudies.length} case-study/<slug>.html shells`);
