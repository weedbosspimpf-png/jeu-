interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  tone?: "default" | "positive" | "warning";
}

export function StatBar({ label, value, max = 100, tone = "default" }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="stat-bar">
      <div className="stat-bar-header">
        <span>{label}</span>
        <span className="stat-bar-value">{Math.round(value)}</span>
      </div>
      <div className="stat-bar-track">
        <div className={`stat-bar-fill tone-${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
