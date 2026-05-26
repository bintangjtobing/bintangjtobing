import { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

// Warna titik mengikuti tema. rgb = warna dasar, maxAlpha = puncak twinkle, glow = blur cahaya.
const THEME_COLORS = {
  light: { rgb: '90, 90, 90', maxAlpha: 0.4, glow: 6 },
  dark: { rgb: '226, 232, 246', maxAlpha: 0.6, glow: 10 },
};

export default function ParticleBackground() {
  const { theme } = useApp();
  const canvasRef = useRef(null);
  const colorRef = useRef(THEME_COLORS[theme] || THEME_COLORS.light);

  // Simpan warna tema terbaru agar loop animasi membacanya tanpa perlu restart.
  useEffect(() => {
    colorRef.current = THEME_COLORS[theme] || THEME_COLORS.light;
  }, [theme]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let rafId;

    const buildParticles = () => {
      // Kepadatan ~1 titik per 14.000px², dibatasi 90 agar tetap ringan.
      const target = Math.min(Math.round((width * height) / 14000), 90);
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8,
        phase: Math.random() * Math.PI * 2,
        twinkle: Math.random() * 0.015 + 0.005,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    const draw = () => {
      const { rgb, maxAlpha, glow } = colorRef.current;
      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = glow;
      ctx.shadowColor = `rgba(${rgb}, ${maxAlpha})`;
      for (const p of particles) {
        if (!prefersReduced) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += p.twinkle;
          if (p.x < -5) p.x = width + 5;
          else if (p.x > width + 5) p.x = -5;
          if (p.y < -5) p.y = height + 5;
          else if (p.y > height + 5) p.y = -5;
        }
        const alpha = prefersReduced
          ? maxAlpha * 0.5
          : (0.15 + ((Math.sin(p.phase) + 1) / 2) * 0.85) * maxAlpha;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!prefersReduced) rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-bg" aria-hidden="true" />;
}
