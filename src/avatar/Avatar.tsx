import { useEffect, useState } from 'react';
import type { AvatarId } from '../game/model';
import { CANVAS, CHARACTERS, renderLayers, resolveAnimation, type AnimState } from './manifest';

export function usePrefersReducedMotion(): boolean {
  const q = '(prefers-reduced-motion: reduce)';
  const [v, setV] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(q).matches);
  useEffect(() => {
    const m = window.matchMedia?.(q);
    if (!m) return;
    const on = () => setV(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return v;
}

/**
 * Personnage entier, calé sur la ligne de sol du canevas (512, 1170).
 * Empile les calques disponibles ; aujourd'hui seul le corps (PNG aplati) existe.
 */
export function Avatar({ avatar, guitar = null, state = 'idle', className = '', label }: {
  avatar: AvatarId; guitar?: string | null; state?: AnimState; className?: string; label?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const anim = resolveAnimation(state, reduced);
  const layers = renderLayers(avatar, guitar);
  const c = CHARACTERS[avatar];
  const alt = label ?? (avatar === 'boy' ? 'Ton héros : le musicien aux cheveux bruns' : 'Ton héroïne : la musicienne aux cheveux corail');
  return (
    <div className={`avatar ${className}`} data-avatar={avatar} data-anim={anim.state} data-anim-mode={anim.mode} data-blocked={anim.blocked ?? undefined}
      style={{ aspectRatio: `${CANVAS.width} / ${CANVAS.height}`, ['--ground' as string]: `${((CANVAS.height - CANVAS.groundY) / CANVAS.height) * 100}%` }}>
      <span className="avatar-shadow" aria-hidden="true" />
      <div className="avatar-rig">
        {layers.map((l) => l.slot === 'body'
          ? <img key={l.slot} className={`avatar-layer layer-${l.slot}`} src={c.file} srcSet={`${c.file512} 512w, ${c.file} 1024w`} sizes="(max-width: 760px) 60vw, 420px" alt={alt} draggable={false} data-testid="avatar-body" />
          : <img key={l.slot} className={`avatar-layer layer-${l.slot}`} src={l.src} alt="" draggable={false} />)}
      </div>
    </div>
  );
}

/** Portrait dérivé officiellement du master (cadrage tête), pour les vues compactes. */
export function AvatarPortrait({ avatar, size = 64 }: { avatar: AvatarId; size?: number }) {
  // Fenêtre carrée 400 px centrée sur la tête (x 312–712, y 70–470) du canevas 1024×1280.
  const W = 400;
  return (
    <span className="avatar-portrait" style={{ width: size, height: size, backgroundImage: `url(${CHARACTERS[avatar].file512})`, backgroundSize: `${(CANVAS.width / W) * 100}% auto`, backgroundPosition: `${(312 / (CANVAS.width - W)) * 100}% ${(70 / (CANVAS.height - W)) * 100}%` }}
      role="img" aria-label={avatar === 'boy' ? 'Portrait du héros' : 'Portrait de l’héroïne'} />
  );
}

/** Silhouette neutre tant que le personnage n'est pas choisi (évite d'afficher un mauvais avatar). */
export function AvatarPending() {
  return <div className="avatar avatar-pending" style={{ aspectRatio: '1024 / 1280' }} aria-label="Personnage pas encore choisi" role="img" />;
}
