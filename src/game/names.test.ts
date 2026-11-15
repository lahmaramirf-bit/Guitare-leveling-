import { describe, expect, it } from 'vitest';
import { DEFAULT_NAMES, finishOnboarding, setSfx } from './actions';
import { emptySave } from './model';

describe('profil', () => {
  it('nom musical par défaut si le joueur n’en saisit pas', () => {
    expect(finishOnboarding(emptySave(), '', 'boy').profile.name).toBe(DEFAULT_NAMES.boy);
    expect(finishOnboarding(emptySave(), '   ', 'girl').profile.name).toBe('Mélodie');
    expect(finishOnboarding(emptySave(), 'Amir', 'girl').profile.name).toBe('Amir');
  });
  it('interrupteur des sons', () => {
    expect(setSfx(emptySave(), false).profile.sfx).toBe(false);
  });
});
