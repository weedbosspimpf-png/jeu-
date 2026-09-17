import type { GameState } from "@/engine/types";

export function RelationshipsPanel({ state }: { state: GameState }) {
  const relations = Object.values(state.relationships);

  return (
    <section className="panel">
      <h2>Relations</h2>
      {relations.length === 0 && <p className="muted">Aucune relation notable pour le moment.</p>}
      <ul className="relationship-list">
        {relations.map((rel) => (
          <li key={rel.npcId} className="relationship-item">
            <div className="relationship-header">
              <strong>{rel.name}</strong>
              <span className={`status-badge status-${rel.status}`}>{rel.status}</span>
            </div>
            <p className="muted small">{rel.role}</p>
            <div className="relationship-metrics">
              <span>Confiance {rel.trust}</span>
              <span>Loyaute {rel.loyalty}</span>
              <span>Influence {rel.influence}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
