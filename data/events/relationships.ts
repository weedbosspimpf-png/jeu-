import type { GameEvent } from "@/engine/types";

export const relationshipEvents: GameEvent[] = [
  {
    id: "mentor-advice",
    title: "Ton mentor te donne un conseil",
    description: "Ton mentor t'invite a discuter de tes choix recents.",
    category: "relationship",
    cooldown: 3,
    condition: (state) => (state.relationships["mentor"]?.trust ?? 0) >= 20,
    choices: [
      {
        id: "listen",
        label: "Ecouter attentivement ses conseils",
        effects: [
          { type: "stat", stat: "intelligence", delta: 3 },
          { type: "relationship", npcId: "mentor", trust: 5 },
        ],
      },
      {
        id: "ignore",
        label: "Suivre ta propre intuition",
        effects: [
          { type: "stat", stat: "ambition", delta: 3 },
          { type: "relationship", npcId: "mentor", trust: -5 },
        ],
      },
    ],
  },
  {
    id: "mentor-betrayal-risk",
    title: "Une confidence risquee",
    description: "Ton mentor te confie une information sensible qui pourrait te servir... ou te nuire.",
    category: "relationship",
    once: true,
    condition: (state) => (state.relationships["mentor"]?.trust ?? 0) >= 60,
    choices: [
      {
        id: "use-it",
        label: "Utiliser cette information a ton avantage",
        effects: [{ type: "stat", stat: "influence", delta: 8 }],
        hiddenEffects: [{ type: "relationship", npcId: "mentor", trust: -15, loyalty: -10 }],
      },
      {
        id: "protect",
        label: "Proteger cette confidence",
        effects: [{ type: "relationship", npcId: "mentor", trust: 10, loyalty: 10 }],
      },
    ],
  },
  {
    id: "rival-appears",
    title: "Un rival se manifeste",
    description: "Une personne ambitieuse commence a te voir comme un obstacle a sa propre reussite.",
    category: "relationship",
    once: true,
    condition: (state) => state.character.stats.reputation >= 35,
    choices: [
      {
        id: "confront",
        label: "Le confronter directement",
        effects: [
          { type: "relationshipStatus", npcId: "rival", status: "rival" },
          { type: "stat", stat: "courage", delta: 5 },
        ],
      },
      {
        id: "diplomacy",
        label: "Chercher un terrain d'entente",
        effects: [
          { type: "relationshipStatus", npcId: "rival", status: "partenaire" },
          { type: "stat", stat: "diplomacy", delta: 5 },
        ],
      },
    ],
  },
];
