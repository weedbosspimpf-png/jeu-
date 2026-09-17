import type { GameEvent, GameState } from "@/engine/types";

/**
 * Boucle de carriere entrepreneuriale : embauche, concurrence, contrats,
 * risque de faillite et lobbying politique. Complement de
 * "business-growth" (career.ts), qui reste le dilemme generique
 * reinvestir/empocher.
 */

function isEntrepreneurRank(state: GameState, ranks: string[]): boolean {
  return state.career.currentTrack === "entrepreneur" && ranks.includes(state.career.currentRankId ?? "");
}

export const entrepreneurCareerEvents: GameEvent[] = [
  {
    id: "entrepreneur-first-hire",
    title: "Ta premiere embauche",
    description: "Ton activite grandit assez pour envisager d'embaucher une premiere personne.",
    category: "entrepreneur-career",
    once: true,
    condition: (state) => isEntrepreneurRank(state, ["independant", "chef-entreprise"]),
    choices: [
      {
        id: "hire-formal",
        label: "Embaucher dans les regles, avec un contrat en bonne et due forme",
        effects: [
          { type: "money", delta: -200 },
          { type: "stat", stat: "reputation", delta: 4 },
          { type: "careerPerformance", delta: 4 },
          {
            type: "relationshipInit",
            npcId: "employe",
            name: "Adjoua",
            role: "Premiere employee",
          },
        ],
      },
      {
        id: "hire-informal",
        label: "Embaucher de maniere informelle, moins cher",
        effects: [
          { type: "money", delta: -50 },
          { type: "stat", stat: "greed", delta: 4 },
          { type: "stat", stat: "opportunism", delta: 4 },
          {
            type: "relationshipInit",
            npcId: "employe",
            name: "Adjoua",
            role: "Premiere employee",
          },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -3 }],
      },
      {
        id: "stay-solo",
        label: "Rester seul pour l'instant",
        effects: [{ type: "stat", stat: "discipline", delta: 2 }],
      },
    ],
  },
  {
    id: "entrepreneur-corrupt-contract",
    title: "Un contrat public a decrocher",
    description:
      "Un fonctionnaire laisse entendre qu'un geste financier faciliterait l'attribution d'un contrat public a ton entreprise.",
    category: "entrepreneur-career",
    once: true,
    condition: (state) => isEntrepreneurRank(state, ["chef-entreprise", "dirigeant"]),
    choices: [
      {
        id: "pay-bribe",
        label: "Verser le pot-de-vin demande",
        effects: [
          { type: "money", delta: 1500 },
          { type: "stat", stat: "greed", delta: 8 },
          { type: "stat", stat: "opportunism", delta: 6 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -10 }],
        delayedEffects: [
          {
            delay: 4,
            note: "Un audit des marches publics remonte jusqu'a ton entreprise.",
            effects: [
              { type: "stat", stat: "reputation", delta: -15 },
              { type: "money", delta: -800 },
            ],
          },
        ],
      },
      {
        id: "refuse-bribe",
        label: "Refuser et concourir sur le seul merite du dossier",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "reputation", delta: 3 },
        ],
      },
      {
        id: "report-official",
        label: "Denoncer la demande de pot-de-vin",
        effects: [
          { type: "stat", stat: "integrity", delta: 10 },
          { type: "stat", stat: "publicTrust", delta: 6 },
        ],
        hiddenEffects: [{ type: "world", key: "corruption", delta: -1 }],
      },
    ],
  },
  {
    id: "entrepreneur-competitor-pressure",
    title: "La concurrence se durcit",
    description:
      "Un concurrent direct casse ses prix et fait circuler des rumeurs sur la qualite de tes produits.",
    category: "entrepreneur-career",
    cooldown: 4,
    condition: (state) => isEntrepreneurRank(state, ["chef-entreprise", "dirigeant"]),
    choices: [
      {
        id: "fair-competition",
        label: "Ameliorer honnetement ton offre pour reprendre l'avantage",
        effects: [
          { type: "money", delta: -300 },
          { type: "stat", stat: "reputation", delta: 6 },
          { type: "careerPerformance", delta: 5 },
        ],
      },
      {
        id: "cartel-arrangement",
        label: "Proposer discretement un arrangement de prix au concurrent",
        effects: [
          { type: "stat", stat: "wealth", delta: 6 },
          { type: "stat", stat: "greed", delta: 6 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -6 }],
        delayedEffects: [
          {
            delay: 3,
            note: "Une enquete sur des pratiques anticoncurrentielles vise ton secteur.",
            effects: [{ type: "stat", stat: "reputation", delta: -10 }],
          },
        ],
      },
      {
        id: "public-counter",
        label: "Repondre publiquement pour defendre ta reputation",
        effects: [
          { type: "stat", stat: "charisma", delta: 5 },
          { type: "stat", stat: "popularity", delta: 4 },
        ],
      },
    ],
  },
  {
    id: "entrepreneur-employee-crisis",
    title: "Des employes en difficulte",
    description:
      "La conjoncture economique pese sur ton entreprise. Tes employes s'inquietent pour leur emploi.",
    category: "entrepreneur-career",
    cooldown: 4,
    condition: (state) =>
      isEntrepreneurRank(state, ["chef-entreprise", "dirigeant"]) && state.world.values.economy < 45,
    choices: [
      {
        id: "support-employees",
        label: "Maintenir les emplois malgre le cout",
        effects: [
          { type: "money", delta: -500 },
          { type: "stat", stat: "empathy", delta: 8 },
          { type: "stat", stat: "reputation", delta: 5 },
        ],
      },
      {
        id: "layoffs",
        label: "Reduire les effectifs pour proteger la tresorerie",
        effects: [
          { type: "money", delta: 400 },
          { type: "stat", stat: "wealth", delta: 4 },
          { type: "stat", stat: "reputation", delta: -6 },
        ],
      },
      {
        id: "negotiate-reduced-hours",
        label: "Negocier une reduction temporaire du temps de travail",
        effects: [
          { type: "stat", stat: "diplomacy", delta: 5 },
          { type: "stat", stat: "empathy", delta: 3 },
        ],
      },
    ],
  },
  {
    id: "entrepreneur-bankruptcy-risk",
    title: "Le risque de faillite",
    description: "Ta tresorerie est au plus bas. Il faut trouver une solution rapidement.",
    category: "entrepreneur-career",
    cooldown: 5,
    condition: (state) => state.career.currentTrack === "entrepreneur" && state.character.money < 300,
    choices: [
      {
        id: "seek-loan",
        label: "Contracter un emprunt risque",
        effects: [{ type: "money", delta: 1000 }],
        hiddenEffects: [{ type: "stat", stat: "wealth", delta: -3 }],
        delayedEffects: [
          {
            delay: 2,
            note: "Les echeances de remboursement pesent lourdement sur ta tresorerie.",
            effects: [{ type: "money", delta: -600 }],
          },
        ],
      },
      {
        id: "bring-investor",
        label: "Faire entrer un investisseur, au prix d'une partie de ton independance",
        effects: [
          { type: "money", delta: 1500 },
          { type: "stat", stat: "influence", delta: -5 },
          { type: "stat", stat: "ambition", delta: -3 },
        ],
      },
      {
        id: "declare-bankruptcy",
        label: "Deposer le bilan",
        effects: [
          { type: "flag", flag: "entrepreneur-bankruptcy", value: true },
          { type: "stat", stat: "reputation", delta: -10 },
          { type: "joinCareer", track: "civil", rankId: "employe" },
        ],
      },
    ],
  },
  {
    id: "entrepreneur-political-lobbying",
    title: "Faire entendre ta voix auprès du pouvoir",
    description:
      "Ton influence economique te permet desormais de peser sur des decisions publiques qui concernent ton secteur.",
    category: "entrepreneur-career",
    once: true,
    condition: (state) => isEntrepreneurRank(state, ["dirigeant"]) && state.character.stats.influence >= 40,
    choices: [
      {
        id: "lobby-openly",
        label: "Faire du lobbying ouvert pour ton secteur",
        effects: [
          { type: "stat", stat: "influence", delta: 8 },
          { type: "stat", stat: "reputation", delta: 3 },
        ],
      },
      {
        id: "lobby-discreet",
        label: "Privilegier des arrangements discrets avec des responsables cles",
        effects: [
          { type: "stat", stat: "influence", delta: 10 },
          { type: "stat", stat: "opportunism", delta: 6 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -5 }],
      },
      {
        id: "join-politics-track",
        label: "Utiliser cette influence pour entrer directement en politique",
        effects: [{ type: "joinCareer", track: "politics", rankId: "militant" }],
      },
    ],
  },
];
