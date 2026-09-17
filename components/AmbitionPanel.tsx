import type { GameState } from "@/engine/types";
import { getCurrentRank } from "@/engine/careers";
import { CAREER_TRACKS } from "@/data/careers";
import { AMBITION_LABELS, getTopAmbitions, listLockedTransitions } from "@/data/ambitions";
import { StatBar } from "./StatBar";

/**
 * Complement de l'objectif principal (deja affiche dans OverviewTab) :
 * ambitions secondaires, soutiens, trajectoires verrouillees et passe
 * professionnel conserve. N'affiche jamais deux fois la meme jauge.
 */
export function AmbitionPanel({ state }: { state: GameState }) {
  const current = getCurrentRank(state, CAREER_TRACKS);
  const secondary = getTopAmbitions(state, 3);
  const locked = listLockedTransitions(state);
  const allies = Object.values(state.relationships).filter(
    (r) => r.status === "allie" || r.status === "partenaire"
  ).length;
  const experience = current ? state.career.turnsInRank : 0;

  const legacyEntries = Object.entries(state.careerLegacy) as [string, NonNullable<(typeof state.careerLegacy)[keyof typeof state.careerLegacy]>][];

  return (
    <section className="panel">
      <h2>Ambitions secondaires</h2>
      <p className="muted small">
        Soutiens : {allies} &middot; Anciennete dans le poste actuel : {experience} an(s)
      </p>

      <div className="stat-grid">
        {secondary.map(({ key, value }) => (
          <StatBar key={key} label={AMBITION_LABELS[key]} value={value} />
        ))}
      </div>

      {locked.length > 0 && (
        <>
          <h3 className="muted small">Trajectoires verrouillees</h3>
          <ul className="history-list">
            {locked.map((item) => (
              <li key={item.label}>
                🔒 {item.label} &mdash; {item.reason}
              </li>
            ))}
          </ul>
        </>
      )}

      {legacyEntries.length > 0 && (
        <>
          <h3 className="muted small">Passe professionnel conserve</h3>
          <ul className="history-list">
            {legacyEntries.map(([trackId, legacy]) => (
              <li key={trackId}>
                {trackId} &mdash; grade atteint : {legacy.peakRankId}
                {legacy.exitReason ? ` (${legacy.exitReason})` : ""}, reputation a la sortie :{" "}
                {legacy.reputationAtExit}/100, influence a la sortie : {legacy.influenceAtExit}/100
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
