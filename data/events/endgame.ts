import type { GameEvent } from "@/engine/types";

export const endgameEvents: GameEvent[] = [
  {
    id: "retirement-offer",
    title: "L'heure de la retraite ?",
    description: "A ton age, la question se pose serieusement : continuer, ou tourner la page ?",
    category: "endgame",
    once: true,
    condition: (state) => state.character.age >= 65,
    choices: [
      {
        id: "retire",
        label: "Prendre ma retraite",
        effects: [{ type: "flag", flag: "retired", value: true }],
      },
      {
        id: "continue",
        label: "Continuer sur ma lancee",
        effects: [{ type: "stat", stat: "ambition", delta: 3 }],
      },
    ],
  },
  {
    id: "police-investigation",
    title: "Une enquete se resserre",
    description:
      "La police enquete sur les activites de ton reseau. La securite du pays est en alerte a ton sujet.",
    category: "endgame",
    once: true,
    condition: (state) => state.career.currentTrack === "crime" && state.world.values.security < 30,
    choices: [
      {
        id: "flee",
        label: "Prendre la fuite et disparaitre du reseau",
        effects: [
          { type: "flag", flag: "hunted", value: true },
          { type: "stat", stat: "reputation", delta: -15 },
          { type: "careerPerformance", delta: -20 },
        ],
      },
      {
        id: "resist",
        label: "Tenter de tenir tete a l'enquete",
        effects: [{ type: "stat", stat: "courage", delta: 5 }],
        delayedEffects: [
          {
            delay: 1,
            note: "L'enquete aboutit : tu es arrete.",
            effects: [{ type: "flag", flag: "arrested", value: true }],
          },
        ],
      },
      {
        id: "go-legal",
        label: "Couper les ponts avec le reseau et rentrer dans la legalite",
        effects: [
          { type: "joinCareer", track: "civil", rankId: "etudiant" },
          { type: "stat", stat: "integrity", delta: 10 },
          { type: "relationship", npcId: "mentor", trust: -20, loyalty: -20 },
        ],
      },
    ],
  },
];
