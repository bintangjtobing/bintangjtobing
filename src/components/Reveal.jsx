import { useEffect, useRef, useState } from 'react';
import { trackSectionView } from '../utils/tracking';

export default function Reveal({ children, className = '', delay = 0, trackId = null }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (trackId) trackSectionView(trackId);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [trackId]);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'vis' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
