import type { CareerTrack } from "@/engine/types";

export const policeTrack: CareerTrack = {
  id: "police",
  label: "Police",
  description: "Filiere policiere : de l'ecole jusqu'aux hautes responsabilites.",
  ranks: [
    { id: "eleve", title: "Eleve agent", minTurnsInRank: 0, requirements: () => true },
    {
      id: "agent",
      title: "Agent de terrain",
      minTurnsInRank: 1,
      requirements: (state) => state.character.stats.discipline >= 45 && state.career.performance >= 40,
    },
    {
      id: "enqueteur",
      title: "Enqueteur",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.intelligence >= 55 && state.career.performance >= 55,
      onPromote: [{ type: "stat", stat: "reputation", delta: 8 }],
    },
    {
      id: "responsable",
      title: "Haut responsable",
      minTurnsInRank: 3,
      requirements: (state) =>
        state.character.stats.leadership >= 65 &&
        state.character.stats.integrity >= 50 &&
        state.career.performance >= 65,
      onPromote: [{ type: "stat", stat: "influence", delta: 15 }],
    },
  ],
};
