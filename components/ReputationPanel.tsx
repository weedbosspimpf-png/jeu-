import type { GameState } from "@/engine/types";
import { computeCareerRiskGauges, computeLegitimacy } from "@/data/careerRisk";
import { StatBar } from "./StatBar";

const RISK_TONE: Record<string, "default" | "positive" | "warning"> = {
  faible: "positive",
  modere: "default",
  eleve: "warning",
  critique: "warning",
};

export function ReputationPanel({ state }: { state: GameState }) {
  const legitimacy = computeLegitimacy(state);
  const risks = computeCareerRiskGauges(state);
  const hasCriticalRisk = risks.some((r) => r.level === "eleve" || r.level === "critique");

  return (
    <section className="panel">
      <h2>Reputation et pouvoir</h2>
      <p className="muted small">
        Quatre notions distinctes : la popularite (perception actuelle), la reputation (image construite dans
        le temps), l&apos;influence (capacite a peser sur les decisions) et la legitimite (reconnaissance de ta
        position).
      </p>
      <div className="stat-grid">
        <StatBar label="Popularite" value={state.character.stats.popularity} />
        <StatBar label="Reputation" value={state.character.stats.reputation} />
        <StatBar label="Influence" value={state.character.stats.influence} />
        <StatBar label="Legitimite" value={legitimacy} />
      </div>

      {risks.length > 0 && (
        <>
          <h3 className="muted small">Jauges de risque de la filiere actuelle</h3>
          <div className="stat-grid">
            {risks.map((risk) => (
              <StatBar key={risk.label} label={risk.label} value={risk.value} tone={RISK_TONE[risk.level]} />
            ))}
          </div>
          {hasCriticalRisk && (
            <p className="muted small">
              ⚠️ AVERTISSEMENT — un ou plusieurs risques sont eleves. Une reaction rapide peut encore changer
              l&apos;issue.
            </p>
          )}
        </>
      )}
    </section>
  );
}
