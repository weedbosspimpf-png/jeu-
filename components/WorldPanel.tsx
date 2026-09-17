import type { GameState } from "@/engine/types";
import { WORLD_LABELS } from "@/data/world";
import { StatBar } from "./StatBar";

export function WorldPanel({ state }: { state: GameState }) {
  return (
    <section className="panel">
      <h2>{state.world.countryName}</h2>
      <p className="muted">Population : {state.world.population.toLocaleString("fr-FR")}</p>
      <div className="stat-grid">
        {(Object.keys(WORLD_LABELS) as (keyof typeof WORLD_LABELS)[]).map((key) => (
          <StatBar
            key={key}
            label={WORLD_LABELS[key]}
            value={state.world.values[key]}
            tone={state.world.values[key] < 30 ? "warning" : "default"}
          />
        ))}
      </div>
    </section>
  );
}
