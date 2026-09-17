import type { GameEvent, GameState } from "@/engine/types";

/**
 * Deux directions hierarchiques distinctes : la confiance de mes
 * superieurs et le moral/loyaute de mes subordonnes evoluent
 * independamment (voir CareerState.superiorTrust/subordinateMorale).
 * On peut etre appreci  de ses hommes et mal vu de sa hierarchie, ou
 * l'inverse - ce sont ces evenements qui creent cette tension.
 */

const HIERARCHICAL_TRACKS = ["army", "police", "gendarmerie"];
const LEADERSHIP_RANKS: Record<string, string[]> = {
  army: ["officier", "commandant", "colonel", "general"],
  police: ["enqueteur", "responsable"],
  gendarmerie: ["officier-gendarmerie", "commandement"],
};

function inLeadershipRank(state: GameState): boolean {
  const track = state.career.currentTrack ?? "";
  if (!HIERARCHICAL_TRACKS.includes(track)) return false;
  return (LEADERSHIP_RANKS[track] ?? []).includes(state.career.currentRankId ?? "");
}

export const leadershipManagementEvents: GameEvent[] = [
  {
    id: "leadership-favor-troops-or-superiors",
    title: "Un arbitrage delicat",
    description:
      "Une decision a prendre va forcement favoriser soit tes hommes, soit les attentes de ta hierarchie. Difficile de contenter les deux a la fois.",
    category: "leadership",
    cooldown: 3,
    condition: inLeadershipRank,
    choices: [
      {
        id: "favor-troops",
        label: "Prendre le parti de tes hommes",
        effects: [
          { type: "subordinateMorale", delta: 10 },
          { type: "superiorTrust", delta: -8 },
          { type: "stat", stat: "empathy", delta: 3 },
        ],
      },
      {
        id: "favor-superiors",
        label: "Prendre le parti de ta hierarchie",
        effects: [
          { type: "superiorTrust", delta: 10 },
          { type: "subordinateMorale", delta: -8 },
          { type: "stat", stat: "opportunism", delta: 3 },
        ],
      },
      {
        id: "balance-both",
        label: "Chercher un compromis diplomatique",
        effects: [
          { type: "subordinateMorale", delta: 3 },
          { type: "superiorTrust", delta: 3 },
          { type: "stat", stat: "diplomacy", delta: 3 },
        ],
      },
    ],
  },
  {
    id: "leadership-crisis-of-confidence",
    title: "Une crise de confiance chez tes hommes",
    description: "Le moral de tes subordonnes s'effondre. Une reaction est necessaire.",
    category: "leadership",
    cooldown: 4,
    condition: (state) => inLeadershipRank(state) && state.career.subordinateMorale <= 25,
    choices: [
      {
        id: "address-concerns",
        label: "Ecouter leurs preoccupations et y repondre",
        effects: [
          { type: "subordinateMorale", delta: 20 },
          { type: "careerPerformance", delta: -5 },
        ],
      },
      {
        id: "discipline-crackdown",
        label: "Reimposer la discipline fermement",
        effects: [
          { type: "superiorTrust", delta: 10 },
          { type: "subordinateMorale", delta: -10 },
          { type: "stat", stat: "authority", delta: 5 },
        ],
      },
      {
        id: "ignore-crisis",
        label: "Ne rien changer",
        effects: [{ type: "careerPerformance", delta: -10 }],
      },
    ],
  },
  {
    id: "leadership-superior-scrutiny",
    title: "Ta hierarchie doute de toi",
    description: "La confiance de tes superieurs envers toi s'est degradee. Ta position devient fragile.",
    category: "leadership",
    cooldown: 4,
    condition: (state) => inLeadershipRank(state) && state.career.superiorTrust <= 25,
    choices: [
      {
        id: "rebuild-trust",
        label: "Investir du temps pour rebatir la confiance",
        effects: [
          { type: "superiorTrust", delta: 20 },
          { type: "careerPerformance", delta: -5 },
        ],
      },
      {
        id: "rely-on-troops",
        label: "T'appuyer sur la loyaute de tes hommes pour tenir malgre tout",
        effects: [
          { type: "subordinateMorale", delta: -5 },
          { type: "stat", stat: "authority", delta: 3 },
        ],
      },
      {
        id: "risk-it",
        label: "Ne rien faire et assumer le risque",
        effects: [{ type: "careerPerformance", delta: -10 }],
      },
    ],
  },
  {
    id: "army-colonel-resource-rivalry",
    title: "Une rivalite pour des ressources limitees",
    description:
      "Un autre colonel revendique les memes ressources et les memes soutiens au sein du haut commandement que toi.",
    category: "leadership",
    once: true,
    condition: (state) => state.career.currentTrack === "army" && state.career.currentRankId === "colonel",
    choices: [
      {
        id: "cooperate-with-rival",
        label: "Proposer une repartition cooperative des ressources",
        effects: [
          { type: "stat", stat: "diplomacy", delta: 6 },
          { type: "superiorTrust", delta: 8 },
        ],
      },
      {
        id: "outmaneuver-rival",
        label: "Manoeuvrer pour l'emporter seul",
        effects: [
          { type: "stat", stat: "opportunism", delta: 6 },
          { type: "stat", stat: "authority", delta: 5 },
        ],
        hiddenEffects: [{ type: "relationshipStatus", npcId: "rival", status: "rival" }],
      },
      {
        id: "appeal-to-high-command",
        label: "En referer directement au haut commandement",
        effects: [
          { type: "stat", stat: "authority", delta: 4 },
          { type: "superiorTrust", delta: 10 },
        ],
      },
    ],
  },
  {
    id: "entrepreneur-board-conflict",
    title: "Le conseil d'administration se divise",
    description:
      "Ton conseil d'administration est divise entre expansion agressive et prudence financiere. Il attend ton arbitrage.",
    category: "leadership",
    once: true,
    condition: (state) => state.career.currentTrack === "entrepreneur" && state.career.currentRankId === "dirigeant",
    choices: [
      {
        id: "expand-aggressively",
        label: "Trancher pour une expansion agressive",
        effects: [
          { type: "money", delta: -3000 },
          { type: "ambition", key: "richesse", delta: 8 },
          { type: "stat", stat: "ambition", delta: 5 },
        ],
      },
      {
        id: "stay-conservative",
        label: "Privilegier une gestion prudente",
        effects: [
          { type: "ambition", key: "stabilite", delta: 6 },
          { type: "stat", stat: "prudence", delta: 4 },
        ],
      },
      {
        id: "negotiate-board",
        label: "Negocier un compromis avec le conseil",
        effects: [{ type: "stat", stat: "diplomacy", delta: 5 }],
      },
    ],
  },
  {
    id: "politics-elu-alliance-choice",
    title: "Choisir ton camp au parlement",
    description: "Ton mandat te force a choisir : rejoindre la majorite, rejoindre l'opposition, ou rester independant.",
    category: "leadership",
    once: true,
    condition: (state) => state.career.currentTrack === "politics" && state.career.currentRankId === "elu",
    choices: [
      {
        id: "join-majority",
        label: "Rejoindre l'alliance majoritaire",
        effects: [
          { type: "relationship", npcId: "president", trust: 10 },
          { type: "ambition", key: "institutions", delta: 5 },
        ],
      },
      {
        id: "join-opposition",
        label: "Rejoindre l'opposition",
        effects: [
          { type: "relationship", npcId: "president", trust: -10 },
          { type: "ambition", key: "reforme", delta: 6 },
          { type: "stat", stat: "courage", delta: 4 },
        ],
      },
      {
        id: "stay-independent",
        label: "Rester independant de toute alliance",
        effects: [{ type: "stat", stat: "integrity", delta: 5 }],
      },
    ],
  },
  {
    id: "presidency-power-consolidation",
    title: "Consolider ton pouvoir",
    description:
      "Chaque orientation de gouvernance cree des compromis : renforcer un secteur signifie souvent en negliger un autre.",
    category: "leadership",
    cooldown: 4,
    condition: (state) => state.career.currentRankId === "president",
    choices: [
      {
        id: "strengthen-institutions",
        label: "Renforcer les institutions",
        effects: [
          { type: "presidentTrait", trait: "institutionalRespect", delta: 10 },
          { type: "stat", stat: "authority", delta: 5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "popularity", delta: -3 }],
      },
      {
        id: "invest-public-services",
        label: "Investir dans les services publics",
        effects: [
          { type: "stat", stat: "publicTrust", delta: 8 },
          { type: "world", key: "socialTension", delta: -3 },
        ],
        hiddenEffects: [{ type: "world", key: "economy", delta: -3 }],
      },
      {
        id: "negotiate-opponents",
        label: "Negocier avec les opposants",
        effects: [
          { type: "presidentTrait", trait: "legitimacy", delta: 6 },
          { type: "stat", stat: "diplomacy", delta: 5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "authority", delta: -3 }],
      },
      {
        id: "build-alliances",
        label: "Construire de nouvelles alliances politiques",
        effects: [
          { type: "stat", stat: "influence", delta: 6 },
          { type: "presidentTrait", trait: "popularity", delta: 4 },
        ],
      },
    ],
  },
  {
    id: "presidency-military-relationship",
    title: "La relation avec les forces armees",
    description:
      "Le haut commandement attend une decision claire sur le budget et le role des forces de securite. Aucune option n'est neutre.",
    category: "leadership",
    cooldown: 4,
    condition: (state) => state.career.currentRankId === "president",
    choices: [
      {
        id: "increase-military-budget",
        label: "Augmenter significativement le budget militaire",
        effects: [
          { type: "world", key: "militaryPower", delta: 8 },
          { type: "presidentTrait", trait: "militarySupport", delta: 10 },
        ],
        hiddenEffects: [{ type: "world", key: "economy", delta: -5 }],
      },
      {
        id: "professionalize-forces",
        label: "Investir dans la professionnalisation plutot que dans les effectifs",
        effects: [
          { type: "world", key: "militaryPower", delta: 3 },
          { type: "stat", stat: "publicTrust", delta: 5 },
          { type: "presidentTrait", trait: "militarySupport", delta: 5 },
        ],
      },
      {
        id: "reduce-military-budget",
        label: "Reduire le budget militaire pour financer d'autres priorites",
        effects: [
          { type: "world", key: "economy", delta: 5 },
          { type: "presidentTrait", trait: "militarySupport", delta: -10 },
        ],
        hiddenEffects: [{ type: "world", key: "stability", delta: -3 }],
      },
    ],
  },
];
