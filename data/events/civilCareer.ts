import type { GameEvent, GameState } from "@/engine/types";

/**
 * Boucle de vie civile : etudes, emploi, famille et difficultes
 * economiques. C'est la filiere la plus generaliste, pensee comme un
 * tremplin : plusieurs de ses evenements ouvrent explicitement la porte
 * vers une autre trajectoire (armee, entrepreneuriat, reseau fictif).
 */

function isCivilRank(state: GameState, ranks: string[]): boolean {
  return state.career.currentTrack === "civil" && ranks.includes(state.career.currentRankId ?? "");
}

export const civilCareerEvents: GameEvent[] = [
  {
    id: "civil-education-path",
    title: "Poursuivre les etudes, ou travailler tout de suite ?",
    description:
      "Une formation superieure te tendrait la main, mais elle coute du temps et de l'argent que tu pourrais gagner immediatement.",
    category: "civil-career",
    once: true,
    condition: (state) => isCivilRank(state, ["etudiant"]),
    choices: [
      {
        id: "pursue-studies",
        label: "Poursuivre des etudes superieures",
        effects: [
          { type: "money", delta: -300 },
          { type: "stat", stat: "intelligence", delta: 8 },
          { type: "careerPerformance", delta: 4 },
        ],
      },
      {
        id: "work-immediately",
        label: "Travailler immediatement",
        effects: [
          { type: "money", delta: 400 },
          { type: "stat", stat: "discipline", delta: 4 },
        ],
      },
    ],
  },
  {
    id: "civil-first-stable-job",
    title: "Un premier emploi stable",
    description: "Une entreprise locale te propose un poste stable, mais peu valorisant a court terme.",
    category: "civil-career",
    once: true,
    condition: (state) => isCivilRank(state, ["etudiant", "employe"]),
    choices: [
      {
        id: "accept-job",
        label: "Accepter ce poste stable",
        effects: [
          { type: "money", delta: 300 },
          { type: "stat", stat: "discipline", delta: 3 },
          { type: "careerPerformance", delta: 5 },
        ],
      },
      {
        id: "keep-looking",
        label: "Continuer a chercher mieux",
        effects: [
          { type: "stat", stat: "ambition", delta: 4 },
          { type: "money", delta: -100 },
        ],
      },
    ],
  },
  {
    id: "civil-family-formation",
    title: "Fonder une famille",
    description:
      "L'occasion se presente de t'installer durablement avec quelqu'un et de fonder une famille.",
    category: "civil-career",
    once: true,
    condition: (state) => state.character.age >= 24 && state.character.age <= 40,
    choices: [
      {
        id: "prioritize-family",
        label: "Donner la priorite a ta vie de famille",
        effects: [
          { type: "stat", stat: "empathy", delta: 8 },
          { type: "money", delta: -200 },
          {
            type: "relationshipInit",
            npcId: "famille",
            name: "Ta famille",
            role: "Foyer",
          },
          { type: "relationship", npcId: "famille", trust: 30, loyalty: 30 },
        ],
      },
      {
        id: "prioritize-career",
        label: "Continuer a donner la priorite a ta carriere",
        effects: [
          { type: "stat", stat: "ambition", delta: 6 },
          {
            type: "relationshipInit",
            npcId: "famille",
            name: "Ta famille",
            role: "Foyer",
          },
          { type: "relationship", npcId: "famille", trust: 5 },
        ],
      },
      {
        id: "decline-family",
        label: "Rester concentre sur toi-meme pour l'instant",
        effects: [{ type: "stat", stat: "ambition", delta: 2 }],
      },
    ],
  },
  {
    id: "civil-economic-hardship",
    title: "Coup dur economique",
    description: "Tu perds ton emploi alors que l'economie du pays traverse une periode difficile.",
    category: "civil-career",
    cooldown: 5,
    condition: (state) =>
      state.career.currentTrack === "civil" &&
      (state.world.values.economy < 35 || state.world.values.unemployment > 55),
    choices: [
      {
        id: "take-any-job",
        label: "Accepter n'importe quel travail disponible",
        effects: [
          { type: "money", delta: 150 },
          { type: "stat", stat: "discipline", delta: 3 },
        ],
      },
      {
        id: "lean-on-network",
        label: "Demander de l'aide a ton reseau de confiance",
        effects: [
          { type: "money", delta: 200 },
          { type: "relationship", npcId: "mentor", trust: 5 },
        ],
      },
      {
        id: "informal-business",
        label: "Se lancer dans une petite activite independante",
        effects: [{ type: "joinCareer", track: "entrepreneur", rankId: "independant" }],
      },
      {
        id: "turn-to-network",
        label: "Accepter l'aide d'un reseau informel plus trouble",
        effects: [
          { type: "money", delta: 300 },
          { type: "stat", stat: "integrity", delta: -6 },
          { type: "joinCareer", track: "crime", rankId: "membre" },
        ],
      },
    ],
  },
  {
    id: "civil-community-involvement",
    title: "S'impliquer dans la vie locale",
    description: "Une association de quartier cherche des volontaires pour ses activites.",
    category: "civil-career",
    cooldown: 4,
    condition: (state) => isCivilRank(state, ["employe", "cadre"]),
    choices: [
      {
        id: "get-involved",
        label: "S'impliquer activement",
        effects: [
          { type: "stat", stat: "publicTrust", delta: 6 },
          { type: "stat", stat: "reputation", delta: 4 },
          { type: "stat", stat: "empathy", delta: 4 },
        ],
      },
      {
        id: "focus-on-self",
        label: "Rester concentre sur ta propre situation",
        effects: [{ type: "stat", stat: "ambition", delta: 3 }],
      },
    ],
  },
  {
    id: "civil-crossroads",
    title: "Un carrefour de vie",
    description:
      "A ce stade de ta vie civile, plusieurs portes te semblent accessibles : armee, entreprise, ou engagement politique local.",
    category: "civil-career",
    once: true,
    condition: (state) => isCivilRank(state, ["cadre"]) && state.character.age >= 26,
    choices: [
      {
        id: "join-army",
        label: "Rejoindre l'armee",
        effects: [{ type: "joinCareer", track: "army", rankId: "recrue" }],
      },
      {
        id: "start-business",
        label: "Se lancer dans l'entrepreneuriat",
        effects: [{ type: "joinCareer", track: "entrepreneur", rankId: "independant" }],
      },
      {
        id: "stay-civil",
        label: "Continuer ta trajectoire civile actuelle",
        effects: [{ type: "stat", stat: "discipline", delta: 2 }],
      },
    ],
  },
];
