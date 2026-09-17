import type { GameState } from "@/engine/types";
import { PRESIDENT_TRAIT_LABELS, REGIME_LABELS, WORLD_LABELS } from "@/data/world";
import { StatBar } from "./StatBar";

export function WorldPanel({ state }: { state: GameState }) {
  const { president, regime } = state.world;
  return (
    <section className="panel">
      <h2>{state.world.countryName}</h2>
      <p className="muted">Population : {state.world.population.toLocaleString("fr-FR")}</p>
      <p className="muted small">
        Regime : {REGIME_LABELS[regime]} &middot; President : {president.name}
      </p>
      <div className="stat-grid">
        {(Object.keys(PRESIDENT_TRAIT_LABELS) as (keyof typeof PRESIDENT_TRAIT_LABELS)[]).map((key) => (
          <StatBar key={key} label={`President - ${PRESIDENT_TRAIT_LABELS[key]}`} value={president.traits[key]} />
        ))}
      </div>
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
