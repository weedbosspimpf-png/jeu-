import type { GameState } from "@/engine/types";
import { STAT_LABELS } from "@/data/stats";
import { StatBar } from "./StatBar";

export function CharacterSheet({ state }: { state: GameState }) {
  return (
    <section className="panel">
      <h2>{state.character.name}</h2>
      <p className="muted">
        {state.character.age} ans &middot; {state.character.money.toLocaleString("fr-FR")} credits
      </p>
      <div className="stat-grid">
        {(Object.keys(STAT_LABELS) as (keyof typeof STAT_LABELS)[]).map((key) => (
          <StatBar key={key} label={STAT_LABELS[key]} value={state.character.stats[key]} />
        ))}
      </div>
    </section>
  );
}
