import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import Controls from '../components/Controls';
import VerifiedBadge from '../components/VerifiedBadge';
import { trackPageView, trackLinksPageClick } from '../utils/tracking';
import photo from '../assets/photo.jpg';
import thumbCirrus from '../assets/thumbs/cirrus.jpg';
import thumbGithub from '../assets/thumbs/github.jpg';
import thumbInstagram from '../assets/thumbs/instagram.jpg';
import thumbYoutube from '../assets/thumbs/youtube.jpg';

const linksSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Bintang Tobing | Links',
  description: 'All professional, social, and personal links for Bintang Tobing.',
  url: 'https://bintangtobing.com/links',
  author: { '@type': 'Person', name: 'Bintang Tobing' },
};

const linkGroups = [
  {
    labelKey: 'group.professional',
    groupName: 'Professional',
    links: [
      { icon: '\uD83D\uDCBC', labelKey: 'link.work', fallbackLabel: 'Work Together', url: 'https://cirrus-hub.net/appointment?utm_source=bintangtobing-links&utm_medium=share-on-links', title: 'Schedule a meeting with Bintang Tobing', thumbnail: true, thumbSrc: thumbCirrus, thumbAlt: 'Cirrus Hub appointment page preview' },
      { icon: 'in', label: 'LinkedIn', url: 'https://linkedin.com/in/bintangtobing', title: 'Bintang Tobing on LinkedIn' },
      { icon: '\u270D', labelKey: 'link.freelance', fallbackLabel: 'Freelance Projects', url: 'https://www.upwork.com/freelancers/~01981e16848fe1eecf', title: 'Hire Bintang Tobing on Upwork' },
      { icon: '\uD83C\uDF93', labelKey: 'link.certs', fallbackLabel: 'Licenses & Certifications', url: 'https://coursera.org/learner/bintang-tobing', title: 'Bintang Tobing certifications on Coursera' },
    ],
  },
  {
    labelKey: 'group.code',
    groupName: 'Code & Writing',
    links: [
      { icon: '</>', labelKey: 'link.github', fallbackLabel: 'GitHub', url: 'https://github.com/bintangjtobing', title: 'Bintang Tobing GitHub profile and repositories', thumbnail: true, thumbSrc: thumbGithub, thumbAlt: 'Bintang Tobing GitHub profile preview' },
      { icon: '\u270E', label: 'Press / Blog', url: 'https://press.bintangtobing.com', title: 'Bintang Tobing blog and press articles' },
      { icon: '\uD83C\uDF10', labelKey: 'link.website', fallbackLabel: 'Personal Website', url: 'https://bintangtobing.com', title: 'Bintang Tobing personal website' },
    ],
  },
  {
    labelKey: 'group.social',
    groupName: 'Social',
    links: [
      { icon: '\uD83D\uDCF7', label: 'Instagram', url: 'https://instagram.com/bcjlt', title: 'Bintang Tobing on Instagram @bcjlt', thumbnail: true, thumbSrc: thumbInstagram, thumbAlt: 'Bintang Tobing Instagram profile preview' },
      { icon: '\u266B', label: 'TikTok', url: 'https://www.tiktok.com/@tatangkatanyaa', title: 'Bintang Tobing on TikTok @tatangkatanyaa' },
      { icon: '\uD83D\uDCB0', labelKey: 'link.earn', fallbackLabel: 'Earning Opportunity', url: 'https://short.bitunixads.com/3x59hr', title: 'Earning opportunity via Bitunix' },
    ],
  },
  {
    labelKey: 'group.music',
    groupName: 'Music & Vibes',
    links: [
      { icon: '\uD83C\uDFB5', labelKey: 'link.lyrics', fallbackLabel: 'Lyrics Playlist', url: 'https://www.youtube.com/playlist?list=PL7QhwjamNNvJvLiP3hUlACgLRI5vc2i2b', title: 'Lyrics and music playlist on YouTube', thumbnail: true, thumbSrc: thumbYoutube, thumbAlt: 'YouTube lyrics playlist preview' },
      { icon: '\uD83C\uDFA7', label: 'Lofi Beats Playlist', url: 'https://www.youtube.com/playlist?list=PLQ8rSx0el_goJxYa7i1pGGpmmPFjPQFlt', title: 'Lofi beats playlist on YouTube' },
    ],
  },
  {
    labelKey: 'group.contact',
    groupName: 'Contact',
    links: [
      { icon: '\u2709', label: 'hello@bintangtobing.com', url: 'mailto:hello@bintangtobing.com?cc=bintangjtobing@gmail.com', external: false, title: 'Send email to Bintang Tobing' },
    ],
  },
];

export default function Links() {
  const { t } = useApp();

  useEffect(() => {
    trackPageView('/links', 'Links');
  }, []);

  let delayIndex = 0;

  const handleClick = (groupName, linkLabel, url) => {
    trackLinksPageClick(groupName, linkLabel, url);
  };

  return (
    <div className="links-page">
      <SEO
        title="Bintang Tobing | Links"
        description="All professional, social, and personal links for Bintang Tobing. Connect on LinkedIn, GitHub, Instagram, and more."
        path="/links"
        schemas={[linksSchema]}
      />

      <Link to="/" className="back" title="Back to Bintang Tobing homepage">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        Home
      </Link>

      <Controls />

      <div className="container">
        {/* PROFILE */}
        <div className="profile fade-in fd1">
          <div className="profile-photo">
            <img src={photo} alt="Bintang Tobing - profile photo" title="Bintang Tobing" />
          </div>
          <div className="profile-name-row">
            <h1 className="profile-name">Bintang Tobing</h1>
            <VerifiedBadge className="verified-badge" />
          </div>
          <p className="profile-bio">{t('bio')}</p>
        </div>

        {/* LINK GROUPS */}
        {linkGroups.map((group) => {
          delayIndex++;
          const groupDelay = delayIndex;
          return (
            <div key={group.labelKey} className={`link-group fade-in fd${Math.min(groupDelay, 15)}`}>
              <p className="link-group-label">{t(group.labelKey)}</p>
              <div className="link-list">
                {group.links.map((link) => {
                  delayIndex++;
                  const d = Math.min(delayIndex, 15);
                  const displayLabel = link.labelKey ? t(link.labelKey) : link.label;

                  if (link.thumbnail) {
                    return (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener"
                        title={link.title}
                        className={`link-item link-item-thumb fade-in fd${d}`}
                        onClick={() => handleClick(group.groupName, displayLabel, link.url)}
                      >
                        <div className="link-thumb">
                          <img
                            src={link.thumbSrc}
                            alt={link.thumbAlt}
                            title={link.title}
                            loading="lazy"
                          />
                        </div>
                        <div className="link-item-bottom">
                          <div className="link-item-left">
                            <div className="link-icon" aria-hidden="true">{link.icon}</div>
                            <span className="link-label">{displayLabel}</span>
                          </div>
                          <span className="link-arrow" aria-hidden="true">&rarr;</span>
                        </div>
                      </a>
                    );
                  }

                  return (
                    <a
                      key={link.url}
                      href={link.url}
                      target={link.external === false ? undefined : '_blank'}
                      rel={link.external === false ? undefined : 'noopener'}
                      title={link.title}
                      className={`link-item fade-in fd${d}`}
                      onClick={() => handleClick(group.groupName, displayLabel, link.url)}
                    >
                      <div className="link-item-left">
                        <div className="link-icon" aria-hidden="true">{link.icon}</div>
                        <span className="link-label">{displayLabel}</span>
                      </div>
                      <span className="link-arrow" aria-hidden="true">&rarr;</span>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* FOOTER */}
        <div className="links-footer">
          <p>&copy; 2026 Bintang Tobing</p>
        </div>
      </div>
    </div>
  );
}
