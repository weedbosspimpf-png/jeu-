import type { CareerTrack } from "@/engine/types";

export const politicsTrack: CareerTrack = {
  id: "politics",
  label: "Politique",
  description:
    "Filiere politique, accessible depuis n'importe quelle autre trajectoire une fois l'influence suffisante.",
  ranks: [
    {
      id: "militant",
      title: "Militant",
      minTurnsInRank: 0,
      requirements: (state) => state.character.stats.influence >= 30,
    },
    {
      id: "responsable-local",
      title: "Responsable local",
      minTurnsInRank: 1,
      requirements: (state) =>
        state.character.stats.diplomacy >= 45 && state.career.performance >= 45,
    },
    {
      id: "elu",
      title: "Elu",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.reputation >= 55 &&
        state.character.stats.charisma >= 50 &&
        state.career.performance >= 55,
      onPromote: [{ type: "stat", stat: "influence", delta: 10 }],
    },
    {
      id: "ministre",
      title: "Ministre",
      minTurnsInRank: 3,
      requirements: (state) =>
        state.character.stats.influence >= 70 && state.career.performance >= 65,
      onPromote: [
        { type: "stat", stat: "influence", delta: 15 },
        { type: "relationshipSyncPresident" },
      ],
    },
    {
      id: "president",
      title: "President",
      minTurnsInRank: 4,
      requirements: (state) =>
        state.character.stats.influence >= 90 &&
        state.character.stats.reputation >= 75 &&
        state.career.performance >= 75,
      onPromote: [{ type: "stat", stat: "reputation", delta: 20 }],
    },
  ],
};
