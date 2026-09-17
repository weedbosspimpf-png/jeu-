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
      responsibilities: {
        objective: "Reussir ta formation et tes premieres missions territoriales.",
        challenges: ["Formation", "Discipline", "Premieres missions territoriales"],
        risks: ["Echec de formation"],
        opportunities: ["Titularisation comme gendarme"],
      },
    },
    {
      id: "gendarme",
      title: "Gendarme",
      minTurnsInRank: 1,
      requirements: (state) => state.character.stats.discipline >= 45 && state.career.performance >= 40,
      baseSalary: 1500,
      responsibilities: {
        objective: "Assurer la securite territoriale et construire tes relations locales.",
        challenges: ["Maintien de l'ordre local", "Enquetes de terrain", "Relations avec les notables locaux"],
        risks: ["Corruption aux barrages", "Conflit avec un notable"],
        opportunities: ["Acces au grade d'officier", "Reconnaissance locale"],
      },
    },
    {
      id: "officier-gendarmerie",
      title: "Officier",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.leadership >= 60 && state.career.performance >= 60,
      onPromote: [{ type: "stat", stat: "reputation", delta: 10 }],
      baseSalary: 2800,
      responsibilities: {
        objective: "Encadrer une brigade et arbitrer entre autorite militaire et proximite locale.",
        challenges: ["Encadrement de brigade", "Relations avec l'armee", "Relations avec les autorites locales"],
        risks: ["Conflit d'autorite avec l'armee", "Perte de confiance locale"],
        opportunities: ["Acces au commandement", "Reseau d'influence regional"],
      },
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
      responsibilities: {
        objective: "Definir les pratiques de la gendarmerie a l'echelle regionale.",
        challenges: ["Reforme des pratiques", "Relations institutionnelles", "Coordination avec l'armee", "Crises regionales"],
        risks: ["Scandale regional", "Rupture avec le haut commandement militaire"],
        opportunities: ["Influence nationale", "Entree en politique"],
      },
    },
  ],
};
