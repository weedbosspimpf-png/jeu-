import type { CareerTrack, GameState, WealthSourceId } from "./types";
import { getCurrentRank } from "./careers";
import { clamp, randomInt } from "./utils";

function incomeSourceFor(state: GameState): WealthSourceId {
  if (state.career.currentTrack === "entrepreneur") return "entreprise";
  if (state.career.currentTrack === "crime") return "douteux";
  return "salaire";
}

/**
 * Economie personnelle du personnage. Le revenu depend de la filiere et
 * du grade (CareerRank.baseSalary, declare dans data/careers/*), jamais
 * du moteur lui-meme. Les depenses dependent du comportement du
 * personnage (cupidite vs prudence) : deux personnages au meme salaire
 * peuvent donc diverger completement selon leurs choix passes.
 */
export function applyAnnualFinances(state: GameState, tracks: CareerTrack[]): void {
  const current = getCurrentRank(state, tracks);
  const baseSalary = current?.rank.baseSalary ?? 0;
  const performanceMultiplier = 0.6 + (state.career.performance / 100) * 0.6;
  const income = Math.round(baseSalary * performanceMultiplier);

  const stats = state.character.stats;
  const expenseRatio = clamp(0.5 + (stats.greed - stats.prudence) * 0.003, 0.3, 0.95);
  const expenses = Math.round(income * expenseRatio);
  const net = income - expenses;

  state.finances.annualIncome = income;
  state.finances.annualExpenses = expenses;

  if (income > 0) {
    const wealthSource = incomeSourceFor(state);
    state.finances.wealthBySource[wealthSource] = (state.finances.wealthBySource[wealthSource] ?? 0) + income;
  }

  if (net >= 0) {
    const savingsPortion = Math.round(net * (0.3 + stats.prudence * 0.005));
    state.finances.savings += savingsPortion;
    state.character.money = Math.round(state.character.money + (net - savingsPortion));
  } else {
    const debtPortion = Math.round(-net * (0.5 + (100 - stats.prudence) * 0.003));
    state.finances.debt = Math.max(0, state.finances.debt + debtPortion);
    state.character.money = Math.round(state.character.money + net + debtPortion);
  }
}

export interface InvestmentOutcome {
  /** Profit au-dessus du capital investi (0 si l'investissement echoue : le capital est perdu). */
  profit: number;
  succeeded: boolean;
}

/**
 * Un investissement n'est jamais garanti : le risque depend de la
 * prudence et de l'intelligence du personnage, et du contexte
 * economique du pays, mais le hasard reste toujours present. Le
 * capital investi est deduit separement (voir engine/effects.ts) ; ceci
 * ne calcule que le profit eventuel.
 */
export function resolveInvestmentOutcome(state: GameState, amount: number): InvestmentOutcome {
  const stats = state.character.stats;
  const successScore = clamp(
    40 + stats.prudence * 0.25 + stats.intelligence * 0.2 + (state.world.values.economy - 50) * 0.3,
    5,
    90
  );
  const succeeded = randomInt(0, 99) < successScore;
  const profit = succeeded ? Math.round(amount * (0.3 + randomInt(0, 60) / 100)) : 0;
  return { profit, succeeded };
}
