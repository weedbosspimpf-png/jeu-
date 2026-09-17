import type { GameEvent, GameState } from "@/engine/types";

/**
 * Systeme d'ambitions et de transitions de trajectoire : le metier n'est
 * jamais une finalite. Ces evenements permettent au joueur de declarer
 * explicitement un objectif de long terme propre a sa filiere, et
 * ouvrent des portes de sortie/reconversion qui dependent de son
 * contexte (echec, richesse accumulee, popularite, lassitude...), pas
 * d'un scenario impose.
 */

function isTrackRank(state: GameState, track: string, ranks: string[]): boolean {
  return state.career.currentTrack === track && ranks.includes(state.career.currentRankId ?? "");
}

export const ambitionTransitionEvents: GameEvent[] = [
  // --- Declarer un objectif de long terme, propre a chaque filiere ---
  {
    id: "army-declare-goal",
    title: "Un objectif se dessine",
    description: "A ce stade de ta carriere militaire, une question se pose : jusqu'ou veux-tu aller ?",
    category: "ambition",
    once: true,
    condition: (state) => isTrackRank(state, "army", ["officier", "commandant"]) && state.declaredGoal === null,
    choices: [
      {
        id: "declare-general",
        label: "Te fixer comme objectif de devenir general",
        effects: [
          { type: "declareGoal", label: "Devenir general et atteindre le haut commandement." },
          { type: "ambition", key: "prestige", delta: 8 },
          { type: "ambition", key: "institutions", delta: 4 },
        ],
      },
      {
        id: "decline-goal",
        label: "Ne pas te projeter aussi loin pour l'instant",
        effects: [{ type: "ambition", key: "protectionDesSiens", delta: 3 }],
      },
    ],
  },
  {
    id: "police-declare-goal",
    title: "Un objectif se dessine",
    description: "Ta carriere policiere avance. Vises-tu simplement le terrain, ou davantage ?",
    category: "ambition",
    once: true,
    condition: (state) => isTrackRank(state, "police", ["agent", "enqueteur"]) && state.declaredGoal === null,
    choices: [
      {
        id: "declare-command",
        label: "Te fixer comme objectif de diriger un jour le service",
        effects: [
          { type: "declareGoal", label: "Atteindre le commandement ou la direction du service." },
          { type: "ambition", key: "justice", delta: 6 },
          { type: "ambition", key: "prestige", delta: 4 },
        ],
      },
      {
        id: "decline-goal",
        label: "Rester concentre sur le terrain",
        effects: [{ type: "ambition", key: "securite", delta: 3 }],
      },
    ],
  },
  {
    id: "crime-declare-goal",
    title: "Un objectif se dessine",
    description: "Dans le reseau, certains restent executants toute leur vie. D'autres visent plus haut.",
    category: "ambition",
    once: true,
    condition: (state) => isTrackRank(state, "crime", ["executant", "lieutenant"]) && state.declaredGoal === null,
    choices: [
      {
        id: "declare-influence",
        label: "Te fixer comme objectif de devenir une figure influente du milieu",
        effects: [
          { type: "declareGoal", label: "Devenir une figure influente du reseau fictif." },
          { type: "ambition", key: "richesse", delta: 6 },
          { type: "ambition", key: "independance", delta: 6 },
        ],
      },
      {
        id: "decline-goal",
        label: "Te contenter de ta place actuelle",
        effects: [{ type: "ambition", key: "richesse", delta: 3 }],
      },
    ],
  },
  {
    id: "entrepreneur-declare-goal",
    title: "Un objectif se dessine",
    description: "Ton activite fonctionne. Veux-tu simplement en vivre, ou construire quelque chose de plus grand ?",
    category: "ambition",
    once: true,
    condition: (state) => isTrackRank(state, "entrepreneur", ["chef-entreprise"]) && state.declaredGoal === null,
    choices: [
      {
        id: "declare-empire",
        label: "Te fixer comme objectif de construire un groupe economique majeur",
        effects: [
          { type: "declareGoal", label: "Construire une entreprise majeure ou un groupe economique." },
          { type: "ambition", key: "richesse", delta: 8 },
          { type: "ambition", key: "prestige", delta: 4 },
        ],
      },
      {
        id: "decline-goal",
        label: "Te satisfaire d'une activite stable",
        effects: [{ type: "ambition", key: "stabilite", delta: 4 }],
      },
    ],
  },
  {
    id: "politics-declare-goal",
    title: "Un objectif se dessine",
    description: "Ton engagement politique grandit. Certains rêvent d'un mandat local, d'autres du sommet de l'Etat.",
    category: "ambition",
    once: true,
    condition: (state) =>
      isTrackRank(state, "politics", ["militant", "responsable-local"]) && state.declaredGoal === null,
    choices: [
      {
        id: "declare-president",
        label: "Te fixer comme objectif de devenir president de la Republique",
        effects: [
          { type: "declareGoal", label: "Devenir president de la Republique." },
          { type: "ambition", key: "politique", delta: 10 },
          { type: "ambition", key: "institutions", delta: 4 },
        ],
      },
      {
        id: "decline-goal",
        label: "Te contenter d'un mandat plus modeste",
        effects: [{ type: "ambition", key: "stabilite", delta: 3 }],
      },
    ],
  },
  {
    id: "civil-declare-goal",
    title: "Un objectif se dessine",
    description: "Ta vie suit son cours. Qu'est-ce qui compte vraiment pour toi, au fond ?",
    category: "ambition",
    once: true,
    condition: (state) => isTrackRank(state, "civil", ["employe", "cadre"]) && state.declaredGoal === null,
    choices: [
      {
        id: "declare-stable-life",
        label: "Te fixer comme objectif une vie personnelle et professionnelle reussie",
        effects: [
          { type: "declareGoal", label: "Construire une vie personnelle et professionnelle reussie." },
          { type: "ambition", key: "stabilite", delta: 6 },
          { type: "ambition", key: "protectionDesSiens", delta: 4 },
        ],
      },
      {
        id: "decline-goal",
        label: "Rester ouvert a toutes les possibilites",
        effects: [{ type: "ambition", key: "independance", delta: 3 }],
      },
    ],
  },

  // --- Transitions de trajectoire, dependantes du contexte du personnage ---
  {
    id: "opportunity-popular-general-politics",
    title: "Une popularite qui ouvre des portes",
    description:
      "Ta popularite en tant que general depasse le cercle militaire. Une coalition politique t'approche discretement.",
    category: "ambition",
    once: true,
    condition: (state) => isTrackRank(state, "army", ["general"]) && state.character.stats.popularity >= 55,
    choices: [
      {
        id: "enter-politics",
        label: "Quitter officiellement l'armee pour te lancer en politique",
        effects: [
          { type: "joinCareer", track: "politics", rankId: "militant" },
          { type: "ambition", key: "politique", delta: 10 },
        ],
      },
      {
        id: "decline-opportunity",
        label: "Rester fidele a l'institution militaire",
        effects: [{ type: "ambition", key: "institutions", delta: 5 }],
      },
    ],
  },
  {
    id: "army-failed-career-reconversion",
    title: "Une carriere qui s'enlise",
    description:
      "Tes performances militaires ne progressent plus depuis longtemps. Une reconversion merite d'etre envisagee.",
    category: "ambition",
    once: true,
    condition: (state) =>
      state.career.currentTrack === "army" && state.career.performance <= 25 && state.career.turnsInRank >= 2,
    choices: [
      {
        id: "rebound",
        label: "Tenter de rebondir dans l'armee",
        effects: [
          { type: "careerPerformance", delta: 20 },
          { type: "stat", stat: "discipline", delta: 5 },
        ],
      },
      {
        id: "leave-to-civil",
        label: "Quitter l'armee pour une vie civile",
        effects: [
          { type: "joinCareer", track: "civil", rankId: "employe" },
          { type: "ambition", key: "stabilite", delta: 5 },
        ],
      },
      {
        id: "leave-to-business",
        label: "Utiliser tes indemnites de depart pour te lancer dans l'entrepreneuriat",
        effects: [
          { type: "joinCareer", track: "entrepreneur", rankId: "independant" },
          { type: "money", delta: 500 },
          { type: "ambition", key: "richesse", delta: 5 },
        ],
      },
    ],
  },
  {
    id: "army-to-civil-retirement",
    title: "Choisir une autre vie",
    description:
      "Ton grade et ton experience te permettraient de continuer, mais l'idee d'une vie plus tranquille te traverse l'esprit.",
    category: "ambition",
    once: true,
    condition: (state) => isTrackRank(state, "army", ["commandant", "colonel", "general"]) && state.career.turnsInRank >= 3,
    choices: [
      {
        id: "retire-to-civil",
        label: "Quitter l'armee pour une vie civile plus tranquille",
        effects: [
          { type: "joinCareer", track: "civil", rankId: "cadre" },
          { type: "ambition", key: "protectionDesSiens", delta: 8 },
        ],
      },
      {
        id: "stay-army",
        label: "Continuer ta carriere militaire",
        effects: [{ type: "ambition", key: "prestige", delta: 3 }],
      },
    ],
  },
  {
    id: "crime-wealth-independence",
    title: "Assez pour tourner la page",
    description:
      "Tu as accumule assez de richesse pour envisager de quitter le reseau et devenir un entrepreneur reconnu.",
    category: "ambition",
    once: true,
    condition: (state) => state.career.currentTrack === "crime" && state.character.money >= 5000,
    choices: [
      {
        id: "leave-for-business",
        label: "Quitter le reseau pour devenir entrepreneur",
        effects: [
          { type: "joinCareer", track: "entrepreneur", rankId: "independant" },
          { type: "stat", stat: "integrity", delta: 8 },
          { type: "ambition", key: "independance", delta: 8 },
          { type: "ambition", key: "richesse", delta: 4 },
        ],
      },
      {
        id: "stay-in-network",
        label: "Rester dans le reseau malgre tout",
        effects: [{ type: "ambition", key: "richesse", delta: 4 }],
      },
    ],
  },
  {
    id: "security-career-to-business",
    title: "Une reconversion economique",
    description:
      "Tes economies et tes relations te permettraient de te lancer dans une activite independante, en dehors des forces de l'ordre.",
    category: "ambition",
    once: true,
    condition: (state) =>
      (state.career.currentTrack === "police" || state.career.currentTrack === "gendarmerie") &&
      (state.character.stats.wealth >= 40 || state.character.money >= 3000),
    choices: [
      {
        id: "convert-to-business",
        label: "Quitter pour te lancer dans l'entrepreneuriat",
        effects: [
          { type: "joinCareer", track: "entrepreneur", rankId: "independant" },
          { type: "ambition", key: "richesse", delta: 6 },
          { type: "ambition", key: "independance", delta: 5 },
        ],
      },
      {
        id: "stay-in-force",
        label: "Rester dans les forces de l'ordre",
        effects: [{ type: "ambition", key: "securite", delta: 3 }],
      },
    ],
  },
  {
    id: "civil-crossroads-police",
    title: "L'appel de l'ordre public",
    description: "Ta rigueur pourrait te mener a l'ecole de police, si tu choisis cette voie.",
    category: "ambition",
    once: true,
    condition: (state) =>
      isTrackRank(state, "civil", ["employe", "cadre"]) && state.character.stats.discipline >= 40,
    choices: [
      {
        id: "join-police",
        label: "Rejoindre l'ecole de police",
        effects: [
          { type: "joinCareer", track: "police", rankId: "eleve" },
          { type: "ambition", key: "justice", delta: 5 },
        ],
      },
      {
        id: "decline-police",
        label: "Poursuivre ta trajectoire civile",
        effects: [{ type: "ambition", key: "stabilite", delta: 2 }],
      },
    ],
  },
];
