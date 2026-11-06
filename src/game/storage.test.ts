import { describe, expect, it } from 'vitest';
import { load, save, sanitize, exportJson, importJson, STORAGE_KEY, type KV } from './storage';
import { newGame, logSession } from './state';

function memKV(): KV & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
}

describe('sauvegarde', () => {
  it('aller-retour sans perte', () => {
    const kv = memKV();
    const s = logSession(newGame(), { exerciseId: 'open_chords', songId: null, minutes: 10, bpm: 60, quality: 2, notes: 'ok' }, new Date(), '2026-11-06', 'a').state;
    save(kv, s);
    expect(load(kv)).toEqual(s);
  });
  it('sauvegarde corrompue → nouvelle partie + copie conservée', () => {
    const kv = memKV();
    kv.setItem(STORAGE_KEY, '{pas du json');
    expect(load(kv).xp).toBe(0);
    expect([...kv.data.keys()].some((k) => k.includes('corrupt'))).toBe(true);
  });
  it('champs invalides réparés champ par champ', () => {
    const s = sanitize({ schemaVersion: 1, xp: -5, crystals: 'x', appearance: { avatarId: 'girl', themeId: 'moe_moe', loadout: { guitar: 'guitar_crystal' } }, inventory: ['inconnu'] });
    expect(s.xp).toBe(0);
    expect(s.crystals).toBe(0);
    expect(s.appearance.avatarId).toBe('girl');
    expect(s.appearance.themeId).toBe('sakura');
    expect(s.appearance.loadout.guitar).toBe('guitar_acoustic'); // non possédée → défaut
    expect(s.inventory).not.toContain('inconnu');
  });
  it('export / import JSON', () => {
    const kv = memKV();
    const s = { ...newGame(), xp: 1234 };
    const back = importJson(kv, exportJson(s), newGame());
    expect(back.xp).toBe(1234);
    expect(() => importJson(kv, '{"foo":1}', s)).toThrow();
  });
});
