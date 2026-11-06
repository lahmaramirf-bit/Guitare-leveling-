import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { WORLDS, activePanel } from './worlds';

describe('décor du panneau (variantes)', () => {
  it('V1 reste le décor par défaut ; V2 seulement sur ?panel=v2', () => {
    expect(activePanel(WORLDS.sakura.panel, '').file).toBe('./art/panel/panel_bg_sakura.png');
    expect(activePanel(WORLDS.sakura.panel, '?panel=v2').file).toBe('./art/panel/panel_bg_sakura_v2.png');
    expect(activePanel(WORLDS.sakura.panel, '?panel=zz').variant).toBe('v1');
  });
  it('aucune version n’est approuvée sans validation du fondateur', () => {
    expect(WORLDS.sakura.panel.status).toBe('candidate');
    expect(WORLDS.sakura.panel.variants?.v2.status).toBe('candidate');
  });
  it('les fichiers référencés existent en local (pas d’URL externe)', () => {
    for (const f of [WORLDS.sakura.panel.file!, WORLDS.sakura.panel.variants!.v2.file]) {
      expect(f.startsWith('./art/panel/')).toBe(true);
      expect(existsSync('public/' + f.slice(2))).toBe(true);
    }
  });
});
