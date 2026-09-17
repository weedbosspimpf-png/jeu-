import type { GameState } from "@/engine/types";
import { CAREER_TRACKS } from "@/data/careers";
import { getCurrentRank } from "@/engine/careers";

export function CharacterSheet({ state }: { state: GameState }) {
  const current = getCurrentRank(state, CAREER_TRACKS);
  const legacyEntries = Object.entries(state.careerLegacy);

  return (
    <section className="panel">
      <h2>{state.character.name}</h2>
      <p className="muted">
        {state.character.age} ans &middot; {state.character.money.toLocaleString("fr-FR")} credits
      </p>
      <p className="muted small">
        {current ? `${current.rank.title} · ${current.track.label}` : "Sans trajectoire engagee"}
      </p>
      {legacyEntries.length > 0 && (
        <p className="muted small">
          Ancien parcours : {legacyEntries.map(([trackId]) => trackId).join(", ")}
        </p>
      )}
    </section>
  );
}
