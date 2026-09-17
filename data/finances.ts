import type { GameState, WealthSourceId } from "@/engine/types";
import { clamp } from "@/engine/utils";

/**
 * Cote presentation pure : le patrimoine total n'est jamais stocke, il
 * est toujours recalcule a partir des liquidites, de l'epargne, des
 * investissements et des dettes (voir GameState.finances). Ne pilote
 * aucune regle de jeu par lui-meme.
 */

export const WEALTH_SOURCE_LABELS: Record<WealthSourceId, string> = {
  salaire: "Salaire",
  entreprise: "Revenus d'entreprise",
  investissement: "Investissements",
  heritage: "Heritage",
  "activite-sociale": "Activite sociale",
  douteux: "Sources douteuses",
};

export type Lifestyle = "Precaire" | "Modeste" | "Confortable" | "Aise" | "Riche" | "Tres riche";

export function computeNetWorth(state: GameState): number {
  const f = state.finances;
  return state.character.money + f.savings + f.investments - f.debt;
}

export function computeLifestyle(state: GameState): Lifestyle {
  const netWorth = computeNetWorth(state);
  const income = state.finances.annualIncome;

  if (netWorth < 0 || (income > 0 && state.finances.debt > income * 2)) return "Precaire";
  if (netWorth < 2000) return "Modeste";
  if (netWorth < 15000) return "Confortable";
  if (netWorth < 60000) return "Aise";
  if (netWorth < 200000) return "Riche";
  return "Tres riche";
}

/**
 * Influence financiere : distincte de l'influence politique. Depend du
 * patrimoine, des investissements et de la reputation, mais jamais
 * uniquement de l'argent disponible.
 */
export function computeFinancialInfluence(state: GameState): number {
  const netWorth = computeNetWorth(state);
  const netWorthScore = clamp(Math.log10(Math.max(netWorth, 1)) * 12, 0, 60);
  const investmentScore = clamp((state.finances.investments / 1000) * 2, 0, 20);
  const reputationScore = (state.character.stats.reputation / 100) * 20;
  return clamp(Math.round(netWorthScore + investmentScore + reputationScore), 0, 100);
}

export type FinancialHealth = "fragile" | "stable" | "confortable" | "prospere" | "exceptionnelle";

export const FINANCIAL_HEALTH_LABELS: Record<FinancialHealth, string> = {
  fragile: "Fragile",
  stable: "Stable",
  confortable: "Confortable",
  prospere: "Prospere",
  exceptionnelle: "Exceptionnelle",
};

/** Indicateur visuel rapide de la situation financiere globale (patrimoine net de dettes). */
export function computeFinancialHealth(state: GameState): FinancialHealth {
  const netWorth = computeNetWorth(state);
  if (netWorth < 0 || state.finances.debt > state.character.money + state.finances.savings) return "fragile";
  if (netWorth < 3000) return "stable";
  if (netWorth < 20000) return "confortable";
  if (netWorth < 100000) return "prospere";
  return "exceptionnelle";
}

export function getDominantWealthSource(state: GameState): WealthSourceId | null {
  const entries = Object.entries(state.finances.wealthBySource) as [WealthSourceId, number][];
  if (entries.length === 0) return null;
  return entries.reduce((best, current) => (current[1] > best[1] ? current : best))[0];
}
