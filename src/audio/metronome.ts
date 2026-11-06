/**
 * Métronome Web Audio (planification anticipée pour un tempo stable).
 * Il ne fait QUE produire un clic : aucune écoute ni analyse du jeu.
 */
export class Metronome {
  private ctx: AudioContext | null = null;
  private timer: number | null = null;
  private nextTime = 0;
  private beat = 0;
  bpm = 60;
  beatsPerBar = 4;
  onBeat: ((beat: number) => void) | null = null;

  get running(): boolean {
    return this.timer !== null;
  }

  start(): boolean {
    if (this.running) return true;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return false;
    this.ctx ??= new Ctor();
    void this.ctx.resume();
    this.beat = 0;
    this.nextTime = this.ctx.currentTime + 0.06;
    this.timer = window.setInterval(() => this.schedule(), 25);
    return true;
  }

  stop(): void {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
  }

  dispose(): void {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
  }

  private schedule(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextTime < ctx.currentTime + 0.12) {
      const accent = this.beat % this.beatsPerBar === 0;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = accent ? 1500 : 1000;
      gain.gain.setValueAtTime(0.0001, this.nextTime);
      gain.gain.exponentialRampToValueAtTime(accent ? 0.6 : 0.35, this.nextTime + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.nextTime + 0.05);
      osc.connect(gain).connect(ctx.destination);
      osc.start(this.nextTime);
      osc.stop(this.nextTime + 0.06);
      const b = this.beat;
      const delay = Math.max(0, (this.nextTime - ctx.currentTime) * 1000);
      window.setTimeout(() => this.onBeat?.(b % this.beatsPerBar), delay);
      this.nextTime += 60 / this.bpm;
      this.beat++;
    }
  }
}
