import type { GameState } from "@/engine/types";
import { CAREER_TRACKS } from "@/data/careers";
import { getCurrentRank } from "@/engine/careers";
import { STAT_LABELS } from "@/data/stats";

const RISK_BY_TRACK: Record<string, string> = {
  crime: "Eleve",
  army: "Eleve",
  police: "Modere",
  gendarmerie: "Modere",
  politics: "Modere",
  entrepreneur: "Variable",
  civil: "Faible",
};

function topStats(state: GameState, count: number) {
  return (Object.keys(state.character.stats) as (keyof typeof STAT_LABELS)[])
    .map((key) => ({ key, value: state.character.stats[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

export function ComparisonPanel({ state }: { state: GameState }) {
  const current = getCurrentRank(state, CAREER_TRACKS);
  const relations = Object.values(state.relationships);
  const avgTrust = relations.length
    ? Math.round(relations.reduce((sum, r) => sum + r.trust, 0) / relations.length)
    : 0;
  const skills = topStats(state, 3);

  let promotionOutlook = "Aucune carriere engagee";
  if (current) {
    const track = CAREER_TRACKS.find((t) => t.id === current.track.id);
    const idx = track?.ranks.findIndex((r) => r.id === current.rank.id) ?? -1;
    const next = track?.ranks[idx + 1];
    promotionOutlook = next
      ? `Prochain palier possible : ${next.title}`
      : "Sommet de cette filiere atteint";
  }

  const rows: [string, string][] = [
    ["Revenu", `${state.character.money.toLocaleString("fr-FR")} credits`],
    ["Stabilite", `${state.career.performance}/100 de performance dans le poste actuel`],
    ["Influence", `${state.character.stats.influence}/100`],
    ["Reputation", `${state.character.stats.reputation}/100`],
    ["Risque associe au parcours", RISK_BY_TRACK[state.career.currentTrack ?? "civil"] ?? "Inconnu"],
    ["Possibilites de promotion", promotionOutlook],
    ["Relations", `${relations.length} relation(s), confiance moyenne ${avgTrust}/100`],
    ["Competences dominantes", skills.map((s) => STAT_LABELS[s.key]).join(", ") || "-"],
  ];

  return (
    <section className="panel">
      <h2>Bilan du parcours</h2>
      <p className="muted small">
        Ce tableau decrit ton parcours, il ne juge pas quelle voie est la meilleure.
      </p>
      <table className="comparison-table">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th>{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
