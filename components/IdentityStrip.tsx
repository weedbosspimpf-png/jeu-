import type { GameState } from "@/engine/types";
import { CAREER_TRACKS } from "@/data/careers";
import { getCurrentRank } from "@/engine/careers";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function IdentityStrip({ state }: { state: GameState }) {
  const current = getCurrentRank(state, CAREER_TRACKS);

  return (
    <div className="identity-strip">
      <div className="identity-avatar">{initials(state.character.name)}</div>
      <div className="identity-details">
        <strong>{state.character.name}</strong>
        <span className="muted small">
          {state.character.age} ans &middot; {state.world.countryName}
          {current ? ` · ${current.rank.title} (${current.track.label})` : " · Sans trajectoire engagee"}
        </span>
      </div>
    </div>
  );
}
