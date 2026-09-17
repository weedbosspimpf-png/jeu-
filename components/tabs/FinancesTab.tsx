import type { GameState } from "@/engine/types";
import { FINANCIAL_HEALTH_LABELS, computeFinancialHealth } from "@/data/finances";
import { FinancesPanel } from "@/components/FinancesPanel";

export function FinancesTab({ state }: { state: GameState }) {
  const health = computeFinancialHealth(state);

  return (
    <>
      <section className="panel">
        <h2>Situation financiere</h2>
        <p className={`financial-health financial-health-${health}`}>{FINANCIAL_HEALTH_LABELS[health]}</p>
      </section>
      <FinancesPanel state={state} />
    </>
  );
}
