import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SEO, { personSchema, SITE_URL } from '../components/SEO';
import Controls from '../components/Controls';
import Reveal from '../components/Reveal';
import { caseStudies } from '../data/caseStudies';
import { trackPageView, trackCaseStudyOpen } from '../utils/tracking';

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Case Studies — Bintang Tobing',
  description: 'In-depth case studies of products Bintang Tobing has built and shipped: PMHelper, the Bitunix MarTech Dashboard, and KlindrOS.',
  url: `${SITE_URL}/case-study`,
  author: { '@type': 'Person', name: 'Bintang Tobing' },
  publisher: { '@type': 'Person', name: 'Bintang Tobing', url: SITE_URL },
  hasPart: caseStudies.map((c) => ({
    '@type': 'Article',
    headline: c.title,
    url: `${SITE_URL}/case-study/${c.slug}`,
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${SITE_URL}/case-study` },
  ],
};

export default function CaseStudyIndex() {
  const { t } = useApp();

  useEffect(() => {
    trackPageView('/case-study', 'Case Studies');
  }, []);

  return (
    <div className="cs-page">
      <SEO
        title="Case Studies | Bintang Tobing — Products I've Built & Shipped"
        description="In-depth case studies of products Bintang Tobing has built: PMHelper (a production PM tool with QA gates and an MCP server), the Bitunix MarTech Dashboard, and KlindrOS marketing intelligence."
        path="/case-study"
        type="website"
        schemas={[personSchema, collectionSchema, breadcrumbSchema]}
      />

      <Link to="/" className="back" title="Back to Bintang Tobing homepage">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        Home
      </Link>

      <Controls />

      <div className="cs-container">
        <header className="cs-index-head">
          <Reveal><p className="section-label">{t('cs.label')}</p></Reveal>
          <Reveal><h1 className="cs-index-title">{t('cs.index.title')}</h1></Reveal>
          <Reveal><p className="cs-index-intro">{t('cs.index.intro')}</p></Reveal>
        </header>

        <div className="cs-index-list">
          {caseStudies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.04}>
              <Link
                to={`/case-study/${c.slug}`}
                className="cs-index-card"
                title={c.title}
                onClick={() => trackCaseStudyOpen(c.slug, 'index')}
              >
                <div className="cs-index-card-media">
                  <img src={c.cardImage} alt={c.cardImageAlt} title={c.title} loading="lazy" />
                </div>
                <div className="cs-index-card-body">
                  <span className="cs-index-card-cat">{c.category} · {c.year}</span>
                  <h2 className="cs-index-card-title">{c.title}</h2>
                  <p className="cs-index-card-desc">{c.cardDesc}</p>
                  <div className="cs-index-card-tags">
                    {c.cardTags.map((tag) => <span key={tag} className="cs-tag">{tag}</span>)}
                  </div>
                  <span className="cs-index-card-read">{t('cs.read')} <span aria-hidden="true">&rarr;</span></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="cs-index-foot">
          <p>&copy; 2026 Bintang Tobing</p>
        </div>
      </div>
    </div>
  );
}
