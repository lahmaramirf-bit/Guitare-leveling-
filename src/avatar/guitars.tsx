/**
 * Guitares vectorielles, dessinées dans le style de la planche de DA (aplats, contour sombre épais),
 * d'après les quatre « skins d'exemple » (acoustique naturelle, électrique rouge, améthyste, cristal).
 * Elles se superposent aux masters SANS les modifier : guitare en bandoulière dans le dos, calque derrière le corps.
 * Coordonnées locales : la guitare est dessinée debout dans une boîte 240 × 720 (centre 120, 360).
 */
import type { AvatarId } from '../game/model';

export type GuitarShape = 'acoustic' | 'electric';
export interface GuitarSkin { shape: GuitarShape; name: string; body: string; body2: string; top?: string; guard?: string; neck: string; head: string; detail: string; sparkle?: boolean }

const OUTLINE = '#35202c';
export const GUITAR_SKINS: Record<string, GuitarSkin> = {
  guitar_study:        { shape: 'acoustic', name: 'Guitare d’étude',     body: '#e8b86d', body2: '#c58a3f', top: '#f3cf8a', neck: '#6b3f26', head: '#6b3f26', detail: '#3b2418' },
  guitar_cedar:        { shape: 'acoustic', name: 'Classique en cèdre',  body: '#c97a44', body2: '#9d552a', top: '#dc9a66', neck: '#4a2a18', head: '#4a2a18', detail: '#2d1a10' },
  guitar_maple:        { shape: 'acoustic', name: 'Érable flammé',       body: '#e4a24a', body2: '#b86f2a', top: '#f0c070', neck: '#5a3520', head: '#5a3520', detail: '#3a2010', sparkle: true },
  guitar_red_electric: { shape: 'electric', name: 'Électrique rouge',    body: '#d6263c', body2: '#9d1427', guard: '#fff5ea', neck: '#8a5a33', head: '#d6263c', detail: '#f7e7b4' },
  guitar_amethyst:     { shape: 'electric', name: 'Électrique améthyste', body: '#7d3fb2', body2: '#55267f', guard: '#8f55c4', neck: '#5a3a26', head: '#7d3fb2', detail: '#f3c650', sparkle: true },
  guitar_crystal:      { shape: 'electric', name: 'Guitare de cristal',  body: '#5fb8ff', body2: '#2f7fd6', guard: '#bfe6ff', neck: '#2a4a7a', head: '#5fb8ff', detail: '#ffffff', sparkle: true },
  guitar_virtuoso:     { shape: 'electric', name: 'Guitare du Virtuose', body: '#23202b', body2: '#0f0d14', guard: '#3a3545', neck: '#4a3524', head: '#23202b', detail: '#f3c650', sparkle: true },
};
export const guitarSkin = (id: string | null | undefined): GuitarSkin | null => (id && GUITAR_SKINS[id]) || null;

/**
 * Placement en bandoulière dans le dos, en coordonnées du canevas 1024 × 1280 (sol à 1170).
 * Le manche dépasse au-dessus de l'épaule gauche (côté spectateur), la caisse au niveau de la hanche droite.
 */
export const GUITAR_POSE: Record<AvatarId, { x: number; y: number; rot: number; scale: number; flip: boolean }> = {
  boy: { x: 556, y: 690, rot: -40, scale: 1.16, flip: false },
  // la queue de cheval occupe le côté gauche : guitare en miroir, manche au-dessus de l'épaule droite
  girl: { x: 480, y: 700, rot: 40, scale: 1.14, flip: true },
};

function Strings({ x1 = 96, x2 = 144, y1 = 150, y2 = 560 }: { x1?: number; x2?: number; y1?: number; y2?: number }) {
  return <g stroke="#f7efe0" strokeWidth="2.2" opacity=".9">{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={x1 + (i * (x2 - x1)) / 5} y1={y1} x2={x1 + 8 + (i * (x2 - x1 - 16)) / 5} y2={y2} />)}</g>;
}
function Head({ s, electric }: { s: GuitarSkin; electric: boolean }) {
  return (
    <g>
      {electric
        ? <path d="M98 36 C 96 10, 150 2, 156 30 L 150 150 L 90 150 Z" fill={s.head} stroke={OUTLINE} strokeWidth="9" strokeLinejoin="round" />
        : <path d="M90 150 L 90 40 Q 90 18 112 18 L 128 18 Q 150 18 150 40 L 150 150 Z" fill={s.head} stroke={OUTLINE} strokeWidth="9" strokeLinejoin="round" />}
      {!electric && <><rect x="104" y="48" width="12" height="78" rx="5" fill={OUTLINE} opacity=".5" /><rect x="124" y="48" width="12" height="78" rx="5" fill={OUTLINE} opacity=".5" /></>}
      {[0, 1, 2].map((i) => <g key={i}><circle cx={electric ? 86 : 78} cy={60 + i * 26} r="7" fill={s.detail} stroke={OUTLINE} strokeWidth="5" /><circle cx={electric ? 86 : 162} cy={electric ? 138 - i * 26 : 60 + i * 26} r="7" fill={s.detail} stroke={OUTLINE} strokeWidth="5" /></g>)}
    </g>
  );
}
function Neck({ s }: { s: GuitarSkin }) {
  return (
    <g>
      <rect x="92" y="140" width="56" height="300" fill={s.neck} stroke={OUTLINE} strokeWidth="9" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <line key={i} x1="96" y1={170 + i * 30} x2="144" y2={170 + i * 30} stroke={OUTLINE} strokeWidth="3" opacity=".55" />)}
      <rect x="88" y="142" width="64" height="12" fill="#f3e2c3" stroke={OUTLINE} strokeWidth="5" />
    </g>
  );
}

export function GuitarArt({ skin, className }: { skin: GuitarSkin; className?: string }) {
  const s = skin;
  const electric = s.shape === 'electric';
  return (
    <g className={className}>
      {electric ? (
        <>
          {/* caisse type solid body avec deux cornes */}
          <path d="M120 430 C 60 420, 20 440, 28 500 C 36 548, 10 600, 44 650 C 76 700, 120 720, 150 700 C 190 676, 236 690, 230 630 C 226 584, 250 540, 232 500 C 214 460, 190 452, 170 440 C 160 418, 128 410, 120 430 Z" fill={s.body} stroke={OUTLINE} strokeWidth="10" strokeLinejoin="round" />
          <path d="M70 520 C 60 580, 70 640, 120 668 C 160 684, 200 660, 206 610 C 212 560, 190 520, 150 506 C 120 496, 84 496, 70 520 Z" fill={s.body2} opacity=".35" />
          <path d="M96 470 C 60 480, 56 560, 76 610 C 92 650, 140 668, 176 640 C 196 620, 190 580, 184 540 L 176 470 Z" fill={s.guard} stroke={OUTLINE} strokeWidth="6" strokeLinejoin="round" />
          <rect x="98" y="480" width="44" height="14" rx="4" fill={OUTLINE} /><rect x="98" y="516" width="44" height="14" rx="4" fill={OUTLINE} /><rect x="98" y="554" width="44" height="14" rx="4" fill={OUTLINE} />
          <rect x="92" y="584" width="56" height="12" rx="3" fill={s.detail} stroke={OUTLINE} strokeWidth="4" />
          <circle cx="178" cy="596" r="9" fill={s.detail} stroke={OUTLINE} strokeWidth="4" /><circle cx="196" cy="626" r="9" fill={s.detail} stroke={OUTLINE} strokeWidth="4" />
          <Strings y1={150} y2={588} />
        </>
      ) : (
        <>
          <path d="M120 432 C 70 428, 44 456, 50 500 C 54 526, 72 540, 66 566 C 52 620, 60 690, 120 702 C 180 690, 188 620, 174 566 C 168 540, 186 526, 190 500 C 196 456, 170 428, 120 432 Z" fill={s.body} stroke={OUTLINE} strokeWidth="10" strokeLinejoin="round" />
          <path d="M120 440 C 82 438, 62 462, 66 498 C 70 524, 86 538, 80 566 C 68 614, 76 672, 120 684 C 164 672, 172 614, 160 566 C 154 538, 170 524, 174 498 C 178 462, 158 438, 120 440 Z" fill={s.top} opacity=".55" />
          {s.sparkle && <path d="M74 470 C 90 500, 70 560, 86 600 M150 460 C 166 500, 146 560, 162 610" stroke="#fff" strokeWidth="6" opacity=".35" fill="none" strokeLinecap="round" />}
          <circle cx="120" cy="512" r="30" fill={s.detail} stroke={OUTLINE} strokeWidth="6" /><circle cx="120" cy="512" r="38" fill="none" stroke={s.body2} strokeWidth="5" />
          <rect x="84" y="580" width="72" height="18" rx="4" fill={OUTLINE} /><rect x="88" y="572" width="64" height="8" rx="3" fill="#f3e2c3" />
          <Strings y1={150} y2={582} />
        </>
      )}
      <Neck s={s} />
      <Head s={s} electric={electric} />
    </g>
  );
}

/** Calque « guitare dans le dos » à insérer derrière le corps, dans un SVG au canevas 1024 × 1280. */
export function GuitarBackLayer({ avatar, skin }: { avatar: AvatarId; skin: GuitarSkin }) {
  const p = GUITAR_POSE[avatar];
  return (
    <svg className="avatar-layer layer-guitar_back" viewBox="0 0 1024 1280" aria-hidden="true" data-testid="guitar-layer" data-guitar-shape={skin.shape}>
      <g transform={`translate(${p.x} ${p.y}) rotate(${p.rot}) scale(${p.flip ? -p.scale : p.scale} ${p.scale}) translate(-120 -360)`}>
        <GuitarArt skin={skin} />
      </g>
    </svg>
  );
}

/** Vignette d'une guitare (boutique, garde-robe). */
export function GuitarIcon({ skin, size = 56 }: { skin: GuitarSkin; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 720 720" aria-hidden="true" className="guitar-icon">
      <g transform="translate(360 360) rotate(-40) scale(.9) translate(-120 -360)"><GuitarArt skin={skin} /></g>
    </svg>
  );
}
