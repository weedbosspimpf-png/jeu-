import type { CareerTrack } from "@/engine/types";

export const civilTrack: CareerTrack = {
  id: "civil",
  label: "Vie civile",
  description: "Parcours civil generaliste, tremplin vers n'importe quelle autre filiere.",
  careerGoal: "Construire une vie personnelle et professionnelle reussie.",
  focusAmbitions: ["stabilite", "protectionDesSiens", "richesse"],
  ranks: [
    {
      id: "etudiant",
      title: "Etudiant / debutant",
      minTurnsInRank: 0,
      requirements: () => true,
      baseSalary: 300,
      responsibilities: {
        objective: "Choisir une premiere orientation et t'y engager.",
        challenges: ["Etudes ou premier emploi", "Decouverte de tes propres priorites"],
        risks: ["Precarite", "Absence de direction claire"],
        opportunities: ["Toutes les trajectoires restent ouvertes"],
      },
    },
    {
      id: "employe",
      title: "Employe qualifie",
      minTurnsInRank: 1,
      requirements: (state) => state.character.stats.intelligence >= 45 && state.career.performance >= 40,
      baseSalary: 1200,
      responsibilities: {
        objective: "Stabiliser ta situation professionnelle et personnelle.",
        challenges: ["Stabilite financiere", "Vie de famille", "Engagement associatif eventuel"],
        risks: ["Coup dur economique", "Stagnation professionnelle"],
        opportunities: ["Acces au statut de cadre", "Bifurcation vers une autre filiere"],
      },
    },
    {
      id: "cadre",
      title: "Cadre",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.leadership >= 50 && state.career.performance >= 55,
      onPromote: [{ type: "stat", stat: "wealth", delta: 10 }],
      baseSalary: 3000,
      responsibilities: {
        objective: "Construire une vie confortable et une reputation locale.",
        challenges: ["Responsabilites professionnelles accrues", "Reseau social", "Vie de famille"],
        risks: ["Deception professionnelle durable"],
        opportunities: ["Carrefour de vie vers armee/police/entrepreneuriat/politique"],
      },
    },
  ],
};
