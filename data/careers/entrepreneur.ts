import type { CareerTrack } from "@/engine/types";

export const entrepreneurTrack: CareerTrack = {
  id: "entrepreneur",
  label: "Entrepreneuriat",
  description: "Filiere economique : de l'activite independante a la reussite influente.",
  careerGoal: "Construire une entreprise majeure ou un groupe economique.",
  focusAmbitions: ["richesse", "prestige", "influence", "politique"],
  ranks: [
    {
      id: "independant",
      title: "Independant",
      minTurnsInRank: 0,
      requirements: () => true,
      baseSalary: 500,
      responsibilities: {
        objective: "Trouver tes premiers clients et survivre financierement.",
        challenges: ["Trouver des clients", "Gerer les depenses", "Survivre"],
        risks: ["Faillite precoce", "Isolement professionnel"],
        opportunities: ["Premiere embauche", "Acces au statut de chef d'entreprise"],
      },
    },
    {
      id: "chef-entreprise",
      title: "Chef d'entreprise",
      minTurnsInRank: 1,
      requirements: (state) => state.character.money >= 3000 && state.career.performance >= 45,
      baseSalary: 3000,
      responsibilities: {
        objective: "Faire grandir une entreprise de taille moyenne face a la concurrence.",
        challenges: ["Recrutement", "Concurrence", "Investissements", "Gestion financiere", "Reputation"],
        risks: ["Faillite", "Sabotage concurrentiel", "Crise sociale interne"],
        opportunities: ["Acces au statut de dirigeant influent", "Lobbying politique naissant"],
      },
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
      responsibilities: {
        objective: "Diriger un grand groupe et peser sur le contexte economique du pays.",
        challenges: ["Conseil d'administration", "Investissements majeurs", "Expansion", "Relations economiques", "Reputation publique"],
        risks: ["Crise economique nationale", "Scandale public", "Perte de controle du groupe"],
        opportunities: ["Influence politique", "Fondation ou action sociale d'envergure"],
      },
    },
  ],
};
