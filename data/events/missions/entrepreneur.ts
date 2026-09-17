import type { GameEvent, GameState } from "@/engine/types";

function isEntrepreneurActive(state: GameState): boolean {
  return state.career.currentTrack === "entrepreneur";
}

export const entrepreneurMissionEvents: GameEvent[] = [
  {
    id: "mission-contrat-majeur-briefing",
    title: "Decrocher un contrat majeur",
    description:
      "Un client important est pret a signer un contrat significatif, mais ses exigences sont elevees et le delai est court.",
    category: "mission",
    cooldown: 4,
    condition: (state) => isEntrepreneurActive(state) && state.flags["contrat-majeur-acted"] !== true,
    scene: "entrepreneur-contrat-briefing",
    mission: {
      id: "contrat-majeur",
      title: "Contrat majeur",
      objective: "Convaincre un client important sans compromettre la sante de l'entreprise.",
      difficulty: "modere",
      phase: "briefing",
      rewardsPreview: ["Chiffre d'affaires", "Reputation professionnelle"],
      risksPreview: ["Surengagement financier", "Clause defavorable"],
    },
    choices: [
      {
        id: "negotiate-hard",
        label: "Negocier fermement les termes du contrat",
        effects: [
          { type: "flag", flag: "contrat-majeur-acted", value: true },
          { type: "stat", stat: "diplomacy", delta: 4 },
        ],
      },
      {
        id: "accept-demanding-terms",
        label: "Accepter des conditions exigeantes pour emporter le contrat",
        effects: [
          { type: "flag", flag: "contrat-majeur-acted", value: true },
          { type: "stat", stat: "ambition", delta: 4 },
        ],
        hiddenEffects: [{ type: "money", delta: -200 }],
      },
      {
        id: "prudent-counteroffer",
        label: "Proposer une contre-offre prudente, meme au risque de perdre le client",
        effects: [
          { type: "flag", flag: "contrat-majeur-acted", value: true },
          { type: "stat", stat: "prudence", delta: 4 },
        ],
      },
    ],
  },
  {
    id: "mission-contrat-majeur-resolution",
    title: "Issue de la negociation",
    description: "Le contrat est signe, ou la negociation echoue - dans les deux cas, il faut avancer.",
    category: "mission",
    condition: (state) => state.flags["contrat-majeur-acted"] === true,
    scene: "entrepreneur-contrat-resolution",
    mission: {
      id: "contrat-majeur",
      title: "Contrat majeur",
      objective: "Convaincre un client important.",
      difficulty: "modere",
      phase: "resolution",
    },
    choices: [
      {
        id: "close-contrat",
        label: "Cloturer l'affaire",
        effects: [
          { type: "careerPerformance", delta: 10 },
          { type: "money", delta: 1200, source: "entreprise" },
          { type: "stat", stat: "reputation", delta: 4 },
          { type: "flag", flag: "contrat-majeur-acted", value: false },
        ],
      },
    ],
  },
];
