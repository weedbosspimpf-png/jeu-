import type { AmbitionKey, GameState } from "@/engine/types";
import { clamp } from "@/engine/utils";
import { CAREER_TRACKS } from "@/data/careers";
import { getCurrentRank } from "@/engine/careers";

/**
 * Cote presentation uniquement : deduit une ambition emergente et une
 * progression indicative a partir de l'etat de jeu. N'est jamais importe
 * par engine/ (qui reste pur), et ne pilote aucune regle de jeu : il ne
 * fait qu'expliquer au joueur ce que l'etat actuel suggere.
 */

export const AMBITION_LABELS: Record<AmbitionKey, string> = {
  richesse: "Richesse",
  influence: "Influence",
  prestige: "Prestige",
  reputation: "Reputation personnelle",
  politique: "Ambition politique",
  institutions: "Attachement aux institutions",
  justice: "Sens de la justice",
  securite: "Besoin de securite",
  independance: "Independance",
  reforme: "Volonte de reforme",
  protectionDesSiens: "Protection des siens",
  stabilite: "Stabilite personnelle",
};

const AMBITION_PHRASES: Record<AmbitionKey, string> = {
  richesse: "accumuler davantage de richesse",
  influence: "avoir plus d'influence",
  prestige: "gagner en prestige",
  reputation: "batir une reputation solide",
  politique: "entrer en politique",
  institutions: "servir les institutions",
  justice: "faire regner la justice",
  securite: "assurer la securite de ceux qui t'entourent",
  independance: "devenir pleinement independant",
  reforme: "reformer les choses en profondeur",
  protectionDesSiens: "proteger les tiens",
  stabilite: "construire une vie stable",
};

export function getDominantAmbition(state: GameState): AmbitionKey {
  const entries = Object.entries(state.ambitions) as [AmbitionKey, number][];
  return entries.reduce((best, current) => (current[1] > best[1] ? current : best))[0];
}

export function getTopAmbitions(state: GameState, count: number): { key: AmbitionKey; value: number }[] {
  return (Object.entries(state.ambitions) as [AmbitionKey, number][])
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

/**
 * Objectif principal actuellement affichable : soit explicitement
 * declare par le joueur (declareGoal), soit deduit de sa progression et
 * de son ambition dominante. N'impose jamais une trajectoire unique.
 */
export function describeCurrentAmbition(state: GameState): string {
  if (state.declaredGoal) return state.declaredGoal.label;

  const dominant = getDominantAmbition(state);
  const current = getCurrentRank(state, CAREER_TRACKS);

  if (!current) {
    return state.character.age <= 22
      ? "Je veux simplement trouver un travail."
      : `Je veux ${AMBITION_PHRASES[dominant]}.`;
  }

  const track = CAREER_TRACKS.find((t) => t.id === current.track.id);
  const idx = track?.ranks.findIndex((r) => r.id === current.rank.id) ?? -1;
  const next = track?.ranks[idx + 1];

  if (next) {
    return `Je veux devenir ${next.title.toLowerCase()}.`;
  }
  return `Je veux ${AMBITION_PHRASES[dominant]}.`;
}

/** Progression indicative (0-100) vers le sommet de la filiere actuelle. */
export function computeGoalProgress(state: GameState): number {
  const current = getCurrentRank(state, CAREER_TRACKS);
  if (!current) return 0;

  const track = CAREER_TRACKS.find((t) => t.id === current.track.id);
  if (!track) return 0;

  const idx = track.ranks.findIndex((r) => r.id === current.rank.id);
  const rankProgress = track.ranks.length > 1 ? (idx / (track.ranks.length - 1)) * 75 : 0;
  const performanceBonus = (state.career.performance / 100) * 25;

  return clamp(Math.round(rankProgress + performanceBonus), 0, 100);
}

/**
 * Suggestions indicatives de trajectoires ouvertes par l'etat actuel.
 * Ce ne sont pas les conditions exactes des evenements du moteur : juste
 * un apercu pour orienter le joueur.
 */
export function listAvailableTransitions(state: GameState): string[] {
  const track = state.career.currentTrack;
  const rank = state.career.currentRankId ?? "";
  const options: string[] = [];

  if (!track) {
    options.push("Choisir une premiere orientation");
    return options;
  }

  if (track !== "politics" && state.character.stats.influence >= 25) {
    options.push("Entrer en politique");
  }
  if (track === "crime" && state.character.money >= 3000) {
    options.push("Quitter le reseau pour devenir entrepreneur");
  }
  if (track === "crime" && state.character.stats.integrity >= 40) {
    options.push("Tenter un retour a la vie legale");
  }
  if ((track === "police" || track === "gendarmerie") && state.character.stats.wealth >= 40) {
    options.push("Se reconvertir dans l'entrepreneuriat");
  }
  if (track === "army" && ["commandant", "colonel", "general"].includes(rank)) {
    options.push("Quitter l'armee pour une autre trajectoire");
  }
  if (track === "army" && rank === "general" && state.character.stats.popularity >= 50) {
    options.push("Saisir une opportunite politique liee a ta popularite");
  }
  if (track === "civil") {
    options.push("Rejoindre l'armee", "Rejoindre la police", "Se lancer dans l'entrepreneuriat");
  }
  if (state.declaredGoal === null) {
    options.push("Te fixer un objectif de long terme");
  }

  if (options.length === 0) options.push("Poursuivre ta trajectoire actuelle");
  return options;
}
