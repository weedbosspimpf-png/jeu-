import type { GameState, StatKey } from "@/engine/types";
import { STAT_LABELS } from "@/data/stats";
import { PersonalityPanel } from "@/components/PersonalityPanel";
import { StatBar } from "@/components/StatBar";

const PERSONALITY_STAT_KEYS: StatKey[] = [
  "leadership",
  "malice",
  "ruse",
  "perspicacity",
  "manipulation",
  "prudence",
  "coolness",
  "charisma",
  "diplomacy",
  "opportunism",
  "integrity",
  "loyalty",
  "ambition",
  "greed",
];

const GENERAL_STAT_KEYS: StatKey[] = [
  "intelligence",
  "force",
  "discipline",
  "courage",
  "empathy",
  "authority",
  "publicTrust",
  "wealth",
];

export function PersonalityTab({ state }: { state: GameState }) {
  return (
    <>
      <PersonalityPanel state={state} />
      <section className="panel">
        <h2>Traits comportementaux</h2>
        <p className="muted small">
          Aucun trait n&apos;est bon ou mauvais en soi : chacun ouvre certaines possibilites et en ferme
          d&apos;autres.
        </p>
        <div className="stat-grid">
          {PERSONALITY_STAT_KEYS.map((key) => (
            <StatBar key={key} label={STAT_LABELS[key]} value={state.character.stats[key]} />
          ))}
        </div>
      </section>
      <section className="panel">
        <h2>Autres aptitudes</h2>
        <div className="stat-grid">
          {GENERAL_STAT_KEYS.map((key) => (
            <StatBar key={key} label={STAT_LABELS[key]} value={state.character.stats[key]} />
          ))}
        </div>
      </section>
    </>
  );
}
