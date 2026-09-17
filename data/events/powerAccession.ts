import type { GameEvent, GameState } from "@/engine/types";

/**
 * Plusieurs voies fictives d'acceder au pouvoir supreme, toutes
 * convergeant vers le meme effet moteur (becomePresident) mais avec des
 * conditions, des couts et des consequences tres differents :
 * - voie electorale (campagne -> election, calculee par le moteur,
 *   jamais garantie meme avec une forte popularite) ;
 * - transition de crise institutionnelle (rare, contextuelle) ;
 * - prise de pouvoir par la force (extremement rare, traitee comme une
 *   simulation abstraite : aucune procedure operationnelle reelle).
 * Une defaite ne met jamais fin a la partie (sauf en cas de coup echoue,
 * consequence narrative choisie, pas un game over automatique du systeme).
 */

const CRISIS_REGIMES = ["unstable", "repressive", "transitional"] as const;
const COUP_REGIMES = ["unstable", "authoritarian", "repressive"] as const;

function isTrackRank(state: GameState, track: string, ranks: string[]): boolean {
  return state.career.currentTrack === track && ranks.includes(state.career.currentRankId ?? "");
}

export const powerAccessionEvents: GameEvent[] = [
  // --- Campagne : construire popularite et soutiens avant une election ---
  {
    id: "politics-campaign-activity",
    title: "Une occasion de faire campagne",
    description: "Il est temps de decider comment employer ton temps et tes ressources pour ta carriere politique.",
    category: "power-accession",
    cooldown: 2,
    condition: (state) =>
      isTrackRank(state, "politics", ["militant", "responsable-local", "elu", "ministre", "candidat"]),
    choices: [
      {
        id: "meeting-capitale",
        label: "Organiser un grand meeting dans la capitale",
        effects: [
          { type: "money", delta: -200 },
          { type: "regionalPopularity", region: "capitale", delta: 8 },
          { type: "stat", stat: "charisma", delta: 3 },
          { type: "stat", stat: "popularity", delta: 3 },
        ],
      },
      {
        id: "tour-regions",
        label: "Partir en tournee dans les regions",
        effects: [
          { type: "money", delta: -150 },
          { type: "regionalPopularity", region: "nord", delta: 5 },
          { type: "regionalPopularity", region: "centre", delta: 5 },
          { type: "regionalPopularity", region: "sud", delta: 5 },
          { type: "stat", stat: "publicTrust", delta: 4 },
        ],
      },
      {
        id: "debate-appearance",
        label: "Participer a un debat public",
        effects: [
          { type: "stat", stat: "reputation", delta: 4 },
          { type: "stat", stat: "popularity", delta: 3 },
        ],
      },
      {
        id: "grassroots-mobilization",
        label: "Mobiliser un reseau de soutiens locaux",
        effects: [
          { type: "ambition", key: "influence", delta: 6 },
          { type: "regionalPopularity", region: "centre", delta: 6 },
          { type: "stat", stat: "influence", delta: 3 },
        ],
      },
    ],
  },

  // --- Voie electorale ---
  {
    id: "politics-election-bid",
    title: "Se presenter a l'election presidentielle",
    description:
      "Ta trajectoire politique t'a mene assez loin pour envisager une candidature a la presidence. Le resultat n'est jamais garanti.",
    category: "power-accession",
    cooldown: 4,
    condition: (state) =>
      isTrackRank(state, "politics", ["ministre", "candidat"]) &&
      !CRISIS_REGIMES.includes(state.world.regime as (typeof CRISIS_REGIMES)[number]) &&
      state.world.regime !== "authoritarian" &&
      state.flags["became-president"] !== true,
    choices: [
      {
        id: "run-for-president",
        label: "Te presenter a l'election presidentielle",
        effects: [
          { type: "money", delta: -400 },
          { type: "resolvePresidentialElection" },
        ],
      },
      {
        id: "wait-election",
        label: "Attendre une meilleure occasion",
        effects: [{ type: "ambition", key: "politique", delta: 2 }],
      },
    ],
  },
  {
    id: "election-victory",
    title: "Victoire electorale",
    description: "Les resultats sont sans ambiguite : tu es elu president de la Republique.",
    category: "power-accession",
    weight: 50,
    condition: (state) => state.flags["election-result-pending"] === true && state.flags["election-won"] === true,
    choices: [
      {
        id: "accept-victory",
        label: "Assumer la victoire et prendre tes fonctions",
        effects: [
          { type: "flag", flag: "election-result-pending", value: false },
          { type: "flag", flag: "election-won", value: false },
          { type: "becomePresident", mode: "election" },
          { type: "joinCareer", track: "politics", rankId: "president" },
          { type: "ambition", key: "politique", delta: 15 },
        ],
      },
    ],
  },
  {
    id: "election-defeat-incumbent",
    title: "Defaite a la reelection",
    description: "Malgre ton mandat, les electeurs ont choisi un autre candidat. Ton mandat s'acheve.",
    category: "power-accession",
    weight: 50,
    condition: (state) =>
      state.flags["election-result-pending"] === true &&
      state.flags["election-won"] === false &&
      state.career.currentRankId === "president",
    choices: [
      {
        id: "step-down",
        label: "Ceder le pouvoir dans le respect des institutions",
        effects: [
          { type: "flag", flag: "election-result-pending", value: false },
          { type: "flag", flag: "election-won", value: false },
          { type: "joinCareer", track: "politics", rankId: "ministre" },
          { type: "stat", stat: "reputation", delta: -10 },
          { type: "stat", stat: "popularity", delta: -10 },
          { type: "ambition", key: "institutions", delta: 6 },
        ],
      },
    ],
  },
  {
    id: "election-defeat-candidate",
    title: "Defaite electorale",
    description: "Ta candidature n'a pas convaincu suffisamment d'electeurs cette fois-ci.",
    category: "power-accession",
    weight: 50,
    condition: (state) =>
      state.flags["election-result-pending"] === true &&
      state.flags["election-won"] === false &&
      state.career.currentRankId !== "president",
    choices: [
      {
        id: "accept-defeat",
        label: "Accepter la defaite et continuer ta carriere",
        effects: [
          { type: "flag", flag: "election-result-pending", value: false },
          { type: "flag", flag: "election-won", value: false },
          { type: "stat", stat: "popularity", delta: -15 },
          { type: "stat", stat: "reputation", delta: -8 },
        ],
      },
      {
        id: "contest-result",
        label: "Contester publiquement le resultat",
        effects: [
          { type: "flag", flag: "election-result-pending", value: false },
          { type: "flag", flag: "election-won", value: false },
          { type: "stat", stat: "opportunism", delta: 6 },
          { type: "stat", stat: "publicTrust", delta: -6 },
        ],
      },
    ],
  },

  // --- Voie de la transition de crise ---
  {
    id: "politics-transition-bid",
    title: "Une transition en gestation",
    description:
      "L'instabilite institutionnelle s'aggrave. Certains milieux politiques evoquent la necessite d'une figure de transition.",
    category: "power-accession",
    cooldown: 5,
    condition: (state) =>
      isTrackRank(state, "politics", ["ministre", "candidat"]) &&
      CRISIS_REGIMES.includes(state.world.regime as (typeof CRISIS_REGIMES)[number]) &&
      state.world.values.stability < 40,
    choices: [
      {
        id: "seek-transition-role",
        label: "Te positionner comme figure centrale de la transition",
        effects: [{ type: "resolveCrisisTransition" }],
      },
      {
        id: "avoid-transition-role",
        label: "Rester en retrait de cette crise",
        effects: [{ type: "ambition", key: "stabilite", delta: 4 }],
      },
    ],
  },
  {
    id: "army-transition-bid",
    title: "Une transition en gestation",
    description:
      "L'instabilite institutionnelle s'aggrave. Ton autorite militaire pourrait faire de toi une figure de transition credible.",
    category: "power-accession",
    cooldown: 5,
    condition: (state) =>
      isTrackRank(state, "army", ["general"]) &&
      CRISIS_REGIMES.includes(state.world.regime as (typeof CRISIS_REGIMES)[number]) &&
      state.world.values.stability < 40,
    choices: [
      {
        id: "seek-transition-role",
        label: "Te positionner comme figure centrale de la transition",
        effects: [{ type: "resolveCrisisTransition" }],
      },
      {
        id: "avoid-transition-role",
        label: "Rester loyal a ta fonction militaire actuelle",
        effects: [{ type: "ambition", key: "institutions", delta: 4 }],
      },
    ],
  },
  {
    id: "transition-victory",
    title: "Une transition politique t'installe au pouvoir",
    description:
      "Au terme d'une periode agitee, tu deviens la figure de transition reconnue par les principales forces du pays.",
    category: "power-accession",
    weight: 50,
    condition: (state) => state.flags["transition-result-pending"] === true && state.flags["transition-won"] === true,
    choices: [
      {
        id: "accept-transition-power",
        label: "Assumer ce role de transition",
        effects: [
          { type: "flag", flag: "transition-result-pending", value: false },
          { type: "flag", flag: "transition-won", value: false },
          { type: "becomePresident", mode: "crisis-transition" },
          { type: "joinCareer", track: "politics", rankId: "president" },
          { type: "regimeShift", regime: "transitional" },
          { type: "stat", stat: "authority", delta: 10 },
        ],
      },
    ],
  },
  {
    id: "transition-defeat",
    title: "La transition t'echappe",
    description: "D'autres acteurs, plus habiles ou mieux places, s'imposent dans la periode de transition.",
    category: "power-accession",
    weight: 50,
    condition: (state) => state.flags["transition-result-pending"] === true && state.flags["transition-won"] === false,
    choices: [
      {
        id: "withdraw",
        label: "Te retirer de cette confrontation politique",
        effects: [
          { type: "flag", flag: "transition-result-pending", value: false },
          { type: "flag", flag: "transition-won", value: false },
          { type: "stat", stat: "authority", delta: -10 },
          { type: "stat", stat: "influence", delta: -10 },
        ],
      },
    ],
  },

  // --- Voie de la force (extremement rare, purement abstraite) ---
  {
    id: "army-coup-attempt",
    title: "Une tentation dangereuse",
    description:
      "Dans un pays fragilise, certains de tes soutiens au sein de l'armee evoquent la possibilite de prendre le controle de l'Etat. " +
      "Rien n'est encore engage : la decision t'appartient entierement.",
    category: "power-accession",
    cooldown: 6,
    weight: 0.4,
    condition: (state) =>
      isTrackRank(state, "army", ["general"]) &&
      state.character.stats.authority >= 65 &&
      state.character.stats.influence >= 65 &&
      COUP_REGIMES.includes(state.world.regime as (typeof COUP_REGIMES)[number]) &&
      state.flags["became-president"] !== true,
    choices: [
      {
        id: "attempt-coup",
        label: "Chercher a prendre le controle de l'Etat",
        effects: [{ type: "resolveCoupAttempt" }],
      },
      {
        id: "renounce-coup",
        label: "Renoncer et rester loyal a l'ordre constitutionnel",
        effects: [
          { type: "ambition", key: "institutions", delta: 8 },
          { type: "stat", stat: "integrity", delta: 5 },
        ],
      },
    ],
  },
  {
    id: "coup-victory",
    title: "Prise de controle de l'Etat",
    description:
      "Ta tentative reussit : les principales institutions de securite se rallient a toi. Tu prends le controle de l'Etat.",
    category: "power-accession",
    weight: 50,
    condition: (state) => state.flags["coup-result-pending"] === true && state.flags["coup-won"] === true,
    choices: [
      {
        id: "consolidate-power",
        label: "Consolider ta prise de pouvoir",
        effects: [
          { type: "flag", flag: "coup-result-pending", value: false },
          { type: "flag", flag: "coup-won", value: false },
          { type: "becomePresident", mode: "coup" },
          { type: "joinCareer", track: "politics", rankId: "president" },
          { type: "regimeShift", regime: "unstable" },
          { type: "world", key: "stability", delta: -20 },
          { type: "world", key: "foreignRelations", delta: -15 },
        ],
      },
    ],
  },
  {
    id: "coup-defeat",
    title: "La tentative echoue",
    description:
      "Les forces restees loyales aux institutions dejouent la tentative. Les consequences pour toi sont severes.",
    category: "power-accession",
    weight: 50,
    condition: (state) => state.flags["coup-result-pending"] === true && state.flags["coup-won"] === false,
    choices: [
      {
        id: "face-consequences",
        label: "Faire face aux consequences",
        effects: [
          { type: "flag", flag: "coup-result-pending", value: false },
          { type: "flag", flag: "coup-won", value: false },
          { type: "flag", flag: "arrested", value: true },
          { type: "stat", stat: "authority", delta: -30 },
          { type: "stat", stat: "influence", delta: -40 },
        ],
      },
    ],
  },
];
