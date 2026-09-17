import type { GameEvent, GameState } from "@/engine/types";

function isGendarmerieActive(state: GameState): boolean {
  return (
    state.career.currentTrack === "gendarmerie" &&
    ["gendarme", "officier-gendarmerie", "commandement"].includes(state.career.currentRankId ?? "")
  );
}

export const gendarmerieMissionEvents: GameEvent[] = [
  {
    id: "mission-sarabo-briefing",
    title: "Securiser la zone frontaliere de Sarabo",
    description:
      "Des activites illegales fictives se multiplient pres de la frontiere, dans la zone de Sarabo. Ta brigade doit y retablir la securite.",
    category: "mission",
    cooldown: 4,
    condition: (state) => isGendarmerieActive(state) && state.flags["sarabo-acted"] !== true,
    mission: {
      id: "sarabo",
      title: "Securisation de Sarabo",
      objective: "Retablir la securite dans la zone frontaliere, sans procedure operationnelle reelle.",
      difficulty: "modere",
      phase: "briefing",
      rewardsPreview: ["Reputation locale", "Confiance des autorites locales"],
      risksPreview: ["Tension avec la population locale", "Incident frontalier"],
    },
    choices: [
      {
        id: "increase-patrols",
        label: "Renforcer les patrouilles sur la zone",
        effects: [
          { type: "flag", flag: "sarabo-acted", value: true },
          { type: "stat", stat: "discipline", delta: 3 },
        ],
      },
      {
        id: "coordinate-locals",
        label: "Coordonner l'action avec les autorites locales",
        effects: [
          { type: "flag", flag: "sarabo-acted", value: true },
          { type: "stat", stat: "diplomacy", delta: 3 },
        ],
      },
      {
        id: "coordinate-army",
        label: "Demander un appui temporaire de l'armee",
        effects: [
          { type: "flag", flag: "sarabo-acted", value: true },
          { type: "stat", stat: "authority", delta: 3 },
        ],
      },
    ],
  },
  {
    id: "mission-sarabo-resolution",
    title: "Bilan de l'operation",
    description: "L'operation dans la zone de Sarabo touche a sa fin.",
    category: "mission",
    condition: (state) => state.flags["sarabo-acted"] === true,
    mission: {
      id: "sarabo",
      title: "Securisation de Sarabo",
      objective: "Retablir la securite dans la zone frontaliere.",
      difficulty: "modere",
      phase: "resolution",
    },
    choices: [
      {
        id: "close-sarabo",
        label: "Cloturer l'operation",
        effects: [
          { type: "careerPerformance", delta: 10 },
          { type: "stat", stat: "reputation", delta: 5 },
          { type: "money", delta: 200, source: "salaire" },
          { type: "world", key: "security", delta: 2 },
          { type: "flag", flag: "sarabo-acted", value: false },
        ],
      },
    ],
  },
];
