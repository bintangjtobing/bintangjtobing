import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { trackCvDownload, trackCvMenu } from '../utils/tracking';

const CV_OPTIONS = [
  {
    id: 'fullstack',
    role: 'Full-Stack Developer',
    labelKey: 'cv.fullstack',
    subKey: 'cv.fullstack.sub',
    file: '/cv/Bintang-Tobing-CV-Full-Stack-Developer.pdf',
  },
  {
    id: 'tpm',
    role: 'Technical Project Manager',
    labelKey: 'cv.tpm',
    subKey: 'cv.tpm.sub',
    file: '/cv/Bintang-Tobing-CV-Technical-Project-Manager.pdf',
  },
  {
    id: 'general',
    role: 'General',
    labelKey: 'cv.general',
    subKey: 'cv.general.sub',
    file: '/cv/Bintang-Tobing-CV-General.pdf',
  },
];

export default function CvDownload() {
  const { t, lang } = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        trackCvMenu('close', { location: 'hero', method: 'outside_click', language: lang });
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        trackCvMenu('close', { location: 'hero', method: 'escape', language: lang });
        btnRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, lang]);

  const toggleMenu = () => {
    const next = !open;
    setOpen(next);
    trackCvMenu(next ? 'open' : 'close', { location: 'hero', method: 'button', language: lang });
  };

  const handleDownload = (opt) => {
    const fileName = opt.file.split('/').pop();
    trackCvDownload(opt.id, {
      cv_role: opt.role,
      file_name: fileName,
      file_url: opt.file,
      language: lang,
      location: 'hero',
    });
    setOpen(false);
  };

  return (
    <div className={`cv-download ${open ? 'open' : ''}`} ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        className="cv-download-btn"
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t('cv.button')}
      >
        <svg className="cv-download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="cv-download-label">{t('cv.button')}</span>
        <svg className="cv-download-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul className="cv-menu" role="menu" aria-label={t('cv.button')}>
          {CV_OPTIONS.map((opt) => (
            <li key={opt.id} role="none">
              <a
                role="menuitem"
                className="cv-menu-item"
                href={opt.file}
                download
                title={`${t('cv.download')} — ${t(opt.labelKey)} (PDF)`}
                onClick={() => handleDownload(opt)}
              >
                <span className="cv-menu-text">
                  <span className="cv-menu-label">{t(opt.labelKey)}</span>
                  <span className="cv-menu-sub">{t(opt.subKey)}</span>
                </span>
                <span className="cv-menu-tag">PDF</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
