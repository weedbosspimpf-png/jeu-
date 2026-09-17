import type { GameEvent, GameState } from "@/engine/types";

/**
 * Boucle de carriere politique : militantisme, campagnes, corruption,
 * crises institutionnelles et relation avec le president en place. Le
 * contexte du pays (regime, personnalite du president) influence
 * directement les choix proposes.
 */

function isPoliticsRank(state: GameState, ranks: string[]): boolean {
  return state.career.currentTrack === "politics" && ranks.includes(state.career.currentRankId ?? "");
}

export const politicsCareerEvents: GameEvent[] = [
  {
    id: "politics-first-alliance",
    title: "Choisir une aile du parti",
    description:
      "Le parti que tu rejoins est traverse par plusieurs courants. Il te faut choisir tes premieres alliances internes.",
    category: "politics-career",
    once: true,
    condition: (state) => isPoliticsRank(state, ["militant"]),
    choices: [
      {
        id: "idealist-wing",
        label: "Rejoindre l'aile la plus fidele aux idees d'origine du parti",
        effects: [
          { type: "stat", stat: "integrity", delta: 6 },
          { type: "stat", stat: "reputation", delta: 3 },
        ],
      },
      {
        id: "pragmatic-wing",
        label: "Rejoindre l'aile la plus proche des reseaux d'influence existants",
        effects: [
          { type: "stat", stat: "opportunism", delta: 6 },
          { type: "stat", stat: "influence", delta: 4 },
        ],
      },
      {
        id: "independent-line",
        label: "Rester volontairement en dehors des courants internes",
        effects: [{ type: "stat", stat: "ambition", delta: 3 }],
      },
    ],
  },
  {
    id: "politics-campaign-financing",
    title: "Financer la campagne",
    description:
      "Une campagne electorale coute cher. Des soutiens prives te proposent un financement genereux, en echange de faveurs futures.",
    category: "politics-career",
    cooldown: 4,
    condition: (state) => isPoliticsRank(state, ["responsable-local", "elu"]),
    choices: [
      {
        id: "self-fund",
        label: "Financer ta campagne avec des moyens honnetes et limites",
        effects: [
          { type: "money", delta: -400 },
          { type: "stat", stat: "integrity", delta: 6 },
          { type: "careerPerformance", delta: 3 },
        ],
      },
      {
        id: "private-funding",
        label: "Accepter le financement prive propose",
        effects: [
          { type: "money", delta: 800 },
          { type: "stat", stat: "opportunism", delta: 6 },
          { type: "stat", stat: "greed", delta: 5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -6 }],
        delayedEffects: [
          {
            delay: 4,
            note: "Un journaliste retrouve la trace de ce financement prive et l'expose publiquement.",
            effects: [{ type: "stat", stat: "reputation", delta: -12 }],
          },
        ],
      },
      {
        id: "populist-campaign",
        label: "Miser sur une campagne populiste, au discours simplifie",
        effects: [
          { type: "stat", stat: "popularity", delta: 10 },
          { type: "stat", stat: "publicTrust", delta: -4 },
        ],
      },
    ],
  },
  {
    id: "politics-corruption-temptation",
    title: "Une enveloppe discrete",
    description:
      "Un lobby influent te propose une enveloppe en echange d'un vote favorable a l'un de ses projets.",
    category: "politics-career",
    once: true,
    condition: (state) => isPoliticsRank(state, ["elu", "ministre"]),
    choices: [
      {
        id: "accept-envelope",
        label: "Accepter l'enveloppe",
        effects: [
          { type: "money", delta: 1200 },
          { type: "stat", stat: "greed", delta: 8 },
          { type: "stat", stat: "opportunism", delta: 6 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -12 }],
        delayedEffects: [
          {
            delay: 5,
            note: "Une commission d'enquete parlementaire remonte jusqu'a ce vote favorable.",
            effects: [
              { type: "stat", stat: "reputation", delta: -20 },
              { type: "careerPerformance", delta: -15 },
            ],
          },
        ],
      },
      {
        id: "refuse-envelope",
        label: "Refuser",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "reputation", delta: 3 },
        ],
      },
      {
        id: "expose-lobby",
        label: "Rendre publique la tentative de corruption",
        effects: [
          { type: "stat", stat: "integrity", delta: 12 },
          { type: "stat", stat: "publicTrust", delta: 10 },
          { type: "stat", stat: "popularity", delta: 6 },
        ],
        hiddenEffects: [{ type: "world", key: "corruption", delta: -1 }],
      },
    ],
  },
  {
    id: "politics-loyalty-to-president",
    title: "Loyaute au president",
    description:
      "Le president attend de ses ministres une loyaute sans faille, y compris sur des decisions contestees.",
    category: "politics-career",
    cooldown: 4,
    condition: (state) => isPoliticsRank(state, ["ministre"]),
    choices: [
      {
        id: "stay-loyal",
        label: "Rester loyal au president",
        effects: [
          { type: "relationship", npcId: "president", trust: 15, loyalty: 15 },
          { type: "stat", stat: "loyalty", delta: 6 },
        ],
      },
      {
        id: "voice-disagreement",
        label: "Exprimer publiquement ton desaccord",
        effects: [
          { type: "stat", stat: "integrity", delta: 6 },
          { type: "stat", stat: "publicTrust", delta: 5 },
          { type: "relationship", npcId: "president", trust: -15, loyalty: -10 },
        ],
      },
      {
        id: "join-opposition",
        label: "Rejoindre discretement les rangs de l'opposition",
        effects: [
          { type: "stat", stat: "courage", delta: 6 },
          { type: "relationship", npcId: "president", trust: -25, loyalty: -20 },
          { type: "relationshipStatus", npcId: "president", status: "rival" },
          { type: "flag", flag: "minister-joined-opposition", value: true },
        ],
      },
    ],
  },
  {
    id: "politics-institutional-crisis",
    title: "Crise institutionnelle",
    description:
      "Le pays traverse une crise institutionnelle majeure. Le pouvoir en place vacille, et ta position te force a choisir un camp, ou aucun.",
    category: "politics-career",
    cooldown: 5,
    condition: (state) =>
      isPoliticsRank(state, ["ministre", "president"]) &&
      (state.world.regime === "unstable" || state.world.values.stability < 40),
    choices: [
      {
        id: "back-institutions",
        label: "Defendre le cadre institutionnel existant",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "authority", delta: 5 },
          { type: "world", key: "stability", delta: 5 },
        ],
      },
      {
        id: "seize-opportunity",
        label: "Profiter de la crise pour renforcer ta propre position",
        effects: [
          { type: "stat", stat: "opportunism", delta: 10 },
          { type: "stat", stat: "authority", delta: 6 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -10 }],
      },
      {
        id: "stay-neutral",
        label: "Rester prudemment neutre en attendant l'issue de la crise",
        effects: [{ type: "stat", stat: "diplomacy", delta: 4 }],
      },
      {
        id: "resign",
        label: "Demissionner plutot que de cautionner la suite des evenements",
        effects: [
          { type: "stat", stat: "integrity", delta: 10 },
          { type: "stat", stat: "publicTrust", delta: 8 },
          { type: "joinCareer", track: "civil", rankId: "cadre" },
        ],
      },
    ],
  },
  {
    id: "politics-approach-to-power",
    title: "Ton style de pouvoir",
    description:
      "A l'approche de la magistrature supreme, la maniere dont tu envisages d'exercer le pouvoir commence deja a se dessiner, et a influencer le pays.",
    category: "politics-career",
    once: true,
    condition: (state) => isPoliticsRank(state, ["ministre"]) && state.character.stats.influence >= 80,
    choices: [
      {
        id: "institutional-style",
        label: "Un pouvoir respectueux des institutions et des contre-pouvoirs",
        effects: [
          { type: "stat", stat: "integrity", delta: 6 },
          { type: "stat", stat: "authority", delta: 4 },
          { type: "regimeShift", regime: "democracy_stable" },
        ],
      },
      {
        id: "populist-style",
        label: "Un pouvoir fonde sur ta popularite personnelle",
        effects: [
          { type: "stat", stat: "popularity", delta: 10 },
          { type: "stat", stat: "charisma", delta: 5 },
        ],
      },
      {
        id: "authoritarian-style",
        label: "Un pouvoir centralise et peu tolerant aux oppositions",
        effects: [
          { type: "stat", stat: "authority", delta: 10 },
          { type: "stat", stat: "opportunism", delta: 6 },
          { type: "regimeShift", regime: "authoritarian" },
        ],
        hiddenEffects: [{ type: "stat", stat: "publicTrust", delta: -8 }],
      },
    ],
  },
];
