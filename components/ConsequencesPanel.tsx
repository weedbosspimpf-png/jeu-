export function ConsequencesPanel({ consequences }: { consequences: string[] }) {
  if (consequences.length === 0) return null;

  return (
    <section className="panel consequences-panel">
      <h3>Decision enregistree</h3>
      <ul className="consequences-list">
        {consequences.map((line) => (
          <li key={line} className={line.startsWith("-") ? "tone-warning" : "tone-positive"}>
            {line}
          </li>
        ))}
      </ul>
      <p className="muted small">Certaines consequences ne se reveleront que plus tard.</p>
    </section>
  );
}
