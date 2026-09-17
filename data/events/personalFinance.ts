import type { GameEvent } from "@/engine/types";

/**
 * Choix financiers personnels : investissement risque (jamais garanti),
 * opportunites financieres douteuses (accepter/refuser/denoncer, sans
 * jamais decrire de procedure reelle de corruption ou de detournement),
 * et un objectif financier de long terme possible. Complement de
 * engine/finances.ts (revenus/depenses automatiques par carriere).
 */
export const personalFinanceEvents: GameEvent[] = [
  {
    id: "personal-investment-opportunity",
    title: "Une opportunite d'investissement",
    description:
      "Un contact te presente un projet qui pourrait faire fructifier une partie de tes economies, sans aucune garantie de reussite.",
    category: "personal-finance",
    cooldown: 3,
    condition: (state) => state.character.money >= 500,
    choices: [
      {
        id: "invest-cautiously",
        label: "Investir une petite somme, avec prudence",
        effects: [{ type: "resolveInvestment", amount: 300, source: "investissement" }],
      },
      {
        id: "invest-boldly",
        label: "Investir une somme importante",
        requires: (state) => state.character.money >= 1000,
        effects: [{ type: "resolveInvestment", amount: 1000, source: "investissement" }],
      },
      {
        id: "decline-investment",
        label: "Decliner, trop incertain",
        effects: [{ type: "stat", stat: "prudence", delta: 2 }],
      },
    ],
  },
  {
    id: "dubious-financial-opportunity",
    title: "Une proposition financiere ambigue",
    description:
      "Une occasion se presente d'ameliorer significativement ta situation financiere, par un moyen qui ne resisterait pas a un examen approfondi.",
    category: "personal-finance",
    cooldown: 4,
    condition: (state) => state.career.currentTrack !== "crime",
    choices: [
      {
        id: "accept-dubious",
        label: "Accepter",
        effects: [
          { type: "money", delta: 600, source: "douteux" },
          { type: "stat", stat: "greed", delta: 5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -8 }],
        delayedEffects: [
          {
            delay: 5,
            note: "L'origine douteuse de certains de tes revenus finit par etre questionnee.",
            effects: [{ type: "stat", stat: "reputation", delta: -10 }],
          },
        ],
      },
      {
        id: "refuse-dubious",
        label: "Refuser",
        effects: [{ type: "stat", stat: "integrity", delta: 5 }],
      },
      {
        id: "denounce-dubious",
        label: "Denoncer la proposition",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "publicTrust", delta: 4 },
        ],
        hiddenEffects: [{ type: "stat", stat: "influence", delta: -2 }],
      },
    ],
  },
  {
    id: "financial-declare-goal",
    title: "Un objectif financier se dessine",
    description: "Tes finances se stabilisent. Te fixer un veritable objectif patrimonial te traverse l'esprit.",
    category: "personal-finance",
    once: true,
    condition: (state) =>
      state.declaredGoal === null && state.character.money + state.finances.savings >= 3000,
    choices: [
      {
        id: "declare-financial-independence",
        label: "Te fixer comme objectif de devenir financierement independant",
        effects: [
          { type: "declareGoal", label: "Devenir financierement independant." },
          { type: "ambition", key: "richesse", delta: 8 },
          { type: "ambition", key: "independance", delta: 5 },
        ],
      },
      {
        id: "decline-financial-goal",
        label: "Ne pas te fixer d'objectif financier precis",
        effects: [],
      },
    ],
  },
];
