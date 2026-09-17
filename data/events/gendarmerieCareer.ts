import type { GameEvent, GameState } from "@/engine/types";

/**
 * Boucle de carriere gendarmerie : maintien de l'ordre en zone
 * territoriale, relations avec les notables locaux et l'armee,
 * dilemmes d'integrite propres au terrain rural/peri-urbain. Complement
 * de gendarmerieTraining.ts (exercices et mediations deja existants).
 */

function isGendarmerieRank(state: GameState, ranks: string[]): boolean {
  return state.career.currentTrack === "gendarmerie" && ranks.includes(state.career.currentRankId ?? "");
}

export const gendarmerieCareerEvents: GameEvent[] = [
  {
    id: "gendarmerie-checkpoint-bribery",
    title: "Barrage routier",
    description:
      "A un barrage de controle des marchandises, un transporteur propose un arrangement financier pour eviter une fouille approfondie.",
    category: "gendarmerie-career",
    cooldown: 3,
    condition: (state) => isGendarmerieRank(state, ["gendarme", "officier-gendarmerie"]),
    choices: [
      {
        id: "inspect-fully",
        label: "Effectuer le controle complet",
        effects: [
          { type: "stat", stat: "integrity", delta: 5 },
          { type: "stat", stat: "reputation", delta: 3 },
          { type: "careerPerformance", delta: 3 },
        ],
      },
      {
        id: "accept-arrangement",
        label: "Accepter l'arrangement",
        effects: [
          { type: "money", delta: 200 },
          { type: "stat", stat: "greed", delta: 6 },
          { type: "stat", stat: "opportunism", delta: 5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -8 }],
        delayedEffects: [
          {
            delay: 4,
            note: "Un controle hierarchique inopine met au jour tes arrangements aux barrages.",
            effects: [
              { type: "stat", stat: "reputation", delta: -12 },
              { type: "careerPerformance", delta: -10 },
            ],
          },
        ],
      },
      {
        id: "light-check",
        label: "Faire un controle allege, sans contrepartie",
        effects: [{ type: "stat", stat: "empathy", delta: 3 }],
      },
    ],
  },
  {
    id: "gendarmerie-local-notable-favor",
    title: "La demande d'un notable",
    description:
      "Un notable de la region te demande discretement un traitement de faveur pour un proche implique dans une affaire.",
    category: "gendarmerie-career",
    once: true,
    condition: (state) => isGendarmerieRank(state, ["officier-gendarmerie", "commandement"]),
    choices: [
      {
        id: "accept-favor",
        label: "Accorder la faveur demandee",
        effects: [
          { type: "stat", stat: "greed", delta: 4 },
          { type: "stat", stat: "opportunism", delta: 6 },
          {
            type: "relationshipInit",
            npcId: "notable-local",
            name: "Chef Dembele",
            role: "Notable local",
          },
          { type: "relationship", npcId: "notable-local", trust: 20, loyalty: 10 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -6 }],
      },
      {
        id: "refuse-favor",
        label: "Refuser fermement",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          {
            type: "relationshipInit",
            npcId: "notable-local",
            name: "Chef Dembele",
            role: "Notable local",
          },
          { type: "relationship", npcId: "notable-local", trust: -15 },
        ],
      },
      {
        id: "negotiate-favor",
        label: "Proposer un compromis mesure",
        effects: [
          { type: "stat", stat: "diplomacy", delta: 6 },
          { type: "stat", stat: "integrity", delta: -3 },
          {
            type: "relationshipInit",
            npcId: "notable-local",
            name: "Chef Dembele",
            role: "Notable local",
          },
          { type: "relationship", npcId: "notable-local", trust: 10 },
        ],
      },
    ],
  },
  {
    id: "gendarmerie-military-liaison",
    title: "Operation conjointe avec l'armee",
    description:
      "Une operation de maintien de l'ordre en zone tendue exige une coordination directe avec l'armee. Le commandement militaire n'a pas toujours les memes priorites que la gendarmerie.",
    category: "gendarmerie-career",
    cooldown: 4,
    condition: (state) =>
      isGendarmerieRank(state, ["commandement"]) && state.world.values.socialTension >= 55,
    choices: [
      {
        id: "defer-to-army",
        label: "Suivre les priorites de l'armee",
        effects: [
          { type: "stat", stat: "loyalty", delta: 5 },
          { type: "world", key: "stability", delta: 3 },
        ],
        hiddenEffects: [{ type: "stat", stat: "authority", delta: -4 }],
      },
      {
        id: "assert-authority",
        label: "Affirmer l'autonomie de commandement de la gendarmerie",
        effects: [
          { type: "stat", stat: "authority", delta: 8 },
          { type: "stat", stat: "integrity", delta: 3 },
        ],
        hiddenEffects: [{ type: "world", key: "stability", delta: -1 }],
      },
      {
        id: "protect-population",
        label: "Prioriser la protection de la population civile sur le terrain",
        effects: [
          { type: "stat", stat: "publicTrust", delta: 8 },
          { type: "stat", stat: "popularity", delta: 5 },
        ],
        hiddenEffects: [{ type: "world", key: "socialTension", delta: -3 }],
      },
    ],
  },
  {
    id: "gendarmerie-command-reform",
    title: "A la tete de la brigade",
    description:
      "Devenu responsable de commandement, tu peux reformer les pratiques locales ou preserver le reseau d'habitudes en place.",
    category: "gendarmerie-career",
    once: true,
    condition: (state) => isGendarmerieRank(state, ["commandement"]),
    choices: [
      {
        id: "reform-brigade",
        label: "Reformer les pratiques de la brigade",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "authority", delta: 6 },
          { type: "stat", stat: "publicTrust", delta: 6 },
        ],
        hiddenEffects: [{ type: "world", key: "corruption", delta: -2 }],
      },
      {
        id: "keep-status-quo",
        label: "Preserver les equilibres locaux existants",
        effects: [
          { type: "stat", stat: "influence", delta: 6 },
          { type: "stat", stat: "opportunism", delta: 5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -5 }],
      },
    ],
  },
];
