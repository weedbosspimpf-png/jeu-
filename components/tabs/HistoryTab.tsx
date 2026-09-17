import type { GameState } from "@/engine/types";

export function HistoryTab({ state }: { state: GameState }) {
  const entries = state.history.slice().reverse();

  return (
    <section className="panel">
      <h2>Historique de vie</h2>
      <p className="muted small">Genere a partir des evenements reellement traverses.</p>
      <ul className="history-list history-timeline">
        {entries.map((entry, idx) => (
          <li key={idx}>
            <strong>{entry.age} ans</strong> &mdash; {entry.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
