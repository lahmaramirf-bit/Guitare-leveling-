import type { ReactNode } from 'react';
import type { Rarity } from '../game/catalog';
import { RARITY_LABELS } from '../game/catalog';

export function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(n));
}

export function Bar({ value, max, label, right }: { value: number; max: number; label: string; right?: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 100;
  return (
    <div className="bar">
      <div className="bar-head"><span>{label}</span><span className="mono">{right ?? `${fmt(value)} / ${fmt(max)}`}</span></div>
      <div className="bar-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(value, max)}>
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Panel({ title, children, className = '', aside, id }: { title?: string; children: ReactNode; className?: string; aside?: ReactNode; id?: string }) {
  return (
    <section className={`panel ${className}`} id={id}>
      {title && <div className="panel-head"><h2 className="ribbon">{title}</h2>{aside}</div>}
      {children}
    </section>
  );
}

/** Ligne à cocher (quête, objectif, défi) — même mécanique que le projet de base. */
export function CheckItem({ on, onToggle, title, desc, xp, meta, boss, testId }: {
  on: boolean; onToggle: () => void; title: string; desc?: ReactNode; xp?: number | string; meta?: ReactNode; boss?: boolean; testId?: string;
}) {
  return (
    <button className={`check-item ${on ? 'on' : ''} ${boss ? 'boss' : ''}`} role="checkbox" aria-checked={on} onClick={onToggle} data-testid={testId}>
      <span className="box" aria-hidden="true">{on ? '✓' : ''}</span>
      <span className="ci-body">
        {boss && <span className="bosstag">Boss du donjon</span>}
        <span className="ci-title">{title}</span>
        {desc && <span className="ci-desc">{desc}</span>}
      </span>
      <span className="ci-meta">
        {xp !== undefined && <span className="xp">+{typeof xp === 'number' ? fmt(xp) : xp} XP</span>}
        {meta}
      </span>
    </button>
  );
}

export function RarityTag({ rarity }: { rarity: Rarity }) {
  return <span className={`rarity rarity-${rarity}`}>{RARITY_LABELS[rarity]}</span>;
}

export function Crystal() {
  return <span className="ico ico-crystal" aria-hidden="true">◆</span>;
}

export function Tabs<T extends string>({ value, onChange, items, label }: { value: T; onChange: (v: T) => void; items: [T, string][]; label: string }) {
  return (
    <div className="subtabs" role="tablist" aria-label={label}>
      {items.map(([id, l]) => <button key={id} role="tab" aria-selected={value === id} className={`subtab ${value === id ? 'sel' : ''}`} onClick={() => onChange(id)}>{l}</button>)}
    </div>
  );
}
