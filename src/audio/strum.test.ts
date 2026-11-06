import { describe, expect, it } from 'vitest';
import { CHORDS, chordFreqs } from './strum';
import { PLAY_SPRITES, playReady } from '../avatar/manifest';

describe('accord du personnage', () => {
  it('doigtés justes (G majeur : sol, si, ré)', () => {
    const f = chordFreqs(CHORDS[0].frets);
    expect(f).toHaveLength(6);
    expect(f[0]).toBeCloseTo(98.0, 0);   // G2
    expect(f[1]).toBeCloseTo(123.47, 0); // B2
    expect(f[5]).toBeCloseTo(392.0, 0);  // G4
    expect(chordFreqs(CHORDS[3].frets)).toHaveLength(4); // D : 4 cordes
  });
  it('sans images « tient la guitare » approuvées, le master reste affiché', () => {
    expect(playReady('boy')).toBe(false);
    expect(playReady('girl')).toBe(false);
    expect(PLAY_SPRITES.girl.expected).toContain('girl_guitar_strum_06.png');
  });
});
