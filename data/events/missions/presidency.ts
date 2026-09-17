import type { GameEvent, GameState } from "@/engine/types";

function isPresident(state: GameState): boolean {
  return state.career.currentRankId === "president";
}

export const presidencyMissionEvents: GameEvent[] = [
  {
    id: "mission-budget-briefing",
    title: "Arbitrer une enveloppe budgetaire limitee",
    description:
      "Ton gouvernement dispose d'une enveloppe budgetaire limitee cette annee. Chaque priorite retenue se fera au detriment d'une autre.",
    category: "mission",
    cooldown: 4,
    condition: (state) => isPresident(state) && state.flags["budget-mission-acted"] !== true,
    scene: "presidency-budget-briefing",
    mission: {
      id: "budget-arbitrage",
      title: "Arbitrage budgetaire",
      objective: "Choisir une priorite nationale pour cette enveloppe limitee.",
      difficulty: "eleve",
      phase: "briefing",
      rewardsPreview: ["Amelioration d'un secteur cle"],
      risksPreview: ["Mecontentement dans les secteurs negliges"],
    },
    choices: [
      {
        id: "prioritize-infrastructure",
        label: "Investir dans les infrastructures",
        effects: [
          { type: "flag", flag: "budget-mission-acted", value: true },
          { type: "world", key: "economy", delta: 5 },
        ],
        hiddenEffects: [{ type: "world", key: "socialTension", delta: 2 }],
      },
      {
        id: "prioritize-education",
        label: "Investir dans l'education",
        effects: [
          { type: "flag", flag: "budget-mission-acted", value: true },
          { type: "stat", stat: "publicTrust", delta: 6 },
        ],
        hiddenEffects: [{ type: "world", key: "economy", delta: -2 }],
      },
      {
        id: "prioritize-health",
        label: "Investir dans la sante publique",
        effects: [
          { type: "flag", flag: "budget-mission-acted", value: true },
          { type: "stat", stat: "publicTrust", delta: 5 },
          { type: "world", key: "socialTension", delta: -3 },
        ],
      },
      {
        id: "prioritize-security",
        label: "Investir dans la securite",
        effects: [
          { type: "flag", flag: "budget-mission-acted", value: true },
          { type: "world", key: "security", delta: 6 },
        ],
        hiddenEffects: [{ type: "world", key: "economy", delta: -2 }],
      },
    ],
  },
  {
    id: "mission-budget-resolution",
    title: "Le budget est vote",
    description: "L'arbitrage budgetaire est desormais applique.",
    category: "mission",
    condition: (state) => state.flags["budget-mission-acted"] === true,
    scene: "presidency-budget-resolution",
    mission: {
      id: "budget-arbitrage",
      title: "Arbitrage budgetaire",
      objective: "Choisir une priorite nationale.",
      difficulty: "eleve",
      phase: "resolution",
    },
    choices: [
      {
        id: "close-budget",
        label: "Cloturer l'arbitrage",
        effects: [
          { type: "presidentTrait", trait: "legitimacy", delta: 3 },
          { type: "flag", flag: "budget-mission-acted", value: false },
        ],
      },
    ],
  },
];
