import type { Stats, StatKey } from "@/engine/types";

export const STAT_LABELS: Record<StatKey, string> = {
  intelligence: "Intelligence",
  force: "Force",
  discipline: "Discipline",
  courage: "Courage",
  ambition: "Ambition",
  leadership: "Leadership",
  loyalty: "Loyaute",
  diplomacy: "Diplomatie",
  charisma: "Charisme",
  integrity: "Integrite",
  wealth: "Richesse",
  reputation: "Reputation",
  influence: "Influence",
};

export const BASE_STATS: Stats = {
  intelligence: 40,
  force: 40,
  discipline: 40,
  courage: 40,
  ambition: 40,
  leadership: 30,
  loyalty: 50,
  diplomacy: 35,
  charisma: 40,
  integrity: 55,
  wealth: 20,
  reputation: 20,
  influence: 10,
};
