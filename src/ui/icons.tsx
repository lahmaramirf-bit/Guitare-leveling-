/** Icônes vectorielles de l'interface (trait uniforme), pour remplacer les emojis. */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size: number, props: P) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...props,
});

export const Icon = {
  gear: ({ size = 22, ...p }: P) => (
    <svg {...base(size, p)}><circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" /></svg>
  ),
  sparkle: ({ size = 22, ...p }: P) => (
    <svg {...base(size, p)}><path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" /><path d="M19 15.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5Z" /></svg>
  ),
  scroll: ({ size = 22, ...p }: P) => (
    <svg {...base(size, p)}><path d="M7 4h11a2 2 0 0 1 2 2v1H9" /><path d="M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1H9" /><path d="M9 10h7M9 13.5h7M9 17h4" /></svg>
  ),
  gate: ({ size = 22, ...p }: P) => (
    <svg {...base(size, p)}><path d="M3 6c3 1 15 1 18 0" /><path d="M5 10h14" /><path d="M7 6.5V20M17 6.5V20M12 6.5V10" /></svg>
  ),
  note: ({ size = 22, ...p }: P) => (
    <svg {...base(size, p)}><path d="M9 18.5V5.5l10-2.5v12.5" /><circle cx="6.5" cy="18.5" r="2.5" /><circle cx="16.5" cy="15.5" r="2.5" /><path d="M9 9.5l10-2.5" /></svg>
  ),
  guitar: ({ size = 22, ...p }: P) => (
    <svg {...base(size, p)}><path d="M20.5 3.5 14 10" /><path d="M18 3l3 3" /><path d="M13.2 9.8c1.6 1.6.9 3.3-.2 4.4-1 .9-.4 2.3.6 3.2 1.4 1.4.7 3.3-.8 4.3-2.2 1.5-5.3 1.1-7.3-.9s-2.4-5.1-.9-7.3c1-1.5 2.9-2.2 4.3-.8.9 1 2.3 1.6 3.2.6 1.1-1.1 2.8-1.8 4.4-.2" /><circle cx="9.5" cy="15.5" r="1.6" /></svg>
  ),
  trophy: ({ size = 22, ...p }: P) => (
    <svg {...base(size, p)}><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" /><path d="M12 13v3M9 20h6M10 16.5h4v3.5h-4z" /></svg>
  ),
  book: ({ size = 22, ...p }: P) => (
    <svg {...base(size, p)}><path d="M12 6.5c-1.6-1.4-4-2-8-2v13c4 0 6.4.6 8 2 1.6-1.4 4-2 8-2v-13c-4 0-6.4.6-8 2Z" /><path d="M12 6.5v13" /><path d="M15.5 9.5c.1 1 .5 1.4 1.5 1.5-1 .1-1.4.5-1.5 1.5-.1-1-.5-1.4-1.5-1.5 1-.1 1.4-.5 1.5-1.5Z" /></svg>
  ),
  flame: ({ size = 18, ...p }: P) => (
    <svg {...base(size, p)}><path d="M12 3c1 3 4 4.5 4 9a4 4 0 0 1-8 0c0-1.5.5-2.5 1.2-3.3.3 1 .9 1.6 1.8 1.8C10.5 8.5 11 6 12 3Z" /></svg>
  ),
  gem: ({ size = 16, ...p }: P) => (
    <svg {...base(size, p)} fill="currentColor" stroke="none"><path d="M6 3h12l4 6-10 12L2 9l4-6Z" opacity=".95" /><path d="M2 9h20L12 21 2 9Z" fill="#fff" opacity=".22" /></svg>
  ),
  play: ({ size = 22, ...p }: P) => (
    <svg {...base(size, p)} fill="currentColor" stroke="none"><path d="M7 4.5v15l12-7.5L7 4.5Z" /></svg>
  ),
  chevron: ({ size = 18, ...p }: P) => (
    <svg {...base(size, p)}><path d="m9 5 7 7-7 7" /></svg>
  ),
};
export type IconName = keyof typeof Icon;
