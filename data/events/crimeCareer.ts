import type { GameEvent, GameState } from "@/engine/types";

/**
 * Approfondit la trajectoire criminelle fictive au-dela de la chaine de
 * missions initiale (crimeMissions.ts) : rivalites entre groupes, tests
 * de loyaute, trahisons, et connexions vers une sortie legale
 * progressive. Toujours fictif et abstrait : aucune methode
 * operationnelle reelle n'est jamais decrite.
 */

function isCrimeRank(state: GameState, ranks: string[]): boolean {
  return state.career.currentTrack === "crime" && ranks.includes(state.career.currentRankId ?? "");
}

export const crimeCareerEvents: GameEvent[] = [
  {
    id: "crime-loyalty-test",
    title: "Un test de loyaute",
    description:
      "Le chef te demande de surveiller un proche du groupe qu'il suspecte de le trahir, et de lui faire un rapport.",
    category: "crime-career",
    once: true,
    condition: (state) => isCrimeRank(state, ["executant", "lieutenant"]),
    choices: [
      {
        id: "report-friend",
        label: "Faire ton rapport, meme si cela compromet ton ami",
        effects: [
          { type: "stat", stat: "loyalty", delta: 8 },
          { type: "stat", stat: "opportunism", delta: 5 },
          { type: "relationship", npcId: "boss", trust: 20, loyalty: 15 },
        ],
        hiddenEffects: [{ type: "stat", stat: "empathy", delta: -6 }],
      },
      {
        id: "warn-friend",
        label: "Avertir discretement ton ami sans en informer le chef",
        effects: [
          { type: "stat", stat: "empathy", delta: 6 },
          { type: "stat", stat: "loyalty", delta: -6 },
        ],
        hiddenEffects: [{ type: "relationship", npcId: "boss", trust: -10 }],
      },
      {
        id: "fabricate-report",
        label: "Fabriquer un rapport rassurant pour proteger tout le monde",
        effects: [
          { type: "stat", stat: "diplomacy", delta: 5 },
          { type: "stat", stat: "integrity", delta: -5 },
        ],
      },
    ],
  },
  {
    id: "crime-rival-faction",
    title: "Une faction rivale s'installe",
    description:
      "Un groupe rival revendique une part du territoire controle par ton reseau. Le chef attend une reponse.",
    category: "crime-career",
    cooldown: 4,
    condition: (state) => isCrimeRank(state, ["lieutenant", "chef-secteur", "chef-reseau"]),
    choices: [
      {
        id: "negotiate-alliance",
        label: "Chercher un arrangement territorial avec la faction rivale",
        effects: [
          { type: "stat", stat: "diplomacy", delta: 8 },
          { type: "stat", stat: "influence", delta: 4 },
        ],
      },
      {
        id: "pay-tribute",
        label: "Accepter de verser un tribut pour eviter le conflit",
        effects: [
          { type: "money", delta: -300 },
          { type: "stat", stat: "reputation", delta: -3 },
        ],
      },
      {
        id: "confront-rival",
        label: "Repondre fermement pour defendre le territoire",
        effects: [
          { type: "stat", stat: "courage", delta: 8 },
          { type: "stat", stat: "reputation", delta: 5 },
        ],
        hiddenEffects: [{ type: "world", key: "security", delta: -2 }],
        delayedEffects: [
          {
            delay: 2,
            note: "Le conflit territorial attire l'attention des autorites sur le secteur.",
            effects: [{ type: "world", key: "security", delta: -2 }],
          },
        ],
      },
      {
        id: "read-rival-intentions",
        label: "Percer les vraies intentions du rival avant de repondre",
        requires: (state) => state.character.stats.perspicacity >= 60 && state.character.stats.diplomacy >= 55,
        effects: [
          { type: "stat", stat: "perspicacity", delta: 3 },
          { type: "stat", stat: "influence", delta: 6 },
          { type: "money", delta: -100 },
        ],
      },
    ],
  },
  {
    id: "crime-subordinate-betrayal",
    title: "Une trahison venue de tes rangs",
    description:
      "Un subordonne que tu as forme a transmis des informations sensibles a l'exterieur du reseau.",
    category: "crime-career",
    once: true,
    condition: (state) => isCrimeRank(state, ["chef-secteur", "chef-reseau", "figure-influente"]),
    choices: [
      {
        id: "harsh-response",
        label: "Faire un exemple severe pour dissuader toute future trahison",
        effects: [
          { type: "stat", stat: "authority", delta: 8 },
          { type: "stat", stat: "reputation", delta: -5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "empathy", delta: -8 }],
      },
      {
        id: "forgive-subordinate",
        label: "Pardonner et tenter de comprendre ses raisons",
        effects: [
          { type: "stat", stat: "empathy", delta: 8 },
          { type: "stat", stat: "authority", delta: -4 },
        ],
      },
      {
        id: "quiet-exclusion",
        label: "L'ecarter discretement du reseau sans eclat",
        effects: [
          { type: "stat", stat: "diplomacy", delta: 5 },
          { type: "stat", stat: "authority", delta: 3 },
        ],
      },
    ],
  },
  {
    id: "crime-legit-front",
    title: "Une vitrine legale",
    description:
      "L'idee circule de creer une activite commerciale legale pour blanchir une partie des revenus du reseau, ou pour preparer une sortie progressive.",
    category: "crime-career",
    once: true,
    condition: (state) => isCrimeRank(state, ["chef-secteur", "chef-reseau", "figure-influente"]),
    choices: [
      {
        id: "launder-quietly",
        label: "Utiliser la vitrine pour blanchir discretement les revenus",
        effects: [
          { type: "stat", stat: "wealth", delta: 8 },
          { type: "stat", stat: "greed", delta: 6 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -8 }],
        delayedEffects: [
          {
            delay: 5,
            note: "Un controle financier s'interesse a l'activite qui te servait de vitrine.",
            effects: [
              { type: "stat", stat: "reputation", delta: -12 },
              { type: "money", delta: -400 },
            ],
          },
        ],
      },
      {
        id: "genuine-transition",
        label: "En faire une vraie activite independante, comme premiere etape de sortie",
        effects: [
          { type: "joinCareer", track: "entrepreneur", rankId: "independant" },
          { type: "stat", stat: "ambition", delta: 6 },
          { type: "stat", stat: "integrity", delta: 6 },
          { type: "flag", flag: "former-criminal-entrepreneur", value: true },
        ],
      },
      {
        id: "decline-front",
        label: "Refuser l'idee, trop risque pour le reseau",
        effects: [{ type: "stat", stat: "discipline", delta: 3 }],
      },
    ],
  },
  {
    id: "crime-political-connection",
    title: "Une sollicitation politique",
    description:
      "Un responsable politique local sollicite discretement le soutien financier et logistique de ton reseau pour sa campagne.",
    category: "crime-career",
    once: true,
    condition: (state) => isCrimeRank(state, ["chef-reseau", "figure-influente"]),
    choices: [
      {
        id: "back-politician",
        label: "Soutenir ce responsable en echange d'une protection future",
        effects: [
          { type: "money", delta: -500 },
          { type: "stat", stat: "influence", delta: 12 },
          { type: "stat", stat: "opportunism", delta: 6 },
        ],
        hiddenEffects: [{ type: "world", key: "corruption", delta: 2 }],
        delayedEffects: [
          {
            delay: 4,
            note: "Ce lien avec un responsable politique refait surface dans une enquete plus large.",
            effects: [{ type: "stat", stat: "reputation", delta: -10 }],
          },
        ],
      },
      {
        id: "decline-politician",
        label: "Refuser de meler le reseau a la politique",
        effects: [{ type: "stat", stat: "integrity", delta: 4 }],
      },
      {
        id: "leverage-for-legitimacy",
        label: "Poser tes propres conditions, en vue d'une reconversion legale future",
        effects: [
          { type: "stat", stat: "influence", delta: 8 },
          { type: "stat", stat: "diplomacy", delta: 5 },
        ],
      },
    ],
  },
];
