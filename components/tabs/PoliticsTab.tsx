import type { GameState } from "@/engine/types";
import { REGION_LABELS } from "@/data/world";
import { computeLegitimacy } from "@/data/careerRisk";
import { StatBar } from "@/components/StatBar";

const POWER_ACCESSION_LABELS: Record<string, string> = {
  election: "Elu par la population",
  "crisis-transition": "Porte au pouvoir par une transition institutionnelle",
  coup: "Arrive au pouvoir par la force",
};

export function PoliticsTab({ state }: { state: GameState }) {
  const legitimacy = computeLegitimacy(state);

  return (
    <section className="panel">
      <h2>Politique</h2>
      <div className="stat-grid">
        <StatBar label="Popularite nationale" value={state.character.stats.popularity} />
        <StatBar label="Influence" value={state.character.stats.influence} />
        <StatBar label="Legitimite" value={legitimacy} />
      </div>

      <h3 className="muted small">Popularite par region</h3>
      <div className="stat-grid">
        {(Object.keys(REGION_LABELS) as (keyof typeof REGION_LABELS)[]).map((region) => (
          <StatBar key={region} label={REGION_LABELS[region]} value={state.character.regionalPopularity[region]} />
        ))}
      </div>

      {state.powerAccessionMode && (
        <p className="muted small">
          Mode d&apos;accession au pouvoir : {POWER_ACCESSION_LABELS[state.powerAccessionMode]}
        </p>
      )}
      <p className="muted small">
        Une campagne, une candidature ou une election peuvent se presenter au fil des evenements, selon le
        contexte du pays et ta situation.
      </p>
    </section>
  );
}
