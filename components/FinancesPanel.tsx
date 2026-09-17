import type { GameState } from "@/engine/types";
import {
  WEALTH_SOURCE_LABELS,
  computeFinancialInfluence,
  computeLifestyle,
  computeNetWorth,
  getDominantWealthSource,
} from "@/data/finances";
import { StatBar } from "./StatBar";

export function FinancesPanel({ state }: { state: GameState }) {
  const netWorth = computeNetWorth(state);
  const lifestyle = computeLifestyle(state);
  const financialInfluence = computeFinancialInfluence(state);
  const dominantSource = getDominantWealthSource(state);

  return (
    <section className="panel">
      <h2>Patrimoine</h2>
      <table className="comparison-table">
        <tbody>
          <tr>
            <th>Liquidites</th>
            <td>{state.character.money.toLocaleString("fr-FR")} credits</td>
          </tr>
          <tr>
            <th>Revenu annuel</th>
            <td>{state.finances.annualIncome.toLocaleString("fr-FR")} credits</td>
          </tr>
          <tr>
            <th>Depenses annuelles</th>
            <td>{state.finances.annualExpenses.toLocaleString("fr-FR")} credits</td>
          </tr>
          <tr>
            <th>Epargne</th>
            <td>{state.finances.savings.toLocaleString("fr-FR")} credits</td>
          </tr>
          <tr>
            <th>Investissements</th>
            <td>{state.finances.investments.toLocaleString("fr-FR")} credits</td>
          </tr>
          <tr>
            <th>Dettes</th>
            <td>{state.finances.debt.toLocaleString("fr-FR")} credits</td>
          </tr>
          <tr>
            <th>Patrimoine total</th>
            <td>{netWorth.toLocaleString("fr-FR")} credits</td>
          </tr>
          <tr>
            <th>Niveau de vie</th>
            <td>{lifestyle}</td>
          </tr>
          {dominantSource && (
            <tr>
              <th>Source principale de revenus</th>
              <td>{WEALTH_SOURCE_LABELS[dominantSource]}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="stat-grid">
        <StatBar label="Influence financiere" value={financialInfluence} />
      </div>
    </section>
  );
}
