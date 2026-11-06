import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ANIMATIONS, CHARACTERS, GUITARS, equipVisibility, renderLayers, resolveAnimation } from './manifest';
import { emptySave } from '../game/model';
import * as A from '../game/actions';
import { sanitize } from '../game/storage';
import { compute } from '../game/engine';

const kit = JSON.parse(readFileSync(new URL('../../handoff_art/manifest/asset_status.json', import.meta.url), 'utf8'));
const ver = JSON.parse(readFileSync(new URL('../../handoff_art/manifest/verification.json', import.meta.url), 'utf8'));

describe('assets des personnages (gate A)', () => {
  for (const id of ['boy', 'girl'] as const) {
    it(`${id} : fichier du kit inchangé, bbox conforme au manifeste`, () => {
      const buf = readFileSync(new URL(`../../public/characters/${id}_base.png`, import.meta.url));
      expect(createHash('sha256').update(buf).digest('hex')).toBe(ver.files[`${id}_base.png`].sha256);
      expect(buf.readUInt32BE(16)).toBe(1024);
      expect(buf.readUInt32BE(20)).toBe(1280);
      expect(CHARACTERS[id].bbox).toEqual(kit.characters[id].alphaBBoxMeaningful);
      expect(CHARACTERS[id].status).toBe(kit.characters[id].status);
    });
  }
});

describe('animations et équipements : rien d’inventé (gates F/G)', () => {
  it('le manifeste reflète le kit : guitares et rig manquants', () => {
    for (const g of Object.keys(GUITARS)) expect(GUITARS[g].status).toBe(kit.other[g]);
    for (const a of Object.values(ANIMATIONS)) expect(a.status).toBe('planned_missing');
  });
  it('sans rig : idle/célébration = placeholder, strum/marche = statique, tous bloqués', () => {
    expect(resolveAnimation('idle', false)).toEqual({ state: 'idle', mode: 'placeholder', blocked: 'blocked_by_missing_art' });
    expect(resolveAnimation('celebrate', false).mode).toBe('placeholder');
    expect(resolveAnimation('strum', false)).toEqual({ state: 'strum', mode: 'static', blocked: 'blocked_by_missing_art' });
    expect(resolveAnimation('walk', false).mode).toBe('static');
    expect(resolveAnimation('idle', true).mode).toBe('static'); // prefers-reduced-motion
  });
  it('une guitare équipée mais non livrée n’ajoute aucun calque', () => {
    expect(renderLayers('girl', 'guitar_crystal').map((l) => l.slot)).toEqual(['body']);
    expect(equipVisibility('guitar_crystal')).toBe('blocked_by_missing_art');
    expect(equipVisibility(null)).toBe('none');
  });
});

describe('choix du personnage une seule fois (gate C)', () => {
  it('nouvelle partie : choix requis, puis verrouillé', () => {
    let s = emptySave();
    expect(A.needsAvatarChoice(s)).toBe(true);
    s = A.finishOnboarding(s, 'Amir', 'girl');
    expect(s.profile).toMatchObject({ avatar: 'girl', avatarConfirmed: true, onboarded: true, name: 'Amir' });
    expect(A.needsAvatarChoice(s)).toBe(false);
    expect(() => A.confirmAvatar(s, 'boy')).toThrow();
  });
  it('compte v0.2 existant sans choix : demandé une fois, progression et nom conservés', () => {
    const v02 = { days: { '2026-11-01': { q: ['arp', 'gamme'] } }, items: { 'E-obj-0': '2026-11-01' }, weeks: {}, records: {}, meta: {}, rep: {}, repc: {}, profile: { name: 'Amir', avatar: 'boy', theme: 'ombre', onboarded: true, sfx: true }, shop: { spent: 0, owned: [], equipped: {}, inv: { c_scroll: 0, c_key: 0 } } };
    let s = sanitize(v02);
    const xp = compute(s).xp;
    expect(A.needsAvatarChoice(s)).toBe(true);
    s = A.finishOnboarding(s, '', 'girl');
    expect(s.profile).toMatchObject({ name: 'Amir', avatar: 'girl', avatarConfirmed: true, theme: 'ombre' });
    expect(compute(s).xp).toBe(xp);
  });
  it('sauvegarde relue : choix conservé ; valeur incohérente → nouveau choix demandé', () => {
    const s = A.finishOnboarding(emptySave(), 'X', 'boy');
    expect(sanitize(JSON.parse(JSON.stringify(s))).profile.avatarConfirmed).toBe(true);
    expect(sanitize({ ...s, profile: { ...s.profile, avatar: 'robot' } }).profile.avatarConfirmed).toBe(false);
  });
});
