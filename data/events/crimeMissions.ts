import type { GameEvent } from "@/engine/types";

/**
 * Chaine de missions du reseau criminel fictif. Traite de maniere abstraite :
 * aucune methode operationnelle n'est decrite, seulement des consequences
 * narratives (loyaute, courage, intelligence, negociation, influence,
 * gestion de conflits).
 */
export const crimeMissionEvents: GameEvent[] = [
  {
    id: "crime-first-mission",
    title: "Premiere mission",
    description:
      "Le chef du reseau te confie une premiere mission pour evaluer ta loyaute et ton sang-froid.",
    category: "crime-mission",
    once: true,
    condition: (state) => state.career.currentTrack === "crime",
    choices: [
      {
        id: "obey",
        label: "Obeir et executer la mission",
        effects: [
          {
            type: "relationshipInit",
            npcId: "boss",
            name: "Le Vieux",
            role: "Chef du reseau",
          },
          { type: "relationship", npcId: "boss", trust: 15, loyalty: 10 },
          { type: "stat", stat: "loyalty", delta: 8 },
          { type: "stat", stat: "courage", delta: 3 },
          { type: "money", delta: 300 },
          { type: "careerPerformance", delta: 8 },
        ],
      },
      {
        id: "negotiate",
        label: "Accepter, mais negocier de meilleures conditions",
        effects: [
          {
            type: "relationshipInit",
            npcId: "boss",
            name: "Le Vieux",
            role: "Chef du reseau",
          },
          { type: "stat", stat: "diplomacy", delta: 6 },
          { type: "money", delta: 150 },
          { type: "careerPerformance", delta: 4 },
        ],
      },
      {
        id: "refuse",
        label: "Refuser d'executer la mission",
        effects: [
          {
            type: "relationshipInit",
            npcId: "boss",
            name: "Le Vieux",
            role: "Chef du reseau",
          },
          { type: "relationship", npcId: "boss", trust: -15, loyalty: -10 },
          { type: "stat", stat: "integrity", delta: 5 },
        ],
      },
    ],
  },
  {
    id: "crime-conflict-management",
    title: "Conflit interne",
    description:
      "Deux membres du reseau entrent en conflit ouvert. Le chef attend de toi une resolution rapide.",
    category: "crime-mission",
    cooldown: 3,
    condition: (state) => state.career.currentTrack === "crime",
    choices: [
      {
        id: "mediate",
        label: "Chercher un compromis entre les deux parties",
        effects: [
          { type: "stat", stat: "diplomacy", delta: 6 },
          { type: "stat", stat: "leadership", delta: 3 },
        ],
      },
      {
        id: "side-with-boss",
        label: "Trancher fermement en faveur de l'autorite du chef",
        effects: [
          { type: "relationship", npcId: "boss", trust: 10, loyalty: 5 },
          { type: "stat", stat: "reputation", delta: -3 },
        ],
      },
      {
        id: "let-escalate",
        label: "Laisser la situation se degrader",
        effects: [{ type: "world", key: "security", delta: -1 }],
        hiddenEffects: [{ type: "relationship", npcId: "boss", trust: -8 }],
      },
    ],
  },
  {
    id: "crime-betray-opportunity",
    title: "L'occasion de trahir",
    description:
      "Une faille dans l'organisation du chef t'offrirait la possibilite de prendre sa place par la force.",
    category: "crime-mission",
    once: true,
    condition: (state) =>
      state.career.currentTrack === "crime" &&
      (state.career.currentRankId === "lieutenant" || state.career.currentRankId === "chef-secteur"),
    choices: [
      {
        id: "betray",
        label: "Trahir le chef et tenter de prendre sa place",
        effects: [
          { type: "stat", stat: "leadership", delta: 10 },
          { type: "stat", stat: "ambition", delta: 5 },
          { type: "stat", stat: "loyalty", delta: -15 },
          { type: "relationshipStatus", npcId: "boss", status: "ennemi" },
          { type: "relationship", npcId: "boss", trust: -100, loyalty: -100 },
          { type: "careerPerformance", delta: 15 },
        ],
      },
      {
        id: "stay-loyal",
        label: "Rester loyal et denoncer la tentative a ton chef",
        effects: [
          { type: "stat", stat: "loyalty", delta: 10 },
          { type: "relationship", npcId: "boss", trust: 20, loyalty: 15 },
        ],
      },
    ],
  },
  {
    id: "crime-exit-opportunity",
    title: "Une porte de sortie",
    description:
      "Une occasion rare se presente : quitter le reseau pour de bon, ou tenter ta chance en dehors de son controle.",
    category: "crime-mission",
    cooldown: 4,
    condition: (state) =>
      state.career.currentTrack === "crime" && state.career.currentRankId !== "membre",
    choices: [
      {
        id: "leave-network",
        label: "Quitter definitivement le reseau et rentrer dans la legalite",
        effects: [
          { type: "joinCareer", track: "civil", rankId: "etudiant" },
          { type: "stat", stat: "integrity", delta: 12 },
          { type: "relationship", npcId: "boss", trust: -20, loyalty: -20 },
        ],
      },
      {
        id: "go-independent",
        label: "Rompre les liens et devenir independant",
        effects: [
          { type: "joinCareer", track: "entrepreneur", rankId: "independant" },
          { type: "stat", stat: "ambition", delta: 8 },
          { type: "money", delta: -200 },
          { type: "flag", flag: "former-criminal-entrepreneur", value: true },
          { type: "relationship", npcId: "boss", trust: -15 },
        ],
      },
      {
        id: "stay-in-network",
        label: "Rester dans le reseau",
        effects: [{ type: "careerPerformance", delta: 2 }],
      },
    ],
  },
];
