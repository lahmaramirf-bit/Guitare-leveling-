/**
 * Manifeste des assets d'avatar — reflet EXACT de handoff_art/manifest/asset_status.json (v0.3).
 * Règle : un élément n'est rendu que si son statut le permet. Rien n'est inventé.
 */
import type { AvatarId } from '../game/model';

export type AssetStatus = 'ready_static' | 'approved' | 'reference_only' | 'planned_missing';

/** Canevas commun de tous les calques (contrat du kit). */
export const CANVAS = { width: 1024, height: 1280, centerX: 512, groundY: 1170 } as const;

export interface CharacterAsset {
  status: AssetStatus;
  file: string;
  /** version réduite (simple réduction, jamais un agrandissement) */
  file512: string;
  /** boîte englobante utile [x0, y0, x1, y1] sur le canevas */
  bbox: [number, number, number, number];
  animated: false;
  layered: false;
}

export const CHARACTERS: Record<AvatarId, CharacterAsset> = {
  boy: { status: 'ready_static', file: './characters/boy_base.png', file512: './characters/boy_base_512.png', bbox: [304, 90, 719, 1170], animated: false, layered: false },
  girl: { status: 'ready_static', file: './characters/girl_base.png', file512: './characters/girl_base_512.png', bbox: [250, 90, 774, 1170], animated: false, layered: false },
};

/**
 * Ordre des calques autour du corps (doc 04). Seul `body` existe aujourd'hui (PNG aplati).
 * Les autres emplacements sont prêts à recevoir des PNG 1024×1280 sur le même canevas.
 */
export const LAYER_ORDER = ['guitar_strap_back', 'guitar_back', 'body', 'guitar_body_front', 'left_hand_over_neck', 'right_hand_over_strings'] as const;
export type LayerSlot = (typeof LAYER_ORDER)[number];

/** Points d'ancrage à fournir par la source du rig (jamais déduits du PNG aplati). */
export const ANCHORS = ['shoulder_strap', 'left_hand_neck', 'right_hand_strum', 'body_center', 'guitar_neck_angle'] as const;
export type Anchor = (typeof ANCHORS)[number];
export const ANCHOR_VALUES: Record<AvatarId, Partial<Record<Anchor, [number, number] | number>>> = { boy: {}, girl: {} };

/** Guitares : contrat de production (noms = ids de la boutique). Aucune n'est livrée. */
export interface EquipAsset { status: AssetStatus; layers: Partial<Record<LayerSlot, string>>; icon?: string }
export const GUITARS: Record<string, EquipAsset> = {
  guitar_study: { status: 'planned_missing', layers: {} },
  guitar_red_electric: { status: 'planned_missing', layers: {} },
  guitar_amethyst: { status: 'planned_missing', layers: {} },
  guitar_crystal: { status: 'planned_missing', layers: {} },
};
/** Vêtements / coiffures / accessoires : nécessitent une source multicouche (doc 04). */
export const CLOTHING_STATUS: AssetStatus = 'planned_missing';

export type AnimState = 'idle' | 'celebrate' | 'strum' | 'walk' | 'greet';
export interface AnimDef { status: AssetStatus; needs: string[] }
/** États d'animation prévus et ce qui manque pour les réaliser vraiment (doc 02). */
export const ANIMATIONS: Record<AnimState, AnimDef> = {
  idle: { status: 'planned_missing', needs: ['boy_rig_source.psd', 'girl_rig_source.psd', 'calques PNG + pivots', 'boy_idle / girl_idle validés'] },
  greet: { status: 'planned_missing', needs: ['rig multicouche', 'variantes de visage et de bras'] },
  celebrate: { status: 'planned_missing', needs: ['rig multicouche', 'animation célébration 0,8–1,5 s validée'] },
  strum: { status: 'planned_missing', needs: ['rig multicouche', 'guitare équipée', 'poses main droite / main gauche'] },
  walk: { status: 'planned_missing', needs: ['vues 3/4, côté, dos', 'cycle de marche validé'] },
};

export interface ResolvedAnim {
  state: AnimState;
  /** 'rig' = vraie animation ; 'placeholder' = léger effet d'interface sur le PNG entier ; 'static' = image fixe */
  mode: 'rig' | 'placeholder' | 'static';
  blocked: null | 'blocked_by_missing_art';
}

/**
 * Résout l'état demandé. Sans rig, seul un « placeholder d'animation » est autorisé
 * (translation de 2–4 px du personnage entier), et uniquement pour idle et célébration.
 */
export function resolveAnimation(state: AnimState, reducedMotion: boolean): ResolvedAnim {
  const def = ANIMATIONS[state];
  if (def.status === 'approved') return { state, mode: reducedMotion ? 'static' : 'rig', blocked: null };
  const placeholderAllowed = state === 'idle' || state === 'celebrate';
  return { state, mode: placeholderAllowed && !reducedMotion ? 'placeholder' : 'static', blocked: 'blocked_by_missing_art' };
}

/** Calques effectivement rendus pour un avatar et une guitare équipée. */
export function renderLayers(avatar: AvatarId, guitarId: string | null): { slot: LayerSlot; src: string }[] {
  const out: { slot: LayerSlot; src: string }[] = [];
  const g = guitarId ? GUITARS[guitarId] : undefined;
  for (const slot of LAYER_ORDER) {
    if (slot === 'body') { out.push({ slot, src: CHARACTERS[avatar].file }); continue; }
    const src = g && g.status === 'approved' ? g.layers[slot] : undefined;
    if (src) out.push({ slot, src });
  }
  return out;
}

/** Ce qui manque pour qu'un objet équipé soit réellement visible. */
export function equipVisibility(itemId: string | null): 'visible' | 'blocked_by_missing_art' | 'none' {
  if (!itemId) return 'none';
  const g = GUITARS[itemId];
  if (g) return g.status === 'approved' ? 'visible' : 'blocked_by_missing_art';
  return 'blocked_by_missing_art';
}
