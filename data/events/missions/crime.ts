import type { GameEvent, GameState } from "@/engine/types";

function isCrimeActive(state: GameState): boolean {
  return (
    state.career.currentTrack === "crime" &&
    state.career.currentRankId !== "membre"
  );
}

export const crimeMissionEventsExtra: GameEvent[] = [
  {
    id: "mission-dette-rivale-briefing",
    title: "Une dette envers un rival",
    description:
      "Un groupe rival estime que ton reseau lui doit une compensation pour un ancien differend. La reponse que tu choisis definira votre relation future.",
    category: "mission",
    cooldown: 4,
    condition: (state) => isCrimeActive(state) && state.flags["dette-rivale-acted"] !== true,
    mission: {
      id: "dette-rivale",
      title: "Une dette a regler",
      objective: "Decider comment traiter une obligation envers un rival, de maniere abstraite.",
      difficulty: "modere",
      phase: "briefing",
      rewardsPreview: ["Reputation dans le milieu", "Independance"],
      risksPreview: ["Escalade du conflit", "Perte de loyaute interne"],
    },
    choices: [
      {
        id: "pay-the-debt",
        label: "Payer la dette pour eviter le conflit",
        effects: [
          { type: "flag", flag: "dette-rivale-acted", value: true },
          { type: "money", delta: -400 },
          { type: "stat", stat: "loyalty", delta: 4 },
        ],
      },
      {
        id: "negotiate-debt",
        label: "Negocier un arrangement plus favorable",
        effects: [
          { type: "flag", flag: "dette-rivale-acted", value: true },
          { type: "stat", stat: "diplomacy", delta: 4 },
          { type: "money", delta: -150 },
        ],
      },
      {
        id: "refuse-debt",
        label: "Refuser purement et simplement, quitte a t'affirmer independant",
        effects: [
          { type: "flag", flag: "dette-rivale-acted", value: true },
          { type: "ambition", key: "independance", delta: 6 },
          { type: "stat", stat: "courage", delta: 4 },
        ],
      },
    ],
  },
  {
    id: "mission-dette-rivale-resolution",
    title: "Une affaire close",
    description: "Le differend avec le groupe rival trouve une issue.",
    category: "mission",
    condition: (state) => state.flags["dette-rivale-acted"] === true,
    mission: {
      id: "dette-rivale",
      title: "Une dette a regler",
      objective: "Decider comment traiter une obligation envers un rival.",
      difficulty: "modere",
      phase: "resolution",
    },
    choices: [
      {
        id: "close-dette",
        label: "Tourner la page",
        effects: [
          { type: "careerPerformance", delta: 8 },
          { type: "stat", stat: "reputation", delta: 3 },
          { type: "flag", flag: "dette-rivale-acted", value: false },
        ],
      },
    ],
  },
];
