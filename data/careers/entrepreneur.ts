import type { CareerTrack } from "@/engine/types";

export const entrepreneurTrack: CareerTrack = {
  id: "entrepreneur",
  label: "Entrepreneuriat",
  description: "Filiere economique : de l'activite independante a la reussite influente.",
  careerGoal: "Construire une entreprise majeure ou un groupe economique.",
  focusAmbitions: ["richesse", "prestige", "influence", "politique"],
  ranks: [
    { id: "independant", title: "Independant", minTurnsInRank: 0, requirements: () => true, baseSalary: 500 },
    {
      id: "chef-entreprise",
      title: "Chef d'entreprise",
      minTurnsInRank: 1,
      requirements: (state) => state.character.money >= 3000 && state.career.performance >= 45,
      baseSalary: 3000,
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
      baseSalary: 9000,
    },
  ],
};
