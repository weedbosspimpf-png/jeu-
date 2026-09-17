import type { GameState } from "@/engine/types";
import { CAREER_TRACKS } from "@/data/careers";
import { getCurrentRank } from "@/engine/careers";
import {
  AMBITION_LABELS,
  computeGoalProgress,
  describeCurrentAmbition,
  getTopAmbitions,
  listAvailableTransitions,
} from "@/data/ambitions";
import { StatBar } from "./StatBar";

export function AmbitionPanel({ state }: { state: GameState }) {
  const current = getCurrentRank(state, CAREER_TRACKS);
  const track = current ? CAREER_TRACKS.find((t) => t.id === current.track.id) : null;
  const progress = computeGoalProgress(state);
  const secondary = getTopAmbitions(state, 3);
  const transitions = listAvailableTransitions(state);
  const allies = Object.values(state.relationships).filter(
    (r) => r.status === "allie" || r.status === "partenaire"
  ).length;
  const experience = current ? state.career.turnsInRank : 0;

  const legacyEntries = Object.entries(state.careerLegacy) as [string, NonNullable<(typeof state.careerLegacy)[keyof typeof state.careerLegacy]>][];

  return (
    <section className="panel">
      <h2>Ambition</h2>
      <p className="muted small">Objectif professionnel : {track?.careerGoal ?? "Aucune trajectoire engagee."}</p>
      <p className="career-rank">{describeCurrentAmbition(state)}</p>

      <div className="stat-bar">
        <div className="stat-bar-header">
          <span>Progression vers l&apos;objectif</span>
          <span className="stat-bar-value">{progress}%</span>
        </div>
        <div className="stat-bar-track">
          <div className="stat-bar-fill tone-positive" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="muted small">
        Influence : {state.character.stats.influence}/100 &middot; Reputation : {state.character.stats.reputation}/100
        &middot; Soutiens : {allies} &middot; Anciennete dans le poste actuel : {experience} an(s)
      </p>

      <h3 className="muted small">Ambitions secondaires dominantes</h3>
      <div className="stat-grid">
        {secondary.map(({ key, value }) => (
          <StatBar key={key} label={AMBITION_LABELS[key]} value={value} />
        ))}
      </div>

      <h3 className="muted small">Trajectoires disponibles</h3>
      <ul className="history-list">
        {transitions.map((option) => (
          <li key={option}>{option}</li>
        ))}
      </ul>

      {legacyEntries.length > 0 && (
        <>
          <h3 className="muted small">Passe professionnel conserve</h3>
          <ul className="history-list">
            {legacyEntries.map(([trackId, legacy]) => (
              <li key={trackId}>
                {trackId} &mdash; grade atteint : {legacy.peakRankId}, reputation a la sortie :{" "}
                {legacy.reputationAtExit}/100, influence a la sortie : {legacy.influenceAtExit}/100
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
