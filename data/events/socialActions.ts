import type { GameEvent } from "@/engine/types";

/**
 * Actions sociales : jamais un bouton "don -> +10 popularite". Le cout
 * est reel (argent, immediatement deduit), et l'effet reel depend du
 * contexte (voir engine/socialActions.ts::computeSocialActionOutcome) :
 * une action sincere et bien percue peut avoir un effet fort, une action
 * jugee interessee peut avoir peu d'effet ou meme se retourner contre le
 * personnage.
 */
export const socialActionEvents: GameEvent[] = [
  {
    id: "social-action-opportunity",
    title: "Une occasion de s'engager",
    description:
      "Une association locale sollicite ton soutien pour un projet concret. Comment reagis-tu ?",
    category: "social-action",
    cooldown: 3,
    condition: (state) => state.character.money >= 300,
    choices: [
      {
        id: "support-orphanage",
        label: "Soutenir un orphelinat fictif (cout modere)",
        effects: [{ type: "resolveSocialAction", cost: 250, scale: "small" }],
      },
      {
        id: "fund-school",
        label: "Financer une ecole fictive (cout important)",
        effects: [{ type: "resolveSocialAction", cost: 500, scale: "medium" }],
      },
      {
        id: "disaster-relief",
        label: "Participer a une aide d'urgence lors d'une catastrophe (cout eleve)",
        effects: [{ type: "resolveSocialAction", cost: 800, scale: "large" }],
      },
      {
        id: "decline-social-action",
        label: "Decliner cette fois-ci",
        effects: [],
      },
    ],
  },
  {
    id: "create-foundation",
    title: "Creer une fondation",
    description:
      "Tes ressources te permettraient de creer une fondation fictive durable plutot que des actions ponctuelles.",
    category: "social-action",
    once: true,
    condition: (state) => state.character.money >= 5000,
    choices: [
      {
        id: "found-foundation",
        label: "Creer ta fondation",
        effects: [
          { type: "flag", flag: "has-foundation", value: true },
          { type: "ambition", key: "prestige", delta: 8 },
          { type: "resolveSocialAction", cost: 3000, scale: "large" },
        ],
      },
      {
        id: "decline-foundation",
        label: "Ne pas t'engager sur cette voie pour l'instant",
        effects: [],
      },
    ],
  },
];
