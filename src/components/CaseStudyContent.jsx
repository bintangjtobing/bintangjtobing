import Reveal from './Reveal';
import { trackCaseStudyImage, trackCaseStudyCta } from '../utils/tracking';

const RE_ESCAPE = /[.*+?^${}()|[\]\\]/g;

// Wrap brand terms in plain text with outbound links. `autolink` may be a
// single { word, url } rule or an array of them; the longest phrase is matched
// first so "KScore Personal" wins over "KlindrOS".
function autolinkText(text, autolink, slug, keyBase) {
  if (!autolink) return [text];
  const rules = Array.isArray(autolink) ? autolink : [autolink];
  if (!rules.length) return [text];
  const sorted = [...rules].sort((a, b) => b.word.length - a.word.length);
  const re = new RegExp('(' + sorted.map((r) => r.word.replace(RE_ESCAPE, '\\$&')).join('|') + ')', 'g');
  const out = [];
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const matched = m[0];
    const rule = rules.find((r) => r.word === matched);
    out.push(
      <a
        key={`${keyBase}-al-${i++}`}
        className="cs-brand-link"
        href={rule.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${matched} — open`}
        onClick={() => trackCaseStudyCta(slug, rule.url, 'brand_inline')}
      >
        {matched}
      </a>
    );
    last = m.index + matched.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out.length ? out : [text];
}

// Minimal inline formatter: **bold** and `code`, plus optional brand auto-linking.
// Returns an array of React nodes.
function inline(text, autolink, slug) {
  const nodes = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(...autolinkText(text.slice(last, m.index), autolink, slug, `p${k}`));
    const tok = m[0];
    // Code stays literal; bold still gets brand links inside it.
    if (tok.startsWith('**')) nodes.push(<strong key={k++}>{autolinkText(tok.slice(2, -2), autolink, slug, `b${k}`)}</strong>);
    else nodes.push(<code key={k++}>{tok.slice(1, -1)}</code>);
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(...autolinkText(text.slice(last), autolink, slug, `t${k}`));
  return nodes;
}

// 'The ticket system' -> 'the-ticket-system'
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function Block({ block, slug, autolink }) {
  switch (block.type) {
    case 'lead':
      return <p className="cs-lead">{inline(block.text, autolink, slug)}</p>;

    case 'h2':
      return <h2 id={slugify(block.text)} className="cs-h2">{block.text}</h2>;

    case 'p':
      return <p className="cs-p">{inline(block.text, autolink, slug)}</p>;

    case 'quote':
      return (
        <blockquote className="cs-quote">
          <p>{inline(block.text, autolink, slug)}</p>
        </blockquote>
      );

    case 'list':
      return block.ordered ? (
        <ol className="cs-list cs-list-ol">{block.items.map((it, i) => <li key={i}>{inline(it, autolink, slug)}</li>)}</ol>
      ) : (
        <ul className="cs-list">{block.items.map((it, i) => <li key={i}>{inline(it, autolink, slug)}</li>)}</ul>
      );

    case 'stats':
      return (
        <div className="cs-stats">
          {block.items.map((s, i) => (
            <div key={i} className="cs-stat">
              <span className="cs-stat-value">{s.value}</span>
              <span className="cs-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      );

    case 'table':
      return (
        <div className="cs-table-wrap">
          <table className="cs-table">
            <thead>
              <tr>{block.head.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>{row.map((cell, c) => <td key={c}>{inline(cell, autolink, slug)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'image':
      return (
        <figure className="cs-figure">
          <a
            href={block.src}
            target="_blank"
            rel="noopener noreferrer"
            title={block.title}
            className="cs-figure-link"
            onClick={() => trackCaseStudyImage(slug, block.src.split('/').pop(), block.title)}
          >
            <img src={block.src} alt={block.alt} title={block.title} loading="lazy" />
          </a>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    default:
      return null;
  }
}

export default function CaseStudyContent({ blocks, slug, autolink }) {
  return (
    <div className="cs-body">
      {blocks.map((block, i) => (
        <Reveal key={i}>
          <Block block={block} slug={slug} autolink={autolink} />
        </Reveal>
      ))}
    </div>
  );
}
