import type { GameState } from "@/engine/types";
import { computeCurrentChallenges } from "@/data/challenges";
import { computeGoalProgress, computeGoalProgressFactors, describeCurrentAmbition, listAvailableTransitions } from "@/data/ambitions";

export function OverviewTab({ state }: { state: GameState }) {
  const progress = computeGoalProgress(state);
  const factors = computeGoalProgressFactors(state);
  const challenges = computeCurrentChallenges(state);
  const opportunities = listAvailableTransitions(state);

  return (
    <>
      <section className="panel">
        <h2>Objectif principal</h2>
        <p className="career-rank">{describeCurrentAmbition(state)}</p>
        <div className="stat-bar">
          <div className="stat-bar-header">
            <span>Progression estimee</span>
            <span className="stat-bar-value">{progress}%</span>
          </div>
          <div className="stat-bar-track">
            <div className="stat-bar-fill tone-positive" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <p className="muted small">Cette estimation ne garantit jamais la reussite.</p>
        <div className="factors-grid">
          <ul className="factors-list">
            {factors.positive.map((f) => (
              <li key={f} className="tone-positive">
                + {f}
              </li>
            ))}
          </ul>
          <ul className="factors-list">
            {factors.negative.map((f) => (
              <li key={f} className="tone-warning">
                - {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel">
        <h2>Defis actuels</h2>
        <ul className="challenge-list">
          {challenges.map((challenge) => (
            <li key={challenge.label} className={challenge.tone === "warning" ? "tone-warning" : "tone-positive"}>
              {challenge.tone === "warning" ? "⚠" : "✓"} {challenge.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Opportunites</h2>
        <ul className="history-list">
          {opportunities.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
