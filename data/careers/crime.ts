import type { CareerTrack } from "@/engine/types";

export const crimeTrack: CareerTrack = {
  id: "crime",
  label: "Reseau (fictif)",
  description:
    "Trajectoire criminelle entierement fictive et abstraite, traitee comme mecanique narrative uniquement.",
  careerGoal: "Construire un reseau criminel fictif et devenir une figure influente du milieu.",
  focusAmbitions: ["richesse", "influence", "reputation", "independance"],
  ranks: [
    { id: "membre", title: "Membre du groupe", minTurnsInRank: 0, requirements: () => true },
    {
      id: "executant",
      title: "Executant",
      minTurnsInRank: 1,
      requirements: (state) => state.character.stats.loyalty >= 35 && state.career.performance >= 40,
    },
    {
      id: "lieutenant",
      title: "Lieutenant",
      minTurnsInRank: 1,
      requirements: (state) =>
        state.character.stats.courage >= 45 &&
        state.character.stats.intelligence >= 40 &&
        state.career.performance >= 50,
      onPromote: [{ type: "stat", stat: "reputation", delta: -5 }],
    },
    {
      id: "chef-secteur",
      title: "Chef de secteur",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.leadership >= 55 &&
        state.character.stats.diplomacy >= 45 &&
        state.career.performance >= 55,
      onPromote: [{ type: "stat", stat: "influence", delta: 8 }],
    },
    {
      id: "chef-reseau",
      title: "Chef de reseau",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.leadership >= 65 &&
        state.character.stats.courage >= 55 &&
        state.career.performance >= 65,
      onPromote: [{ type: "stat", stat: "influence", delta: 15 }],
    },
    {
      id: "figure-influente",
      title: "Figure criminelle influente",
      minTurnsInRank: 3,
      requirements: (state) =>
        state.character.stats.influence >= 70 &&
        state.character.stats.reputation >= 30 &&
        state.career.performance >= 70,
      onPromote: [{ type: "stat", stat: "influence", delta: 15 }],
    },
  ],
};
