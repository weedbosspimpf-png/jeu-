import type { GameState, PowerAccessionMode, RegionId } from "./types";
import { clamp, randomInt } from "./utils";

/**
 * Calcule des scores abstraits pour les tentatives d'acceder au pouvoir.
 * Volontairement abstrait : aucune de ces fonctions ne modelise une
 * procedure reelle (electorale, insurrectionnelle ou autre). Ce ne sont
 * que des variables de jeu combinees, jamais un guide operationnel.
 */

const REGIONS: RegionId[] = ["nord", "centre", "sud", "capitale"];

export function averageRegionalPopularity(state: GameState): number {
  const values = REGIONS.map((r) => state.character.regionalPopularity[r]);
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function alliesCount(state: GameState): number {
  return Object.values(state.relationships).filter(
    (r) => r.status === "allie" || r.status === "partenaire"
  ).length;
}

/**
 * Score du joueur (0-100) pour une tentative d'acceder au pouvoir. Chaque
 * mode pondere differemment les memes signaux (popularite, influence,
 * contexte du pays, soutiens).
 */
export function computePowerBidScore(state: GameState, mode: PowerAccessionMode): number {
  const stats = state.character.stats;
  const v = state.world.values;
  const allies = Math.min(alliesCount(state), 6) * 3;
  const randomFactor = randomInt(-12, 12);
  const regionalPopularity = averageRegionalPopularity(state);

  if (mode === "election") {
    return clamp(
      regionalPopularity * 0.25 +
        stats.popularity * 0.15 +
        stats.influence * 0.2 +
        stats.reputation * 0.15 +
        v.economy * 0.1 +
        v.stability * 0.1 +
        allies +
        randomFactor,
      0,
      100
    );
  }

  if (mode === "crisis-transition") {
    return clamp(
      stats.authority * 0.3 +
        stats.influence * 0.25 +
        (100 - v.stability) * 0.15 -
        state.world.president.traits.institutionalRespect * 0.1 +
        allies +
        randomFactor,
      0,
      100
    );
  }

  // coup : deliberement tres difficile, et penalise par la legitimite
  // institutionnelle en place et la stabilite du pays.
  return clamp(
    stats.authority * 0.3 +
      stats.influence * 0.2 +
      v.militaryPower * 0.15 -
      v.stability * 0.15 -
      state.world.president.traits.institutionalRespect * 0.1 +
      allies +
      randomFactor -
      25,
    0,
    100
  );
}

/**
 * Une candidature presidentielle n'affronte jamais un simple seuil : elle
 * est comparee a des rivaux fictifs generes a la volee (jamais persistes
 * comme personnages complets, ce n'est qu'un calcul abstrait de contexte
 * electoral).
 */
function generateRivalScore(state: GameState): number {
  const base = randomInt(30, 70);
  const contextBoost = state.world.values.economy < 40 ? randomInt(0, 15) : 0;
  const incumbentPenalty = state.world.president.traits.popularity < 40 ? randomInt(0, 10) : 0;
  return clamp(base + contextBoost + incumbentPenalty + randomInt(-10, 10), 0, 100);
}

export interface PowerBidResult {
  won: boolean;
  playerScore: number;
}

export function resolvePowerBid(state: GameState, mode: PowerAccessionMode): PowerBidResult {
  const playerScore = computePowerBidScore(state, mode);

  if (mode === "election") {
    const rivalScores = [generateRivalScore(state), generateRivalScore(state)];
    const won = playerScore > Math.max(...rivalScores);
    return { won, playerScore };
  }

  const roll = randomInt(0, 99);
  return { won: roll < playerScore, playerScore };
}
