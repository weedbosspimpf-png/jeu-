import type { CareerTrack } from "@/engine/types";

export const crimeTrack: CareerTrack = {
  id: "crime",
  label: "Reseau (fictif)",
  description: "Trajectoire criminelle fictive, traitee comme mecanique narrative uniquement.",
  ranks: [
    { id: "recrue", title: "Recrue du reseau", minTurnsInRank: 0, requirements: () => true },
    {
      id: "lieutenant",
      title: "Lieutenant",
      minTurnsInRank: 1,
      requirements: (state) => state.character.stats.loyalty >= 40 && state.career.performance >= 45,
      onPromote: [{ type: "stat", stat: "reputation", delta: -5 }],
    },
    {
      id: "chef-reseau",
      title: "Chef de reseau",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.leadership >= 55 &&
        state.character.stats.courage >= 55 &&
        state.career.performance >= 60,
      onPromote: [{ type: "stat", stat: "influence", delta: 15 }],
    },
  ],
};
