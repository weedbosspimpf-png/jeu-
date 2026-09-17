import type { GameState, SocialActionScale } from "./types";
import { clamp, randomInt } from "./utils";

/**
 * Une action sociale (don, fondation, soutien...) n'est jamais un bouton
 * "+10 popularite" : son effet reel depend de la sincerite percue, elle
 * meme deduite de l'historique du personnage (integrite, empathie,
 * cupidite, opportunisme), pas seulement de la somme depensee. Une action
 * couteuse mais jugee interessee peut avoir peu d'effet, voire un effet
 * negatif.
 */

export interface SocialActionOutcome {
  reputationDelta: number;
  popularityDelta: number;
  publicTrustDelta: number;
  perceivedAsGenuine: boolean;
}

const BASE_EFFECT_BY_SCALE: Record<SocialActionScale, number> = {
  small: 3,
  medium: 6,
  large: 10,
};

export function computeSocialActionOutcome(state: GameState, scale: SocialActionScale): SocialActionOutcome {
  const stats = state.character.stats;
  const base = BASE_EFFECT_BY_SCALE[scale];

  const sincerityScore =
    stats.integrity * 0.4 + stats.empathy * 0.3 - stats.greed * 0.2 - stats.opportunism * 0.2;
  const perceptionRoll = clamp(sincerityScore + randomInt(-8, 8), -50, 50);

  let multiplier: number;
  if (perceptionRoll >= 20) multiplier = 1.5; // action jugee sincere et efficace
  else if (perceptionRoll >= 0) multiplier = 1;
  else if (perceptionRoll >= -20) multiplier = 0.4; // couteuse mais mal percue : peu d'effet
  else multiplier = -0.3; // jugee uniquement destinee a l'image : effet contraire

  return {
    reputationDelta: Math.round(base * multiplier),
    popularityDelta: Math.round(base * multiplier * 0.8),
    publicTrustDelta: Math.round(base * multiplier * 0.6),
    perceivedAsGenuine: multiplier >= 1,
  };
}
