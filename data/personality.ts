import type { GameState } from "@/engine/types";

/**
 * Profil emergent, jamais stocke : recalcule a chaque affichage a partir
 * des stats actuelles. Ce n'est pas une classe figee - il peut changer
 * si le personnage change durablement de comportement.
 */
function computeArchetypeScores(state: GameState): [string, number][] {
  const s = state.character.stats;
  return [
    ["Stratege", s.prudence + s.intelligence + s.coolness],
    ["Leader", s.leadership + s.charisma + s.authority],
    ["Diplomate", s.diplomacy + s.perspicacity + s.empathy],
    ["Opportuniste", s.opportunism + s.ruse + s.greed],
    ["Negociateur", s.diplomacy + s.ruse + s.manipulation],
    ["Homme ou femme d'influence", s.influence + s.reputation + s.manipulation],
    ["Idealiste", s.integrity + s.loyalty + s.empathy],
    ["Pragmatique", s.opportunism + s.prudence + s.intelligence],
  ];
}

export function describeArchetype(state: GameState): string {
  const scores = computeArchetypeScores(state);
  const best = scores.reduce((top, current) => (current[1] > top[1] ? current : top));
  return best[0];
}
