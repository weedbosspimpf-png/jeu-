import type { CareerTrack } from "@/engine/types";

export const gendarmerieTrack: CareerTrack = {
  id: "gendarmerie",
  label: "Gendarmerie",
  description: "Filiere militaire de securite interieure.",
  careerGoal: "Atteindre le haut commandement de la gendarmerie.",
  focusAmbitions: ["securite", "prestige", "influence", "politique"],
  ranks: [
    {
      id: "eleve-gendarme",
      title: "Eleve gendarme",
      minTurnsInRank: 0,
      requirements: () => true,
      baseSalary: 700,
    },
    {
      id: "gendarme",
      title: "Gendarme",
      minTurnsInRank: 1,
      requirements: (state) => state.character.stats.discipline >= 45 && state.career.performance >= 40,
      baseSalary: 1500,
    },
    {
      id: "officier-gendarmerie",
      title: "Officier",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.leadership >= 60 && state.career.performance >= 60,
      onPromote: [{ type: "stat", stat: "reputation", delta: 10 }],
      baseSalary: 2800,
    },
    {
      id: "commandement",
      title: "Commandement",
      minTurnsInRank: 3,
      requirements: (state) =>
        state.character.stats.leadership >= 75 &&
        state.character.stats.influence >= 55 &&
        state.career.performance >= 70,
      onPromote: [{ type: "stat", stat: "influence", delta: 15 }],
      baseSalary: 5000,
    },
  ],
};
