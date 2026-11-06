/**
 * Accord de guitare synthétisé (Karplus-Strong : corde pincée), aucun fichier audio.
 * Sert au retour sonore quand on touche le personnage. Ce n'est pas un outil d'écoute.
 */
const E2 = 82.41;
const semi = (base: number, n: number) => base * 2 ** (n / 12);
/** Cordes à vide E A D G B E, en demi-tons au-dessus de E2 */
const OPEN = [0, 5, 10, 15, 19, 24];
/** Doigtés (case par corde, -1 = corde non jouée) : progression G – Em – C – D */
export const CHORDS: { name: string; frets: number[] }[] = [
  { name: 'G', frets: [3, 2, 0, 0, 0, 3] },
  { name: 'Em', frets: [0, 2, 2, 0, 0, 0] },
  { name: 'C', frets: [-1, 3, 2, 0, 1, 0] },
  { name: 'D', frets: [-1, -1, 0, 2, 3, 2] },
];
export const chordFreqs = (frets: number[]) => frets.flatMap((f, i) => (f < 0 ? [] : [semi(E2, OPEN[i] + f)]));

let ctx: AudioContext | null = null;
const cache = new Map<string, AudioBuffer>();

function pluck(ac: AudioContext, freq: number): AudioBuffer {
  const key = `${ac.sampleRate}:${freq.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const sr = ac.sampleRate, len = Math.floor(sr * 2.2), period = Math.max(2, Math.round(sr / freq));
  const buf = ac.createBuffer(1, len, sr);
  const out = buf.getChannelData(0);
  const ring = new Float32Array(period);
  let seed = Math.round(freq * 1000) | 1; // bruit déterministe (pas de Math.random : rendu reproductible)
  for (let i = 0; i < period; i++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; ring[i] = (seed / 0x7fffffff) * 2 - 1; }
  let p = 0;
  for (let i = 0; i < len; i++) {
    const nx = (p + 1) % period;
    const v = 0.996 * 0.5 * (ring[p] + ring[nx]);
    out[i] = ring[p];
    ring[p] = v;
    p = nx;
  }
  cache.set(key, buf);
  return buf;
}

/** Joue un accord gratté vers le bas (cordes décalées de ~18 ms). Retourne false si l'audio est indisponible. */
export function strum(chordIndex: number, volume = 0.5): boolean {
  try {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return false;
    ctx ??= new C();
    void ctx.resume();
    const chord = CHORDS[((chordIndex % CHORDS.length) + CHORDS.length) % CHORDS.length];
    const t0 = ctx.currentTime + 0.01;
    const master = ctx.createGain();
    master.gain.value = volume;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass'; tone.frequency.value = 3200;
    master.connect(tone).connect(ctx.destination);
    chordFreqs(chord.frets).forEach((f, i) => {
      const src = ctx!.createBufferSource();
      src.buffer = pluck(ctx!, f);
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0.32, t0 + i * 0.018);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.018 + 2.0);
      src.connect(g).connect(master);
      src.start(t0 + i * 0.018);
      src.stop(t0 + i * 0.018 + 2.1);
    });
    return true;
  } catch { return false; }
}
