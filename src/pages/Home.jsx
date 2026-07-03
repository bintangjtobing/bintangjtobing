import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import Controls from '../components/Controls';
import StickyNav from '../components/StickyNav';
import VerifiedBadge from '../components/VerifiedBadge';
import CvDownload from '../components/CvDownload';
import Reveal from '../components/Reveal';
import { caseStudies } from '../data/caseStudies';
import { trackPageView, trackEvent, trackScrollDepth, trackCaseStudyOpen } from '../utils/tracking';
import photo from '../assets/photo.webp';

const experiences = [
  {
    roleKey: 'exp.1.role',
    meta: 'Bitunix Fintech LLC, United Arab Emirates · Feb 2025 – May 2026',
    bullets: ['exp.1.b1', 'exp.1.b2', 'exp.1.b3', 'exp.1.b4'],
  },
  {
    roleKey: 'exp.2.role',
    meta: 'Parla Consultancy Sdn Bhd, Kuala Lumpur · Jun 2024 – Apr 2025',
    bullets: ['exp.2.b1', 'exp.2.b2', 'exp.2.b3'],
  },
  {
    roleKey: 'exp.3.role',
    meta: 'PT Dinamik Mobile (iPay88), Jakarta · Jun – Nov 2024',
    bullets: ['exp.3.b1', 'exp.3.b2', 'exp.3.b3'],
  },
  {
    roleKey: 'exp.4.role',
    meta: 'PT Boxity Central Indonesia, Jakarta · Mar 2021 – Nov 2023',
    bullets: ['exp.4.b1', 'exp.4.b2', 'exp.4.b3', 'exp.4.b4'],
  },
  {
    roleKey: 'exp.5.role',
    meta: 'PT Benua Solusi Teknologi, Jakarta · Sep 2018 – Oct 2023',
    bullets: ['exp.5.b1', 'exp.5.b2', 'exp.5.b3'],
  },
  {
    roleKey: 'exp.6.role',
    meta: 'Digital Envision Pty. Ltd, Sydney, Australia · Nov 2020 – Feb 2021',
    bullets: ['exp.6.b1', 'exp.6.b2'],
    suffix: <span style={{ fontWeight: 400, color: 'var(--muted)' }}> (Remote)</span>,
  },
];

const projects = [
  { name: 'KlindrOS', descKey: 'proj.klindros.desc', metrics: ['proj.klindros.m1', 'proj.klindros.m2'], extraMetrics: ['Laravel 11 + Next.js 16 + Expo'] },
  { name: 'Bitunix MarTech Dashboard', descKey: 'proj.bitunix.desc', metrics: ['proj.bitunix.m1', 'proj.bitunix.m2'] },
  { name: 'PMHelper', descKey: 'proj.4.desc', metrics: ['proj.4.m1', 'proj.4.m2'] },
  { name: 'Cirrus Crypto Platform', descKey: 'proj.1.desc', metrics: ['proj.1.m1'] },
  { name: 'AI Marketing Extension', descKey: 'proj.2.desc', metrics: ['proj.2.m1', 'proj.2.m2'] },
  { name: 'YouTube-to-Twitter Automation', descKey: 'proj.3.desc', metrics: ['proj.3.m1'] },
  { name: 'ERP Platform · Boxity', descKey: 'proj.5.desc', metrics: ['proj.5.m1'], extraMetrics: ['React Native + Laravel'] },
  { nameKey: 'proj.6.name', descKey: 'proj.6.desc', metrics: ['proj.6.m1'] },
  { nameKey: 'proj.7.name', descKey: 'proj.7.desc', metrics: ['proj.7.m1', 'proj.7.m2'] },
];

const stackGroups = [
  { labelKey: 'stack.ai', tags: ['Anthropic Claude API', 'OpenAI GPT-4o', 'MCP', 'n8n', 'Prompt Engineering', 'AI Pipeline Architecture'] },
  { labelKey: 'stack.prog', tags: ['JavaScript', 'TypeScript', 'Python', 'PHP'] },
  { label: 'Frontend', tags: ['React.js', 'Next.js', 'Vue.js', 'React Native', 'Expo', 'Flutter', 'TailwindCSS', 'shadcn/ui', 'Alpine.js'] },
  { label: 'Backend', tags: ['Node.js', 'Laravel', 'Filament', 'Livewire', 'REST API', 'GraphQL'] },
  { labelKey: 'stack.db', tags: ['PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB', 'Redis'] },
  { label: 'Data & Analytics', tags: ['Data Analysis', 'Tableau', 'R', 'Data Visualization', 'Data Storytelling', 'Data Cleaning'] },
  { labelKey: 'stack.realtime', tags: ['Pusher Channels', 'Jitsi Meet (self-hosted)', 'Laravel Horizon', 'BigQuery'] },
  { labelKey: 'stack.martech', tags: ['Google Analytics 4', 'Meta Business Suite', 'TikTok Ads', 'Twitter Ads', 'CRM', 'UTM Tracking', 'A/B Testing', 'CRO'] },
  { label: 'Project Management', tags: ['Agile', 'Scrum', 'Sprint Planning', 'Backlog Management', 'Risk Management', 'Stakeholder Management', 'SDLC'] },
  { labelKey: 'stack.devops', tags: ['Git', 'GitHub', 'Docker', 'CI/CD', 'Nginx', 'PM2', 'Let’s Encrypt', 'fail2ban', 'Server Administration'] },
  { labelKey: 'stack.tools', tags: ['Vite', 'WordPress', 'Figma', 'Photoshop', 'Chrome Extension API'] },
];

const awards = [
  { rank: 'Top 250 Global', detail: 'Slingshot 2022 Deep Tech Startup Competition, Singapore' },
  { rank: 'Top 100 Global', detail: 'Huawei Spark Ignite 2022 Program' },
  { rankKey: 'award.3.rank', detail: 'Founder+ Incubator Program' },
  { rankKey: 'award.4.rank', detail: 'Startup Exhibition Medan 2023' },
  { rank: 'Top 32', detail: 'Hatch! Gerakan 1000 Startup Digital Nasional, Kemenkominfo' },
];

const certs = [
  { name: 'Google Data Analytics Professional Certificate', org: 'Google', year: '2026', url: 'https://coursera.org/verify/professional-cert/WV0MOQW5LC5P' },
  { name: 'Supply Chain Management and Analytics', org: 'Unilever', year: '2026', url: 'https://www.coursera.org/account/accomplishments/verify/QE4M44E58B21' },
  { name: 'IBM IT Project Manager Specialization', org: 'IBM & SkillUp EdTech', year: '2025', url: 'https://www.coursera.org/account/accomplishments/specialization/OW33Y1QVQ9VO' },
  { name: 'Google Project Management Professional Certificate', org: 'Google', year: '2024', url: 'https://www.coursera.org/account/accomplishments/specialization/3VULLFKJCR9Q' },
  { name: 'ASEAN Data Science Explorers', org: 'SAP Analytics Cloud, ASEAN Foundation', year: '2024', credId: 'No. 074/SERT/24-DSI-04/IV/2024' },
  { name: 'Cyber Security Certification', org: 'habiskerja.com', year: '2022' },
  { name: 'Front-end Web Development Quantum Degree', org: 'Next Academy, Kuala Lumpur', year: '2019', credId: '8-b607091d-72c1-4a40-ad96-74187180d53d' },
];

const heroLinks = [
  { label: 'Email', href: 'mailto:hello@bintangtobing.com?cc=bintangjtobing@gmail.com', title: 'Send email to Bintang Tobing', event: 'click_hero_email' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/bintangtobing', title: 'Bintang Tobing on LinkedIn', event: 'click_hero_linkedin' },
  { label: 'GitHub', href: 'https://github.com/bintangjtobing', title: 'Bintang Tobing on GitHub', event: 'click_hero_github' },
  { label: 'Press', href: 'https://press.bintangtobing.com', title: 'Bintang Tobing Blog & Press', event: 'click_hero_press' },
  { label: 'Website', href: 'https://bintangtobing.com', title: 'Bintang Tobing Personal Website', event: 'click_hero_website' },
];

export default function Home() {
  const { t } = useApp();

  // Years of experience auto-grow from start years (no manual updates needed).
  const currentYear = new Date().getFullYear();
  const fsYears = currentYear - 2016; // Full-Stack Developer since 2016
  const pmYears = currentYear - 2018; // Product / Project Manager since 2018
  const heroSummary = t('hero.summary')
    .replace('{fsYears}', fsYears)
    .replace('{pmYears}', pmYears);

  useEffect(() => {
    trackPageView('/', 'Home');

    // Scroll depth tracking
    const thresholds = [25, 50, 75, 100];
    const fired = new Set();

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);

      thresholds.forEach(t => {
        if (percent >= t && !fired.has(t)) {
          fired.add(t);
          trackScrollDepth(t);
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (eventName, href) => {
    trackEvent(eventName, { link_url: href, location: 'hero' });
  };

  return (
    <>
      <SEO
        title="Bintang Tobing | Product & Project Manager · Full-Stack Developer"
        description="Bintang Tobing, Product & Project Manager and Full-Stack Developer based in Indonesia & UAE, delivering products across ASEAN and remotely worldwide. MarTech, AI integration & fintech."
        path="/"
      />
      <Controls />
      <StickyNav />

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-top hero-enter hero-enter-d1">
            <div className="hero-photo">
              <img src={photo} alt="Bintang Tobing - Marketing Technology Manager and Full-Stack Developer" title="Bintang Tobing" />
            </div>
            <div>
              <div className="hero-name-row">
                <h1 className="hero-name">Bintang Tobing</h1>
                <VerifiedBadge />
              </div>
              <p className="hero-tagline">{t('hero.tagline')}</p>
            </div>
          </div>

          <p className="hero-summary hero-enter hero-enter-d2">{heroSummary}</p>

          <ul className="hero-links hero-enter hero-enter-d3">
            {heroLinks.map(link => (
              <li key={link.event}>
                <a
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'me noopener'}
                  title={link.title}
                  onClick={() => handleLinkClick(link.event, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hero-cv hero-enter hero-enter-d3">
            <CvDownload />
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <div className="section-divider" />
      <section className="section" id="experience">
        <Reveal trackId="experience"><p className="section-label">{t('section.experience')}</p></Reveal>
        {experiences.map((exp, i) => (
          <Reveal key={i}>
            <div className="exp-item">
              <h3 className="exp-role">{t(exp.roleKey)}{exp.suffix}</h3>
              <p className="exp-meta">{exp.meta}</p>
              <ul className="exp-bullets">
                {exp.bullets.map((bk) => <li key={bk}>{t(bk)}</li>)}
              </ul>
            </div>
          </Reveal>
        ))}
      </section>

      {/* PROJECTS */}
      <div className="section-divider" />
      <section className="section" id="projects">
        <Reveal trackId="projects"><p className="section-label">{t('section.projects')}</p></Reveal>
        <div className="project-grid">
          {projects.map((p, i) => (
            <Reveal key={i}>
              <div className="project-card">
                <h3 className="project-name">{p.nameKey ? t(p.nameKey) : p.name}</h3>
                <p className="project-desc">{t(p.descKey)}</p>
                {p.metrics.map((mk) => <span key={mk} className="project-metric">{t(mk)}</span>)}
                {p.extraMetrics?.map((m) => <span key={m} className="project-metric">{m}</span>)}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <a
            href="https://cirrus-hub.net/portfolio?utm_source=bintangtobing.com&utm_medium=personal-site&utm_campaign=portfolio-cta"
            target="_blank"
            rel="noopener"
            title="View Bintang Tobing's project portfolio and case studies"
            className="portfolio-cta"
            onClick={() => trackEvent('click_cta_portfolio', { link_url: 'https://cirrus-hub.net/portfolio', location: 'projects' })}
          >
            <div className="portfolio-cta-text">
              <span className="portfolio-cta-title">{t('cta.title')}</span>
              <span className="portfolio-cta-sub">cirrus-hub.net/portfolio</span>
            </div>
            <span className="portfolio-cta-arrow">&rarr;</span>
          </a>
        </Reveal>
      </section>

      {/* CASE STUDIES */}
      <div className="section-divider" />
      <section className="section" id="case-studies">
        <Reveal trackId="case-studies"><p className="section-label">{t('section.casestudies')}</p></Reveal>
        <Reveal><p className="cs-home-intro">{t('cs.home.intro')}</p></Reveal>
        <div className="cs-home-grid">
          {caseStudies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.04}>
              <Link
                to={`/case-study/${c.slug}`}
                className="cs-home-card"
                title={c.title}
                onClick={() => trackCaseStudyOpen(c.slug, 'home')}
              >
                <div className="cs-home-card-media">
                  <img src={c.cardImage} alt={c.cardImageAlt} title={c.title} loading="lazy" />
                </div>
                <div className="cs-home-card-body">
                  <span className="cs-home-card-cat">{c.category}</span>
                  <h3 className="cs-home-card-title">{c.title}</h3>
                  <p className="cs-home-card-desc">{c.cardDesc}</p>
                  <div className="cs-home-card-tags">
                    {c.cardTags.map((tag) => <span key={tag} className="cs-tag">{tag}</span>)}
                  </div>
                  <span className="cs-home-card-read">{t('cs.read')} <span aria-hidden="true">&rarr;</span></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Link
            to="/case-study"
            className="cs-home-viewall"
            title="View all case studies"
            onClick={() => trackEvent('click_case_studies_viewall', { location: 'home' })}
          >
            {t('cs.home.viewall')} <span aria-hidden="true">&rarr;</span>
          </Link>
        </Reveal>
      </section>

      {/* TECH STACK */}
      <div className="section-divider" />
      <section className="section" id="stack">
        <Reveal trackId="stack"><p className="section-label">{t('section.stack')}</p></Reveal>
        {stackGroups.map((g, i) => (
          <Reveal key={i}>
            <div className="stack-group">
              <p className="stack-group-label">{g.labelKey ? t(g.labelKey) : g.label}</p>
              <div className="stack-tags">
                {g.tags.map((tag) => <span key={tag} className="stack-tag" title={tag}>{tag}</span>)}
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* AWARDS */}
      <div className="section-divider" />
      <section className="section" id="awards">
        <Reveal trackId="awards"><p className="section-label">{t('section.awards')}</p></Reveal>
        <ul className="award-list">
          {awards.map((a, i) => (
            <Reveal key={i}>
              <li className="award-item">
                <span className="award-rank">{a.rankKey ? t(a.rankKey) : a.rank}</span>
                <span className="award-detail">{a.detail}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* CERTIFICATIONS */}
      <div className="section-divider" />
      <section className="section" id="certifications">
        <Reveal trackId="certifications"><p className="section-label">{t('section.certs')}</p></Reveal>
        <ul className="cert-list">
          {certs.map((c, i) => (
            <Reveal key={i}>
              <li className="cert-item">
                <span className="cert-name">
                  <span className="cert-title"><strong>{c.name}</strong> · {c.org}</span>
                  {c.url && (
                    <a
                      className="cert-verify"
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Verify ${c.name} credential`}
                      onClick={() => trackEvent('click_cert_verify', { link_url: c.url, location: 'certifications', cert: c.name })}
                    >
                      Verify credential ↗
                    </a>
                  )}
                  {c.credId && <span className="cert-cred">Credential ID: {c.credId}</span>}
                </span>
                <span className="cert-year">{c.year}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* FOOTER */}
      <div className="section-divider" />
      <footer>
        <span className="footer-copy">&copy; 2026 Bintang Tobing</span>
        <ul className="footer-nav">
          <li><a href="#experience" title="Experience section">{t('nav.experience')}</a></li>
          <li><a href="#projects" title="Projects section">{t('nav.projects')}</a></li>
          <li><a href="#case-studies" title="Case Studies section">{t('nav.casestudies')}</a></li>
          <li><a href="#stack" title="Tech Stack section">{t('nav.stack')}</a></li>
          <li><a href="#awards" title="Awards section">{t('nav.awards')}</a></li>
          <li><a href="#certifications" title="Certifications section">{t('nav.certs')}</a></li>
        </ul>
      </footer>
    </>
  );
}
