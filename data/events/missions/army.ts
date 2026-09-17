import type { GameEvent, GameState } from "@/engine/types";

/**
 * Mission phare de la filiere armee, en 3 phases (briefing -> action ->
 * resolution), liees par des flags - exactement le meme mecanisme que
 * les epreuves de armyTraining.ts, mais habille en "mission" pour
 * l'affichage immersif (voir EventCard.tsx). Traitement volontairement
 * abstrait : aucune procedure operationnelle reelle.
 */
function isArmyOfficerTier(state: GameState): boolean {
  return (
    state.career.currentTrack === "army" &&
    ["officier", "commandant", "colonel", "general"].includes(state.career.currentRankId ?? "")
  );
}

export const armyMissionEvents: GameEvent[] = [
  {
    id: "mission-kambara-briefing",
    title: "Briefing : operation dans la region de Kambara",
    description:
      "Une exploitation miniere clandestine fictive s'est installee dans la region de Kambara, hors de tout controle de l'Etat. " +
      "Ton unite est chargee d'y retablir le controle. Comment organises-tu l'intervention ?",
    category: "mission",
    cooldown: 5,
    condition: (state) =>
      isArmyOfficerTier(state) &&
      state.flags["kambara-briefed"] !== true,
    mission: {
      id: "kambara",
      title: "Operation Kambara",
      objective: "Retablir le controle de l'Etat sur la zone, sans procedure operationnelle reelle a suivre.",
      difficulty: "modere",
      phase: "briefing",
      rewardsPreview: ["Reputation", "Confiance de ta hierarchie", "Prime eventuelle"],
      risksPreview: ["Perte de moral de l'unite", "Reaction violente sur le terrain", "Attention politique"],
    },
    choices: [
      {
        id: "approach-fast",
        label: "Une intervention rapide et decisive",
        effects: [
          { type: "flag", flag: "kambara-briefed", value: true },
          { type: "flag", flag: "kambara-approach-fast", value: true },
          { type: "stat", stat: "courage", delta: 3 },
        ],
      },
      {
        id: "approach-cautious",
        label: "Une approche prudente et progressive",
        effects: [
          { type: "flag", flag: "kambara-briefed", value: true },
          { type: "flag", flag: "kambara-approach-cautious", value: true },
          { type: "stat", stat: "prudence", delta: 3 },
        ],
      },
      {
        id: "approach-negotiate",
        label: "Negocier d'abord avec les responsables locaux",
        effects: [
          { type: "flag", flag: "kambara-briefed", value: true },
          { type: "flag", flag: "kambara-approach-negotiate", value: true },
          { type: "stat", stat: "diplomacy", delta: 3 },
        ],
      },
    ],
  },
  {
    id: "mission-kambara-action",
    title: "Sur le terrain",
    description:
      "L'operation est engagee. La situation se complique : tes hommes attendent une decision claire, et le temps presse.",
    category: "mission",
    condition: (state) => state.flags["kambara-briefed"] === true && state.flags["kambara-acted"] !== true,
    mission: {
      id: "kambara",
      title: "Operation Kambara",
      objective: "Retablir le controle de l'Etat sur la zone.",
      difficulty: "modere",
      phase: "action",
    },
    choices: [
      {
        id: "lead-from-front",
        label: "Prendre personnellement la tete de l'operation",
        effects: [
          { type: "flag", flag: "kambara-acted", value: true },
          { type: "stat", stat: "leadership", delta: 4 },
          { type: "subordinateMorale", delta: 8 },
        ],
      },
      {
        id: "delegate-command",
        label: "Deleguer le commandement de terrain a un officier de confiance",
        effects: [
          { type: "flag", flag: "kambara-acted", value: true },
          { type: "stat", stat: "diplomacy", delta: 3 },
          { type: "superiorTrust", delta: 4 },
        ],
      },
      {
        id: "cool-headed-call",
        label: "Garder ton sang-froid pour trancher un imprevu critique",
        requires: (state) => state.character.stats.coolness >= 60,
        effects: [
          { type: "flag", flag: "kambara-acted", value: true },
          { type: "stat", stat: "coolness", delta: 4 },
          { type: "subordinateMorale", delta: 10 },
          { type: "superiorTrust", delta: 6 },
        ],
      },
    ],
  },
  {
    id: "mission-kambara-resolution",
    title: "Mission terminee",
    description: "L'operation dans la region de Kambara s'acheve. Le bilan est desormais connu.",
    category: "mission",
    condition: (state) => state.flags["kambara-acted"] === true,
    mission: {
      id: "kambara",
      title: "Operation Kambara",
      objective: "Retablir le controle de l'Etat sur la zone.",
      difficulty: "modere",
      phase: "resolution",
    },
    choices: [
      {
        id: "close-mission",
        label: "Cloturer la mission et faire ton rapport",
        effects: [
          { type: "careerPerformance", delta: 10 },
          { type: "stat", stat: "reputation", delta: 6 },
          { type: "money", delta: 300, source: "salaire" },
          { type: "world", key: "security", delta: 3 },
          { type: "flag", flag: "kambara-briefed", value: false },
          { type: "flag", flag: "kambara-acted", value: false },
          { type: "flag", flag: "kambara-approach-fast", value: false },
          { type: "flag", flag: "kambara-approach-cautious", value: false },
          { type: "flag", flag: "kambara-approach-negotiate", value: false },
        ],
        hiddenEffects: [{ type: "world", key: "socialTension", delta: 2 }],
      },
    ],
  },
];
