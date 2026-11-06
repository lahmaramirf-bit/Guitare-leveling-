/** Jour de jeu local AAAA-MM-JJ (identique au projet de base). */
const pad = (n: number) => String(n).padStart(2, '0');
export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function dayStart(k: string): number {
  return new Date(k + 'T12:00:00').getTime();
}
export function addDays(k: string, delta: number): string {
  const d = new Date(k + 'T12:00:00');
  d.setDate(d.getDate() + delta);
  return dayKey(d);
}
/** Lundi de la semaine contenant `k`. */
export function mondayOf(k: string): string {
  const d = new Date(k + 'T12:00:00');
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return dayKey(d);
}
export function daysBetween(a: string, b: string): number {
  return Math.round((dayStart(b) - dayStart(a)) / 86400000);
}
