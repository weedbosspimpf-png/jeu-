import type { GameEvent } from "@/engine/types";

export const careerEvents: GameEvent[] = [
  {
    id: "performance-review-army",
    title: "Evaluation militaire",
    description: "Ton superieur evalue ta rigueur et ton engagement sur le terrain.",
    category: "career",
    cooldown: 2,
    condition: (state) => state.career.currentTrack === "army",
    choices: [
      {
        id: "excel",
        label: "Te surpasser pendant l'evaluation",
        effects: [
          { type: "careerPerformance", delta: 12 },
          { type: "stat", stat: "discipline", delta: 3 },
        ],
      },
      {
        id: "minimum",
        label: "Faire le minimum requis",
        effects: [{ type: "careerPerformance", delta: 2 }],
      },
    ],
  },
  {
    id: "corruption-offer-police",
    title: "Une proposition douteuse",
    description: "Quelqu'un t'offre de l'argent pour fermer les yeux sur une affaire.",
    category: "career",
    once: true,
    condition: (state) => state.career.currentTrack === "police" || state.career.currentTrack === "gendarmerie",
    choices: [
      {
        id: "accept",
        label: "Accepter l'argent",
        effects: [{ type: "money", delta: 500 }],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -10 }],
        delayedEffects: [
          {
            delay: 4,
            note: "Une enquete interne met au jour ton implication passee.",
            effects: [
              { type: "stat", stat: "reputation", delta: -20 },
              { type: "careerPerformance", delta: -15 },
            ],
          },
        ],
      },
      {
        id: "refuse",
        label: "Refuser et signaler la tentative",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "reputation", delta: 5 },
        ],
      },
    ],
  },
  {
    id: "business-growth",
    title: "Ton activite prend de l'ampleur",
    description: "Tes affaires se developpent. Il faut decider comment investir les benefices.",
    category: "career",
    cooldown: 3,
    condition: (state) => state.career.currentTrack === "entrepreneur",
    choices: [
      {
        id: "reinvest",
        label: "Tout reinvestir dans l'entreprise",
        effects: [
          { type: "careerPerformance", delta: 10 },
          { type: "money", delta: -300 },
          { type: "stat", stat: "wealth", delta: 4 },
        ],
      },
      {
        id: "personal",
        label: "Garder les benefices pour toi",
        effects: [{ type: "money", delta: 500 }, { type: "stat", stat: "reputation", delta: -2 }],
      },
    ],
  },
  {
    id: "crime-job-offer",
    title: "Un coup a preparer",
    description: "Le reseau te propose de participer a une operation risquee mais lucrative.",
    category: "career",
    cooldown: 3,
    condition: (state) => state.career.currentTrack === "crime",
    choices: [
      {
        id: "accept-job",
        label: "Participer a l'operation",
        effects: [
          { type: "money", delta: 800 },
          { type: "careerPerformance", delta: 10 },
          { type: "relationship", npcId: "mentor", loyalty: 8, trust: 5 },
        ],
        hiddenEffects: [{ type: "world", key: "security", delta: -2 }],
      },
      {
        id: "decline-job",
        label: "Refuser, trop risque",
        effects: [{ type: "relationship", npcId: "mentor", trust: -5, loyalty: -5 }],
      },
    ],
  },
  {
    id: "political-entry",
    title: "Entrer en politique",
    description:
      "Ton influence grandissante attire l'attention d'un parti local qui te propose de le rejoindre.",
    category: "career",
    once: true,
    condition: (state) => state.character.stats.influence >= 30 && state.career.currentTrack !== "politics",
    choices: [
      {
        id: "join-politics",
        label: "Rejoindre le parti et t'engager en politique",
        effects: [{ type: "joinCareer", track: "politics", rankId: "militant" }],
      },
      {
        id: "stay-course",
        label: "Rester sur ta trajectoire actuelle",
        effects: [{ type: "stat", stat: "ambition", delta: -2 }],
      },
    ],
  },
];
