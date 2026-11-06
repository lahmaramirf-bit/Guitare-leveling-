import type { ReactNode } from 'react';
import type { Rarity } from '../game/cosmetics';
import { RARITY_LABELS } from '../game/cosmetics';

export function Bar({ value, max, label, right }: { value: number; max: number; label: string; right?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 100;
  return (
    <div className="bar">
      <div className="bar-head"><span>{label}</span><span className="mono">{right ?? `${fmt(value)} / ${fmt(max)}`}</span></div>
      <div className="bar-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(value, max)}>
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Panel({ title, children, className = '', aside }: { title?: string; children: ReactNode; className?: string; aside?: ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      {title && <div className="panel-head"><h2 className="ribbon">{title}</h2>{aside}</div>}
      {children}
    </section>
  );
}

export function RarityTag({ rarity }: { rarity: Rarity }) {
  return <span className={`rarity rarity-${rarity}`}>{RARITY_LABELS[rarity]}</span>;
}

export function Crystal() {
  return <span className="ico ico-crystal" aria-hidden="true">◆</span>;
}
export function Shard() {
  return <span className="ico ico-shard" aria-hidden="true">✦</span>;
}

export function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n);
}
