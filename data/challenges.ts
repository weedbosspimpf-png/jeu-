import type { GameState } from "@/engine/types";
import { computeCareerRiskGauges } from "@/data/careerRisk";

/**
 * "Defis actuels" affiches a l'ecran principal : derives entierement de
 * l'etat existant (jauges de risque, hierarchie, contexte du pays),
 * jamais un nouveau systeme de simulation. Purement presentation.
 */
export interface ChallengeItem {
  label: string;
  tone: "warning" | "positive";
}

export function computeCurrentChallenges(state: GameState): ChallengeItem[] {
  const items: ChallengeItem[] = [];
  const track = state.career.currentTrack;

  for (const risk of computeCareerRiskGauges(state)) {
    if (risk.level === "eleve" || risk.level === "critique") {
      items.push({ label: `${risk.label} eleve`, tone: "warning" });
    }
  }

  if (track === "army" || track === "police" || track === "gendarmerie") {
    if (state.career.subordinateMorale < 35) items.push({ label: "Discipline/moral de l'unite en baisse", tone: "warning" });
    if (state.career.superiorTrust < 35) items.push({ label: "Votre superieur doute de votre leadership", tone: "warning" });
  }

  if (track === "entrepreneur") {
    if (state.character.money < 500) items.push({ label: "Tresorerie faible", tone: "warning" });
  }

  if (track === "politics" || state.career.currentRankId === "president") {
    const regionalValues = Object.values(state.character.regionalPopularity);
    if (regionalValues.some((v) => v < 35)) items.push({ label: "Popularite en baisse dans une region", tone: "warning" });
  }

  if (state.career.currentRankId === "president") {
    if (state.world.values.economy < 40) items.push({ label: "Inflation / difficultes economiques", tone: "warning" });
    if (state.world.values.socialTension > 60) items.push({ label: "Opposition et tension sociale en progression", tone: "warning" });
    if (state.world.president.traits.legitimacy < 40) items.push({ label: "Legitimite fragile", tone: "warning" });
  }

  if (state.career.performance >= 70) items.push({ label: "Excellente performance recente", tone: "positive" });
  if (state.character.stats.reputation >= 65) items.push({ label: "Reputation solide", tone: "positive" });

  if (items.length === 0) {
    items.push({ label: "Situation stable pour l'instant", tone: "positive" });
  }

  return items;
}
