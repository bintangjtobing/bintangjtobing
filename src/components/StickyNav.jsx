import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export default function StickyNav() {
  const { t } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={visible ? 'visible' : ''}>
      <div className="nav-inner">
        <span className="nav-name">Bintang Tobing</span>
        <ul className="nav-links">
          <li><a href="#experience" title="Jump to Experience section">{t('nav.experience')}</a></li>
          <li><a href="#projects" title="Jump to Projects section">{t('nav.projects')}</a></li>
          <li><a href="#stack" title="Jump to Tech Stack section">{t('nav.stack')}</a></li>
          <li><a href="#awards" title="Jump to Awards section">{t('nav.awards')}</a></li>
        </ul>
      </div>
    </nav>
  );
}
