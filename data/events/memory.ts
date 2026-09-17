import type { GameEvent } from "@/engine/types";

/**
 * Ces evenements demontrent le systeme de memoire : une decision prise
 * plusieurs annees plus tot revient influencer la partie. Ils se
 * declenchent sur des flags poses par d'autres evenements, jamais sur
 * le hasard seul.
 */
export const memoryEvents: GameEvent[] = [
  {
    id: "former-superior-returns",
    title: "Un visage du passe",
    description:
      "L'ancien superieur que tu avais denonce des annees plus tot occupe desormais un poste influent. " +
      "Vos chemins se recroisent.",
    category: "memory",
    once: true,
    condition: (state) =>
      state.flags["reported-superior"] === true &&
      state.character.age >= 28 &&
      state.relationships["superieur"]?.status === "rival",
    choices: [
      {
        id: "reconcile",
        label: "Tenter une reconciliation",
        effects: [
          { type: "relationshipStatus", npcId: "superieur", status: "allie" },
          { type: "relationship", npcId: "superieur", trust: 25, loyalty: 15 },
          { type: "stat", stat: "diplomacy", delta: 5 },
        ],
      },
      {
        id: "confront",
        label: "Le confronter sur le passe",
        effects: [
          { type: "stat", stat: "courage", delta: 5 },
          { type: "relationship", npcId: "superieur", trust: -10 },
        ],
      },
      {
        id: "avoid",
        label: "Eviter la confrontation",
        effects: [],
      },
    ],
  },
  {
    id: "old-network-contact",
    title: "Un contact du reseau reapparait",
    description:
      "Une personne de ton ancienne vie dans le reseau te retrouve, alors que tu as choisi une autre voie. " +
      "Elle te demande un service.",
    category: "memory",
    once: true,
    condition: (state) =>
      state.flags["former-criminal-entrepreneur"] === true && state.career.currentTrack === "entrepreneur",
    choices: [
      {
        id: "help",
        label: "Rendre le service demande",
        effects: [
          { type: "money", delta: 400 },
          { type: "stat", stat: "integrity", delta: -8 },
          { type: "relationship", npcId: "boss", trust: 15 },
        ],
      },
      {
        id: "refuse-help",
        label: "Refuser et couper definitivement les ponts",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "relationship", npcId: "boss", trust: -20 },
          { type: "relationshipStatus", npcId: "boss", status: "ennemi" },
        ],
      },
    ],
  },
  {
    id: "mentor-crosses-path-again",
    title: "Ton mentor reapparait",
    description:
      "Des annees apres vos premiers echanges, ton ancien mentor croise a nouveau ta route, dans un contexte tres different.",
    category: "memory",
    once: true,
    condition: (state) => state.character.age >= 35 && (state.relationships["mentor"]?.trust ?? 0) !== 40,
    choices: [
      {
        id: "reconnect",
        label: "Renouer le contact",
        effects: [{ type: "relationship", npcId: "mentor", trust: 10, loyalty: 5 }],
      },
      {
        id: "move-on",
        label: "Rester concentre sur ta propre trajectoire",
        effects: [{ type: "stat", stat: "ambition", delta: 2 }],
      },
    ],
  },
];
