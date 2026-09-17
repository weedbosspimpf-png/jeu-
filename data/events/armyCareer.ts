import type { GameEvent, GameState } from "@/engine/types";

/**
 * Evenements de carriere militaire au-dela des epreuves de formation
 * (armyTraining.ts) : la meme carriere peut produire un militaire
 * discipline et loyal aux institutions, un opportuniste corrompu, un
 * meneur d'hommes empathique ou un general assoiffe de pouvoir, selon les
 * choix faits a chaque grade. Aucune option n'est presentee comme
 * moralement superieure : chaque choix a un cout et un benefice.
 */

function isArmyRank(state: GameState, ranks: string[]): boolean {
  return state.career.currentTrack === "army" && ranks.includes(state.career.currentRankId ?? "");
}

export const armyCareerEvents: GameEvent[] = [
  {
    id: "army-recruit-cheating",
    title: "Un camarade a triche",
    description:
      "Tu decouvres qu'un camarade de section a truque un exercice note pour ameliorer son classement.",
    category: "army-career",
    once: true,
    condition: (state) => isArmyRank(state, ["recrue", "caporal"]),
    choices: [
      {
        id: "denounce",
        label: "Le signaler a l'instructeur",
        effects: [
          { type: "stat", stat: "integrity", delta: 6 },
          { type: "stat", stat: "reputation", delta: 3 },
          {
            type: "relationshipInit",
            npcId: "camarade",
            name: "Sory",
            role: "Camarade de section",
          },
          { type: "relationshipStatus", npcId: "camarade", status: "rival" },
        ],
      },
      {
        id: "cover",
        label: "Couvrir pour lui, par esprit de corps",
        effects: [
          { type: "stat", stat: "loyalty", delta: 6 },
          { type: "stat", stat: "integrity", delta: -4 },
          {
            type: "relationshipInit",
            npcId: "camarade",
            name: "Sory",
            role: "Camarade de section",
          },
          { type: "relationship", npcId: "camarade", trust: 15, loyalty: 15 },
          { type: "relationshipStatus", npcId: "camarade", status: "allie" },
        ],
      },
      {
        id: "exploit",
        label: "Garder l'information pour t'en servir plus tard",
        effects: [
          { type: "stat", stat: "opportunism", delta: 8 },
          { type: "stat", stat: "greed", delta: 3 },
          { type: "stat", stat: "integrity", delta: -6 },
          {
            type: "relationshipInit",
            npcId: "camarade",
            name: "Sory",
            role: "Camarade de section",
          },
          { type: "relationship", npcId: "camarade", trust: -10 },
          { type: "flag", flag: "leveraged-camarade-secret", value: true },
        ],
      },
      {
        id: "ignore",
        label: "Ne rien faire, ce n'est pas ton affaire",
        effects: [{ type: "stat", stat: "empathy", delta: -2 }],
      },
    ],
  },
  {
    id: "army-officer-mentorship",
    title: "Un subordonne en difficulte",
    description:
      "Un jeune soldat sous tes ordres accumule les echecs et risque d'etre ecarte. Tu peux l'aider ou te concentrer sur ton propre dossier de promotion.",
    category: "army-career",
    cooldown: 3,
    condition: (state) => isArmyRank(state, ["officier", "commandant", "colonel"]),
    choices: [
      {
        id: "mentor",
        label: "Prendre le temps de le former personnellement",
        effects: [
          { type: "stat", stat: "empathy", delta: 8 },
          { type: "stat", stat: "leadership", delta: 3 },
          { type: "careerPerformance", delta: 2 },
          {
            type: "relationshipInit",
            npcId: "subordonne",
            name: "Yannick",
            role: "Subordonne",
          },
          { type: "relationship", npcId: "subordonne", trust: 20, loyalty: 20 },
        ],
      },
      {
        id: "focus-self",
        label: "Te concentrer sur ton propre dossier",
        effects: [
          { type: "stat", stat: "ambition", delta: 6 },
          { type: "stat", stat: "opportunism", delta: 4 },
          { type: "stat", stat: "empathy", delta: -4 },
          { type: "careerPerformance", delta: 5 },
        ],
      },
    ],
  },
  {
    id: "army-supply-kickback",
    title: "Une commission sur un marche de fournitures",
    description:
      "Un fournisseur propose de gonfler discretement une facture de materiel en echange d'une commission versee sur ton compte personnel.",
    category: "army-career",
    once: true,
    condition: (state) => isArmyRank(state, ["officier", "commandant", "colonel", "general"]),
    choices: [
      {
        id: "accept",
        label: "Accepter la commission",
        effects: [
          { type: "money", delta: 600 },
          { type: "stat", stat: "greed", delta: 8 },
          { type: "stat", stat: "opportunism", delta: 6 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -10 }],
        delayedEffects: [
          {
            delay: 5,
            note: "Un audit des marches militaires ressort d'anciennes surfacturations.",
            effects: [
              { type: "stat", stat: "reputation", delta: -15 },
              { type: "careerPerformance", delta: -12 },
            ],
          },
        ],
      },
      {
        id: "refuse",
        label: "Refuser",
        effects: [
          { type: "stat", stat: "integrity", delta: 6 },
          { type: "stat", stat: "reputation", delta: 3 },
        ],
      },
      {
        id: "report",
        label: "Denoncer la tentative de corruption",
        effects: [
          { type: "stat", stat: "integrity", delta: 10 },
          { type: "stat", stat: "reputation", delta: 6 },
          { type: "flag", flag: "reported-supply-corruption", value: true },
        ],
      },
      {
        id: "negotiate",
        label: "Negocier une commission plus modeste, pour toi et ton unite",
        effects: [
          { type: "money", delta: 250 },
          { type: "stat", stat: "greed", delta: 3 },
          { type: "stat", stat: "integrity", delta: -4 },
          { type: "stat", stat: "diplomacy", delta: 3 },
        ],
      },
    ],
  },
  {
    id: "army-superior-embezzlement",
    title: "Ton superieur te demande de te taire",
    description:
      "Tu decouvres une irregularite dans la gestion des fonds de l'unite. Ton superieur te demande de garder le silence, en echange d'un service futur.",
    category: "army-career",
    once: true,
    condition: (state) =>
      isArmyRank(state, ["officier", "commandant", "colonel", "general"]) &&
      state.relationships["mentor"] !== undefined,
    choices: [
      {
        id: "report-chain",
        label: "Signaler l'irregularite par la voie hierarchique officielle",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "authority", delta: 3 },
          { type: "relationship", npcId: "mentor", trust: -15, loyalty: -10 },
          { type: "relationshipStatus", npcId: "mentor", status: "rival" },
          { type: "flag", flag: "reported-superior-embezzlement", value: true },
        ],
      },
      {
        id: "protect-superior",
        label: "Proteger ton superieur et garder le silence",
        effects: [
          { type: "stat", stat: "loyalty", delta: 8 },
          { type: "relationship", npcId: "mentor", trust: 20, loyalty: 20 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -6 }],
        delayedEffects: [
          {
            delay: 6,
            note: "Une inspection finit par remonter jusqu'a l'affaire que tu avais couverte.",
            effects: [
              { type: "stat", stat: "reputation", delta: -10 },
              { type: "careerPerformance", delta: -8 },
            ],
          },
        ],
      },
      {
        id: "accept-favor",
        label: "Accepter l'arrangement et en profiter toi aussi",
        effects: [
          { type: "money", delta: 400 },
          { type: "stat", stat: "greed", delta: 10 },
          { type: "stat", stat: "opportunism", delta: 8 },
          { type: "relationship", npcId: "mentor", trust: 15 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -10 }],
      },
      {
        id: "negotiate-quiet-fix",
        label: "Negocier une correction discrete, sans denonciation ni argent",
        effects: [
          { type: "money", delta: 150 },
          { type: "stat", stat: "integrity", delta: -3 },
          { type: "relationship", npcId: "mentor", trust: 5 },
        ],
      },
    ],
  },
  {
    id: "army-crime-network-contact",
    title: "Un ancien camarade a change de vie",
    description:
      "Un ancien camarade d'armee, aujourd'hui lie a un reseau fictif de contrebande pres d'une zone militaire, te propose fermer les yeux en echange d'une protection mutuelle.",
    category: "army-career",
    once: true,
    condition: (state) => isArmyRank(state, ["commandant", "colonel", "general"]),
    choices: [
      {
        id: "accept-protection",
        label: "Accepter l'arrangement",
        effects: [
          { type: "money", delta: 500 },
          { type: "stat", stat: "greed", delta: 8 },
          { type: "stat", stat: "opportunism", delta: 6 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -10 }],
        delayedEffects: [
          {
            delay: 5,
            note: "Une enquete de securite interieure met au jour ce reseau, et ton nom avec.",
            effects: [
              { type: "world", key: "security", delta: -3 },
              { type: "stat", stat: "reputation", delta: -18 },
              { type: "careerPerformance", delta: -15 },
            ],
          },
        ],
      },
      {
        id: "report-contact",
        label: "Denoncer ce contact aux services competents",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "reputation", delta: 5 },
          {
            type: "relationshipInit",
            npcId: "ancien-camarade-reseau",
            name: "Sory",
            role: "Ancien camarade, reseau fictif",
          },
          { type: "relationshipStatus", npcId: "ancien-camarade-reseau", status: "ennemi" },
        ],
      },
      {
        id: "decline-quiet",
        label: "Refuser sans le denoncer, pour couper les liens discretement",
        effects: [{ type: "stat", stat: "integrity", delta: 3 }],
      },
      {
        id: "trade-information",
        label: "Echanger des informations utiles sans argent ni protection directe",
        effects: [
          { type: "stat", stat: "influence", delta: 5 },
          { type: "stat", stat: "integrity", delta: -2 },
        ],
      },
    ],
  },
  {
    id: "army-general-president-bond",
    title: "Premiere rencontre avec le president",
    description:
      "Devenu general, tu es recu par le president de la Republique. La nature de ta loyaute future se decide en partie ici : a l'homme, a l'institution, ou a tes propres interets.",
    category: "army-career",
    once: true,
    condition: (state) => isArmyRank(state, ["general"]),
    choices: [
      {
        id: "loyal-to-man",
        label: "Te presenter comme un soutien personnel loyal",
        effects: [
          { type: "relationship", npcId: "president", trust: 20, loyalty: 20 },
          { type: "stat", stat: "loyalty", delta: 5 },
          { type: "flag", flag: "general-loyal-to-president", value: true },
        ],
      },
      {
        id: "loyal-to-institutions",
        label: "Affirmer ta loyaute aux institutions avant tout",
        effects: [
          { type: "stat", stat: "authority", delta: 5 },
          { type: "stat", stat: "integrity", delta: 4 },
          { type: "relationship", npcId: "president", trust: 5 },
          { type: "flag", flag: "general-institutionalist", value: true },
        ],
      },
      {
        id: "cultivate-own-power",
        label: "Profiter de l'occasion pour cultiver ton propre reseau d'influence",
        effects: [
          { type: "stat", stat: "opportunism", delta: 8 },
          { type: "stat", stat: "influence", delta: 6 },
          { type: "relationship", npcId: "president", trust: -5 },
          { type: "flag", flag: "general-self-interested", value: true },
        ],
      },
    ],
  },
  {
    id: "army-general-political-crisis",
    title: "Crise politique",
    description:
      "Des manifestations degenerent et la stabilite du pays est menacee. Le gouvernement attend une reponse claire de la hierarchie militaire.",
    category: "army-career",
    cooldown: 4,
    condition: (state) =>
      isArmyRank(state, ["general"]) &&
      (state.world.values.socialTension >= 60 || state.world.values.stability < 45),
    choices: [
      {
        id: "support-crackdown",
        label: "Soutenir une reponse fermement ordonnee par le pouvoir",
        effects: [
          { type: "relationship", npcId: "president", trust: 15, loyalty: 10 },
          { type: "stat", stat: "authority", delta: 5 },
          { type: "world", key: "stability", delta: 5 },
        ],
        hiddenEffects: [
          { type: "world", key: "socialTension", delta: 5 },
          { type: "stat", stat: "publicTrust", delta: -10 },
        ],
      },
      {
        id: "defend-institutions",
        label: "Defendre un cadre institutionnel neutre, sans parti pris",
        effects: [
          { type: "stat", stat: "authority", delta: 8 },
          { type: "stat", stat: "integrity", delta: 5 },
          { type: "relationship", npcId: "president", trust: -5 },
          { type: "world", key: "stability", delta: 3 },
        ],
      },
      {
        id: "side-population",
        label: "Prendre en compte les revendications de la population",
        effects: [
          { type: "stat", stat: "publicTrust", delta: 10 },
          { type: "stat", stat: "popularity", delta: 8 },
          { type: "relationship", npcId: "president", trust: -20, loyalty: -10 },
          { type: "world", key: "govPopularity", delta: -5 },
        ],
      },
      {
        id: "exploit-chaos",
        label: "Profiter du chaos pour renforcer ta propre position",
        effects: [
          { type: "stat", stat: "opportunism", delta: 10 },
          { type: "stat", stat: "influence", delta: 10 },
          { type: "stat", stat: "greed", delta: 5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -10 }],
        delayedEffects: [
          {
            delay: 3,
            note: "Des rumeurs circulent sur tes manoeuvres personnelles pendant la crise.",
            effects: [{ type: "stat", stat: "reputation", delta: -10 }],
          },
        ],
      },
    ],
  },
];
