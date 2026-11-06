import { COSMETICS, type Cosmetic, type Rarity } from './cosmetics';
import type { Rng } from './rng';

/** Monnaie gagnée uniquement en jouant. Aucun achat réel (MVP). */
export const PULL_COST = 100;
export const PITY_LIMIT = 50;

/** Taux affichés au joueur (somme = 100 %). */
export const RATES: { rarity: Rarity; pct: number }[] = [
  { rarity: 'common', pct: 70 },
  { rarity: 'rare', pct: 22 },
  { rarity: 'epic', pct: 7 },
  { rarity: 'legendary', pct: 1 },
];

/** Éclats rendus pour un doublon. */
export const DUPLICATE_SHARDS: Record<Rarity, number> = { common: 5, rare: 15, epic: 40, legendary: 100 };

export function gachaPool(): Cosmetic[] {
  return COSMETICS.filter((c) => c.unlock.type === 'gacha');
}

export function rollRarity(rng: Rng, pity: number): Rarity {
  if (pity + 1 >= PITY_LIMIT) return 'legendary';
  let r = rng() * 100;
  for (const x of RATES) {
    if (r < x.pct) return x.rarity;
    r -= x.pct;
  }
  return 'common';
}

export interface PullResult {
  item: Cosmetic;
  duplicate: boolean;
  shards: number;
}

export function pull(rng: Rng, pity: number, inventory: string[]): PullResult & { pity: number } {
  const rarity = rollRarity(rng, pity);
  const pool = gachaPool().filter((c) => c.rarity === rarity);
  const item = pool[Math.floor(rng() * pool.length)];
  const duplicate = inventory.includes(item.id);
  return {
    item,
    duplicate,
    shards: duplicate ? DUPLICATE_SHARDS[rarity] : 0,
    pity: rarity === 'legendary' ? 0 : pity + 1,
  };
}

/** Coffre du jour : 20 à 50 cristaux. */
export function chestReward(rng: Rng): number {
  return 20 + Math.floor(rng() * 31);
}
