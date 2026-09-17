import type { GameState } from "@/engine/types";
import { CAREER_TRACKS } from "@/data/careers";
import { getCurrentRank } from "@/engine/careers";
import { StatBar } from "./StatBar";

export function CareerPanel({ state }: { state: GameState }) {
  const current = getCurrentRank(state, CAREER_TRACKS);
  const responsibilities = current?.rank.responsibilities;

  return (
    <section className="panel">
      <h2>Carriere</h2>
      {current ? (
        <>
          <p className="muted">{current.track.label}</p>
          <p className="career-rank">{current.rank.title}</p>
          <div className="stat-bar">
            <div className="stat-bar-header">
              <span>Performance</span>
              <span className="stat-bar-value">{state.career.performance}</span>
            </div>
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill tone-positive"
                style={{ width: `${state.career.performance}%` }}
              />
            </div>
          </div>
          <p className="muted small">Anciennete dans ce grade : {state.career.turnsInRank} an(s)</p>

          <div className="stat-grid">
            <StatBar label="Confiance de mes superieurs" value={state.career.superiorTrust} />
            <StatBar label="Moral de mes subordonnes" value={state.career.subordinateMorale} />
          </div>

          {responsibilities && (
            <>
              <p className="muted small">
                <strong>Objectif :</strong> {responsibilities.objective}
              </p>
              <p className="muted small">
                <strong>Defis :</strong> {responsibilities.challenges.join(", ")}
              </p>
              <p className="muted small">
                <strong>Risques :</strong> {responsibilities.risks.join(", ")}
              </p>
              <p className="muted small">
                <strong>Opportunites :</strong> {responsibilities.opportunities.join(", ")}
              </p>
            </>
          )}
        </>
      ) : (
        <p className="muted">Aucune carriere engagee pour le moment.</p>
      )}
      {state.career.history.length > 0 && (
        <ul className="history-list">
          {state.career.history
            .slice()
            .reverse()
            .map((entry, idx) => (
              <li key={idx}>
                An {entry.since} &mdash; {entry.trackId} : {entry.rankId}
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
