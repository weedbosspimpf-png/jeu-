export function HistoryLog({ log }: { log: string[] }) {
  if (log.length === 0) return null;
  return (
    <section className="panel">
      <h2>Journal recent</h2>
      <ul className="history-list">
        {log.map((entry, idx) => (
          <li key={idx}>{entry}</li>
        ))}
      </ul>
    </section>
  );
}
