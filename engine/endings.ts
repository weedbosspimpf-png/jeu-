import type { Ending, GameState } from "./types";

/**
 * Moteur de fin de partie generique : il ne connait aucune fin en
 * particulier, il lit juste la liste d'Ending fournie par les donnees
 * (data/endings.ts). Ajouter une fin = ajouter une entree, jamais
 * modifier ce fichier.
 */
export function checkEnding(state: GameState, registry: Ending[]): Ending | null {
  const matching = registry.filter((ending) => ending.condition(state));
  if (matching.length === 0) return null;
  return matching.reduce((best, current) => (current.priority > best.priority ? current : best));
}
