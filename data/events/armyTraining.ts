import type { GameEvent } from "@/engine/types";

/**
 * Sequence d'epreuves de formation militaire. Chaque epreuve pose un flag
 * "trial-x-done" pour ne se declencher qu'une fois et pour permettre a
 * l'epreuve suivante de s'enchainer. Une mauvaise epreuve ne met jamais fin
 * a la partie : elle ferme simplement certaines affectations futures.
 */
export const armyTrainingEvents: GameEvent[] = [
  {
    id: "trial-endurance",
    title: "Epreuve d'endurance",
    description: "Une marche forcee de 40 km avec paquetage teste ta resistance physique.",
    category: "army-trial",
    once: true,
    condition: (state) => state.career.currentTrack === "army" && !state.flags["trial-endurance-done"],
    choices: [
      {
        id: "push",
        label: "Te depasser jusqu'au bout",
        effects: [
          { type: "stat", stat: "force", delta: 8 },
          { type: "stat", stat: "discipline", delta: 2 },
          { type: "careerPerformance", delta: 6 },
          { type: "flag", flag: "trial-endurance-done", value: true },
          { type: "flag", flag: "trial-endurance-excellent", value: true },
        ],
      },
      {
        id: "pace",
        label: "Gerer ton effort pour finir sans te blesser",
        effects: [
          { type: "stat", stat: "force", delta: 3 },
          { type: "stat", stat: "discipline", delta: 4 },
          { type: "careerPerformance", delta: 3 },
          { type: "flag", flag: "trial-endurance-done", value: true },
        ],
      },
    ],
  },
  {
    id: "trial-discipline",
    title: "Epreuve de discipline",
    description: "L'instructeur impose des ordres stricts et repetitifs, en partie absurdes, pour tester ton obeissance.",
    category: "army-trial",
    once: true,
    condition: (state) => state.career.currentTrack === "army" && state.flags["trial-endurance-done"] === true && !state.flags["trial-discipline-done"],
    choices: [
      {
        id: "comply",
        label: "Obeir sans discuter",
        effects: [
          { type: "stat", stat: "discipline", delta: 8 },
          { type: "careerPerformance", delta: 5 },
          { type: "flag", flag: "trial-discipline-done", value: true },
        ],
      },
      {
        id: "question",
        label: "Poser des questions sur le sens des ordres",
        effects: [
          { type: "stat", stat: "intelligence", delta: 4 },
          { type: "stat", stat: "discipline", delta: 2 },
          { type: "careerPerformance", delta: 1 },
          { type: "flag", flag: "trial-discipline-done", value: true },
        ],
      },
    ],
  },
  {
    id: "trial-leadership",
    title: "Epreuve de leadership",
    description: "On te confie temporairement le commandement d'un petit groupe de recrues en difficulte.",
    category: "army-trial",
    once: true,
    condition: (state) => state.career.currentTrack === "army" && state.flags["trial-discipline-done"] === true && !state.flags["trial-leadership-done"],
    choices: [
      {
        id: "lead-firm",
        label: "Diriger avec fermete",
        effects: [
          { type: "stat", stat: "leadership", delta: 8 },
          { type: "stat", stat: "loyalty", delta: -2 },
          { type: "careerPerformance", delta: 6 },
          { type: "flag", flag: "trial-leadership-done", value: true },
        ],
      },
      {
        id: "lead-support",
        label: "Diriger en soutenant chacun individuellement",
        effects: [
          { type: "stat", stat: "leadership", delta: 5 },
          { type: "stat", stat: "diplomacy", delta: 4 },
          { type: "careerPerformance", delta: 4 },
          { type: "flag", flag: "trial-leadership-done", value: true },
        ],
      },
    ],
  },
  {
    id: "trial-strategy",
    title: "Epreuve de strategie",
    description: "Un exercice de simulation tactique te place face a un scenario de terrain complexe.",
    category: "army-trial",
    once: true,
    condition: (state) => state.career.currentTrack === "army" && state.flags["trial-leadership-done"] === true && !state.flags["trial-strategy-done"],
    choices: [
      {
        id: "bold-plan",
        label: "Proposer un plan audacieux",
        effects: [
          { type: "stat", stat: "intelligence", delta: 5 },
          { type: "stat", stat: "courage", delta: 5 },
          { type: "careerPerformance", delta: 5 },
          { type: "flag", flag: "trial-strategy-done", value: true },
        ],
      },
      {
        id: "cautious-plan",
        label: "Proposer un plan prudent et methodique",
        effects: [
          { type: "stat", stat: "intelligence", delta: 6 },
          { type: "stat", stat: "discipline", delta: 3 },
          { type: "careerPerformance", delta: 3 },
          { type: "flag", flag: "trial-strategy-done", value: true },
        ],
      },
    ],
  },
  {
    id: "trial-teamwork",
    title: "Epreuve d'esprit d'equipe",
    description: "Un exercice collectif ne peut reussir que si toute l'equipe progresse ensemble.",
    category: "army-trial",
    once: true,
    condition: (state) => state.career.currentTrack === "army" && state.flags["trial-strategy-done"] === true && !state.flags["trial-teamwork-done"],
    choices: [
      {
        id: "help-others",
        label: "Ralentir pour aider les plus en difficulte",
        effects: [
          { type: "stat", stat: "loyalty", delta: 8 },
          { type: "stat", stat: "leadership", delta: 3 },
          { type: "careerPerformance", delta: 4 },
          { type: "flag", flag: "trial-teamwork-done", value: true },
        ],
      },
      {
        id: "focus-self",
        label: "Te concentrer sur ta propre performance",
        effects: [
          { type: "stat", stat: "ambition", delta: 5 },
          { type: "careerPerformance", delta: 3 },
          { type: "stat", stat: "loyalty", delta: -4 },
          { type: "flag", flag: "trial-teamwork-done", value: true },
        ],
      },
    ],
  },
  {
    id: "trial-stress",
    title: "Epreuve de gestion du stress",
    description: "Un exercice de tir sous pression, avec bruit et fatigue intenses, teste ton sang-froid.",
    category: "army-trial",
    once: true,
    condition: (state) => state.career.currentTrack === "army" && state.flags["trial-teamwork-done"] === true && !state.flags["trial-stress-done"],
    choices: [
      {
        id: "stay-calm",
        label: "Respirer et garder ton calme",
        effects: [
          { type: "stat", stat: "discipline", delta: 5 },
          { type: "stat", stat: "courage", delta: 5 },
          { type: "careerPerformance", delta: 5 },
          { type: "flag", flag: "trial-stress-done", value: true },
        ],
      },
      {
        id: "push-through",
        label: "Serrer les dents et forcer le passage",
        effects: [
          { type: "stat", stat: "courage", delta: 7 },
          { type: "stat", stat: "discipline", delta: 1 },
          { type: "careerPerformance", delta: 3 },
          { type: "flag", flag: "trial-stress-done", value: true },
        ],
      },
    ],
  },
  {
    id: "trial-decision",
    title: "Epreuve de prise de decision",
    description: "Un scenario d'urgence te force a trancher seul, dans l'instant, sans validation hierarchique.",
    category: "army-trial",
    once: true,
    condition: (state) => state.career.currentTrack === "army" && state.flags["trial-stress-done"] === true && !state.flags["trial-decision-done"],
    choices: [
      {
        id: "decisive",
        label: "Trancher rapidement et assumer",
        effects: [
          { type: "stat", stat: "leadership", delta: 5 },
          { type: "stat", stat: "courage", delta: 3 },
          { type: "careerPerformance", delta: 6 },
          { type: "flag", flag: "trial-decision-done", value: true },
        ],
      },
      {
        id: "consult",
        label: "Prendre le temps de consulter les autres",
        effects: [
          { type: "stat", stat: "diplomacy", delta: 5 },
          { type: "stat", stat: "intelligence", delta: 3 },
          { type: "careerPerformance", delta: 3 },
          { type: "flag", flag: "trial-decision-done", value: true },
        ],
      },
    ],
  },
  {
    id: "army-assignment-elite",
    title: "Affectation en unite d'elite",
    description:
      "Ton parcours de formation a ete remarque : le commandement t'ouvre l'acces a une unite d'elite.",
    category: "army-trial",
    once: true,
    condition: (state) =>
      state.career.currentTrack === "army" &&
      state.flags["trial-decision-done"] === true &&
      state.career.performance >= 65,
    choices: [
      {
        id: "accept-elite",
        label: "Accepter l'affectation d'elite",
        effects: [
          { type: "flag", flag: "army-elite-unit", value: true },
          { type: "stat", stat: "reputation", delta: 10 },
          { type: "careerPerformance", delta: 10 },
        ],
      },
      {
        id: "decline-elite",
        label: "Rester dans une unite reguliere, plus stable",
        effects: [{ type: "stat", stat: "discipline", delta: 3 }],
      },
    ],
  },
  {
    id: "army-assignment-standard",
    title: "Affectation standard",
    description: "La formation initiale est terminee. Tu rejoins une unite reguliere.",
    category: "army-trial",
    once: true,
    condition: (state) =>
      state.career.currentTrack === "army" &&
      state.flags["trial-decision-done"] === true &&
      state.career.performance < 65,
    choices: [
      {
        id: "accept-standard",
        label: "Rejoindre l'unite reguliere",
        effects: [{ type: "careerPerformance", delta: 3 }],
      },
    ],
  },
];
