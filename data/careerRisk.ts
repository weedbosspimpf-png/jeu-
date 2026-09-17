import type { GameState } from "@/engine/types";
import { clamp } from "@/engine/utils";
import { averageRegionalPopularity } from "@/engine/powerBids";

/**
 * Jauges de risque et de legitimite, cote presentation pure : elles ne
 * pilotent aucune regle par elles-memes (les evenements de
 * data/events/careerDiscipline.ts recalculent leurs propres seuils),
 * elles servent a ce que le joueur comprenne toujours ou il se situe.
 */

export type RiskLevel = "faible" | "modere" | "eleve" | "critique";

export interface CareerRiskGauge {
  label: string;
  value: number;
  level: RiskLevel;
}

export function riskLevel(value: number): RiskLevel {
  if (value >= 75) return "critique";
  if (value >= 50) return "eleve";
  if (value >= 25) return "modere";
  return "faible";
}

/** Risque disciplinaire/de revocation, commun aux filieres hierarchiques (armee, police, gendarmerie). */
export function computeDisciplinaryRisk(state: GameState): number {
  const stats = state.character.stats;
  const perf = state.career.performance;
  const priorSanction = state.flags["career-sanctioned-once"] === true ? 20 : 0;

  return clamp(
    Math.round(
      (100 - stats.discipline) * 0.3 + (100 - perf) * 0.35 + (100 - stats.integrity) * 0.15 + priorSanction
    ),
    0,
    100
  );
}

export function computeCareerRiskGauges(state: GameState): CareerRiskGauge[] {
  const track = state.career.currentTrack;
  const stats = state.character.stats;
  const perf = state.career.performance;

  if (track === "army" || track === "police" || track === "gendarmerie") {
    const disciplinaryRisk = computeDisciplinaryRisk(state);
    const dismissalRisk = clamp(
      Math.round(disciplinaryRisk * 0.6 + (100 - stats.reputation) * 0.2),
      0,
      100
    );
    return [
      { label: "Risque disciplinaire", value: disciplinaryRisk, level: riskLevel(disciplinaryRisk) },
      { label: "Risque de revocation", value: dismissalRisk, level: riskLevel(dismissalRisk) },
    ];
  }

  if (track === "entrepreneur") {
    const financialRisk = clamp(
      Math.round(
        (state.character.money < 500 ? 50 : 0) +
          (100 - state.world.values.economy) * 0.3 +
          (100 - perf) * 0.2
      ),
      0,
      100
    );
    return [{ label: "Risque financier", value: financialRisk, level: riskLevel(financialRisk) }];
  }

  if (track === "crime") {
    const judicialRisk = clamp(
      Math.round((100 - state.world.values.security) * 0.4 + (100 - perf) * 0.2),
      0,
      100
    );
    return [{ label: "Risque judiciaire", value: judicialRisk, level: riskLevel(judicialRisk) }];
  }

  if (track === "politics") {
    const popularityLossRisk = clamp(
      Math.round(
        (100 - stats.popularity) * 0.4 +
          (100 - stats.reputation) * 0.3 +
          state.world.values.socialTension * 0.2
      ),
      0,
      100
    );
    return [
      { label: "Risque de perte de popularite", value: popularityLossRisk, level: riskLevel(popularityLossRisk) },
    ];
  }

  return [];
}

/**
 * Legitimite : distincte de la reputation (image construite dans le
 * temps), de la popularite (perception actuelle) et de l'influence
 * (capacite a peser sur les decisions). Pour le president, c'est le
 * trait fixe par le mode d'accession au pouvoir ; sinon, une estimation
 * de coherence entre le rang occupe et l'integrite/reputation reelles.
 */
export function computeLegitimacy(state: GameState): number {
  if (state.career.currentRankId === "president") {
    return state.world.president.traits.legitimacy;
  }
  return clamp(Math.round((state.character.stats.integrity + state.character.stats.reputation) / 2), 0, 100);
}

export { averageRegionalPopularity };
