import type { GameEvent } from "@/engine/types";

/**
 * Devenir president n'est jamais une fin en soi : cette phase de
 * gouvernement se poursuit ensuite (economie, securite, relations
 * internationales, reelection ou succession), et la maniere dont le
 * pouvoir a ete obtenu (election, transition, coup - voir
 * powerAccession.ts) continue d'influencer la legitimite et les options
 * disponibles.
 */

const isPresident = (state: Parameters<GameEvent["condition"]>[0]) => state.career.currentRankId === "president";

export const presidencyGovernanceEvents: GameEvent[] = [
  {
    id: "presidency-economic-policy",
    title: "Une decision budgetaire",
    description: "Ton gouvernement doit trancher une orientation economique majeure pour le pays.",
    category: "presidency",
    cooldown: 3,
    condition: isPresident,
    choices: [
      {
        id: "stimulus",
        label: "Lancer un plan de relance",
        effects: [
          { type: "world", key: "economy", delta: 8 },
          { type: "world", key: "unemployment", delta: -4 },
        ],
        hiddenEffects: [{ type: "world", key: "corruption", delta: 1 }],
      },
      {
        id: "austerity",
        label: "Imposer une politique de rigueur budgetaire",
        effects: [
          { type: "world", key: "stability", delta: 3 },
          { type: "stat", stat: "authority", delta: 4 },
        ],
        hiddenEffects: [
          { type: "world", key: "economy", delta: -3 },
          { type: "world", key: "socialTension", delta: 5 },
        ],
      },
      {
        id: "anti-corruption-reform",
        label: "Lancer une reforme de lutte contre la corruption",
        effects: [
          { type: "world", key: "corruption", delta: -10 },
          { type: "stat", stat: "integrity", delta: 5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "popularity", delta: -3 }],
      },
    ],
  },
  {
    id: "presidency-security-policy",
    title: "La question de la securite",
    description: "La situation securitaire du pays exige une orientation claire de ta part.",
    category: "presidency",
    cooldown: 3,
    condition: isPresident,
    choices: [
      {
        id: "reinforce-security",
        label: "Renforcer massivement les effectifs de securite",
        effects: [{ type: "world", key: "security", delta: 8 }],
        hiddenEffects: [
          { type: "world", key: "socialTension", delta: 3 },
          { type: "stat", stat: "publicTrust", delta: -3 },
        ],
      },
      {
        id: "reform-forces",
        label: "Reformer les forces de l'ordre en profondeur",
        effects: [
          { type: "world", key: "security", delta: 3 },
          { type: "stat", stat: "publicTrust", delta: 8 },
          { type: "stat", stat: "integrity", delta: 3 },
        ],
      },
      {
        id: "cut-security-budget",
        label: "Reduire le budget de la securite pour financer d'autres priorites",
        effects: [{ type: "world", key: "economy", delta: 3 }],
        hiddenEffects: [
          { type: "world", key: "security", delta: -5 },
          { type: "world", key: "militaryPower", delta: -3 },
        ],
      },
    ],
  },
  {
    id: "presidency-international-relations",
    title: "Une question de diplomatie",
    description: "Une occasion se presente de faire evoluer la place du pays sur la scene internationale.",
    category: "presidency",
    cooldown: 4,
    condition: isPresident,
    choices: [
      {
        id: "strengthen-alliances",
        label: "Renforcer les alliances internationales",
        effects: [
          { type: "world", key: "foreignRelations", delta: 8 },
          { type: "stat", stat: "diplomacy", delta: 4 },
        ],
      },
      {
        id: "sovereigntist-stance",
        label: "Adopter une posture souverainiste plus independante",
        effects: [{ type: "stat", stat: "popularity", delta: 5 }],
        hiddenEffects: [{ type: "world", key: "foreignRelations", delta: -5 }],
      },
      {
        id: "negotiate-aid",
        label: "Negocier une aide financiere internationale",
        effects: [
          { type: "world", key: "economy", delta: 5 },
          { type: "world", key: "foreignRelations", delta: 3 },
        ],
        hiddenEffects: [{ type: "world", key: "corruption", delta: 2 }],
      },
    ],
  },
  {
    id: "presidency-reelection-bid",
    title: "La fin du mandat approche",
    description: "Ton mandat presidentiel arrive a echeance. Comment envisages-tu la suite ?",
    category: "presidency",
    cooldown: 5,
    condition: (state) =>
      isPresident(state) && state.career.turnsInRank >= 4 && state.world.regime !== "unstable",
    choices: [
      {
        id: "seek-reelection",
        label: "Te presenter pour un nouveau mandat",
        effects: [
          { type: "money", delta: -400 },
          { type: "resolvePresidentialElection" },
        ],
      },
      {
        id: "voluntary-succession",
        label: "Preparer ta succession et quitter le pouvoir volontairement",
        effects: [
          { type: "joinCareer", track: "civil", rankId: "cadre" },
          { type: "stat", stat: "reputation", delta: 10 },
          { type: "ambition", key: "stabilite", delta: 8 },
          { type: "flag", flag: "voluntary-succession", value: true },
        ],
      },
    ],
  },
];
