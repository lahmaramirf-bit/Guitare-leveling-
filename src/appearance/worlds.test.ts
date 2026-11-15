import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { WORLDS } from './worlds';

describe('décor de l’accueil : un seul par thème', () => {
  it('Sakura : fichier local présent, jamais d’URL externe ; aucune version approuvée sans le fondateur', () => {
    const p = WORLDS.sakura.panel;
    expect(p.file).toBe('./art/panel/panel_bg_sakura.png');
    expect(existsSync('public/' + p.file!.slice(2))).toBe(true);
    expect(p.status).toBe('candidate');
  });
  it('Cyberpunk et Ombre : décor attendu, provisoire en attendant', () => {
    for (const t of ['cyberpunk', 'ombre'] as const) {
      expect(WORLDS[t].panel.status).toBe('planned_missing');
      expect(WORLDS[t].panel.file).toBeNull();
      expect(WORLDS[t].provisional.startsWith('./concept/')).toBe(true);
    }
  });
});
