/**
 * Catalogue de personnalisation — SANS hasard.
 * - « Boutique » : chaque objet a un prix en cristaux ET une condition de progression.
 *   Tant que la condition n'est pas remplie, l'objet est visible mais verrouillé.
 * - « Maîtrise » : gratuit, débloqué en maîtrisant des morceaux (genres / collections).
 * Les visuels n'existent pas encore (sprites en production) : seuls les titres s'affichent déjà.
 */
import masteryRaw from '../content/mastery-items.json';
import type { AvatarId, Slot } from './model';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'mastery';
export const RARITY_LABELS: Record<Rarity, string> = { common: 'Commun', rare: 'Rare', epic: 'Épique', legendary: 'Légendaire', mythic: 'Mythique', mastery: '★ Maîtrise' };
export const PRICE: Record<Exclude<Rarity, 'mastery'>, number> = { common: 40, rare: 120, epic: 300, legendary: 700, mythic: 1500 };

export const SLOT_LABELS: Record<Slot, string> = { hair: 'Coiffure', top: 'Haut', bottom: 'Bas', accessory: 'Accessoire', guitar: 'Guitare', aura: 'Aura', decor: 'Décor de profil', title: 'Titre' };

/** Grandeurs de progression utilisables comme conditions (toutes calculées par le moteur). */
export type ReqKey = 'level' | 'rank' | 'quests' | 'perfectDays' | 'daysPlayed' | 'hours' | 'bestStreak' | 'portals' | 'weeks' | 'records' | 'boss' | 'achievements' | 'mastered' | 'limitBreaks' | 'shadows';
export const REQ_LABEL: Record<ReqKey, (n: number) => string> = {
  level: (n) => `Atteindre le niveau ${n}`,
  rank: (n) => `Atteindre le rang ${['E', 'D', 'C', 'B', 'A', 'S', 'N'][n]}`,
  quests: (n) => `${n} quêtes quotidiennes accomplies`,
  perfectDays: (n) => `${n} journées parfaites (7/7)`,
  daysPlayed: (n) => `${n} jours de pratique`,
  hours: (n) => `${n} h de pratique`,
  bestStreak: (n) => `Série de ${n} jours`,
  portals: (n) => `${n} portails fermés`,
  weeks: (n) => `${n} défis hebdo relevés`,
  records: (n) => `${n} records battus`,
  boss: (n) => `${n} boss de donjon vaincu${n > 1 ? 's' : ''}`,
  achievements: (n) => `${n} succès débloqués`,
  mastered: (n) => `${n} morceaux maîtrisés`,
  limitBreaks: (n) => `${n} Limit Break`,
  shadows: (n) => `${n} ombres dans ton armée`,
};

export interface CatalogItem {
  id: string; slot: Slot; rarity: Rarity; name: string; desc: string;
  avatars?: AvatarId[]; default?: boolean;
  req?: [ReqKey, number]; price?: number;
  visual: 'missing' | 'reference_only' | 'approved';
}

const shop = (id: string, slot: Slot, rarity: Exclude<Rarity, 'mastery'>, name: string, desc: string, req: [ReqKey, number], extra: Partial<CatalogItem> = {}): CatalogItem =>
  ({ id, slot, rarity, name, desc, req, price: PRICE[rarity], visual: slot === 'title' ? 'approved' : 'reference_only', ...extra });

export const DEFAULTS: CatalogItem[] = [
  { id: 'hair_boy_brown', slot: 'hair', rarity: 'common', name: 'Brun ébouriffé', desc: 'La coiffure du Guitariste.', avatars: ['boy'], default: true, visual: 'reference_only' },
  { id: 'hair_girl_coral', slot: 'hair', rarity: 'common', name: 'Queue corail', desc: 'La coiffure de la Guitariste.', avatars: ['girl'], default: true, visual: 'reference_only' },
  { id: 'top_academy', slot: 'top', rarity: 'common', name: 'Veste de l’Académie', desc: 'Bleu nuit et crème, boutons dorés.', default: true, visual: 'reference_only' },
  { id: 'bottom_academy', slot: 'bottom', rarity: 'common', name: 'Pantalon de l’Académie', desc: 'Sobre et confortable.', avatars: ['boy'], default: true, visual: 'reference_only' },
  { id: 'bottom_pleated', slot: 'bottom', rarity: 'common', name: 'Jupe plissée', desc: 'L’uniforme de l’Académie.', avatars: ['girl'], default: true, visual: 'reference_only' },
  { id: 'guitar_study', slot: 'guitar', rarity: 'common', name: 'Guitare d’étude', desc: 'Celle avec qui tout recommence.', default: true, visual: 'reference_only' },
];

export const SHOP: CatalogItem[] = [
  // Guitares
  shop('guitar_cedar', 'guitar', 'rare', 'Classique en cèdre', 'Un son chaud et rond, parfait pour les arpèges.', ['level', 5]),
  shop('guitar_red_electric', 'guitar', 'rare', 'Électrique rouge', 'Pour les jours où l’on a envie de faire du bruit.', ['quests', 40]),
  shop('guitar_maple', 'guitar', 'epic', 'Érable flammé', 'Le bois ondule comme une flamme sous la lumière.', ['rank', 1]),
  shop('guitar_amethyst', 'guitar', 'epic', 'Électrique améthyste', 'Motifs dorés sur fond violet.', ['boss', 1]),
  shop('guitar_crystal', 'guitar', 'legendary', 'Guitare de cristal', 'Taillée dans un cristal de mana pur.', ['rank', 2]),
  shop('guitar_virtuoso', 'guitar', 'mythic', 'Guitare du Virtuose', 'Réservée à ceux qui ont vaincu la Forteresse des Ligados.', ['rank', 4]),
  // Hauts
  shop('top_red_hoodie', 'top', 'common', 'Veste à capuche rouge', 'Pour les longues séances du soir.', ['daysPlayed', 7]),
  shop('top_stage_vest', 'top', 'rare', 'Gilet de scène', 'Premier pas vers la lumière des projecteurs.', ['portals', 5]),
  shop('top_urban_purple', 'top', 'rare', 'Blouson Scène Urbaine', 'Moderne, street, rythmé.', ['bestStreak', 7]),
  shop('top_concert', 'top', 'epic', 'Tenue de concert', 'Noir et blanc, prête pour la grande salle.', ['mastered', 5]),
  shop('top_virtuoso', 'top', 'legendary', 'Manteau du Virtuose', 'Prestige, concert, maîtrise.', ['rank', 3]),
  // Bas
  shop('bottom_cargo', 'bottom', 'common', 'Pantalon cargo', 'Des poches pour les médiators… et les ongles de rechange.', ['weeks', 3]),
  shop('bottom_urban', 'bottom', 'rare', 'Short Scène Urbaine', 'Assorti au blouson.', ['bestStreak', 14]),
  // Coiffures
  shop('hair_chestnut', 'hair', 'common', 'Châtain doux', 'Un changement tout en douceur.', ['level', 3]),
  shop('hair_gold', 'hair', 'rare', 'Blond doré', 'Brillant comme une corde neuve.', ['perfectDays', 10]),
  shop('hair_violet', 'hair', 'epic', 'Violet nuit', 'La couleur des scènes sombres.', ['limitBreaks', 10]),
  shop('hair_lavender', 'hair', 'legendary', 'Lavande virtuose', 'La couleur de la tenue Virtuose.', ['rank', 4]),
  // Accessoires
  shop('acc_cap', 'accessory', 'common', 'Casquette urbaine', 'Visière en arrière, évidemment.', ['level', 8]),
  shop('acc_round_glasses', 'accessory', 'common', 'Lunettes rondes', 'Pour lire les petites notes.', ['records', 3]),
  shop('acc_headphones', 'accessory', 'rare', 'Casque de studio', 'Pour s’écouter vraiment.', ['hours', 10]),
  shop('acc_aviator', 'accessory', 'rare', 'Lunettes d’aviateur', 'Prêt à décoller.', ['achievements', 15]),
  shop('acc_clef_pin', 'accessory', 'epic', 'Barrette clé de sol', 'Le signe de ceux qui ne lâchent rien.', ['bestStreak', 30]),
  // Titres (texte : utilisables tout de suite)
  shop('t1', 'title', 'common', 'Gratteur du dimanche', 'Un titre à porter fièrement.', ['daysPlayed', 3]),
  shop('t2', 'title', 'common', 'Ami des cordes à vide', 'Pas de doigts, pas de problème.', ['level', 2]),
  shop('t3', 'title', 'common', 'Accordeur compulsif', 'Encore un petit quart de tour…', ['quests', 15]),
  shop('t4', 'title', 'common', 'Collectionneur de cordes', 'Il en reste toujours un jeu dans le tiroir.', ['daysPlayed', 10]),
  shop('t5', 'title', 'rare', 'Main gauche d’acier', 'Les barrés ne te font plus peur.', ['records', 5]),
  shop('t6', 'title', 'rare', 'Pouce métronome', 'Régulier comme une horloge.', ['perfectDays', 5]),
  shop('t7', 'title', 'rare', 'Ennemi des frisures', 'Pas une corde qui grésille.', ['perfectDays', 20]),
  shop('t8', 'title', 'rare', 'Liseur de tablatures', 'Six lignes, aucun secret.', ['mastered', 3]),
  shop('t9', 'title', 'epic', 'Maître du barré', 'Case I, 30 secondes, propre.', ['rank', 3]),
  shop('t10', 'title', 'epic', 'Arpège ambulant', 'p-i-m-a, même en dormant.', ['hours', 50]),
  shop('t11', 'title', 'epic', 'Trémolo vivant', 'Une note devient une rivière.', ['rank', 4]),
  shop('t12', 'title', 'legendary', 'Héritier de Tárrega', 'Lágrima n’a plus de secret.', ['boss', 2]),
  shop('t13', 'title', 'legendary', 'Disciple de Sor', 'Deux voix, une seule guitare.', ['mastered', 15]),
  shop('t14', 'title', 'legendary', 'Voix de l’Alhambra', 'Le tremolo du début à la fin.', ['rank', 5]),
  shop('t15', 'title', 'mythic', 'Souverain des six cordes', 'Niveau 100. Rien de moins.', ['level', 100]),
];

const SLOT_MAP: Record<string, Slot> = { hair: 'hair', outfit: 'top', acc: 'accessory', bg: 'decor', aura: 'aura', title: 'title' };
export const MASTERY: CatalogItem[] = (masteryRaw as { id: string; t: string; n: string; d: string }[]).map((m) => ({
  id: m.id, slot: SLOT_MAP[m.t] ?? 'accessory', rarity: 'mastery', name: m.n, desc: m.d,
  visual: SLOT_MAP[m.t] === 'title' ? 'approved' : 'missing',
}));

/** Objets consommables (prix fixes, utiles et non aléatoires). */
export const CONSUMABLES = [
  { id: 'c_scroll' as const, name: 'Parchemin de série', desc: 'Sauve ta série si tu as manqué hier (la veille doit être validée).', price: 60 },
  { id: 'c_key' as const, name: 'Clé de portail', desc: 'Fait apparaître un autre portail du jour.', price: 25 },
];

export const CATALOG: CatalogItem[] = [...DEFAULTS, ...SHOP, ...MASTERY];
export const ITEM: Record<string, CatalogItem> = Object.fromEntries(CATALOG.map((i) => [i.id, i]));

export function fitsAvatar(i: CatalogItem, a: AvatarId): boolean {
  return !i.avatars || i.avatars.includes(a);
}
export function defaultLoadout(a: AvatarId): Partial<Record<Slot, string | null>> {
  return { hair: a === 'boy' ? 'hair_boy_brown' : 'hair_girl_coral', top: 'top_academy', bottom: a === 'boy' ? 'bottom_academy' : 'bottom_pleated', guitar: 'guitar_study', accessory: null, aura: null, decor: null, title: null };
}
