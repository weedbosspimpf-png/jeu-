import type { GameEvent, GameState } from "@/engine/types";

/**
 * Boucle de carriere policiere. Le meme metier peut produire un agent
 * integre, un opportuniste qui arrondit les angles, ou un policier
 * pleinement corrompu : aucune de ces trajectoires n'est presentee comme
 * la bonne. Complement de policeMoral.ts (dilemmes deja existants sur le
 * superieur et le terrain) : ici, controles routiers, enquetes,
 * informateurs et collegues veroles.
 */

function isPoliceRank(state: GameState, ranks: string[]): boolean {
  return state.career.currentTrack === "police" && ranks.includes(state.career.currentRankId ?? "");
}

export const policeCareerEvents: GameEvent[] = [
  {
    id: "police-traffic-stop",
    title: "Controle routier",
    description:
      "Tu controles un conducteur clairement en infraction. Il laisse entendre qu'il pourrait 'arranger les choses'.",
    category: "police-career",
    cooldown: 3,
    condition: (state) => isPoliceRank(state, ["agent", "enqueteur"]),
    choices: [
      {
        id: "strict",
        label: "Appliquer la procedure sans exception",
        effects: [
          { type: "stat", stat: "integrity", delta: 5 },
          { type: "stat", stat: "publicTrust", delta: 3 },
          { type: "careerPerformance", delta: 3 },
        ],
      },
      {
        id: "warning",
        label: "Donner un simple avertissement",
        effects: [
          { type: "stat", stat: "empathy", delta: 4 },
          { type: "stat", stat: "publicTrust", delta: 2 },
        ],
      },
      {
        id: "accept-money",
        label: "Accepter l'avantage financier propose",
        effects: [
          { type: "money", delta: 150 },
          { type: "stat", stat: "greed", delta: 6 },
          { type: "stat", stat: "opportunism", delta: 5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -8 }],
        delayedEffects: [
          {
            delay: 4,
            note: "Les affaires internes remontent un signalement d'usagers sur tes controles routiers.",
            effects: [
              { type: "stat", stat: "reputation", delta: -12 },
              { type: "careerPerformance", delta: -8 },
            ],
          },
        ],
      },
      {
        id: "report-attempt",
        label: "Signaler la tentative de corruption",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "reputation", delta: 4 },
          {
            type: "relationshipInit",
            npcId: "automobiliste-influent",
            name: "Un notable local",
            role: "Automobiliste influent",
          },
          { type: "relationshipStatus", npcId: "automobiliste-influent", status: "ennemi" },
        ],
        hiddenEffects: [{ type: "stat", stat: "influence", delta: -3 }],
      },
    ],
  },
  {
    id: "police-corrupt-colleague",
    title: "Un collegue qui derape",
    description:
      "Tu remarques qu'un collegue extorque systematiquement de petits commercants lors de ses rondes.",
    category: "police-career",
    once: true,
    condition: (state) => isPoliceRank(state, ["agent", "enqueteur"]),
    choices: [
      {
        id: "report-colleague",
        label: "Le signaler a la hierarchie",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          {
            type: "relationshipInit",
            npcId: "collegue-corrompu",
            name: "Brigadier Fofana",
            role: "Collegue de service",
          },
          { type: "relationshipStatus", npcId: "collegue-corrompu", status: "ennemi" },
        ],
      },
      {
        id: "join-in",
        label: "Accepter sa proposition de partager les gains",
        effects: [
          { type: "money", delta: 300 },
          { type: "stat", stat: "greed", delta: 8 },
          { type: "stat", stat: "opportunism", delta: 6 },
          {
            type: "relationshipInit",
            npcId: "collegue-corrompu",
            name: "Brigadier Fofana",
            role: "Collegue de service",
          },
          { type: "relationship", npcId: "collegue-corrompu", trust: 20, loyalty: 15 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -10 }],
        delayedEffects: [
          {
            delay: 5,
            note: "Une enquete de moralite finit par toucher tout le groupe implique.",
            effects: [
              { type: "stat", stat: "reputation", delta: -18 },
              { type: "careerPerformance", delta: -15 },
            ],
          },
        ],
      },
      {
        id: "confront-privately",
        label: "Le confronter en prive, sans le denoncer",
        effects: [
          { type: "stat", stat: "courage", delta: 5 },
          {
            type: "relationshipInit",
            npcId: "collegue-corrompu",
            name: "Brigadier Fofana",
            role: "Collegue de service",
          },
          { type: "relationship", npcId: "collegue-corrompu", trust: -10 },
        ],
      },
      {
        id: "ignore-colleague",
        label: "Faire comme si tu n'avais rien vu",
        effects: [{ type: "stat", stat: "opportunism", delta: 3 }],
      },
    ],
  },
  {
    id: "police-investigation-powerful-suspect",
    title: "Une enquete sensible",
    description:
      "Ton enquete mene a une personnalite influente de la region. Poursuivre risque de te creer de puissants ennemis.",
    category: "police-career",
    once: true,
    condition: (state) => isPoliceRank(state, ["enqueteur", "responsable"]),
    choices: [
      {
        id: "pursue",
        label: "Poursuivre l'enquete jusqu'au bout",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "courage", delta: 5 },
          { type: "stat", stat: "reputation", delta: 5 },
        ],
        hiddenEffects: [{ type: "stat", stat: "publicTrust", delta: 5 }],
        delayedEffects: [
          {
            delay: 3,
            note: "La personnalite visee par ton enquete d'alors tente de nuire discretement a ta carriere.",
            effects: [{ type: "careerPerformance", delta: -8 }],
          },
        ],
      },
      {
        id: "drop-quietly",
        label: "Laisser l'enquete s'eteindre discretement",
        effects: [
          { type: "stat", stat: "opportunism", delta: 5 },
          { type: "stat", stat: "integrity", delta: -6 },
        ],
      },
      {
        id: "leak-to-press",
        label: "Transmettre discretement le dossier a un journaliste",
        effects: [
          { type: "stat", stat: "popularity", delta: 6 },
          { type: "stat", stat: "publicTrust", delta: 6 },
          { type: "stat", stat: "integrity", delta: -4 },
        ],
        hiddenEffects: [{ type: "world", key: "govPopularity", delta: -3 }],
      },
      {
        id: "trade-for-career",
        label: "Negocier l'abandon du dossier contre un appui pour ta carriere",
        effects: [
          { type: "stat", stat: "opportunism", delta: 8 },
          { type: "stat", stat: "influence", delta: 6 },
          { type: "stat", stat: "integrity", delta: -8 },
        ],
      },
    ],
  },
  {
    id: "police-informant-relationship",
    title: "Un informateur du quartier",
    description:
      "Un informateur regulier te propose des renseignements utiles, en echange d'argent et d'une certaine protection.",
    category: "police-career",
    cooldown: 4,
    condition: (state) => isPoliceRank(state, ["enqueteur", "responsable"]),
    choices: [
      {
        id: "pay-informant",
        label: "Le remunerer regulierement, dans les clous",
        effects: [
          { type: "money", delta: -100 },
          {
            type: "relationshipInit",
            npcId: "informateur",
            name: "Dabo",
            role: "Informateur",
          },
          { type: "relationship", npcId: "informateur", trust: 15 },
          { type: "careerPerformance", delta: 5 },
        ],
      },
      {
        id: "protect-beyond-rules",
        label: "Le proteger au-dela de ce que permettent les regles",
        effects: [
          { type: "stat", stat: "opportunism", delta: 5 },
          {
            type: "relationshipInit",
            npcId: "informateur",
            name: "Dabo",
            role: "Informateur",
          },
          { type: "relationship", npcId: "informateur", trust: 25, loyalty: 15 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -5 }],
      },
      {
        id: "keep-distance",
        label: "Garder une distance strictement professionnelle",
        effects: [
          { type: "stat", stat: "integrity", delta: 3 },
          {
            type: "relationshipInit",
            npcId: "informateur",
            name: "Dabo",
            role: "Informateur",
          },
        ],
      },
    ],
  },
  {
    id: "police-superior-political-pressure",
    title: "Pression sur une affaire sensible",
    description:
      "Ta hierarchie te demande de ralentir une enquete qui genererait, selon elle, des remous politiques indesirables.",
    category: "police-career",
    once: true,
    condition: (state) =>
      isPoliceRank(state, ["agent", "enqueteur", "responsable"]) &&
      (state.world.regime === "authoritarian" ||
        state.world.regime === "repressive" ||
        state.world.values.socialTension > 55),
    choices: [
      {
        id: "comply",
        label: "Obeir et ralentir l'enquete",
        effects: [
          { type: "stat", stat: "loyalty", delta: 5 },
          { type: "stat", stat: "opportunism", delta: 4 },
          { type: "stat", stat: "integrity", delta: -6 },
        ],
      },
      {
        id: "resist",
        label: "Continuer l'enquete a ton rythme malgre la pression",
        effects: [
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "stat", stat: "courage", delta: 5 },
        ],
        hiddenEffects: [{ type: "careerPerformance", delta: -5 }],
      },
      {
        id: "report-pressure",
        label: "Denoncer publiquement cette pression",
        effects: [
          { type: "stat", stat: "integrity", delta: 10 },
          { type: "stat", stat: "publicTrust", delta: 8 },
          { type: "stat", stat: "reputation", delta: -5 },
        ],
        hiddenEffects: [{ type: "world", key: "govPopularity", delta: -4 }],
      },
    ],
  },
  {
    id: "police-command-culture",
    title: "Reformer, ou perpetuer",
    description:
      "A la tete du service, tu peux reformer en profondeur les pratiques internes, ou laisser perdurer les habitudes existantes.",
    category: "police-career",
    once: true,
    condition: (state) => isPoliceRank(state, ["responsable"]),
    choices: [
      {
        id: "reform",
        label: "Lancer une reforme des pratiques internes",
        effects: [
          { type: "stat", stat: "integrity", delta: 10 },
          { type: "stat", stat: "authority", delta: 6 },
          { type: "stat", stat: "publicTrust", delta: 8 },
        ],
        hiddenEffects: [{ type: "world", key: "corruption", delta: -2 }],
      },
      {
        id: "maintain-networks",
        label: "Preserver les reseaux d'influence existants",
        effects: [
          { type: "stat", stat: "influence", delta: 8 },
          { type: "stat", stat: "opportunism", delta: 6 },
        ],
        hiddenEffects: [{ type: "stat", stat: "integrity", delta: -6 }],
      },
    ],
  },
];
