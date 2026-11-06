import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { WORLDS, activePanel, panelFromUrl } from './worlds';

describe('décor du panneau (variantes)', () => {
  it('V1 reste le décor par défaut ; V2 seulement sur ?panel=v2', () => {
    expect(activePanel(WORLDS.sakura.panel, '').file).toBe('./art/panel/panel_bg_sakura.png');
    expect(activePanel(WORLDS.sakura.panel, '?panel=v2').file).toBe('./art/panel/panel_bg_sakura_v2.png');
    expect(activePanel(WORLDS.sakura.panel, '?panel=zz').variant).toBe('v1');
    expect(activePanel(WORLDS.sakura.panel, 'v2').variant).toBe('v2');
    expect(panelFromUrl('http://localhost:5173/#/hub?panel=v2')).toBe('v2');
    expect(panelFromUrl('http://localhost:5173/?panel=v2#/hub')).toBe('v2');
    expect(panelFromUrl('http://localhost:5173/#/hub')).toBe(null);
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
