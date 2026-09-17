import type { GameState, PersonalityTrait } from "./types";

/**
 * Moteur de particularites de personnalite generique : il ne connait
 * aucune particularite en particulier, il lit juste le registre fourni
 * par les donnees (data/personalityTraits.ts). Meme pattern que
 * checkEnding/careerTick : une fois debloquee, une particularite reste
 * acquise (elle est ajoutee a GameState.unlockedTraits).
 */
export function checkNewTraits(state: GameState, registry: PersonalityTrait[]): PersonalityTrait[] {
  const newlyUnlocked: PersonalityTrait[] = [];
  for (const trait of registry) {
    if (state.unlockedTraits.includes(trait.id)) continue;
    if (trait.condition(state)) {
      state.unlockedTraits.push(trait.id);
      newlyUnlocked.push(trait);
    }
  }
  return newlyUnlocked;
}
