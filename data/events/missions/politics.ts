import type { GameEvent, GameState } from "@/engine/types";

function isPoliticsActive(state: GameState): boolean {
  return state.career.currentTrack === "politics";
}

export const politicsMissionEvents: GameEvent[] = [
  {
    id: "mission-mobilisation-briefing",
    title: "Mobiliser un mouvement citoyen",
    description:
      "Tu souhaites rassembler des soutiens autour d'une cause fictive. La maniere de t'y prendre determinera l'ampleur du mouvement.",
    category: "mission",
    cooldown: 4,
    condition: (state) => isPoliticsActive(state) && state.flags["mobilisation-acted"] !== true,
    scene: "politics-mobilisation-briefing",
    mission: {
      id: "mobilisation",
      title: "Mobilisation citoyenne",
      objective: "Rassembler des soutiens autour d'une cause fictive.",
      difficulty: "modere",
      phase: "briefing",
      rewardsPreview: ["Popularite", "Influence"],
      risksPreview: ["Recuperation par un rival", "Deception si le mouvement s'essouffle"],
    },
    choices: [
      {
        id: "public-meeting",
        label: "Organiser une reunion publique",
        effects: [
          { type: "flag", flag: "mobilisation-acted", value: true },
          { type: "money", delta: -150 },
          { type: "stat", stat: "charisma", delta: 3 },
        ],
      },
      {
        id: "grassroots-network",
        label: "Construire un reseau local, plus discret mais plus durable",
        effects: [
          { type: "flag", flag: "mobilisation-acted", value: true },
          { type: "ambition", key: "influence", delta: 5 },
        ],
      },
      {
        id: "charismatic-rally",
        label: "Galvaniser une foule par ton seul charisme",
        requires: (state) => state.character.stats.charisma >= 70,
        effects: [
          { type: "flag", flag: "mobilisation-acted", value: true },
          { type: "regionalPopularity", region: "capitale", delta: 8 },
          { type: "stat", stat: "popularity", delta: 5 },
        ],
      },
    ],
  },
  {
    id: "mission-mobilisation-resolution",
    title: "Le mouvement prend forme",
    description: "Le mouvement citoyen atteint son point culminant. Il est temps d'en tirer les enseignements.",
    category: "mission",
    condition: (state) => state.flags["mobilisation-acted"] === true,
    scene: "politics-mobilisation-resolution",
    mission: {
      id: "mobilisation",
      title: "Mobilisation citoyenne",
      objective: "Rassembler des soutiens autour d'une cause fictive.",
      difficulty: "modere",
      phase: "resolution",
    },
    choices: [
      {
        id: "close-mobilisation",
        label: "Capitaliser sur cette mobilisation",
        effects: [
          { type: "careerPerformance", delta: 8 },
          { type: "stat", stat: "popularity", delta: 4 },
          { type: "stat", stat: "influence", delta: 3 },
          { type: "flag", flag: "mobilisation-acted", value: false },
        ],
      },
    ],
  },
];
