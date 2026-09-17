import type { CareerTrack } from "@/engine/types";

export const politicsTrack: CareerTrack = {
  id: "politics",
  label: "Politique",
  description:
    "Filiere politique, accessible depuis n'importe quelle autre trajectoire une fois l'influence suffisante.",
  careerGoal: "Atteindre les plus hautes fonctions politiques.",
  focusAmbitions: ["politique", "influence", "reforme", "institutions"],
  ranks: [
    {
      id: "militant",
      title: "Militant",
      minTurnsInRank: 0,
      requirements: (state) => state.character.stats.influence >= 30,
      baseSalary: 200,
      responsibilities: {
        objective: "Construire ton reseau et convaincre.",
        challenges: ["Construire ton reseau", "Convaincre", "Developper ta reputation"],
        risks: ["Anonymat persistant", "Mauvaise premiere impression"],
        opportunities: ["Acces a un mandat local"],
      },
    },
    {
      id: "responsable-local",
      title: "Responsable local",
      minTurnsInRank: 1,
      requirements: (state) =>
        state.character.stats.diplomacy >= 45 && state.career.performance >= 45,
      baseSalary: 1000,
      responsibilities: {
        objective: "Gerer des soutiens locaux et resoudre des problemes concrets.",
        challenges: ["Gerer des soutiens", "Problemes locaux", "Construction de la popularite"],
        risks: ["Desaveu local", "Conflit avec un soutien cle"],
        opportunities: ["Acces a un mandat national"],
      },
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
      baseSalary: 3000,
      responsibilities: {
        objective: "Peser sur les debats nationaux depuis ton mandat.",
        challenges: ["Alliances", "Opposition", "Propositions politiques", "Relations avec le gouvernement"],
        risks: ["Isolement politique", "Alliance ratee"],
        opportunities: ["Acces a un ministere", "Reconnaissance nationale"],
      },
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
      baseSalary: 6000,
      responsibilities: {
        objective: "Gerer ton ministere fictif et ta relation avec le president.",
        challenges: ["Gestion d'un ministere", "Budget", "Resultats attendus", "Crises", "Relation avec le president", "Popularite"],
        risks: ["Crise sectorielle", "Perte de confiance du president", "Scandale"],
        opportunities: ["Candidature presidentielle", "Heritage politique durable"],
      },
    },
    {
      id: "candidat",
      title: "Candidat a la presidence",
      minTurnsInRank: 1,
      requirements: (state) =>
        state.character.stats.influence >= 80 && state.character.stats.reputation >= 60,
      baseSalary: 1000,
      responsibilities: {
        objective: "Mener une campagne presidentielle credible.",
        challenges: ["Campagne", "Popularite regionale", "Ressources", "Alliances", "Debats", "Evenements nationaux"],
        risks: ["Defaite electorale", "Scandale de campagne"],
        opportunities: ["Acces a la presidence"],
      },
    },
    {
      id: "president",
      title: "President",
      minTurnsInRank: 1,
      // La presidence ne s'obtient jamais par simple seuil de stats : elle
      // passe toujours par une des voies simulees dans
      // data/events/powerAccession.ts (electorale, transition de crise,
      // coup), qui posent ce flag via l'effet becomePresident.
      requirements: (state) => state.flags["became-president"] === true,
      baseSalary: 15000,
      responsibilities: {
        objective: "Gouverner le pays et maintenir ta legitimite.",
        challenges: ["Economie", "Securite", "Institutions", "Population", "Politique", "Diplomatie"],
        risks: ["Perte de popularite", "Crise economique", "Crise politique", "Perte de legitimite"],
        opportunities: ["Reformes", "Developpement du pays", "Reelection", "Succession politique reussie"],
      },
    },
  ],
};
