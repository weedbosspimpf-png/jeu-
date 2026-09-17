import type { GameEvent, GameState } from "@/engine/types";

function isPoliceInvestigator(state: GameState): boolean {
  return state.career.currentTrack === "police" && ["enqueteur", "responsable"].includes(state.career.currentRankId ?? "");
}

export const policeMissionEvents: GameEvent[] = [
  {
    id: "mission-disparition-briefing",
    title: "Enquete sur une disparition suspecte",
    description:
      "Un dossier de disparition atterrit sur ton bureau. Les premiers elements disponibles sont minces, et plusieurs pistes narratives s'offrent a toi.",
    category: "mission",
    cooldown: 4,
    condition: (state) => isPoliceInvestigator(state) && state.flags["disparition-acted"] !== true,
    mission: {
      id: "disparition",
      title: "Enquete : disparition suspecte",
      objective: "Identifier ce qui s'est reellement passe, sans certitude au depart.",
      difficulty: "modere",
      phase: "briefing",
      rewardsPreview: ["Reputation", "Reconnaissance professionnelle"],
      risksPreview: ["Piste erronee", "Tension avec un collegue ou un informateur"],
    },
    choices: [
      {
        id: "interrogate-firmly",
        label: "Interroger fermement les premiers suspects",
        effects: [
          { type: "flag", flag: "disparition-acted", value: true },
          { type: "stat", stat: "authority", delta: 3 },
        ],
      },
      {
        id: "follow-discreetly",
        label: "Suivre discretement plusieurs pistes en parallele",
        effects: [
          { type: "flag", flag: "disparition-acted", value: true },
          { type: "stat", stat: "perspicacity", delta: 3 },
        ],
      },
      {
        id: "use-informant",
        label: "Solliciter un informateur du quartier",
        effects: [
          { type: "flag", flag: "disparition-acted", value: true },
          {
            type: "relationshipInit",
            npcId: "informateur",
            name: "Dabo",
            role: "Informateur",
          },
          { type: "relationship", npcId: "informateur", trust: 10 },
        ],
      },
      {
        id: "spot-inconsistency",
        label: "Reperer une incoherence que peu de monde remarquerait",
        requires: (state) => state.character.stats.perspicacity >= 65,
        effects: [
          { type: "flag", flag: "disparition-acted", value: true },
          { type: "stat", stat: "perspicacity", delta: 4 },
          { type: "stat", stat: "reputation", delta: 4 },
        ],
      },
    ],
  },
  {
    id: "mission-disparition-resolution",
    title: "Conclusions de l'enquete",
    description: "Le dossier arrive a son terme. Il est temps de presenter tes conclusions.",
    category: "mission",
    condition: (state) => state.flags["disparition-acted"] === true,
    mission: {
      id: "disparition",
      title: "Enquete : disparition suspecte",
      objective: "Identifier ce qui s'est reellement passe.",
      difficulty: "modere",
      phase: "resolution",
    },
    choices: [
      {
        id: "close-investigation",
        label: "Presenter tes conclusions et cloturer le dossier",
        effects: [
          { type: "careerPerformance", delta: 10 },
          { type: "stat", stat: "reputation", delta: 6 },
          { type: "money", delta: 200, source: "salaire" },
          { type: "flag", flag: "disparition-acted", value: false },
        ],
      },
    ],
  },
];
