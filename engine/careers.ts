import type { CareerTrack, GameState } from "./types";
import { applyEffects } from "./effects";

/**
 * Moteur de progression de carriere generique : il ne connait aucune
 * filiere en particulier, il lit juste la liste de CareerTrack fournie
 * par les donnees (data/careers/*).
 */
export function careerTick(state: GameState, tracks: CareerTrack[]): string | null {
  state.career.turnsInRank += 1;

  if (!state.career.currentTrack || !state.career.currentRankId) return null;

  const track = tracks.find((t) => t.id === state.career.currentTrack);
  if (!track) return null;

  const currentIndex = track.ranks.findIndex((r) => r.id === state.career.currentRankId);
  const nextRank = track.ranks[currentIndex + 1];
  if (!nextRank) return null;

  if (state.career.turnsInRank < nextRank.minTurnsInRank) return null;
  if (!nextRank.requirements(state)) return null;

  state.career.currentRankId = nextRank.id;
  state.career.turnsInRank = 0;
  state.career.history.push({
    trackId: track.id,
    rankId: nextRank.id,
    since: state.turn,
  });
  if (nextRank.onPromote) applyEffects(state, nextRank.onPromote);

  return `Promotion : ${nextRank.title} (${track.label})`;
}

export function getCurrentRank(state: GameState, tracks: CareerTrack[]) {
  const track = tracks.find((t) => t.id === state.career.currentTrack);
  if (!track) return null;
  const rank = track.ranks.find((r) => r.id === state.career.currentRankId);
  if (!rank) return null;
  return { track, rank };
}
