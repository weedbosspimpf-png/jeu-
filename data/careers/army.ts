import type { CareerTrack } from "@/engine/types";

export const armyTrack: CareerTrack = {
  id: "army",
  label: "Armee",
  description: "Filiere militaire : de simple recrue a officier superieur.",
  careerGoal: "Atteindre le haut commandement et devenir general.",
  focusAmbitions: ["prestige", "influence", "protectionDesSiens", "politique", "institutions"],
  ranks: [
    {
      id: "recrue",
      title: "Recrue",
      minTurnsInRank: 0,
      requirements: () => true,
    },
    {
      id: "caporal",
      title: "Caporal",
      minTurnsInRank: 1,
      requirements: (state) =>
        state.character.stats.discipline >= 45 && state.career.performance >= 40,
    },
    {
      id: "officier",
      title: "Officier",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.leadership >= 55 &&
        state.character.stats.discipline >= 55 &&
        state.career.performance >= 55,
      onPromote: [{ type: "stat", stat: "reputation", delta: 10 }],
    },
    {
      id: "commandant",
      title: "Commandant",
      minTurnsInRank: 3,
      requirements: (state) =>
        state.character.stats.leadership >= 70 &&
        state.character.stats.reputation >= 60 &&
        state.career.performance >= 65,
      onPromote: [
        { type: "stat", stat: "influence", delta: 10 },
        { type: "stat", stat: "reputation", delta: 10 },
        { type: "stat", stat: "authority", delta: 10 },
      ],
    },
    {
      id: "colonel",
      title: "Colonel",
      minTurnsInRank: 3,
      requirements: (state) =>
        state.character.stats.leadership >= 78 &&
        state.character.stats.authority >= 45 &&
        state.career.performance >= 70,
      onPromote: [
        { type: "stat", stat: "influence", delta: 10 },
        { type: "stat", stat: "authority", delta: 15 },
      ],
    },
    {
      id: "general",
      title: "General",
      minTurnsInRank: 4,
      requirements: (state) =>
        state.character.stats.leadership >= 85 &&
        state.character.stats.influence >= 70 &&
        state.character.stats.authority >= 60 &&
        state.career.performance >= 75,
      onPromote: [
        { type: "stat", stat: "influence", delta: 20 },
        { type: "stat", stat: "authority", delta: 15 },
        { type: "relationshipSyncPresident" },
      ],
    },
  ],
};
