import type { CareerTrack } from "@/engine/types";

export const civilTrack: CareerTrack = {
  id: "civil",
  label: "Vie civile",
  description: "Parcours civil generaliste, tremplin vers n'importe quelle autre filiere.",
  careerGoal: "Construire une vie personnelle et professionnelle reussie.",
  focusAmbitions: ["stabilite", "protectionDesSiens", "richesse"],
  ranks: [
    { id: "etudiant", title: "Etudiant / debutant", minTurnsInRank: 0, requirements: () => true },
    {
      id: "employe",
      title: "Employe qualifie",
      minTurnsInRank: 1,
      requirements: (state) => state.character.stats.intelligence >= 45 && state.career.performance >= 40,
    },
    {
      id: "cadre",
      title: "Cadre",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.leadership >= 50 && state.career.performance >= 55,
      onPromote: [{ type: "stat", stat: "wealth", delta: 10 }],
    },
  ],
};
