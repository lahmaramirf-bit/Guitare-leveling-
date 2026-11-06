import type { Rank } from './levels';

export type Slot = 'hair' | 'top' | 'bottom' | 'accessory' | 'guitar';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AvatarId = 'boy' | 'girl';

export interface CosmeticUnlock {
  type: 'default' | 'gacha' | 'level' | 'rank' | 'streak' | 'sessions';
  value?: number | Rank;
}

export interface Cosmetic {
  id: string;
  name: string;
  slot: Slot;
  rarity: Rarity;
  /** avatars compatibles (vide = les deux) */
  avatars: AvatarId[];
  unlock: CosmeticUnlock;
  /** Statut du visuel : aucun sprite de production n'existe aujourd'hui. */
  visual: 'missing' | 'reference_only' | 'approved';
}

export const SLOT_LABELS: Record<Slot, string> = {
  hair: 'Coiffure',
  top: 'Haut',
  bottom: 'Bas',
  accessory: 'Accessoire',
  guitar: 'Guitare',
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

/** Catalogue d'après la planche approuvée (« Personnalisation » et « Guitares »). */
export const COSMETICS: Cosmetic[] = [
  // Défauts (identités verrouillées)
  { id: 'hair_boy_brown', name: 'Brun ébouriffé', slot: 'hair', rarity: 'common', avatars: ['boy'], unlock: { type: 'default' }, visual: 'reference_only' },
  { id: 'hair_girl_coral', name: 'Queue corail', slot: 'hair', rarity: 'common', avatars: ['girl'], unlock: { type: 'default' }, visual: 'reference_only' },
  { id: 'top_academy', name: 'Veste de l’Académie', slot: 'top', rarity: 'common', avatars: [], unlock: { type: 'default' }, visual: 'reference_only' },
  { id: 'bottom_academy', name: 'Pantalon de l’Académie', slot: 'bottom', rarity: 'common', avatars: ['boy'], unlock: { type: 'default' }, visual: 'reference_only' },
  { id: 'bottom_pleated', name: 'Jupe plissée', slot: 'bottom', rarity: 'common', avatars: ['girl'], unlock: { type: 'default' }, visual: 'reference_only' },
  { id: 'guitar_acoustic', name: 'Acoustique de l’élève', slot: 'guitar', rarity: 'common', avatars: [], unlock: { type: 'default' }, visual: 'reference_only' },
  // Déblocages par progrès musical
  { id: 'acc_headphones', name: 'Casque de studio', slot: 'accessory', rarity: 'rare', avatars: [], unlock: { type: 'sessions', value: 5 }, visual: 'reference_only' },
  { id: 'acc_clef_pin', name: 'Barrette clé de sol', slot: 'accessory', rarity: 'epic', avatars: [], unlock: { type: 'streak', value: 7 }, visual: 'reference_only' },
  { id: 'top_stage_vest', name: 'Gilet de scène', slot: 'top', rarity: 'epic', avatars: [], unlock: { type: 'level', value: 10 }, visual: 'reference_only' },
  { id: 'guitar_crystal', name: 'Guitare de cristal', slot: 'guitar', rarity: 'legendary', avatars: [], unlock: { type: 'rank', value: 'D' }, visual: 'reference_only' },
  // Pool d'invocation (gacha cosmétique, monnaie gagnée uniquement)
  { id: 'hair_chestnut', name: 'Châtain doux', slot: 'hair', rarity: 'common', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'acc_cap', name: 'Casquette urbaine', slot: 'accessory', rarity: 'common', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'acc_round_glasses', name: 'Lunettes rondes', slot: 'accessory', rarity: 'common', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'bottom_cargo', name: 'Pantalon cargo', slot: 'bottom', rarity: 'common', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'top_red_hoodie', name: 'Veste à capuche rouge', slot: 'top', rarity: 'common', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'hair_silver', name: 'Mèches argentées', slot: 'hair', rarity: 'rare', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'hair_gold', name: 'Blond doré', slot: 'hair', rarity: 'rare', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'acc_aviator', name: 'Lunettes d’aviateur', slot: 'accessory', rarity: 'rare', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'guitar_red_electric', name: 'Électrique rouge', slot: 'guitar', rarity: 'rare', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'top_urban_purple', name: 'Blouson Scène Urbaine', slot: 'top', rarity: 'rare', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'hair_violet', name: 'Violet nuit', slot: 'hair', rarity: 'epic', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'guitar_epic_violet', name: 'Électrique améthyste', slot: 'guitar', rarity: 'epic', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'top_virtuoso', name: 'Manteau du Virtuose', slot: 'top', rarity: 'legendary', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
  { id: 'hair_lavender', name: 'Lavande virtuose', slot: 'hair', rarity: 'legendary', avatars: [], unlock: { type: 'gacha' }, visual: 'reference_only' },
];

export function cosmeticById(id: string): Cosmetic | undefined {
  return COSMETICS.find((c) => c.id === id);
}

export function fitsAvatar(c: Cosmetic, avatar: AvatarId): boolean {
  return c.avatars.length === 0 || c.avatars.includes(avatar);
}

export function defaultLoadout(avatar: AvatarId): Record<Slot, string | null> {
  return {
    hair: avatar === 'boy' ? 'hair_boy_brown' : 'hair_girl_coral',
    top: 'top_academy',
    bottom: avatar === 'boy' ? 'bottom_academy' : 'bottom_pleated',
    accessory: null,
    guitar: 'guitar_acoustic',
  };
}

export function unlockLabel(u: CosmeticUnlock): string {
  switch (u.type) {
    case 'default': return 'De base';
    case 'gacha': return 'Invocation';
    case 'level': return `Niveau ${u.value}`;
    case 'rank': return `Rang ${u.value}`;
    case 'streak': return `Série de ${u.value} jours`;
    case 'sessions': return `${u.value} séances`;
  }
}
