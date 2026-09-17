import type { GameEvent } from "@/engine/types";

export const economyEvents: GameEvent[] = [
  {
    id: "economic-crisis",
    title: "Crise economique",
    description:
      "L'economie du pays se degrade fortement. Des difficultes financieres touchent la population.",
    category: "economy",
    cooldown: 4,
    weight: 2,
    condition: (state) => state.world.values.economy < 30,
    choices: [
      {
        id: "help-community",
        label: "Aider ton entourage malgre tes propres difficultes",
        effects: [
          { type: "money", delta: -200 },
          { type: "stat", stat: "reputation", delta: 8 },
          { type: "world", key: "socialTension", delta: -3 },
        ],
      },
      {
        id: "protect-yourself",
        label: "Te concentrer sur ta propre survie financiere",
        effects: [
          { type: "money", delta: 100 },
          { type: "stat", stat: "reputation", delta: -3 },
        ],
      },
    ],
  },
  {
    id: "protests-erupt",
    title: "Manifestations dans le pays",
    description:
      "La tension sociale degenere en manifestations importantes. Ta position te pousse a prendre position.",
    category: "economy",
    cooldown: 4,
    condition: (state) => state.world.values.socialTension > 65,
    choices: [
      {
        id: "join",
        label: "Rejoindre le mouvement",
        effects: [
          { type: "stat", stat: "reputation", delta: 5 },
          { type: "world", key: "govPopularity", delta: -4 },
        ],
        delayedEffects: [
          {
            delay: 2,
            note: "Ton engagement dans les manifestations t'ouvre des portes politiques.",
            effects: [{ type: "stat", stat: "influence", delta: 8 }],
          },
        ],
      },
      {
        id: "stay-out",
        label: "Rester en dehors du mouvement",
        effects: [{ type: "stat", stat: "reputation", delta: -2 }],
      },
      {
        id: "oppose",
        label: "Prendre publiquement position contre le mouvement",
        effects: [
          { type: "world", key: "govPopularity", delta: 3 },
          { type: "stat", stat: "reputation", delta: -5 },
        ],
      },
    ],
  },
  {
    id: "business-opportunity",
    title: "Opportunite d'investissement",
    description: "Un contact te propose d'investir dans un projet prometteur mais risque.",
    category: "economy",
    cooldown: 5,
    condition: (state) => state.character.money >= 500,
    choices: [
      {
        id: "invest",
        label: "Investir une partie de tes economies",
        effects: [{ type: "money", delta: -400 }],
        delayedEffects: [
          {
            delay: 1,
            note: "Ton investissement a porte ses fruits.",
            effects: [
              { type: "money", delta: 900 },
              { type: "stat", stat: "wealth", delta: 6 },
            ],
          },
        ],
      },
      {
        id: "decline",
        label: "Refuser, trop risque",
        effects: [{ type: "stat", stat: "discipline", delta: 2 }],
      },
    ],
  },
];
