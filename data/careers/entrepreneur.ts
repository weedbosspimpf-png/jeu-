import type { CareerTrack } from "@/engine/types";

export const entrepreneurTrack: CareerTrack = {
  id: "entrepreneur",
  label: "Entrepreneuriat",
  description: "Filiere economique : de l'activite independante a la reussite influente.",
  ranks: [
    { id: "independant", title: "Independant", minTurnsInRank: 0, requirements: () => true },
    {
      id: "chef-entreprise",
      title: "Chef d'entreprise",
      minTurnsInRank: 1,
      requirements: (state) => state.character.money >= 3000 && state.career.performance >= 45,
    },
    {
      id: "dirigeant",
      title: "Dirigeant influent",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.money >= 15000 &&
        state.character.stats.reputation >= 55 &&
        state.career.performance >= 60,
      onPromote: [{ type: "stat", stat: "influence", delta: 15 }],
    },
  ],
};
