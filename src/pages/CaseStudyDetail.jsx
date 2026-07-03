import { useEffect, useRef } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SEO, { personSchema, SITE_URL } from '../components/SEO';
import Controls from '../components/Controls';
import Reveal from '../components/Reveal';
import CaseStudyContent from '../components/CaseStudyContent';
import { caseStudies, caseStudyBySlug } from '../data/caseStudies';
import {
  trackPageView,
  trackCaseStudyView,
  trackCaseStudyScroll,
  trackCaseStudyCta,
  trackCaseStudyOpen,
  trackCaseStudyNav,
} from '../utils/tracking';

const LIVE_UTM = 'utm_source=bintangtobing.com&utm_medium=case-study&utm_campaign=case-study-cta';

function withUtm(url) {
  if (!url) return url;
  return url + (url.includes('?') ? '&' : '?') + LIVE_UTM;
}

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const { t } = useApp();
  const study = caseStudyBySlug[slug];
  const firedRef = useRef(new Set());

  useEffect(() => {
    if (!study) return;
    window.scrollTo(0, 0);
    trackPageView(`/case-study/${study.slug}`, study.seo.title);
    trackCaseStudyView(study.slug);

    const fired = firedRef.current;
    const marks = [25, 50, 75, 100];
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 100;
      for (const m of marks) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          trackCaseStudyScroll(study.slug, m);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [study]);

  // Unknown slug -> send to the index rather than a dead page.
  if (!study) return <Navigate to="/case-study" replace />;

  const idx = caseStudies.findIndex((c) => c.slug === study.slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.deck,
    image: `${SITE_URL}${study.ogImage}`,
    author: { '@type': 'Person', name: 'Bintang Tobing', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Bintang Tobing', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/case-study/${study.slug}` },
    about: study.category,
    inLanguage: 'en',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${SITE_URL}/case-study` },
      { '@type': 'ListItem', position: 3, name: study.title, item: `${SITE_URL}/case-study/${study.slug}` },
    ],
  };

  return (
    <div className="cs-page">
      <SEO
        title={study.seo.title}
        description={study.seo.description}
        keywords={study.seo.keywords}
        path={`/case-study/${study.slug}`}
        type="article"
        image={study.ogImage}
        imageAlt={study.hero.alt}
        schemas={[personSchema, articleSchema, breadcrumbSchema]}
      />

      <Link to="/case-study" className="back" title="Back to all case studies">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        {t('cs.all')}
      </Link>

      <Controls />

      <article className="cs-container">
        <header className="cs-detail-head">
          <Reveal><p className="section-label cs-detail-cat">{study.category} · {study.year}</p></Reveal>
          <Reveal><h1 className="cs-detail-title">{study.title}</h1></Reveal>
          <Reveal><p className="cs-detail-deck">{study.deck}</p></Reveal>

          <Reveal>
            <div className="cs-detail-meta">
              <div className="cs-detail-meta-item">
                <span className="cs-detail-meta-label">{t('cs.role')}</span>
                <span className="cs-detail-meta-value">{study.role}</span>
              </div>
              {study.live && (
                <a
                  className="cs-live-link"
                  href={withUtm(study.live.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${study.live.label} (live)`}
                  onClick={() => trackCaseStudyCta(study.slug, study.live.url, 'live_header')}
                >
                  <span className="cs-live-dot" aria-hidden="true" />
                  {t('cs.live')} · {study.live.label}
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </Reveal>

          <Reveal>
            <div className="cs-detail-stack">
              {study.stack.map((s) => <span key={s} className="cs-tag">{s}</span>)}
            </div>
          </Reveal>
        </header>

        <Reveal>
          <figure className="cs-hero-figure">
            <img src={study.hero.src} alt={study.hero.alt} title={study.hero.title} />
          </figure>
        </Reveal>

        <CaseStudyContent blocks={study.blocks} slug={study.slug} autolink={study.autolink} />

        {/* CTA */}
        <Reveal>
          <div className="cs-cta">
            <div className="cs-cta-text">
              <span className="cs-cta-title">{t('cs.cta.title')}</span>
              <span className="cs-cta-sub">{t('cs.cta.sub')}</span>
            </div>
            <div className="cs-cta-actions">
              {study.live && (
                <a
                  className="cs-cta-btn cs-cta-btn-primary"
                  href={withUtm(study.live.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${study.live.label}`}
                  onClick={() => trackCaseStudyCta(study.slug, study.live.url, 'live_footer')}
                >
                  {t('cs.cta.visit')} <span aria-hidden="true">↗</span>
                </a>
              )}
              <a
                className="cs-cta-btn"
                href="https://cirrus-hub.net/appointment?utm_source=bintangtobing.com&utm_medium=case-study&utm_campaign=work-together"
                target="_blank"
                rel="noopener noreferrer"
                title="Work with Bintang Tobing"
                onClick={() => trackCaseStudyCta(study.slug, 'https://cirrus-hub.net/appointment', 'work_together')}
              >
                {t('cs.cta.work')} <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Next study */}
        <Reveal>
          <Link
            to={`/case-study/${next.slug}`}
            className="cs-next"
            title={next.title}
            onClick={() => { trackCaseStudyNav('next', next.slug); trackCaseStudyOpen(next.slug, 'detail_next'); }}
          >
            <div className="cs-next-media">
              <img src={next.cardImage} alt={next.cardImageAlt} loading="lazy" />
            </div>
            <div className="cs-next-body">
              <span className="cs-next-label">{t('cs.next')}</span>
              <span className="cs-next-title">{next.title}</span>
            </div>
            <span className="cs-next-arrow" aria-hidden="true">&rarr;</span>
          </Link>
        </Reveal>

        <div className="cs-index-foot">
          <p>&copy; 2026 Bintang Tobing</p>
        </div>
      </article>
    </div>
  );
}
