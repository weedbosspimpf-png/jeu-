import type { GameEvent } from "@/engine/types";

export const earlyLifeEvents: GameEvent[] = [
  {
    id: "first-choice-study-or-work",
    title: "Une opportunite se presente",
    description:
      "A peine ta nouvelle vie commencee, on te propose soit de reprendre des etudes du soir, soit de saisir un petit boulot immediat.",
    category: "early-life",
    once: true,
    condition: (state) => state.turn <= 1,
    choices: [
      {
        id: "study",
        label: "Reprendre des etudes du soir",
        effects: [
          { type: "stat", stat: "intelligence", delta: 6 },
          { type: "money", delta: -100 },
        ],
      },
      {
        id: "work",
        label: "Accepter le petit boulot",
        effects: [
          { type: "money", delta: 300 },
          { type: "stat", stat: "discipline", delta: 3 },
        ],
      },
    ],
  },
  {
    id: "mentor-first-meeting",
    title: "Une rencontre marquante",
    description:
      "Une personne experimentee de ton entourage te propose son aide. Comment reagis-tu ?",
    category: "early-life",
    once: true,
    weight: 2,
    condition: (state) => state.turn <= 2,
    choices: [
      {
        id: "trust",
        label: "Lui accorder ta confiance",
        effects: [{ type: "relationship", npcId: "mentor", trust: 20, loyalty: 10 }],
      },
      {
        id: "cautious",
        label: "Rester prudent",
        effects: [
          { type: "relationship", npcId: "mentor", trust: 5 },
          { type: "stat", stat: "integrity", delta: 3 },
        ],
      },
    ],
  },
  {
    id: "exam-cheat-temptation",
    title: "La tentation de tricher",
    description: "Une occasion de tricher a un examen important se presente. Personne ne semble regarder.",
    category: "early-life",
    once: true,
    condition: (state) => state.turn >= 1 && state.turn <= 3,
    choices: [
      {
        id: "cheat",
        label: "Tricher pour reussir",
        effects: [{ type: "stat", stat: "reputation", delta: 3 }],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -8 }],
        delayedEffects: [
          {
            delay: 3,
            note: "On decouvre que tu avais triche autrefois : ta reputation en patit.",
            effects: [{ type: "stat", stat: "reputation", delta: -15 }],
          },
        ],
      },
      {
        id: "honest",
        label: "Rester honnete, quitte a echouer",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "intelligence", delta: -2 },
        ],
      },
    ],
  },
];
