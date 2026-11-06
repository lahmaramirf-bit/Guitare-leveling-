import type { AvatarId, Slot } from './cosmetics';

export type ThemeId = 'sakura' | 'cyberpunk' | 'ombre';
export type Quality = 1 | 2 | 3;

export interface Session {
  id: string;
  day: string; // AAAA-MM-JJ
  at: string; // ISO
  exerciseId: string;
  songId: string | null;
  minutes: number;
  bpm: number | null;
  quality: Quality;
  notes: string;
  xp: number;
}

export type SongStatus = 'a_apprendre' | 'en_cours' | 'maitrise';

export interface Song {
  id: string;
  title: string;
  artist: string;
  status: SongStatus;
  targetBpm: number | null;
}

export interface Appearance {
  avatarId: AvatarId;
  themeId: ThemeId;
  loadout: Record<Slot, string | null>;
}

export interface GameState {
  schemaVersion: 1;
  createdAt: string;
  profile: { name: string };
  appearance: Appearance;
  xp: number;
  crystals: number;
  shards: number;
  sessions: Session[];
  songs: Song[];
  inventory: string[];
  /** tirages depuis le dernier légendaire */
  pity: number;
  chestLastDay: string | null;
  /** quêtes quotidiennes réclamées : clé `${day}:${questId}` */
  claimedDaily: string[];
  /** quêtes principales réclamées */
  claimedMain: string[];
  onboarded: boolean;
}
