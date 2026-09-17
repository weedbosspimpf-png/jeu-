import type { Effect, GameState, PowerAccessionMode, RelationshipState } from "./types";
import { clamp, clampStat } from "./utils";
import { resolvePowerBid } from "./powerBids";

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
    case "relationshipInit": {
      if (!state.relationships[effect.npcId]) {
        state.relationships[effect.npcId] = {
          npcId: effect.npcId,
          name: effect.name,
          role: effect.role,
          trust: 40,
          loyalty: 40,
          influence: 15,
          status: "superieur",
          history: [],
        };
      }
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
    case "presidentTrait": {
      const traits = state.world.president.traits;
      traits[effect.trait] = clampStat(traits[effect.trait] + effect.delta);
      break;
    }
    case "regimeShift": {
      state.world.regime = effect.regime;
      break;
    }
    case "relationshipSyncPresident": {
      const existing = state.relationships["president"];
      if (!existing) {
        state.relationships["president"] = {
          npcId: "president",
          name: state.world.president.name,
          role: "President de la Republique",
          trust: 40,
          loyalty: 40,
          influence: 40,
          status: "superieur",
          history: [],
        };
      } else {
        existing.name = state.world.president.name;
      }
      break;
    }
    case "joinCareer": {
      const previousTrack = state.career.currentTrack;
      if (previousTrack && previousTrack !== effect.track && state.career.currentRankId) {
        const firstEntry = state.career.history.find((h) => h.trackId === previousTrack);
        state.careerLegacy[previousTrack] = {
          peakRankId: state.career.currentRankId,
          turnsServed: state.turn - (firstEntry?.since ?? state.turn),
          reputationAtExit: state.character.stats.reputation,
          influenceAtExit: state.character.stats.influence,
          exitTurn: state.turn,
        };
      }
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
    case "ambition": {
      state.ambitions[effect.key] = clampStat(state.ambitions[effect.key] + effect.delta);
      break;
    }
    case "declareGoal": {
      state.declaredGoal = {
        label: effect.label,
        trackId: state.career.currentTrack ?? "civil",
        declaredTurn: state.turn,
      };
      break;
    }
    case "regionalPopularity": {
      state.character.regionalPopularity[effect.region] = clampStat(
        state.character.regionalPopularity[effect.region] + effect.delta
      );
      break;
    }
    case "resolvePresidentialElection": {
      const { won } = resolvePowerBid(state, "election");
      state.flags["election-result-pending"] = true;
      state.flags["election-won"] = won;
      break;
    }
    case "resolveCrisisTransition": {
      const { won } = resolvePowerBid(state, "crisis-transition");
      state.flags["transition-result-pending"] = true;
      state.flags["transition-won"] = won;
      break;
    }
    case "resolveCoupAttempt": {
      const { won } = resolvePowerBid(state, "coup");
      state.flags["coup-result-pending"] = true;
      state.flags["coup-won"] = won;
      break;
    }
    case "becomePresident": {
      const stats = state.character.stats;
      const legitimacyByMode: Record<PowerAccessionMode, number> = {
        election: 75,
        "crisis-transition": 45,
        coup: 15,
      };
      const reputationDeltaByMode: Record<PowerAccessionMode, number> = {
        election: 20,
        "crisis-transition": 8,
        coup: -10,
      };
      const militarySupportByMode: Record<PowerAccessionMode, number> = {
        election: 45,
        "crisis-transition": 55,
        coup: 70,
      };
      state.world.president = {
        name: state.character.name,
        traits: {
          integrity: stats.integrity,
          authority: stats.authority,
          popularity: stats.popularity,
          ambition: stats.ambition,
          corruption: clampStat(stats.greed + stats.opportunism - stats.integrity / 2),
          institutionalRespect: stats.integrity,
          militarySupport: militarySupportByMode[effect.mode],
          legitimacy: legitimacyByMode[effect.mode],
        },
        sinceTurn: state.turn,
      };
      state.powerAccessionMode = effect.mode;
      state.flags["became-president"] = true;
      state.character.stats.reputation = clampStat(
        state.character.stats.reputation + reputationDeltaByMode[effect.mode]
      );
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
