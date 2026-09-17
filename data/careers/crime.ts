import type { CareerTrack } from "@/engine/types";

export const crimeTrack: CareerTrack = {
  id: "crime",
  label: "Reseau (fictif)",
  description:
    "Trajectoire criminelle entierement fictive et abstraite, traitee comme mecanique narrative uniquement.",
  careerGoal: "Construire un reseau criminel fictif et devenir une figure influente du milieu.",
  focusAmbitions: ["richesse", "influence", "reputation", "independance"],
  ranks: [
    {
      id: "membre",
      title: "Membre du groupe",
      minTurnsInRank: 0,
      requirements: () => true,
      baseSalary: 400,
      responsibilities: {
        objective: "Prouver ta fiabilite aux yeux du groupe.",
        challenges: ["Premieres missions", "Loyaute", "Discretion"],
        risks: ["Arrestation precoce", "Mefiance du groupe"],
        opportunities: ["Acces au statut d'executant"],
      },
    },
    {
      id: "executant",
      title: "Executant",
      minTurnsInRank: 1,
      requirements: (state) => state.character.stats.loyalty >= 35 && state.career.performance >= 40,
      baseSalary: 900,
      responsibilities: {
        objective: "Executer des missions plus sensibles sans te faire remarquer.",
        challenges: ["Missions sensibles", "Rivalites internes", "Discretion accrue"],
        risks: ["Trahison interne", "Attention des autorites"],
        opportunities: ["Acces au grade de lieutenant"],
      },
    },
    {
      id: "lieutenant",
      title: "Lieutenant",
      minTurnsInRank: 1,
      requirements: (state) =>
        state.character.stats.courage >= 45 &&
        state.character.stats.intelligence >= 40 &&
        state.career.performance >= 50,
      onPromote: [{ type: "stat", stat: "reputation", delta: -5 }],
      baseSalary: 1800,
      responsibilities: {
        objective: "Encadrer une petite equipe et gerer les rivalites de territoire.",
        challenges: ["Gestion d'equipe restreinte", "Rivalites de territoire", "Loyaute des subordonnes"],
        risks: ["Trahison", "Guerre de territoire"],
        opportunities: ["Acces a un secteur", "Reseau elargi"],
      },
    },
    {
      id: "chef-secteur",
      title: "Chef de secteur",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.leadership >= 55 &&
        state.character.stats.diplomacy >= 45 &&
        state.career.performance >= 55,
      onPromote: [{ type: "stat", stat: "influence", delta: 8 }],
      baseSalary: 3500,
      responsibilities: {
        objective: "Diriger un secteur entier et negocier avec les autres factions.",
        challenges: ["Gestion de secteur", "Negociations inter-factions", "Blanchiment eventuel"],
        risks: ["Guerre ouverte", "Enquete judiciaire"],
        opportunities: ["Acces au reseau complet", "Vitrine legale"],
      },
    },
    {
      id: "chef-reseau",
      title: "Chef de reseau",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.leadership >= 65 &&
        state.character.stats.courage >= 55 &&
        state.career.performance >= 65,
      onPromote: [{ type: "stat", stat: "influence", delta: 15 }],
      baseSalary: 6000,
      responsibilities: {
        objective: "Diriger l'ensemble du reseau et gerer ses connexions politiques.",
        challenges: ["Direction du reseau", "Connexions politiques", "Trahisons possibles"],
        risks: ["Enquete d'envergure", "Trahison d'un lieutenant"],
        opportunities: ["Influence politique", "Sortie progressive vers la legalite"],
      },
    },
    {
      id: "figure-influente",
      title: "Figure criminelle influente",
      minTurnsInRank: 3,
      requirements: (state) =>
        state.character.stats.influence >= 70 &&
        state.character.stats.reputation >= 30 &&
        state.career.performance >= 70,
      onPromote: [{ type: "stat", stat: "influence", delta: 15 }],
      baseSalary: 10000,
      responsibilities: {
        objective: "Peser sur le contexte du pays depuis l'ombre, ou preparer ta sortie.",
        challenges: ["Influence occulte", "Connexions politiques de haut niveau", "Heritage a transmettre"],
        risks: ["Chute spectaculaire", "Cible d'une enquete nationale"],
        opportunities: ["Reconversion legale definitive", "Influence politique durable"],
      },
    },
  ],
};
