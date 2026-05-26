// Post-build: generate a route-specific dist/links.html so the /links page ships
// its own static canonical + Open Graph tags (instead of inheriting the home
// page's "/" canonical). This prevents Google from treating /links as an
// "Alternate page with proper canonical tag" of the homepage.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');

const HOME_TITLE = 'Bintang Tobing | Marketing Technology & Full-Stack Developer';
const HOME_DESC =
  'Bintang Tobing | Marketing Technology Leader, Full-Stack Developer & AI Integration Specialist with 9+ years of expertise.';

const LINKS_TITLE = 'Bintang Tobing | Links';
const LINKS_DESC =
  'All professional, social, and personal links for Bintang Tobing. Connect on LinkedIn, GitHub, Instagram, and more.';

let html = readFileSync(resolve(dist, 'index.html'), 'utf8');

html = html
  // canonical + og:url + twitter:url (root "/" -> "/links")
  .replaceAll('https://bintangtobing.com/"', 'https://bintangtobing.com/links"')
  // <title>, og:title, twitter:title
  .replaceAll(HOME_TITLE, LINKS_TITLE)
  // description, og:description, twitter:description
  .replaceAll(HOME_DESC, LINKS_DESC);

writeFileSync(resolve(dist, 'links.html'), html);
console.log('postbuild: wrote dist/links.html (canonical + OG -> /links)');
