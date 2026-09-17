import type { GameEvent } from "@/engine/types";

/**
 * Le comportement du joueur dans la police n'est jamais juge automatiquement :
 * chaque option a un cout et un benefice differents (argent, reputation,
 * confiance hierarchique, integrite, risque disciplinaire).
 */
export const policeMoralEvents: GameEvent[] = [
  {
    id: "police-meet-superior",
    title: "Prise de fonction",
    description: "Ton nouveau superieur direct t'accueille dans le service.",
    category: "police-moral",
    once: true,
    condition: (state) => state.career.currentTrack === "police" || state.career.currentTrack === "gendarmerie",
    choices: [
      {
        id: "meet",
        label: "Faire connaissance",
        effects: [
          {
            type: "relationshipInit",
            npcId: "superieur",
            name: "Commissaire Verdier",
            role: "Superieur hierarchique",
          },
        ],
      },
    ],
  },
  {
    id: "police-look-away",
    title: "Fermer les yeux ?",
    description:
      "Un superieur te demande de fermer les yeux sur une irregularite dans un rapport, pour eviter des complications.",
    category: "police-moral",
    cooldown: 3,
    condition: (state) => state.career.currentTrack === "police" || state.career.currentTrack === "gendarmerie",
    choices: [
      {
        id: "accept",
        label: "Accepter et fermer les yeux",
        effects: [
          { type: "money", delta: 200 },
          { type: "relationship", npcId: "superieur", trust: 12 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -8 }],
        delayedEffects: [
          {
            delay: 5,
            note: "Une inspection interne ressort d'anciennes irregularites couvertes.",
            effects: [
              { type: "stat", stat: "reputation", delta: -12 },
              { type: "careerPerformance", delta: -10 },
            ],
          },
        ],
      },
      {
        id: "refuse",
        label: "Refuser poliment",
        effects: [
          { type: "stat", stat: "integrity", delta: 4 },
          { type: "relationship", npcId: "superieur", trust: -4 },
        ],
      },
      {
        id: "report",
        label: "Signaler la demande a l'echelon superieur",
        effects: [
          { type: "stat", stat: "integrity", delta: 10 },
          { type: "stat", stat: "reputation", delta: 6 },
          { type: "relationship", npcId: "superieur", trust: -20, loyalty: -20 },
          { type: "relationshipStatus", npcId: "superieur", status: "rival" },
          { type: "flag", flag: "reported-superior", value: true },
        ],
      },
      {
        id: "negotiate",
        label: "Negocier une version intermediaire du rapport",
        effects: [
          { type: "money", delta: 80 },
          { type: "stat", stat: "diplomacy", delta: 5 },
          { type: "stat", stat: "integrity", delta: -3 },
          { type: "relationship", npcId: "superieur", trust: 5 },
        ],
      },
    ],
  },
  {
    id: "police-street-choice",
    title: "Intervention de terrain",
    description:
      "En intervention, tu as l'occasion d'arrondir les angles avec un contrevenant influent, ou d'appliquer le reglement a la lettre.",
    category: "police-moral",
    cooldown: 3,
    condition: (state) => state.career.currentTrack === "police",
    choices: [
      {
        id: "strict",
        label: "Appliquer le reglement sans exception",
        effects: [
          { type: "stat", stat: "integrity", delta: 5 },
          { type: "stat", stat: "reputation", delta: 3 },
          { type: "careerPerformance", delta: 4 },
        ],
      },
      {
        id: "flexible",
        label: "Faire preuve de souplesse en echange d'un service futur",
        effects: [
          { type: "stat", stat: "influence", delta: 4 },
          { type: "stat", stat: "integrity", delta: -4 },
          { type: "careerPerformance", delta: 1 },
        ],
      },
    ],
  },
  {
    id: "police-toward-politics",
    title: "Une carriere politique se dessine",
    description:
      "Ta reputation dans les forces de l'ordre attire l'attention d'elus locaux en quete de candidats credibles.",
    category: "police-moral",
    once: true,
    condition: (state) =>
      (state.career.currentTrack === "police" || state.career.currentTrack === "gendarmerie") &&
      state.character.stats.reputation >= 60 &&
      state.character.stats.influence >= 25,
    choices: [
      {
        id: "enter-politics",
        label: "Saisir cette opportunite politique",
        effects: [{ type: "joinCareer", track: "politics", rankId: "militant" }],
      },
      {
        id: "stay-force",
        label: "Rester fidele a tes fonctions actuelles",
        effects: [{ type: "stat", stat: "loyalty", delta: 3 }],
      },
    ],
  },
];
