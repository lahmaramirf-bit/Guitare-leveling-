import { useEffect, useRef } from 'react';
import type { Ambience } from './worlds';
import { usePrefersReducedMotion } from '../avatar/Avatar';

/**
 * Effets atmosphériques légers (pétales, pluie, particules). Non stroboscopiques,
 * en pause hors écran / onglet caché, désactivés avec prefers-reduced-motion.
 */
export function AmbienceCanvas({ kind }: { kind: Ambience }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const cv = ref.current;
    if (!cv || reduced) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => { w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const N = kind === 'rain' ? 110 : kind === 'petals' ? 26 : 40;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const ps = Array.from({ length: N }, () => ({ x: rnd(0, 1), y: rnd(0, 1), s: rnd(0.5, 1), r: rnd(0, Math.PI * 2), v: rnd(0.6, 1.2) }));
    const draw = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        if (kind === 'petals') {
          p.y += dt * 0.05 * p.v; p.x += dt * 0.025 * Math.sin(t / 1300 + p.r); p.r += dt * 0.8;
          if (p.y > 1.05) { p.y = -0.05; p.x = rnd(0, 1); }
          ctx.save(); ctx.translate(p.x * w, p.y * h); ctx.rotate(p.r); ctx.globalAlpha = 0.75;
          ctx.fillStyle = '#ffc6dd'; ctx.beginPath(); ctx.ellipse(0, 0, 5 * p.s, 3 * p.s, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ff9cc4'; ctx.beginPath(); ctx.ellipse(1 * p.s, 0, 2 * p.s, 1.2 * p.s, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        } else if (kind === 'rain') {
          p.y += dt * 1.1 * p.v; p.x -= dt * 0.08 * p.v;
          if (p.y > 1.02) { p.y = -0.05; p.x = rnd(0, 1.1); }
          ctx.strokeStyle = `rgba(150, 230, 255, ${0.18 + 0.2 * p.s})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x * w, p.y * h); ctx.lineTo(p.x * w + 3, p.y * h - 16 * p.s); ctx.stroke();
        } else {
          p.y -= dt * 0.02 * p.v; p.x += dt * 0.01 * Math.sin(t / 2000 + p.r);
          if (p.y < -0.05) { p.y = 1.05; p.x = rnd(0, 1); }
          const a = 0.25 + 0.25 * Math.sin(t / 900 + p.r);
          ctx.fillStyle = `rgba(214, 190, 255, ${a})`; ctx.beginPath(); ctx.arc(p.x * w, p.y * h, 1.6 * p.s + 0.6, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) { last = performance.now(); raf = requestAnimationFrame(draw); } });
    io.observe(cv);
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden && visible) { last = performance.now(); raf = requestAnimationFrame(draw); } };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', resize); };
  }, [kind, reduced]);
  return <canvas ref={ref} className={`ambience ambience-${kind}`} aria-hidden="true" data-testid="ambience" />;
}
