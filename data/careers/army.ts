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
      baseSalary: 800,
      responsibilities: {
        objective: "Reussir ta formation et t'integrer a ton unite.",
        challenges: ["Formation", "Discipline", "Performances", "Relations avec tes camarades", "Respect des ordres"],
        risks: ["Echec de formation", "Isolement dans l'unite"],
        opportunities: ["Premiere affectation", "Reperage par un instructeur"],
      },
    },
    {
      id: "caporal",
      title: "Caporal",
      minTurnsInRank: 1,
      requirements: (state) =>
        state.character.stats.discipline >= 45 && state.career.performance >= 40,
      baseSalary: 1200,
      responsibilities: {
        objective: "Confirmer ta valeur sur le terrain avant de commander.",
        challenges: ["Premieres affectations", "Confiance des gradés", "Camaraderie"],
        risks: ["Stagnation", "Mauvaise reputation naissante"],
        opportunities: ["Acces au grade d'officier", "Unite d'elite"],
      },
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
      baseSalary: 2500,
      responsibilities: {
        objective: "Commander tes hommes tout en conservant la confiance de ta hierarchie.",
        challenges: ["Gerer tes hommes", "Gerer tes superieurs", "Performances de ton unite", "Conflits internes"],
        risks: ["Perte de confiance de la hierarchie", "Mutinerie larvee", "Sanction disciplinaire"],
        opportunities: ["Reputation grandissante", "Reperage pour le commandement"],
      },
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
      baseSalary: 4500,
      responsibilities: {
        objective: "Faire fonctionner ton unite dans la duree, sans perdre ta reputation.",
        challenges: ["Cohesion de l'unite", "Confiance hierarchique", "Reputation naissante", "Reseau de contacts"],
        risks: ["Corruption ambiante", "Reseaux criminels aux abords"],
        opportunities: ["Acces au commandement de plusieurs unites", "Premiers reseaux d'influence"],
      },
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
      baseSalary: 7000,
      responsibilities: {
        objective: "Administrer plusieurs unites et te positionner face aux autres officiers superieurs.",
        challenges: ["Plusieurs unites", "Ressources", "Rivalites entre officiers", "Relations avec le haut commandement", "Pression politique"],
        risks: ["Conflit institutionnel", "Rivalite destructrice", "Reputation nationale ternie"],
        opportunities: ["Acces au grade de general", "Alliances avec d'autres officiers superieurs"],
      },
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
      baseSalary: 12000,
      responsibilities: {
        objective: "Maintenir une carriere solide au sommet de l'institution militaire.",
        challenges: [
          "Strategie globale",
          "Relations avec les autres generaux",
          "Relation avec le president",
          "Cohesion des forces",
          "Budget",
          "Loyaute institutionnelle",
        ],
        risks: ["Sanction", "Perte de confiance", "Conflit institutionnel", "Crise nationale"],
        opportunities: ["Promotion symbolique", "Influence", "Politique", "Retraite/reconversion"],
      },
    },
  ],
};
