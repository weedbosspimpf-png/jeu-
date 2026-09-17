import type { CareerTrack } from "@/engine/types";

export const policeTrack: CareerTrack = {
  id: "police",
  label: "Police",
  description: "Filiere policiere : de l'ecole jusqu'aux hautes responsabilites.",
  careerGoal: "Atteindre le commandement ou la direction du service.",
  focusAmbitions: ["justice", "reputation", "richesse", "influence", "politique"],
  ranks: [
    {
      id: "eleve",
      title: "Eleve agent",
      minTurnsInRank: 0,
      requirements: () => true,
      baseSalary: 700,
      responsibilities: {
        objective: "Reussir ta formation et tes premieres interventions.",
        challenges: ["Formation", "Discipline", "Premieres interventions"],
        risks: ["Echec de formation"],
        opportunities: ["Titularisation comme agent de terrain"],
      },
    },
    {
      id: "agent",
      title: "Agent de terrain",
      minTurnsInRank: 1,
      requirements: (state) => state.character.stats.discipline >= 45 && state.career.performance >= 40,
      baseSalary: 1500,
      responsibilities: {
        objective: "Construire une reputation solide sur le terrain.",
        challenges: ["Enquetes de terrain", "Affaires en cours", "Collegues", "Reputation naissante"],
        risks: ["Collegue corrompu", "Controle routier douteux", "Perte de confiance publique"],
        opportunities: ["Acces au statut d'enqueteur", "Reperage par un informateur utile"],
      },
    },
    {
      id: "enqueteur",
      title: "Enqueteur",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.intelligence >= 55 && state.career.performance >= 55,
      onPromote: [{ type: "stat", stat: "reputation", delta: 8 }],
      baseSalary: 2800,
      responsibilities: {
        objective: "Gerer une petite equipe d'enquete tout en assumant tes propres objectifs.",
        challenges: ["Gestion d'une equipe restreinte", "Objectifs d'enquete", "Conflits internes", "Responsabilite disciplinaire"],
        risks: ["Enquete politiquement sensible", "Pression hierarchique"],
        opportunities: ["Acces a la direction", "Reconnaissance publique"],
      },
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
      baseSalary: 5000,
      responsibilities: {
        objective: "Definir la politique de securite du service et gerer son image publique.",
        challenges: ["Allocation des ressources", "Politique de securite", "Relations avec le gouvernement", "Opinion publique", "Crises"],
        risks: ["Crise de confiance publique", "Scandale institutionnel"],
        opportunities: ["Reforme durable du service", "Entree en politique"],
      },
    },
  ],
};
