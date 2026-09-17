import type { GameEvent } from "@/engine/types";

export const gendarmerieTrainingEvents: GameEvent[] = [
  {
    id: "gendarmerie-drill",
    title: "Exercice de maintien de l'ordre",
    description: "Un exercice simule une intervention delicate en zone rurale isolee.",
    category: "gendarmerie-trial",
    once: true,
    condition: (state) => state.career.currentTrack === "gendarmerie",
    choices: [
      {
        id: "methodical",
        label: "Suivre la procedure a la lettre",
        effects: [
          { type: "stat", stat: "discipline", delta: 6 },
          { type: "careerPerformance", delta: 5 },
        ],
      },
      {
        id: "adapt",
        label: "T'adapter au terrain, quitte a improviser",
        effects: [
          { type: "stat", stat: "intelligence", delta: 5 },
          { type: "stat", stat: "courage", delta: 3 },
          { type: "careerPerformance", delta: 5 },
        ],
      },
    ],
  },
  {
    id: "gendarmerie-local-conflict",
    title: "Mediation locale",
    description: "Un differend oppose deux familles influentes de la region. On attend une intervention rapide.",
    category: "gendarmerie-trial",
    cooldown: 3,
    condition: (state) => state.career.currentTrack === "gendarmerie",
    choices: [
      {
        id: "mediate",
        label: "Chercher un compromis entre les deux parties",
        effects: [
          { type: "stat", stat: "diplomacy", delta: 6 },
          { type: "stat", stat: "reputation", delta: 3 },
        ],
      },
      {
        id: "enforce",
        label: "Trancher fermement selon le reglement",
        effects: [
          { type: "stat", stat: "discipline", delta: 4 },
          { type: "stat", stat: "reputation", delta: -2 },
          { type: "careerPerformance", delta: 3 },
        ],
      },
    ],
  },
];
