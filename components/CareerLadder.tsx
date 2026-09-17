import type { GameState } from "@/engine/types";
import { CAREER_TRACKS } from "@/data/careers";

export function CareerLadder({ state }: { state: GameState }) {
  const track = CAREER_TRACKS.find((t) => t.id === state.career.currentTrack);
  if (!track) return null;

  const currentIdx = track.ranks.findIndex((r) => r.id === state.career.currentRankId);

  return (
    <section className="panel">
      <h2>Progression - {track.label}</h2>
      <ol className="career-ladder">
        {track.ranks.map((rank, idx) => {
          const status = idx < currentIdx ? "past" : idx === currentIdx ? "current" : "future";
          return (
            <li key={rank.id} className={`career-ladder-step ladder-${status}`}>
              <span className="ladder-marker" />
              <span>{rank.title}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
