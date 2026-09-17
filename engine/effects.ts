import type { Effect, GameState, RelationshipState } from "./types";
import { clamp, clampStat } from "./utils";

function ensureRelationship(state: GameState, npcId: string): RelationshipState {
  const existing = state.relationships[npcId];
  if (existing) return existing;
  const fallback: RelationshipState = {
    npcId,
    name: npcId,
    role: "inconnu",
    trust: 50,
    loyalty: 50,
    influence: 10,
    status: "neutral",
    history: [],
  };
  state.relationships[npcId] = fallback;
  return fallback;
}

/**
 * Applique un effet declaratif a l'etat en mutant une copie deja clonee.
 * Cette fonction n'est jamais appelee sur l'etat original : voir simulation.ts.
 */
export function applyEffect(state: GameState, effect: Effect): void {
  switch (effect.type) {
    case "stat": {
      state.character.stats[effect.stat] = clampStat(
        state.character.stats[effect.stat] + effect.delta
      );
      break;
    }
    case "money": {
      state.character.money = Math.round(state.character.money + effect.delta);
      break;
    }
    case "relationship": {
      const rel = ensureRelationship(state, effect.npcId);
      if (effect.trust !== undefined) rel.trust = clampStat(rel.trust + effect.trust);
      if (effect.loyalty !== undefined) rel.loyalty = clampStat(rel.loyalty + effect.loyalty);
      if (effect.influence !== undefined) rel.influence = clampStat(rel.influence + effect.influence);
      break;
    }
    case "relationshipStatus": {
      const rel = ensureRelationship(state, effect.npcId);
      rel.status = effect.status;
      break;
    }
    case "world": {
      state.world.values[effect.key] = clamp(
        state.world.values[effect.key] + effect.delta,
        0,
        100
      );
      break;
    }
    case "flag": {
      state.flags[effect.flag] = effect.value;
      break;
    }
    case "careerPerformance": {
      state.career.performance = clamp(state.career.performance + effect.delta, 0, 100);
      break;
    }
    case "joinCareer": {
      state.career.currentTrack = effect.track;
      state.career.currentRankId = effect.rankId;
      state.career.turnsInRank = 0;
      state.career.performance = 50;
      state.career.history.push({
        trackId: effect.track,
        rankId: effect.rankId,
        since: state.turn,
      });
      break;
    }
    default: {
      const exhaustive: never = effect;
      throw new Error(`Effet inconnu: ${JSON.stringify(exhaustive)}`);
    }
  }
}

export function applyEffects(state: GameState, effects: Effect[]): void {
  for (const effect of effects) applyEffect(state, effect);
}
